export const SERVER_DATA = {
  AUTHORIZATION: `Basic gKJghkgjgIKGKkjhkj7Yt67Ikg7=`,
  END_POINT: `https://es8-demo-srv.appspot.com/big-trip`,
  POINTS_STORE_KEY: `points-store-key`
};

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
    isChecked: true,
    isVisible: () => true
  },
  {
    id: `future`,
    caption: `Future`,
    value: `future`,
    isVisible: (dayItems) => dayItems.some((item) => item.time.since > Date.now())
  },
  {
    id: `past`,
    caption: `Past`,
    value: `past`,
    isVisible: (dayItems) => dayItems.some((item) => item.time.to < Date.now())
  }
];

export const pointsSorters = [
  {
    id: `event`,
    caption: `Event`,
    value: `event`,
    isChecked: true
  },
  {
    id: `time`,
    caption: `Time`,
    value: `time`
  },
  {
    id: `price`,
    caption: `Price`,
    value: `price`
  },
  {
    id: `offers`,
    caption: `Offers`,
    value: `offers`
  }
];
