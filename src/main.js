import moment from 'moment';
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
const AUTHORIZATION = `Basic gKJghkgjgIKGKkjhkj7Yt67Ikg=`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;

const api = new API({
  endPoint: END_POINT,
  authorization: AUTHORIZATION
});

document.addEventListener(`DOMContentLoaded`, () => {
  api.getOffers()
    .then((data) => {
      data.reduce((map, obj) => {
        map.set(obj.type, obj.offers);

        return map;
      }, mapOffers);
    }).then(() => {
      api.getPoints()
        .then((data) => {
          currentPoints = data;

          renderTripDayItems(currentPoints);
        });
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
 * @description Удаление события маршрута
 * @param {Array} dayItems Массив событий
 * @param {Number} index Индекс удаляемого события
 */
const deleteDayItem = (dayItems, index) => {
  dayItems[index] = null;
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
      Object.assign(item, newData);

      componendDayItem.update(item);
      componendDayItem.render();
      nodeTripDayItems.replaceChild(componendDayItem.element, componendDayItemEdit.element);
      componendDayItemEdit.unrender();
    };

    componendDayItemEdit.onDelete = () => {
      // deleteDayItem(index);

      // nodeTripDayItems.removeChild(componendDayItemEdit.element);

      // componendDayItemEdit.unrender();
    };

    docFragmentTripDayItems.appendChild(
        componendDayItem.render()
    );
  });

  nodeTripDayItems.innerHTML = ``;
  nodeTripDayItems.appendChild(docFragmentTripDayItems);
};
