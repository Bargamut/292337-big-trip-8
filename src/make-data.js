const CURRENT_CURRENCY = `&euro;`;
const arrayCities = [`Amsterdam`, `Geneva`, `Chamonix`];
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
const arrayItems = [
  {type: `Taxi`, icon: `🚕`, caption: `Taxi to Airport`},
  {type: `Bus`, icon: `🚌`, caption: `Bus to `, toCity: true},
  {type: `Train`, icon: `🚂`, caption: `Train to `, toCity: true},
  {type: `Ship`, icon: `🛳️`, caption: `Ship to `, toCity: true},
  {type: `Transport`, icon: `🚊`, caption: `Transport to `, toCity: true},
  {type: `Drive`, icon: `🚗`, caption: `Taxi to `, toCity: true},
  {type: `Flight`, icon: `✈️`, caption: `Flight to `, toCity: true},
  {type: `Check-in`, icon: `🏨`, caption: `Check into a hotel`},
  {type: `Sightseeing`, icon: `🏛️`, caption: `Go to sightseeing`},
  {type: `Restaurant`, icon: `🍴`, caption: `Go to reastaurant`}
];
const arrayOffers = [
  {
    caption: `Add luggage`,
    price: {currency: CURRENT_CURRENCY, value: 15}
  },
  {
    caption: `Switch to comfort class`,
    price: {currency: CURRENT_CURRENCY, value: 25}
  },
  {
    caption: `Add meal`,
    price: {currency: CURRENT_CURRENCY, value: 10}
  },
  {
    caption: `Choose seats`,
    price: {currency: CURRENT_CURRENCY, value: 20}
  }
];

const generateTripDayItem = () => {
  const currentItem = arrayItems[getRandomInt(arrayItems.length)];

  return {
    icon: currentItem.icon,
    title: `${currentItem.caption} ${currentItem.toCity ? arrayCities[getRandomInt(arrayCities.length)] : ``}`.trim(),
    description: generateDescription(),
    picture: `http://picsum.photos/300/150?r=${Math.random()}`,
    schedule: {
      timetable: {
        since: `${getRandomInt(6)}:00`,
        to: `${getRandomInt(12, 7)}:00`
      },
      duration: `${getRandomInt(12)}h ${getRandomInt(59, 20)}m`,
    },
    price: {
      currency: CURRENT_CURRENCY,
      value: getRandomInt(30, 10)
    },
    offers: generateOffers(getRandomInt(3))
  };
};

const generateDescription = () => {
  const currentPhrases = [];
  const countPhrases = getRandomInt(3, 1);

  while (currentPhrases.length !== countPhrases) {
    currentPhrases.push(arrayDescriptionPhrases[getRandomInt(arrayDescriptionPhrases.length)]);
  }

  return currentPhrases.join(` `);
};

const generateOffers = (length = 0) => {
  const currentOffers = new Set();

  while (currentOffers.size !== length) {
    currentOffers.add(arrayOffers[getRandomInt(arrayOffers.length)]);
  }

  return currentOffers;
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
