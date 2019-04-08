import Filter from './make-filter';
import DayItem from './day-item';
import DayItemEdit from './day-item-edit';
import TripDay from './trip-day';
import ModelItem from './model-item';
import API from './api';
import Provider from './provider';
import Store from './store';
import {
  pointsFilters,
  mapItemsTypes
} from './make-data';
import './stat';
import moment from 'moment';

let mapPointsByDays = [];
const mapOffers = new Map();
const mapDestinations = new Map();
const AUTHORIZATION = `Basic gKJglhKGkghKHGSFS{FOSKFJH72fhf23216g=`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;
const POINTS_STORE_KEY = `points-store-key`;

const api = new API({
  endPoint: END_POINT,
  authorization: AUTHORIZATION
});
const store = new Store({
  keyStorage: POINTS_STORE_KEY,
  storage: localStorage
});
const provider = new Provider({
  api,
  store,
  generateId: () => (Date.now() + Math.random())
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(/^\[OFFLINE\]\s(.*)/, `$1`);

  provider.syncPoints();
});
window.addEventListener(`offline`, () => {
  document.title = `[OFFLINE] ${document.title}`;
});

document.addEventListener(`DOMContentLoaded`, () => {
  processLoadingStatus(`loading`);

  provider.getPoints()
  .then((data) => {
    processLoadingStatus();

    mapPointsByDays = makeMapDays(data);

    renderTripDays(mapPointsByDays);
  }).catch(() => {
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

  renderFilters(pointsFilters);

  document.querySelector(`.trip-controls__new-event`).addEventListener(`click`, () => {
    const nodeTripPoints = document.querySelector(`.trip-points`);
    const nodeTripDayItems = document.querySelector(`.trip-day__items`);
    const item = ModelItem.parseData({});
    const componentNewDayItem = new DayItem(item, mapOffers);
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
          componentNewDayItem.update(data);
          componentNewDayItem.render();
          nodeTripDayItems.appendChild(componentNewDayItem.element);
          nodeTripPoints.removeChild(componentNewDayItemEdit.element);
          componentNewDayItemEdit.unblock(`submit`);
          componentNewDayItemEdit.unrender();
        })
        .catch((err) => {
          componentNewDayItemEdit.shake();
          componentNewDayItemEdit.unblock(`submit`);
          throw err;
        });
    };
  });
});

/**
 * @description Отрисовка фильтров точек маршрута с навешиванием обработчика кликов по ним
 * @param {Array} [tripPointsFilters=[]] Объект описания фильтров
 */
const renderFilters = (tripPointsFilters = []) => {
  const nodeFiltersBar = document.querySelector(`.trip-filter`);
  const componentFilter = new Filter(tripPointsFilters);

  componentFilter.onClick = (evt) => {
    const filteredDayItems = filterDayItems(mapPointsByDays, evt.target.id);

    renderTripDays(filteredDayItems);
  };

  componentFilter.render();

  nodeFiltersBar.parentNode.replaceChild(componentFilter.element, nodeFiltersBar);
};

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

  return [...mapDayItems].reduce((filteredMap, [key, dayItems]) => {
    const filteredItems = dayItems.filter(filterCallback);

    filteredMap.set(key, filteredItems);

    return filteredMap;
  }, new Map());
};

/**
 * @description Вывести сообщение статуса загрузки данных
 * @param {String} status Текущий статус загрузки данных
 */
const processLoadingStatus = (status) => {
  const nodeTripDayItems = document.querySelector(`.trip-day__items`);

  switch (status) {
    case `loading`: nodeTripDayItems.innerHTML = `Loading route...`; break;
    case `error`: nodeTripDayItems.innerHTML =
        `Something went wrong while loading your route info.
        Check your connection or try again later`;
      break;
    default: break;
  }
};

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
 * @description Отрисовка списка дней событий маршрута
 * @param {Map} [mapDays=new Map()] Map дней маршрута
 */
const renderTripDays = (mapDays = new Map()) => {
  const docFragmentTripDays = document.createDocumentFragment();
  const nodeTripPoints = document.querySelector(`.trip-points`);

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
          nodeTripDayItems.removeChild(componentDayItemEdit.element);
          componentDayItemEdit.unrender();
        })
        .then(() => provider.getPoints())
        .catch((err) => {
          componentDayItemEdit.shake();
          componentDayItemEdit.unblock(`delete`);
          throw err;
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
