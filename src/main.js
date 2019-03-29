import Filter from './make-filter';
import DayItem from './day-item';
import DayItemEdit from './day-item-edit';
import API from './api';
import {
  pointsFilters,
  mapItemsTypes
} from './make-data';
import './stat';

let currentPoints = [];
const mapOffers = new Map();
const mapDestinations = new Map();
const AUTHORIZATION = `Basic gKJglhKGkghKHGSFS{FOSKFJH72fhf2328g=`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;

const api = new API({
  endPoint: END_POINT,
  authorization: AUTHORIZATION
});

document.addEventListener(`DOMContentLoaded`, () => {
  processLoadingStatus(`loading`);

  api.getPoints()
  .then((data) => {
    processLoadingStatus();

    currentPoints = data;

    renderTripDayItems(currentPoints);
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
});

/**
 * @description Отрисовка фильтров точек маршрута с навешиванием обработчика кликов по ним
 * @param {Array} [tripPointsFilters=[]] Объект описания фильтров
 */
const renderFilters = (tripPointsFilters = []) => {
  const nodeFiltersBar = document.querySelector(`.trip-filter`);
  const componentFilter = new Filter(tripPointsFilters);

  componentFilter.onClick = (evt) => {
    const filteredDayItems = filterDayItems(currentPoints, evt.target.id);

    renderTripDayItems(filteredDayItems);
  };

  componentFilter.render();

  nodeFiltersBar.parentNode.replaceChild(componentFilter.element, nodeFiltersBar);
};

/**
 * @description Отфильтровать события маршрута
 * @param {Array} dayItems События маршрута
 * @param {String} filterId ID фильтра
 * @return {Array} Отфильтрованный массив событий маршрута
 */
const filterDayItems = (dayItems, filterId) => {
  switch (filterId) {
    case `filter-future`:
      return dayItems.filter((item) =>
        item !== null &&
        item.time.since > Date.now()
      );
    case `filter-past`:
      return dayItems.filter((item) =>
        item !== null &&
        item.time.to, `HH:mm` < Date.now()
      );
    case `filter-everything`:
    default: return dayItems;
  }
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

/**
 * @description Отрисовка списка событий маршрута
 * @param {Array} [dayItems=[]] Массив событий маршрута
 */
const renderTripDayItems = (dayItems = []) => {
  const nodeTripDayItems = document.querySelector(`.trip-day__items`);
  const docFragmentTripDayItems = document.createDocumentFragment();

  dayItems.forEach((item) => {
    if (item === null) {
      return;
    }

    const componendDayItem = new DayItem(item, mapOffers);
    const componendDayItemEdit = new DayItemEdit(item, mapDestinations, mapItemsTypes, mapOffers);

    componendDayItem.onEdit = () => {
      componendDayItemEdit.render();
      nodeTripDayItems.replaceChild(componendDayItemEdit.element, componendDayItem.element);
      componendDayItem.unrender();
    };

    componendDayItemEdit.onSubmit = (newData) => {
      componendDayItemEdit.block(`submit`);
      Object.assign(item, newData);

      api.update({
        id: item.id,
        data: item.toRAW()
      })
        .then((data) => {
          componendDayItem.update(data);
          componendDayItem.render();
          nodeTripDayItems.replaceChild(componendDayItem.element, componendDayItemEdit.element);
          componendDayItemEdit.unblock(`submit`);
          componendDayItemEdit.unrender();
        })
        .catch((err) => {
          componendDayItemEdit.shake();
          componendDayItemEdit.unblock(`submit`);
          throw err;
        });
    };

    componendDayItemEdit.onDelete = ({id}) => {
      componendDayItemEdit.block(`delete`);

      api.delete({id})
        .then(() => {
          nodeTripDayItems.removeChild(componendDayItemEdit.element);
          componendDayItemEdit.unrender();
        })
        .then(() => api.getPoints())
        .catch((err) => {
          componendDayItemEdit.shake();
          componendDayItemEdit.unblock(`delete`);
          throw err;
        });
    };

    docFragmentTripDayItems.appendChild(
        componendDayItem.render()
    );
  });

  nodeTripDayItems.innerHTML = ``;
  nodeTripDayItems.appendChild(docFragmentTripDayItems);
};
