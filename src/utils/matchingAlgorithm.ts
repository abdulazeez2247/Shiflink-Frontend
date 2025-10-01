
interface DSPProfile {
  id: string;
  personalInfo: {
    address: {
      city: string;
      state: string;
      zipCode: string;
    };
  };
  professionalInfo: {
    certifications: string[];
    skills: string[];
    experience: string;
    availability?: {
      fullTime: boolean;
      partTime: boolean;
      weekends: boolean;
      evenings: boolean;
    };
  };
  preferences: {
    maxDistance: number;
    preferredRates: {
      min: number;
      max: number;
    };
    preferredShiftTypes: string[];
    preferredSchedule: string[];
  };
  stats?: {
    rating?: number;
    completionRate?: number;
  };
}

interface Shift {
  id: string;
  title: string;
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  hourlyRate: number;
  shiftType: string;
  requiredCredentials: string[];
  description: string;
  specialRequirements: string;
  urgency: 'low' | 'medium' | 'high';
}

interface MatchScore {
  shiftId: string;
  score: number;
  reasons: string[];
  shift: Shift;
}

// Calculate distance between two locations (simplified - using city matching for now)
const calculateDistance = (dspCity: string, shiftCity: string): number => {
  if (dspCity.toLowerCase() === shiftCity.toLowerCase()) {
    return 0;
  }
  // Simplified distance calculation - in a real app, you'd use geolocation APIs
  return Math.random() * 50; // Mock distance in miles
};

// Check if DSP meets credential requirements
const checkCredentialMatch = (dspCertifications: string[], requiredCredentials: string[]): boolean => {
  return requiredCredentials.every(required => 
    dspCertifications.some(cert => cert.toLowerCase().includes(required.toLowerCase()))
  );
};

// Calculate shift time compatibility with DSP availability
const checkTimeCompatibility = (shift: Shift, availability?: DSPProfile['professionalInfo']['availability']): number => {
  if (!availability) return 0.5;

  const shiftStart = parseInt(shift.startTime.split(':')[0]);
  const shiftEnd = parseInt(shift.endTime.split(':')[0]);
  const shiftDate = new Date(shift.date);
  const isWeekend = shiftDate.getDay() === 0 || shiftDate.getDay() === 6;
  const isEvening = shiftStart >= 17 || shiftEnd >= 17;

  let compatibilityScore = 0;

  if (availability.fullTime && (shiftEnd - shiftStart) >= 8) {
    compatibilityScore += 0.4;
  }
  if (availability.partTime && (shiftEnd - shiftStart) < 8) {
    compatibilityScore += 0.4;
  }
  if (availability.weekends && isWeekend) {
    compatibilityScore += 0.3;
  }
  if (availability.evenings && isEvening) {
    compatibilityScore += 0.3;
  }

  return Math.min(compatibilityScore, 1);
};

// Main matching algorithm
export const calculateShiftMatches = (dspProfile: DSPProfile, availableShifts: Shift[]): MatchScore[] => {
  const matches: MatchScore[] = [];

  for (const shift of availableShifts) {
    let score = 0;
    const reasons: string[] = [];

    // 1. Credential matching (40% weight)
    const hasRequiredCredentials = checkCredentialMatch(
      dspProfile.professionalInfo.certifications,
      shift.requiredCredentials
    );
    if (hasRequiredCredentials) {
      score += 40;
      reasons.push('✓ Has required credentials');
    } else {
      score -= 20;
      reasons.push('✗ Missing required credentials');
    }

    // 2. Location proximity (25% weight)
    const distance = calculateDistance(dspProfile.personalInfo.address.city, shift.location);
    if (distance <= dspProfile.preferences.maxDistance) {
      const locationScore = Math.max(25 - (distance / dspProfile.preferences.maxDistance) * 25, 0);
      score += locationScore;
      reasons.push(`✓ Within preferred distance (${distance.toFixed(1)} miles)`);
    } else {
      score -= 10;
      reasons.push(`⚠ Outside preferred distance (${distance.toFixed(1)} miles)`);
    }

    // 3. Rate preferences (20% weight)
    const { min, max } = dspProfile.preferences.preferredRates;
    if (shift.hourlyRate >= min && shift.hourlyRate <= max) {
      score += 20;
      reasons.push(`✓ Rate matches preference ($${shift.hourlyRate}/hr)`);
    } else if (shift.hourlyRate > max) {
      score += 15;
      reasons.push(`✓ Higher than preferred rate ($${shift.hourlyRate}/hr)`);
    } else {
      score -= 5;
      reasons.push(`⚠ Below preferred rate ($${shift.hourlyRate}/hr)`);
    }

    // 4. Shift type preference (10% weight)
    if (dspProfile.preferences.preferredShiftTypes.includes(shift.shiftType)) {
      score += 10;
      reasons.push(`✓ Preferred shift type (${shift.shiftType})`);
    }

    // 5. Schedule compatibility (5% weight)
    const timeCompatibility = checkTimeCompatibility(shift, dspProfile.professionalInfo.availability);
    score += timeCompatibility * 5;
    if (timeCompatibility > 0.7) {
      reasons.push('✓ Good schedule match');
    }

    // Bonus factors
    if (shift.urgency === 'high') {
      score += 5;
      reasons.push('⚡ Urgent shift - extra priority');
    }

    // Rating bonus (if DSP has high rating)
    if (dspProfile.stats?.rating && dspProfile.stats.rating >= 4.5) {
      score += 3;
      reasons.push('⭐ High-rated DSP match');
    }

    matches.push({
      shiftId: shift.id,
      score: Math.max(0, Math.min(100, score)),
      reasons,
      shift
    });
  }

  // Sort by score (highest first)
  return matches.sort((a, b) => b.score - a.score);
};

// Filter matches by minimum score threshold
export const getTopMatches = (matches: MatchScore[], minScore: number = 60, limit: number = 10): MatchScore[] => {
  return matches.filter(match => match.score >= minScore).slice(0, limit);
};
