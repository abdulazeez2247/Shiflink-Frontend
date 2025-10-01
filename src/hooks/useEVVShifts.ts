
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface EVVShift {
  id: string;
  dsp_id: string;
  client_id: string;
  facility_name: string;
  shift_date: string;
  scheduled_start_time: string;
  scheduled_end_time: string;
  actual_clock_in_time?: string;
  actual_clock_out_time?: string;
  clock_in_gps_lat?: number;
  clock_in_gps_lng?: number;
  clock_out_gps_lat?: number;
  clock_out_gps_lng?: number;
  clock_in_address?: string;
  clock_out_address?: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  medicaid_id: string;
  service_type: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  medicaid_id: string;
  address: string;
  phone?: string;
  emergency_contact?: string;
  care_notes?: string;
  is_active: boolean;
}

export const useEVVShifts = () => {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<EVVShift[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [currentShift, setCurrentShift] = useState<EVVShift | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch clients
  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Failed to fetch clients');
    }
  };

  // Fetch shifts for current user
  const fetchShifts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('evv_shifts')
        .select('*')
        .eq('dsp_id', user.id)
        .order('shift_date', { ascending: false })
        .order('scheduled_start_time', { ascending: false });

      if (error) throw error;
      
      // Type cast the data to match our interface
      const typedShifts = (data || []).map(shift => ({
        ...shift,
        status: shift.status as EVVShift['status']
      }));
      
      setShifts(typedShifts);
      
      // Find current active shift
      const activeShift = typedShifts.find(shift => shift.status === 'active');
      setCurrentShift(activeShift || null);
    } catch (err) {
      console.error('Error fetching shifts:', err);
      setError('Failed to fetch shifts');
    } finally {
      setLoading(false);
    }
  };

  // Clock in
  const clockIn = async (clientId: string, location: { lat: number; lng: number }, address?: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const client = clients.find(c => c.id === clientId);
      if (!client) throw new Error('Client not found');

      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().split(' ')[0];

      // Create new shift
      const { data: shiftData, error: shiftError } = await supabase
        .from('evv_shifts')
        .insert({
          dsp_id: user.id,
          client_id: clientId,
          facility_name: 'Direct Care Services', // This could be dynamic
          shift_date: today,
          scheduled_start_time: currentTime,
          scheduled_end_time: '16:00:00', // 8 hour shift default
          actual_clock_in_time: now.toISOString(),
          clock_in_gps_lat: location.lat,
          clock_in_gps_lng: location.lng,
          clock_in_address: address,
          status: 'active',
          medicaid_id: client.medicaid_id,
          service_type: 'personal_care'
        })
        .select()
        .single();

      if (shiftError) throw shiftError;

      // Create EVV log entry
      const { error: logError } = await supabase
        .from('evv_logs')
        .insert({
          shift_id: shiftData.id,
          dsp_id: user.id,
          event_type: 'clock_in',
          gps_latitude: location.lat,
          gps_longitude: location.lng,
          location_address: address,
          verification_status: 'verified'
        });

      if (logError) throw logError;

      // Type cast the returned data
      const typedShift = {
        ...shiftData,
        status: shiftData.status as EVVShift['status']
      };

      setCurrentShift(typedShift);
      await fetchShifts();
      
      return typedShift;
    } catch (err) {
      console.error('Error clocking in:', err);
      throw err;
    }
  };

  // Clock out
  const clockOut = async (location: { lat: number; lng: number }, address?: string, notes?: string) => {
    if (!user || !currentShift) throw new Error('No active shift to clock out');

    try {
      const now = new Date();

      // Update shift
      const { data: shiftData, error: shiftError } = await supabase
        .from('evv_shifts')
        .update({
          actual_clock_out_time: now.toISOString(),
          clock_out_gps_lat: location.lat,
          clock_out_gps_lng: location.lng,
          clock_out_address: address,
          status: 'completed',
          notes: notes,
          updated_at: now.toISOString()
        })
        .eq('id', currentShift.id)
        .select()
        .single();

      if (shiftError) throw shiftError;

      // Create EVV log entry
      const { error: logError } = await supabase
        .from('evv_logs')
        .insert({
          shift_id: currentShift.id,
          dsp_id: user.id,
          event_type: 'clock_out',
          gps_latitude: location.lat,
          gps_longitude: location.lng,
          location_address: address,
          verification_status: 'verified'
        });

      if (logError) throw logError;

      setCurrentShift(null);
      await fetchShifts();
      
      // Type cast the returned data
      return {
        ...shiftData,
        status: shiftData.status as EVVShift['status']
      };
    } catch (err) {
      console.error('Error clocking out:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchClients();
      fetchShifts();
    }
  }, [user]);

  return {
    shifts,
    clients,
    currentShift,
    loading,
    error,
    clockIn,
    clockOut,
    refreshShifts: fetchShifts
  };
};
