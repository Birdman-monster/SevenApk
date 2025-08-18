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
    sevenCity: { baseFare: 400, perKmRate: 60, minimumFare: 800 },
    sevenFlex: { baseFare: 500, perKmRate: 80, minimumFare: 1000 },
    sevenVip: { baseFare: 1000, perKmRate: 90, minimumFare: 2000 },
  };

  // On applique la logique : distance effective = aller + moitié retour = distance * 1.5
  const fareCalculation = (baseFare, perKmRate, minimumFare) => {
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

export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};