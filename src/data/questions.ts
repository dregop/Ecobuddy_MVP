
export const firstQuestions = [
  {
    id: 1,
    question: 'Utilisez-vous principalement une voiture ?',
    field: 'transportMode',
    value: 'car', // Correspond à 0.21 kg CO₂/km dans ton carbonFactors
    icon: require('../assets/images/car.png'),
  },
  {
    id: 2,
    question: 'Parcourez-vous plus de 100 km par semaine en voiture ?',
    field: 'weeklyDistance',
    value: 150, // km/semaine → 150 × 52 × 0.21 kg CO₂/km ≈ 1638 kg/an
    icon: require('../assets/images/car.png'),
  },
  {
    id: 3,
    question: 'Votre logement fait-il plus de 90 m² ?',
    field: 'homeSize',
    value: 100, // m² → 100 × 10 kg CO₂/m²/an = 1000 kg/an
    icon: require('../assets/images/house.png'),
  },
  {
    id: 4,
    question: 'Votre logement est-il mal isolé ou ancien ?',
    field: 'energyConsumption',
    value: 3500, // kWh/an → 3500 × 0.2 kg CO₂/kWh = 700 kg/an
    icon: require('../assets/images/house.png'),
  },
  {
    id: 5,
    question: 'Consommez-vous de la viande plus de 5 fois/semaine ?',
    field: 'dietType',
    value: 'omnivore', // 5 kg CO₂/jour × 365 = 1825 kg/an
    icon: require('../assets/images/shopping.png'),
  },
  {
    id: 6,
    question: 'Prenez-vous plus de 2 vols par an ?',
    field: 'yearlyFlights',
    value: 2, // 2 × 2000 kg CO₂ = 4000 kg/an
    icon: require('../assets/images/plane.png'),
  },
  {
    id: 7,
    question: 'Ces vols dépassent-ils principalement 5000 km (comme un Paris New-York) ?',
    field: 'flightDistance',
    value: 'long', // → 2000 kg CO₂/vol
    icon: require('../assets/images/plane.png'),
  },
  {
    id: 8,
    question: 'Achetez-vous plus de 2 vêtements neufs par mois ?',
    field: 'clothingPurchases',
    value: 24, // 24 vêtements/an × 50 kg CO₂/vêtement = 1200 kg/an
    icon: require('../assets/images/shopping.png'),
  },
  {
    id: 9,
    question: 'Changez-vous de téléphone ou ordinateur tous les 2 ans environ ?',
    field: 'electronicsPurchases',
    value: 50, // 50 kg CO₂/an si renouvellement fréquent
    icon: require('../assets/images/shopping.png'),
  },
];

export const globalQuestions = [
  { id: 1, question: 'Prout ?', field: 'transportMode', value: 'car', icon: require('../assets/images/car.png') },
  { id: 2, question: 'Parcourez-vous plus de 100 km par semaine ?', field: 'weeklyDistance', value: 150, icon: require('../assets/images/car.png') },
  { id: 3, question: 'Votre logement est-il de grande taille (> 90 m²) ?', field: 'homeSize', value: 100, icon: require('../assets/images/house.png') },
  { id: 4, question: 'Votre consommation d’énergie dépasse-t-elle 3000 kWh/an ?', field: 'energyConsumption', value: 3500, icon: require('../assets/images/house.png') },
  { id: 5, question: 'Consommez-vous régulièrement de la viande rouge ?', field: 'dietType', value: 'omnivore', icon: require('../assets/images/shopping.png') },
  { id: 6, question: 'Prenez-vous plus de 2 vols long-courriers par an ?', field: 'yearlyFlights', value: 4, icon: require('../assets/images/plane.png') },
  { id: 7, question: 'Ces vols sont-ils principalement longs (> 5000 km) ?', field: 'flightDistance', value: 'long', icon: require('../assets/images/plane.png') },
  { id: 8, question: 'Achetez-vous plus de 10 vétements neuf par mois ?', field: 'clothingPurchases', value: 600, icon: require('../assets/images/shopping.png') },
  { id: 9, question: 'Changer vous de téléphones tous les 2 ans plus ou moins ?', field: 'electronicsPurchases', value: 400, icon: require('../assets/images/shopping.png') },
];