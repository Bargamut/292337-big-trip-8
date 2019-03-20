export const mapDestinations = new Map([
  [`places`, [`airport`, `hotel`, `sightseeing`, `restaurant`]],
  [`cities`, [`Amsterdam`, `Geneva`, `Chamonix`]]
]);
const arrayDescriptionPhrases = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];
export const arrayItems = [
  {icon: `🚌`, group: `cities`, type: `bus`, caption: `Bus to `},
  {icon: `🚂`, group: `cities`, type: `train`, caption: `Train to `},
  {icon: `🛳️`, group: `cities`, type: `ship`, caption: `Ship to `},
  {icon: `🚊`, group: `cities`, type: `transport`, caption: `Transport to `},
  {icon: `🚗`, group: `cities`, type: `drive`, caption: `Taxi to `},
  {icon: `✈️`, group: `cities`, type: `flight`, caption: `Flight to `},
  {icon: `🚕`, group: `places`, type: `taxi`, caption: `Taxi to `},
  {icon: `🏨`, group: `places`, type: `check-in`, caption: `Check into a `},
  {icon: `🏛️`, group: `places`, type: `sightseeing`, caption: `Go to `},
  {icon: `🍴`, group: `places`, type: `restaurant`, caption: `Go to `}
];
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

const arrayOffersTypes = [
  `add-luggage`,
  `switch-to-comfort-class`,
  `add-meal`,
  `choose-seats`
];

const generateTripDayItem = () => {
  const currentItem = arrayItems[getRandomInt(arrayItems.length)];
  const destinations = mapDestinations.get(currentItem.group);

  return {
    icon: currentItem.icon,
    destination: destinations[getRandomInt(destinations.length)],
    caption: currentItem.caption,
    description: generateDescription(),
    picture: `http://picsum.photos/300/150?r=${Math.random()}`,
    time: {
      since: `${getRandomInt(6)}:00`,
      to: `${getRandomInt(12, 7)}:00`
    },
    price: getRandomInt(30, 10),
    offers: new Set(generateOffers())
  };
};

const generateOffers = () => {
  const currentOffers = [];
  const countOffers = getRandomInt(3, 1);

  while (currentOffers.length !== countOffers) {
    currentOffers.push(arrayOffersTypes[getRandomInt(arrayOffersTypes.length)]);
  }

  return currentOffers;
};

const generateDescription = () => {
  const currentPhrases = [];
  const countPhrases = getRandomInt(3, 1);

  while (currentPhrases.length !== countPhrases) {
    currentPhrases.push(arrayDescriptionPhrases[getRandomInt(arrayDescriptionPhrases.length)]);
  }

  return currentPhrases.join(` `);
};

const getRandomInt = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min;

export default generateTripDayItem;

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
