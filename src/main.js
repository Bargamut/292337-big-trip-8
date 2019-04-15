import Filter from './make-filter';
import Sorter from './make-sorter';
import DayItem from './day-item';
import DayItemEdit from './day-item-edit';
import TripDay from './trip-day';
import TripTotalCost from './trip-total-cost';
import ModelItem from './model-item';
import API from './api';
import Provider from './provider';
import Store from './store';
import {
  SERVER_DATA,
  pointsFilters,
  pointsSorters,
  mapItemsTypes
} from './make-data';
import './stat';
import moment from 'moment';

let mapPointsByDays = new Map();
const mapOffers = new Map();
const mapDestinations = new Map();

const api = new API({
  endPoint: SERVER_DATA.END_POINT,
  authorization: SERVER_DATA.AUTHORIZATION
});
const store = new Store({
  keyStorage: SERVER_DATA.POINTS_STORE_KEY,
  storage: localStorage
});
const provider = new Provider({
  api,
  store,
  generateId: () => (Date.now() + Math.random())
});
const componentTripTotalCost = new TripTotalCost();
const componentFilter = new Filter(pointsFilters);

window.addEventListener(`online`, () => {
  document.title = document.title.replace(/^\[OFFLINE\]\s(.*)/, `$1`);

  provider.syncPoints();
});
window.addEventListener(`offline`, () => {
  document.title = `[OFFLINE] ${document.title}`;
});

document.addEventListener(`DOMContentLoaded`, () => {
  renderFilters(pointsFilters);
  renderSorters(pointsSorters);

  processLoadingStatus(`loading`);

  provider.getPoints()
    .then(refreshTripEvents)
    .catch(() => {
      processLoadingStatus(`error`);
    });

  api.getOffers()
    .then((data) => {
      data.reduce((map, obj) => {
        map.set(obj.type, obj.offers);

        return map;
      }, mapOffers);
    });

  api.getDestinations()
    .then((data) => {
      data.forEach((destination) => {
        mapDestinations.set(destination.name, {
          description: destination.description,
          pictures: destination.pictures
        });
      });
    });

  document.querySelector(`.trip-controls__new-event`).addEventListener(`click`, () => {
    const nodeTripPoints = document.querySelector(`.trip-points`);
    const item = ModelItem.parseData({});
    const componentNewDayItemEdit = new DayItemEdit(
        item,
        mapDestinations,
        mapItemsTypes,
        mapOffers
    );

    nodeTripPoints.insertAdjacentElement(
        `afterbegin`,
        componentNewDayItemEdit.render()
    );

    componentNewDayItemEdit.onSubmit = (newData) => {
      componentNewDayItemEdit.block(`submit`);
      Object.assign(item, newData);

      provider.createPoint({
        point: item.toRAW()
      })
        .then((data) => {
          const keyDate = moment(data.time.since).format(`MMM D`);

          if (mapPointsByDays.has(keyDate)) {
            mapPointsByDays.get(keyDate).push(data);
          } else {
            mapPointsByDays.set(keyDate, [data]);
          }

          renderTripDays(mapPointsByDays);

          componentNewDayItemEdit.unblock(`submit`);
          componentNewDayItemEdit.unrender();
        })
        .catch((err) => {
          componentNewDayItemEdit.shake();
          componentNewDayItemEdit.unblock(`submit`);
          throw err;
        });
    };

    componentNewDayItemEdit.onEscape = (evt) => {
      if (evt.key !== `Escape`) {
        return;
      }

      nodeTripPoints.removeChild(componentNewDayItemEdit.element);
      componentNewDayItemEdit.unrender();
    };
  });

  renderTripTotalCost();
});

/**
 * @description Отфильтровать события маршрута
 * @param {Map} mapDayItems Map событий маршрута по дням
 * @param {String} filterId ID фильтра
 * @return {Map} Отфильтрованный Map дней событий маршрута
 */
const filterDayItems = (mapDayItems, filterId) => {
  let filterCallback;

  switch (filterId) {
    case `filter-future`:
      filterCallback = (item) =>
        item !== null &&
        item.time.since > Date.now();
      break;
    case `filter-past`:
      filterCallback = (item) =>
        item !== null &&
        item.time.to < Date.now();
      break;
    case `filter-everything`:
    default: return mapDayItems;
  }

  return new Map([...mapDayItems].filter(
      ([, dayItems]) => dayItems.filter(filterCallback).length)
  );
};

/**
 * @description Отсортировать события маршрута
 * @param {Array} dayItems Map событий маршрута по дням
 * @param {String} sorterId ID фильтра
 * @return {Array} Отсортированный массив дней событий маршрута
 */
const sortDayItems = (dayItems, sorterId) => {
  let sorterCallback;

  switch (sorterId) {
    case `sorting-offers`:
      sorterCallback = (itemA, itemB) => {
        const countOffersA = [...(itemA.offers.values() || [])].filter((offer) => offer.accepted).length;
        const countOffersB = [...(itemB.offers.values() || [])].filter((offer) => offer.accepted).length;

        return countOffersB - countOffersA;
      };
      break;
    case `sorting-price`:
      sorterCallback = (itemA, itemB) => itemB.price - itemA.price;
      break;
    case `sorting-time`:
      sorterCallback = (itemA, itemB) => getDuration(itemB) - getDuration(itemA);
      break;
    case `sorting-event`:
    default: return dayItems;
  }

  return dayItems.sort(sorterCallback);
};

/**
 * @description Посчитать длительност времени
 * @param {ModelItem} item Объект данных события маршрута
 * @return {Number} Количество милиссикунд дилтельности
 */
const getDuration = (item) => {
  const a = moment(item.time.since);
  const b = moment(item.time.to);
  const duration = moment.duration(b.diff(a));

  return duration.asMilliseconds();
};

/**
 * @description Вывести сообщение статуса загрузки данных
 * @param {String} status Текущий статус загрузки данных
 */
const processLoadingStatus = (status) => {
  const nodeTripDayItems = document.querySelector(`.trip-points`);

  switch (status) {
    case `loading`: nodeTripDayItems.innerHTML = `Loading route...`; break;
    case `error`: nodeTripDayItems.innerHTML =
        `Something went wrong while loading your route info.
        Check your connection or try again later`;
      break;
    default: break;
  }
};

/**
 * @description Рассчитать общую стоимость путешествия
 */
const calculateTotalPrice = () => {
  componentTripTotalCost.update(
      provider.getPointsFromStore()
  );
};

/**
 * @description Создать Map дней с событиями
 * @param {Array} [dayItems=[]] Массив событий маршрута
 * @return {Map} Map дней маршрута с событиями
 */
const makeMapDays = (dayItems = []) => {
  const days = dayItems.reduce((mapDays, item) => {
    const key = moment(item.time.since).format(`MMM D`);

    if (mapDays.has(key)) {
      mapDays.get(key).push(item);
    } else {
      mapDays.set(key, [item]);
    }

    return mapDays;
  }, new Map());

  return days;
};

/**
 * @description Обновить список точек маршрута по дням
 * @param {Array} data Данные точек маршрута
 */
const refreshTripEvents = (data) => {
  processLoadingStatus();

  mapPointsByDays = makeMapDays(data);

  componentFilter.switchFiltersVisible(data);

  renderTripDays(mapPointsByDays);
};

/**
 * @description Отрисовка фильтров точек маршрута с навешиванием обработчика кликов по ним
 */
const renderFilters = () => {
  const nodeFiltersBar = document.querySelector(`.trip-filter`);

  componentFilter.onClick = (evt) => {
    const filteredDayItems = filterDayItems(mapPointsByDays, evt.target.id);

    renderTripDays(filteredDayItems);
  };

  componentFilter.render();

  componentFilter.switchFiltersVisible(
      provider.getPointsFromStore()
  );

  nodeFiltersBar.parentNode.replaceChild(componentFilter.element, nodeFiltersBar);
};

/**
 * @description Отрисовка сортеров точек маршрута с навешиванием обработчика кликов по ним
 * @param {Array} [tripPointsSorters=[]] Объект описания сортеров
 */
const renderSorters = (tripPointsSorters = []) => {
  const nodeSortersBar = document.querySelector(`.trip-sorting`);
  const componentSorter = new Sorter(tripPointsSorters);

  componentSorter.onClick = (evt) => {
    const sortedDayItems = sortDayItems(provider.getPointsFromStore(), evt.target.id);
    const mapDayItems = makeMapDays(sortedDayItems);

    renderTripDays(mapDayItems);
  };

  componentSorter.render();

  nodeSortersBar.parentNode.replaceChild(componentSorter.element, nodeSortersBar);
};

/**
 * @description Отрисовать компонент общей стоимости путешествия
 */
const renderTripTotalCost = () => {
  const nodeTripTotal = document.querySelector(`.trip__total`);

  componentTripTotalCost.render();

  nodeTripTotal.parentNode.replaceChild(componentTripTotalCost.element, nodeTripTotal);
};

/**
 * @description Отрисовка списка дней событий маршрута
 * @param {Map} [mapDays=new Map()] Map дней маршрута
 */
const renderTripDays = (mapDays = new Map()) => {
  const docFragmentTripDays = document.createDocumentFragment();
  const nodeTripPoints = document.querySelector(`.trip-points`);

  mapDays = new Map([...mapDays.entries()].sort(([, pointsA], [, pointsB]) => {
    return pointsA[0].time.since - pointsB[0].time.since;
  }));

  [...mapDays].forEach(([day, points], index) => {
    if (points.length === 0) {
      return;
    }

    const componentTripDay = new TripDay({
      date: day,
      index: index + 1
    });

    componentTripDay.render();
    docFragmentTripDays.appendChild(componentTripDay.element);

    renderTripDayItems({
      dayItems: points,
      nodeTripDay: componentTripDay.element
    });
  });

  nodeTripPoints.innerHTML = ``;
  nodeTripPoints.appendChild(docFragmentTripDays);

  calculateTotalPrice();
};

/**
 * @description Отрисовка списка событий маршрута за день
 * @param {Array} [dayItems=[]] Массив событий маршрута
 * @param {Node} nodeTripDay DOM-элемент дня маршрута
 */
const renderTripDayItems = ({dayItems = [], nodeTripDay}) => {
  const docFragmentTripDayItems = document.createDocumentFragment();
  const nodeTripDayItems = nodeTripDay.querySelector(`.trip-day__items`);

  dayItems.forEach((item) => {
    if (item === null) {
      return;
    }

    const componentDayItem = new DayItem(item, mapOffers);
    const componentDayItemEdit = new DayItemEdit(item, mapDestinations, mapItemsTypes, mapOffers);

    componentDayItem.onEdit = () => {
      componentDayItemEdit.render();
      nodeTripDayItems.replaceChild(componentDayItemEdit.element, componentDayItem.element);
      componentDayItem.unrender();
    };

    componentDayItemEdit.onSubmit = (newData) => {
      componentDayItemEdit.block(`submit`);
      Object.assign(item, newData);

      provider.updatePoint({
        id: item.id,
        data: item.toRAW()
      })
        .then((data) => {
          componentDayItem.update(data);
          componentDayItem.render();
          nodeTripDayItems.replaceChild(componentDayItem.element, componentDayItemEdit.element);
          componentDayItemEdit.unblock(`submit`);
          componentDayItemEdit.unrender();

          calculateTotalPrice();
        })
        .catch((err) => {
          componentDayItemEdit.shake();
          componentDayItemEdit.unblock(`submit`);
          throw err;
        });
    };

    componentDayItemEdit.onDelete = ({id}) => {
      componentDayItemEdit.block(`delete`);

      provider.deletePoint({id})
        .then(() => {
          componentDayItemEdit.unrender();
        })
        .catch((err) => {
          componentDayItemEdit.shake();
          componentDayItemEdit.unblock(`delete`);
          throw err;
        })
        .then(() => provider.getPoints())
        .then(refreshTripEvents)
        .catch(() => {
          processLoadingStatus(`error`);
        });
    };

    componentDayItemEdit.onEscape = (evt) => {
      if (evt.key !== `Escape`) {
        return;
      }

      componentDayItem.render();
      nodeTripDayItems.replaceChild(componentDayItem.element, componentDayItemEdit.element);
      componentDayItemEdit.unrender();
    };

    docFragmentTripDayItems.appendChild(
        componentDayItem.render()
    );
  });

  nodeTripDayItems.innerHTML = ``;
  nodeTripDayItems.appendChild(docFragmentTripDayItems);
};
