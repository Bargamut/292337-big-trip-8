import Component from './component';
import moment from 'moment';

/**
 * @description Класс компонента события маршрута
 * @exports
 * @class DayItem
 * @extends {Component}
 */
export default class DayItem extends Component {
  /**
   * @description Конструктор класса DayItem
   * @param {Object} item Объект описания события маршрута
   * @param {Object} dataOffers Данные по опциям события маршрута
   * @memberof DayItem
   */
  constructor(item, dataOffers) {
    super();
    this._id = item.id;
    this._type = item.type;
    this._icon = item.icon;
    this._caption = item.caption;
    this._destination = item.destination;
    this._time = item.time;
    this._price = item.price;
    this._offers = item.offers;

    this._dataOffers = dataOffers;

    this._onClickEdit = this._onClickEdit.bind(this);
    this._onEdit = null;
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

        <h3 class="trip-point__title">${this._caption} ${this._destination}</h3>

        <p class="trip-point__schedule">
          <span class="trip-point__timetable">${moment(this._time.since).format(`HH:mm`)} — ${moment(this._time.to).format(`HH:mm`)}</span>
          <span class="trip-point__duration">${this._countDuration()}</span>
        </p>

        <p class="trip-point__price">&euro;&nbsp;${this._price}</p>

        <ul class="trip-point__offers">${this._getTripOffersTemplate()}</ul>
      </article>`;

    return nodetripDayItemTemplate;
  }

  /**
   * @description Сеттер установки функции-обработчика для редактирования
   * @param {Function} callback Функция-обработчик события
   * @memberof DayItem
   */
  set onEdit(callback) {
    this._onEdit = callback;
  }

  /**
   * @description Обновить данные компонента
   * @param {Object} data Объект данных, описывающих событие
   * @memberof DayItem
   */
  update(data) {
    this._type = data.type;
    this._icon = data.icon;
    this._destination = data.destination;
    this._caption = data.caption;
    this._time = data.time;
    this._price = data.price;
    this._offers = data.offers;
  }

  /**
   * @description Централизованная установка обработчиков событий
   * @memberof DayItem
   */
  createListeners() {
    this._element.addEventListener(`click`, this._onClickEdit);
  }

  /**
   * @description Централизованное снятие обработчиков событий
   * @memberof DayItem
   */
  removeListeners() {
    this._element.removeEventListener(`click`, this._onClickEdit);
  }

  /**
   * @description Вычислить продолжительность
   * @return {String} Продолжительность в формате "H[h] m[m]"
   * @memberof DayItem
   */
  _countDuration() {
    const a = moment(this._time.since);
    const b = moment(this._time.to);
    const duration = moment.utc(
        moment.duration(
            b.diff(a)
        ).asMilliseconds()
    );

    return duration.format(`H[h] m[m]`);
  }

  /**
   * @description Создание шаблона заказов при событии маршрута
   * @return {String} Шаблон набора заказов при событии маршрута
   * @memberof DayItem
   */
  _getTripOffersTemplate() {
    const dataOffer = this._dataOffers.get(this._type);

    return [...this._offers].reduce((template, offerName) => {
      template +=
          `<li>
            <button class="trip-point__offer">${offerName} +&euro;&nbsp;${dataOffer.get(offerName).price}</button>
          </li>`;

      return template;
    }, ``);
  }

  /**
   * @description Обработчик события клика для редактирования точки маршрута
   * @memberof DayItem
   */
  _onClickEdit() {
    if (this._onEdit instanceof Function) {
      this._onEdit();
    }
  }
}
