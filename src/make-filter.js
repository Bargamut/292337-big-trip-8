import Component from "./component";

/**
 * @description Класс компонента фильтра
 * @export
 * @class Filter
 * @extends {Component}
 */
export default class Filter extends Component {
  /**
   * Конструктор класса компонета фильтра
   * @param {Array} filters Массив данных фильтров
   * @memberof Filter
   */
  constructor(filters) {
    super();

    this._filters = filters;

    this._onFilterClick = this._onFilterClick.bind(this);
    this._onClick = null;
  }

  /**
   * @description Сеттер обработчика клика по фильтру
   * @param {Function} callback Функция-обработчик
   * @memberof Filter
   */
  set onClick(callback) {
    this._onClick = callback;
  }

  /**
   * @description Создание шаблона фильтра
   * @param {Object} filter Объект описания фильтра
   * @return {Node} DOM-элемент <template> фильтра
   */
  get template() {
    const nodeFilterTemplate = document.createElement(`template`);

    nodeFilterTemplate.innerHTML =
      `<form class="trip-filter">
        ${this._generateFiltersTemplate()}
      </form>`;

    return nodeFilterTemplate;
  }

  _generateFiltersTemplate() {
    let templates = ``;

    this._filters.forEach((filter) => {
      templates +=
        `<input type="radio" id="filter-${filter.id}" name="filter" value="${filter.value}" ${filter.isChecked ? `checked` : ``}>
        <label class="trip-filter__item" for="filter-${filter.id}">${filter.caption}</label>`;
    });

    return templates;
  }

  /**
   * @description Централизованное создание обработчиков событий для компонента
   * @memberof Filter
   */
  createListeners() {
    this._element.addEventListener(`change`, this._onFilterClick);
  }

  /**
   * @description Обработчик клика по фильтру событий
   * @param {Event} evt Объект события, передаваемый в callback
   */
  _onFilterClick(evt) {
    if (this._onClick instanceof Function) {
      this._onClick(evt);
    }
  }
}
