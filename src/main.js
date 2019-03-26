import moment from 'moment';
import Filter from './make-filter';
import DayItem from './day-item';
import DayItemEdit from './day-item-edit';
import currentDayItems, {
  pointsFilters,
  mapDestinations,
  mapItemsTypes,
  mapOffers
} from './make-data';

document.addEventListener(`DOMContentLoaded`, () => {
  const nodeDayItemsBoard = document.querySelector(`.trip-day__items`);

  renderFilters(document.querySelector(`.trip-filter`), pointsFilters, nodeDayItemsBoard);
  renderTripDayItems(nodeDayItemsBoard, currentDayItems);
});

/**
 * @description Отрисовка фильтров точек маршрута с навешиванием обработчика кликов по ним
 * @param {Node} nodeFiltersBar DOM-элемент блока фильтров
 * @param {Array} [tripPointsFilters=[]] Объект описания фильтров
 * @param {Node} [nodeDayItemsBoard] DOM-элемент блока событий маршрута
 */
const renderFilters = (nodeFiltersBar, tripPointsFilters = [], nodeDayItemsBoard) => {
  const docFragmentFilters = document.createDocumentFragment();

  tripPointsFilters.forEach((filter) => {
    const componentFilter = new Filter(filter);

    componentFilter.onClick = () => {
      const filteredDayItems = filterDayItems(currentDayItems, filter.id);

      renderTripDayItems(nodeDayItemsBoard, filteredDayItems);
    };

    componentFilter.render();

    docFragmentFilters.appendChild(componentFilter.element);
  });

  nodeFiltersBar.innerHTML = ``;
  nodeFiltersBar.appendChild(docFragmentFilters);
};

/**
 * @description Удаление события маршрута
 * @param {Array} items Массив событий
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
    case `future`: return dayItems.filter((item) => moment(item.time.since, `HH:mm`).valueOf() > Date.now());
    case `past`: return dayItems.filter((item) => moment(item.time.to, `HH:mm`).valueOf() < Date.now());
    case `everything`:
    default: return dayItems;
  }
};

/**
 * @description Отрисовка списка событий маршрута
 * @param {Node} nodeTripDayItems DOM-элемент блока событий маршрута
 * @param {Array} [dayItems=[]] Массив событий маршрута
 */
const renderTripDayItems = (nodeTripDayItems, dayItems = []) => {
  const docFragmentTripDayItems = document.createDocumentFragment();

  dayItems.forEach((item, index) => {
    const componendDayItem = new DayItem(item, mapOffers);
    const componendDayItemEdit = new DayItemEdit(item, mapDestinations, mapItemsTypes, mapOffers);

    componendDayItem.onEdit = () => {
      componendDayItemEdit.render();
      nodeTripDayItems.replaceChild(componendDayItemEdit.element, componendDayItem.element);
      componendDayItem.unrender();
    };

    const switchToView = () => {
      componendDayItem.render();
      nodeTripDayItems.replaceChild(componendDayItem.element, componendDayItemEdit.element);
      componendDayItemEdit.unrender();
    };

    componendDayItemEdit.onSubmit = (newData) => {
      Object.assign(item, newData);

      componendDayItem.update(item);
      switchToView();
    };

    componendDayItemEdit.onDelete = () => {
      deleteDayItem(dayItems, index);

      nodeTripDayItems.removeChild(componendDayItemEdit.element);

      componendDayItemEdit.unrender();
    };

    docFragmentTripDayItems.appendChild(
      componendDayItem.render()
    );
  });

  nodeTripDayItems.innerHTML = ``;
  nodeTripDayItems.appendChild(docFragmentTripDayItems);
};
