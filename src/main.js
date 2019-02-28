import makeFilter from './make-filter';
import makeTripPoint from './make-trip-point';

const pointsFilters = {
  everything: {
    caption: `Everything`,
    value: `everything`,
    isChecked: true
  },
  future: {
    caption: `Future`,
    value: `future`
  },
  past: {
    caption: `Past`,
    value: `past`
  }
};
const tripPoints = [
  {
    icon: `🚕`,
    title: `Taxi to Airport`,
    timetable: {
      since: `10:00`, to: `11:00`
    },
    duration: `1H 30M`,
    price: {
      currency: `&euro;`, value: 20
    },
    offers: [
      {
        caption: `Order UBER`,
        price: {
          currency: `&euro;`, value: 20
        }
      },
      {
        caption: `Upgrade to business`,
        price: {
          currency: `&euro;`, value: 20
        }
      }
    ]
  }
];

document.addEventListener(`DOMContentLoaded`, () => {
  const currentTripPoints = [];

  for (let i = 0; i < 7; i++) {
    currentTripPoints.push(tripPoints[0]);
  }

  renderFilters(document.querySelector(`.trip-filter`), pointsFilters);
  renderTripPoints(document.querySelector(`.trip-day__items`), currentTripPoints);
});

/**
 * @description Отрисовка фильтров точек маршрута с навешиванием обработчика кликов по ним
 * @param {Node} nodeFiltersBar - DOM-элемент блока фильтров
 * @param {Object} [tripPointsFilters={}] - Объект описания фильтров
 */
const renderFilters = function (nodeFiltersBar, tripPointsFilters = {}) {
  const docFragmentFilters = document.createDocumentFragment();

  for (let key in tripPointsFilters) {
    if (!tripPointsFilters.hasOwnProperty(key)) {
      continue;
    }

    docFragmentFilters.appendChild(
        makeFilter(key, tripPointsFilters[key]).content.cloneNode(true)
    );
  }

  nodeFiltersBar.innerHTML = ``;
  nodeFiltersBar.appendChild(docFragmentFilters);
  nodeFiltersBar.addEventListener(`click`, onFilterClick);
};

/**
 * @description Отрисовка списка точек маршрута
 * @param {Node} nodeTripDayItems DOM-элемент блока точек маршрута
 * @param {Array} [points=[]] Массив точек маршрута
 */
const renderTripPoints = function (nodeTripDayItems, points = []) {
  const docFragmentTripPoints = document.createDocumentFragment();

  for (let point of points) {
    docFragmentTripPoints.appendChild(
        makeTripPoint(point).content.cloneNode(true)
    );
  }

  nodeTripDayItems.innerHTML = ``;
  nodeTripDayItems.appendChild(docFragmentTripPoints);
};

/**
 * @description Обработчик клика по фильтру событий
 * @param {Event} evt Объект события, передаваемый в callback
 */
const onFilterClick = (evt) => {
  const nodeTarget = evt.target;
  const randNumPoints = Math.floor(Math.random() * (20 - 1)) + 1;
  const currentTripPoints = [];

  if (!nodeTarget.classList.contains(`trip-filter__item`)) {
    return;
  }

  for (let i = 0; ++i <= randNumPoints;) {
    currentTripPoints.push(tripPoints[0]);
  }

  renderTripPoints(document.querySelector(`.trip-day__items`), currentTripPoints);
};
