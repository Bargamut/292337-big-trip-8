export const mapItemsTypes = new Map([
  [`bus`, {icon: `🚌`, caption: `Bus to `}],
  [`train`, {icon: `🚂`, caption: `Train to `}],
  [`ship`, {icon: `🛳️`, caption: `Ship to `}],
  [`transport`, {icon: `🚊`, caption: `Transport to `}],
  [`drive`, {icon: `🚗`, caption: `Drive to `}],
  [`flight`, {icon: `✈️`, caption: `Flight to `}],
  [`taxi`, {icon: `🚕`, caption: `Taxi to `}],
  [`check-in`, {icon: `🏨`, caption: `Check into a `}],
  [`sightseeing`, {icon: `🏛️`, caption: `Go to `}],
  [`restaurant`, {icon: `🍴`, caption: `Go to `}]
]);
export const mapOffers = new Map([
  [
    `add-luggage`,
    {
      caption: `Add luggage`,
      price: 30
    }
  ], [
    `switch-to-comfort-class`,
    {
      caption: `Switch to comfort class`,
      price: 100
    }
  ], [
    `add-meal`,
    {
      caption: `Add meal`,
      price: 15
    }
  ],
  [
    `choose-seats`,
    {
      caption: `Choose seats`,
      price: 5
    }
  ]
]);

export const pointsFilters = [
  {
    id: `everything`,
    caption: `Everything`,
    value: `everything`,
    isChecked: true
  },
  {
    id: `future`,
    caption: `Future`,
    value: `future`
  },
  {
    id: `past`,
    caption: `Past`,
    value: `past`
  }
];

const generateTripDayItems = () => {
  const arrayItems = [];

  // Набираем 7 элементов
  while (arrayItems.length < 7) {
    arrayItems.push({
      icon: ``,
      type: ``,
      destination: ``,
      caption: ``,
      description: ``,
      pictures: [],
      time: {
        since: null,
        to: null
      },
      price: 0,
      offers: new Set()
    });
  }

  return arrayItems;
};

const dayIitems = generateTripDayItems();

export default dayIitems;
