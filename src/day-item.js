/**
 * @description Класс компонента события маршрута
 * @class DayItem
 */
export default class DayItem {
  /**
   * @description Конструктор класса DayItem
   * @param {Object} tripDayItem Объект описания события маршрута
   * @memberof DayItem
   */
  constructor(tripDayItem) {
    this._icon = tripDayItem.icon;
    this._title = tripDayItem.title;
    this._schedule = tripDayItem.schedule;
    this._price = tripDayItem.price;
    this._offers = tripDayItem.offers;
    this._element = null;
  }

  /**
   * @description Создание шаблона заказов при событии маршрута
   * @return {String} Шаблон набора заказов при событии маршрута
   * @memberof DayItem
   */
  _getTripOffersTemplate() {
    let template = ``;

    this._offers.forEach((offer) => {
      template +=
        `<li>
          <button class="trip-point__offer">${offer.caption} +${offer.price.currency}&nbsp;${offer.price.value}</button>
        </li>`;
    });

    return template;
  }

  /**
   * @description Геттер шаблона события маршрута
   * @return {Node} DOM-элемент <template> события маршрута
   * @memberof DayItem
   */
  get template() {
    const nodetripDayItemTemplate = document.createElement(`template`);

    nodetripDayItemTemplate.innerHTML =
      `<article class="trip-point">
        <i class="trip-icon">${this._icon}</i>

        <h3 class="trip-point__title">${this._title}</h3>

        <p class="trip-point__schedule">
          <span class="trip-point__timetable">${this._schedule.timetable.since} — ${this._schedule.timetable.to}</span>
          <span class="trip-point__duration">${this._schedule.duration}</span>
        </p>

        <p class="trip-point__price">${this._price.currency}&nbsp;${this._price.value}</p>

        <ul class="trip-point__offers">${this._getTripOffersTemplate()}</ul>
      </article>`;

    return nodetripDayItemTemplate;
  }

  /**
   * @description Метод отрисовки элемента события
   * @return {Node} DOM-элемент карточки задачи
   * @memberof DayItem
   */
  render() {
    this._element = this.template.content.cloneNode(true).firstChild;

    return this._element;
  }
}
