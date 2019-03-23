
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

export const mapDestinations = new Map([
  [`places`, [`airport`, `hotel`, `sightseeing`, `restaurant`]],
  [`cities`, [`Amsterdam`, `Geneva`, `Chamonix`]]
]);

export const mapItemsTypes = new Map([
  [`bus`, {icon: `🚌`, group: `cities`, caption: `Bus to `}],
  [`train`, {icon: `🚂`, group: `cities`, caption: `Train to `}],
  [`ship`, {icon: `🛳️`, group: `cities`, caption: `Ship to `}],
  [`transport`, {icon: `🚊`, group: `cities`, caption: `Transport to `}],
  [`drive`, {icon: `🚗`, group: `cities`, caption: `Drive to `}],
  [`flight`, {icon: `✈️`, group: `cities`, caption: `Flight to `}],
  [`taxi`, {icon: `🚕`, group: `places`, caption: `Taxi to `}],
  [`check-in`, {icon: `🏨`, group: `places`, caption: `Check into a `}],
  [`sightseeing`, {icon: `🏛️`, group: `places`, caption: `Go to `}],
  [`restaurant`, {icon: `🍴`, group: `places`, caption: `Go to `}]
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
  const arrayItemsTypes = [...mapItemsTypes.values()];

  // Набираем 7 элементов
  while (arrayItems.length < 7) {
    const currentItem = arrayItemsTypes[getRandomInt(arrayItemsTypes.length)];
    const destinations = mapDestinations.get(currentItem.group);

    arrayItems.push({
      icon: currentItem.icon,
      destination: destinations[getRandomInt(destinations.length)],
      caption: currentItem.caption,
      description: generateDescription(),
      picture: `http://picsum.photos/300/150?r=${Math.random()}`,
      time: {
        since: `${getRandomInt(6)}:${getRandomInt(59, 10)}`,
        to: `${getRandomInt(12, 7)}:${getRandomInt(59, 10)}`
      },
      price: getRandomInt(30, 10),
      offers: new Set(generateOffers())
    });
  }

  return arrayItems;
};

const generateOffers = () => {
  const currentOffers = [];
  const arrayOffersTypes = [...mapOffers.keys()];
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

export default generateTripDayItems();
