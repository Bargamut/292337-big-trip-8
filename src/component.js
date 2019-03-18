/**
 * @description Класс компонента события маршрута
 * @class Component
 */
export default class Component {
  /**
   * @description Конструктор класса Component
   * @memberof Component
   */
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }

    this._element = null;
  }

  /**
   * @description Геттер шаблона
   * @memberof Component
   */
  get template() {
    throw new Error(`You have to define template`);
  }

  /**
   * @description Геттер элемента
   * @readonly
   * @memberof Component
   */
  get element() {
    return this._element;
  }

  /**
   * @description Метод отрисовки элемента
   * @return {Node} DOM-элемент
   * @memberof Component
   */
  render() {
    this._element = this.template.content.cloneNode(true).firstChild;

    this.createListeners();

    return this._element;
  }

  /**
   * @description Очистка свойств и отвязка обработчиков событий
   * @memberof Component
   */
  unrender() {
    this.removeListeners();

    this._element = null;
  }

  /**
   * @description Централизованная установка обработчиков событий
   * @memberof Component
   */
  createListeners() {}

  /**
   * @description Централизованное снятие обработчиков событий
   * @memberof Component
   */
  removeListeners() {}
}
