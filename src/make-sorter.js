import Component from "./component";

/**
 * @description Класс компонента сортировки событий маршрута
 * @class Sorter
 */
export default class Sorter extends Component {
  /**
   * @description Конструктор класса Sorter
   * @param {Array} sorters Массив данных сортировок
   * @memberof Sorter
   */
  constructor(sorters) {
    super();

    this._sorters = sorters;

    this._onSorterClick = this._onSorterClick.bind(this);
    this._onClick = null;
  }

  /**
   * @description Сеттер обработчика клика по сортеру
   * @param {Function} callback Функция-обработчик
   * @memberof Sorter
   */
  set onClick(callback) {
    this._onClick = callback;
  }

  /**
   * @description Геттер шаблона
   * @memberof Sorter
   */
  get template() {
    const nodeSortTempleate = document.createElement(`template`);

    nodeSortTempleate.innerHTML =
      `<form class="trip-sorting">
        ${this._generateSortersTemplate()}
      </form>`;

    return nodeSortTempleate;
  }

  /**
   * @description Гененировать шаблон сортера
   * @return {String} HTML-шаблон сортера
   * @memberof Sorter
   */
  _generateSortersTemplate() {
    return this._sorters.reduce((template, sorter) => {
      template +=
        `<input type="radio" name="trip-sorting" id="sorting-${sorter.id}" value="${sorter.value}" ${sorter.isChecked ? `checked` : ``}>
        <label class="trip-sorting__item trip-sorting__item--${sorter.id}" for="sorting-${sorter.id}">${sorter.caption}</label>`;

      return template;
    }, ``);
  }

  /**
   * @description Централизованная установка обработчиков событий
   * @memberof Sorter
   */
  createListeners() {
    this._element.addEventListener(`change`, this._onSorterClick);
  }

  /**
   * @description Обработчик клика по сортировке событий
   * @param {Event} evt Объект события, передаваемый в callback
   * @memberof Sorter
   */
  _onSorterClick(evt) {
    if (this._onClick instanceof Function) {
      this._onClick(evt);
    }
  }
}
