
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, MapPin, Phone } from 'lucide-react';
import { Client } from '@/hooks/useEVVShifts';

interface ClientSelectorProps {
  clients: Client[];
  selectedClientId: string | null;
  onClientSelect: (clientId: string) => void;
  onStartShift: () => void;
  loading?: boolean;
}

const ClientSelector = ({ 
  clients, 
  selectedClientId, 
  onClientSelect, 
  onStartShift,
  loading = false 
}: ClientSelectorProps) => {
  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Select Client
        </CardTitle>
        <CardDescription>
          Choose the client you'll be providing services to today
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedClientId || ''} onValueChange={onClientSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select a client..." />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{client.name}</span>
                  <span className="text-sm text-gray-500">ID: {client.medicaid_id}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedClient && (
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <h4 className="font-medium text-sm">Client Information</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span>{selectedClient.address}</span>
              </div>
              {selectedClient.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3" />
                  <span>{selectedClient.phone}</span>
                </div>
              )}
              <div className="text-gray-600">
                Medicaid ID: {selectedClient.medicaid_id}
              </div>
              {selectedClient.care_notes && (
                <div className="mt-2">
                  <span className="font-medium">Care Notes:</span>
                  <p className="text-gray-600">{selectedClient.care_notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <Button 
          onClick={onStartShift}
          disabled={!selectedClientId || loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Starting Shift...' : 'Start Shift & Clock In'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClientSelector;
