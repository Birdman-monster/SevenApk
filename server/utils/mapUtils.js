export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const calculateFare = (distance) => {
  const rateStructure = {
    sevenCity: { perKmRate: 400, minimumFare: 2500 },
    sevenFlex: { perKmRate: 600, minimumFare: 5000 },
    sevenVip: { perKmRate: 2500, minimumFare: 25000 },
  };

  // On applique la logique : distance effective = aller + moitié retour = distance * 1.5
  const effectiveDistance = distance * 1.5;

  const fareCalculation = (perKmRate, minimumFare) => {
    const calculatedFare = effectiveDistance * perKmRate;
    return Math.max(calculatedFare, minimumFare);
  };

  return {
    sevenCity: fareCalculation(
      rateStructure.sevenCity.perKmRate,
      rateStructure.sevenCity.minimumFare
    ),
    sevenFlex: fareCalculation(
      rateStructure.sevenFlex.perKmRate,
      rateStructure.sevenFlex.minimumFare
    ),
    sevenVip: fareCalculation(
      rateStructure.sevenVip.perKmRate,
      rateStructure.sevenVip.minimumFare
    ),
  };
};

export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};
