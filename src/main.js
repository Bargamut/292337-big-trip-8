import makeFilter from './make-filter';
import DayItem from './day-item';
import DayItemEdit from './day-item-edit';
import generateTripDayItem, {pointsFilters} from './make-data';

const currentTripDayItems = [];

document.addEventListener(`DOMContentLoaded`, () => {
  // Набираем 7 элементов
  while (currentTripDayItems.length < 7) {
    currentTripDayItems.push(generateTripDayItem());
  }

  renderFilters(document.querySelector(`.trip-filter`), pointsFilters);
  renderTripDayItems(document.querySelector(`.trip-day__items`), currentTripDayItems);
});

/**
 * @description Отрисовка фильтров точек маршрута с навешиванием обработчика кликов по ним
 * @param {Node} nodeFiltersBar DOM-элемент блока фильтров
 * @param {Array} [tripPointsFilters=[]] Объект описания фильтров
 */
const renderFilters = function (nodeFiltersBar, tripPointsFilters = []) {
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

/**
 * @description Отрисовка списка событий маршрута
 * @param {Node} nodeTripDayItems DOM-элемент блока событий маршрута
 * @param {Array} [dayItems=[]] Массив событий маршрута
 */
const renderTripDayItems = function (nodeTripDayItems, dayItems = []) {
  const docFragmentTripDayItems = document.createDocumentFragment();

  for (let item of dayItems) {
    const componendDayItem = new DayItem(item);
    const componendDayItemEdit = new DayItemEdit(item);

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

    componendDayItemEdit.onSubmit = switchToView;
    componendDayItemEdit.onReset = switchToView;

    docFragmentTripDayItems.appendChild(
        componendDayItem.render()
    );
  }

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
