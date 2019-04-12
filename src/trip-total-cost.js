import Component from "./component";

/**
 * @description Класс компонента события маршрута
 * @class TripTotalCost
 */
export default class TripTotalCost extends Component {
  /**
   * @description Конструктор класса TripTotalCost
   * @param {String} [currency=`&euro;`] Валюта
   * @memberof TripTotalCost
   */
  constructor(currency = `&euro;`) {
    super();

    this._currency = currency;
    this._points = [];
    this._state.totalCost = 0;
  }

  /**
   * @description Геттер шаблона
   * @memberof TripTotalCost
   */
  get template() {
    const nodeTotalCostTemplate = document.createElement(`template`);

    nodeTotalCostTemplate.innerHTML =
      `<p class="trip__total">
        Total: <span class="trip__total-cost">
          ${this._currency} ${this._state.totalCost}
        </span>
      </p>`;

    return nodeTotalCostTemplate;
  }

  /**
   * @description Обновить данные компонента
   * @param {Array} points Массив данных описания точек маршрута
   * @memberof TripTotalCost
   */
  update(points) {
    this._points = points;

    this.element.querySelector(`.trip__total-cost`).innerHTML = `${this._currency} ${this._countTotalCost()}`;
  }

  /**
   * @description Рассчитать общую стоимость
   * @return {String}
   * @memberof TripTotalCost
   */
  _countTotalCost() {
    this._state.totalCost = [...(this._points || [])].reduce(
        TripTotalCost.countPointsTotalCost,
        0
    );

    return this._state.totalCost;
  }

  /**
   * @description Расчитать общую стоимость по точке маршрута
   * @static
   * @param {Number} totalCost Общая стоимость
   * @param {ModelItem} point Объект описания точки маршрута
   * @return {Number} Общая стоимость по точке маршрута
   * @memberof TripTotalCost
   */
  static countPointsTotalCost(totalCost, point) {
    totalCost += point.price;

    return [...(point.offers.values() || [])].reduce(
        TripTotalCost.countOffersTotalCost,
        totalCost
    );
  }

  /**
   * @description Рассчитать общую стоимость
   * по включённым опциям точки маршрута
   * @static
   * @param {Number} totalCost Общая стоимость
   * @param {Object} offer Опция точки маршрута
   * @return {Number} Общая стоимость включённых опций точки маршрута
   * @memberof TripTotalCost
   */
  static countOffersTotalCost(totalCost, offer) {
    if (offer.accepted) {
      totalCost += offer.price;
    }

    return totalCost;
  }
}
