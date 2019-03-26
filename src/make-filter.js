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
   * @param {Object} filter Объект данных фильтра
   * @param {String} filter.id ID фильтра
   * @param {String} filter.caption Наименование фильтра
   * @param {String} filter.value Значение фильтра
   * @memberof Filter
   */
  constructor(filter) {
    super();

    this._id = filter.id;
    this._caption = filter.caption;
    this._value = filter.value;

    this._state.isChecked = filter.isChecked || false;

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
      `<div style="display: inline-block;">
        <input type="radio" id="filter-${this._id}" name="filter" value="${this._value}" ${this._state.isChecked ? `checked` : ``}>
        <label class="trip-filter__item" for="filter-${this._id}">${this._caption}</label>
      </div>`;

    return nodeFilterTemplate;
  }

  /**
   * @description Централизованное создание обработчиков событий для компонента
   * @memberof Filter
   */
  createListeners() {
    this._element.addEventListener(`click`, this._onFilterClick);
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
