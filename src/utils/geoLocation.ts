
export interface LocationCoords {
  lat: number;
  lng: number;
}

export interface LocationResult {
  coords: LocationCoords;
  address?: string;
}

export const getCurrentLocation = (): Promise<LocationResult> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        try {
          const address = await reverseGeocode(coords);
          resolve({ coords, address });
        } catch (error) {
          // Still resolve with coordinates even if reverse geocoding fails
          resolve({ coords });
        }
      },
      (error) => {
        let errorMessage = 'Unknown error occurred';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
};

export const reverseGeocode = async (coords: LocationCoords): Promise<string> => {
  try {
    // Using a simple reverse geocoding service (you might want to use a proper API key for production)
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.lat}&longitude=${coords.lng}&localityLanguage=en`
    );
    
    if (!response.ok) throw new Error('Geocoding service unavailable');
    
    const data = await response.json();
    return `${data.locality}, ${data.principalSubdivision}, ${data.countryName}`;
  } catch (error) {
    console.warn('Reverse geocoding failed:', error);
    return `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
  }
};

export const calculateDistance = (coord1: LocationCoords, coord2: LocationCoords): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

const toRad = (value: number): number => {
  return value * Math.PI / 180;
};
