// Import du store utilisateur (utilisé pour récupérer la localisation)
import { userStore } from "@/store/userStore";
// Import de la librairie pour les requêtes HTTP
import axios from "axios";

/** 
 * Récupère la latitude, longitude et adresse d’un lieu à partir de son `placeId` Google Maps.
 */
export const getLatLong = async (placeId: string) => {
    try {
        const response = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
            params: {
                placeid: placeId,
                key: process.env.EXPO_PUBLIC_MAP_API_KEY,
            },
        });

        const data = response.data;

        if (data.status === 'OK' && data.result) {
            const location = data.result.geometry.location;
            const address = data.result.formatted_address;

            return {
                latitude: location.lat,
                longitude: location.lng,
                address: address,
            };
        } else {
            throw new Error('Unable to fetch location details');
        }
    } catch (error) {
        throw new Error('Unable to fetch location details');
    }
};

/**
 * Convertit des coordonnées GPS en une adresse humaine (reverse geocoding).
 */
export const reverseGeocode = async (latitude: number, longitude: number) => {
    // Validation des coordonnées
    if (
        typeof latitude !== 'number' || 
        typeof longitude !== 'number' || 
        isNaN(latitude) || 
        isNaN(longitude)
    ) {
        console.log("❌ Coordonnées invalides :", { latitude, longitude });
        return "";
    }

    try {
        // Appel API Google Geocoding
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: {
                latlng: `${latitude},${longitude}`,
                key: process.env.EXPO_PUBLIC_MAP_API_KEY,
                language: 'fr',
                region: 'CM' // Région Cameroun
            }
        });

        // Vérifie le succès de la requête
        if (response.data.status === 'OK') {
            const address = response.data.results[0]?.formatted_address ?? '';
            return address;
        } else {
            console.log('🛑 Geocoding failed:', response.data.status, response.data.error_message);
            return "";
        }
    } catch (error: any) {
        console.log('💥 Erreur lors du reverse geocoding:', error.message || error);
        return "";
    }
};

/**
 * Extrait les données utiles depuis l’autocomplete de Google Places API.
 */
function extractPlaceData(data: any) {
    return data.map((item: any) => ({
        place_id: item.place_id,
        title: item.structured_formatting.main_text,
        description: item.description
    }));
}

/**
 * Suggère des lieux à partir d’un texte saisi par l’utilisateur.
 */
export const getPlacesSuggestions = async (query: string) => {
    const { location } = userStore.getState();
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
            params: {
                input: query,
                location: `${location?.latitude},${location?.longitude}`,
                radius: 50000,
                components: 'country:CM', // Cameroun
                key: process.env.EXPO_PUBLIC_MAP_API_KEY,
            }
        });

        return extractPlaceData(response.data.predictions);
    } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
        return [];
    }
};

/**
 * Calcule la distance (en kilomètres) entre deux points géographiques avec la formule de Haversine.
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Rayon de la terre en km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Calcule le tarif estimé pour chaque type de véhicule en fonction de la distance.
 */
/**
 * Calcule le tarif estimé pour chaque type de véhicule.
 * - Pour les dépôts (par kilomètre) : on considère que le chemin aller est compté à moitié.
 * - Pour les commandes horaires : tarif à l’heure fixe.
 * sevenCity: { baseFare: 400, perKmRate: 60, minimumFare: 800 },
    sevenFlex: { baseFare: 500, perKmRate: 80, minimumFare: 1000 },
    sevenVip: { baseFare: 1000, perKmRate: 90, minimumFare: 2000 },
 */
export const calculateFare = (distance: number) => {
  const rateStructure = {
    sevenCity: {
      baseFare: 500,
      perKmRate: 80,
      minimumFare: 1000,
    },
    sevenFlex: {
      baseFare: 650,
      perKmRate: 90,
      minimumFare: 1500,
    },
    sevenVip: {
      baseFare: 1500,
      perKmRate: 100,
      minimumFare: 3000,
    },
  };

  const fareCalculation = (
    baseFare: number,
    perKmRate: number,
    minimumFare: number
  ) => {
    const calculatedFare = baseFare + distance * perKmRate;
    return Math.max(calculatedFare, minimumFare);
  };

  return {
    sevenCity: fareCalculation(
      rateStructure.sevenCity.baseFare,
      rateStructure.sevenCity.perKmRate,
      rateStructure.sevenCity.minimumFare
    ),
    sevenFlex: fareCalculation(
      rateStructure.sevenFlex.baseFare,
      rateStructure.sevenFlex.perKmRate,
      rateStructure.sevenFlex.minimumFare
    ),
    sevenVip: fareCalculation(
      rateStructure.sevenVip.baseFare,
      rateStructure.sevenVip.perKmRate,
      rateStructure.sevenVip.minimumFare
    ),
  };
};


/**
 * Génère des points intermédiaires pour tracer une courbe entre deux lieux (bezier quadratic).
 */
function quadraticBezierCurve(p1: any, p2: any, controlPoint: any, numPoints: any) {
    const points = [];
    const step = 1 / (numPoints - 1);

    for (let t = 0; t <= 1; t += step) {
        const x =
            (1 - t) ** 2 * p1[0] +
            2 * (1 - t) * t * controlPoint[0] +
            t ** 2 * p2[0];
        const y =
            (1 - t) ** 2 * p1[1] +
            2 * (1 - t) * t * controlPoint[1] +
            t ** 2 * p2[1];
        const coord = { latitude: x, longitude: y };
        points.push(coord);
    }

    return points;
}

/**
 * Calcule le point de contrôle (control point) pour créer une courbe de Bezier.
 */
const calculateControlPoint = (p1: any, p2: any) => {
    const d = Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
    const scale = 1;
    const h = d * scale;
    const w = d / 2;
    const x_m = (p1[0] + p2[0]) / 2;
    const y_m = (p1[1] + p2[1]) / 2;

    const x_c =
        x_m +
        ((h * (p2[1] - p1[1])) /
            (2 * Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2))) *
        (w / d);
    const y_c =
        y_m -
        ((h * (p2[0] - p1[0])) /
            (2 * Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2))) *
        (w / d);

    const controlPoint = [x_c, y_c];
    return controlPoint;
};

/**
 * Récupère les points d’une courbe entre deux lieux.
 */
export const getPoints = (places: any) => {
    const p1 = [places[0].latitude, places[0].longitude];
    const p2 = [places[1].latitude, places[1].longitude];
    const controlPoint = calculateControlPoint(p1, p2);

    return quadraticBezierCurve(p1, p2, controlPoint, 100);
};

/**
 * Dictionnaire des icônes selon le type de véhicule.
 */
export const vehicleIcons: Record< | 'sevenCity' | 'sevenFlex' | 'sevenVip', { icon: any }> = {
    sevenCity: { icon: require('@/assets/icons/cab.png') },
    sevenFlex: { icon: require('@/assets/icons/seven-flex.png') },
    sevenVip: { icon: require('@/assets/icons/seven-vip.png') },
};