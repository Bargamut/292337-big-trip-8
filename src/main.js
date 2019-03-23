import makeFilter from './make-filter';
import DayItem from './day-item';
import DayItemEdit from './day-item-edit';
import currentTripDayItems, {pointsFilters, mapDestinations, mapItemsTypes, mapOffers} from './make-data';

document.addEventListener(`DOMContentLoaded`, () => {
  renderFilters(document.querySelector(`.trip-filter`), pointsFilters);
  renderTripDayItems(document.querySelector(`.trip-day__items`), currentTripDayItems);
});

/**
 * @description Отрисовка фильтров точек маршрута с навешиванием обработчика кликов по ним
 * @param {Node} nodeFiltersBar DOM-элемент блока фильтров
 * @param {Array} [tripPointsFilters=[]] Объект описания фильтров
 */
const renderFilters = (nodeFiltersBar, tripPointsFilters = []) => {
  const docFragmentFilters = document.createDocumentFragment();

  tripPointsFilters.forEach((objTripFilter) => {
    docFragmentFilters.appendChild(
        makeFilter(objTripFilter).content.cloneNode(true)
    );
  });

  nodeFiltersBar.innerHTML = ``;
  nodeFiltersBar.appendChild(docFragmentFilters);
  nodeFiltersBar.addEventListener(`click`, onFilterClick);
};

const deleteDayItem = (items, index) => {
  items[index] = null;
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
    currentTripPoints.push(generateTripDayItem());
  }

  renderTripDayItems(document.querySelector(`.trip-day__items`), currentTripPoints);
};
