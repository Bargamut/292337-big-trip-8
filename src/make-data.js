export const mapItemsTypes = new Map([
  [`bus`, {icon: `🚌`, group: `transport`, caption: `Bus to `}],
  [`train`, {icon: `🚂`, group: `transport`, caption: `Train to `}],
  [`ship`, {icon: `🛳️`, group: `transport`, caption: `Ship to `}],
  [`transport`, {icon: `🚊`, group: `transport`, caption: `Transport to `}],
  [`drive`, {icon: `🚗`, group: `transport`, caption: `Drive to `}],
  [`flight`, {icon: `✈️`, group: `transport`, caption: `Flight to `}],
  [`taxi`, {icon: `🚕`, group: `transport`, caption: `Taxi to `}],
  [`check-in`, {icon: `🏨`, group: `place`, caption: `Check into a `}],
  [`sightseeing`, {icon: `🏛️`, group: `place`, caption: `Go to `}],
  [`restaurant`, {icon: `🍴`, group: `place`, caption: `Go to `}]
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
