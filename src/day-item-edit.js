/**
 * @description Класс компонента события маршрута
 * @class DayItemEdit
 */
export default class DayItemEdit {
  /**
   * @description Конструктор класса DayItemEdit
   * @param {Object} tripDayItem Объект описания события маршрута
   * @memberof DayItemEdit
   */
  constructor(tripDayItem) {
    this._icon = tripDayItem.icon;
    this._title = tripDayItem.title;
    this._description = tripDayItem.description;
    this._picture = tripDayItem.picture;
    this._schedule = tripDayItem.schedule;
    this._price = tripDayItem.price;
    this._offers = tripDayItem.offers;
    this._element = null;

    this._nodeItemForm = null;

    this._onSubmit = null;
    this._onReset = null;
  }

  /**
   * @description Геттер шаблона события маршрута
   * @return {Node} DOM-элемент <template> события маршрута
   * @memberof DayItemEdit
   */
  get template() {
    const nodetripDayItemTemplate = document.createElement(`template`);

    nodetripDayItemTemplate.innerHTML =
    `<article class="point">
        <form action="" method="get">
          <header class="point__header">
            <label class="point__date">
              choose day
              <input class="point__input" type="text" placeholder="MAR 18" name="day">
            </label>

            <div class="travel-way">
              <label class="travel-way__label" for="travel-way__toggle">${this._icon}</label>

              <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

              ${this._getTravelWaySelectTemplate()}
            </div>

            <div class="point__destination-wrap">
              <label class="point__destination-label" for="destination">Flight to</label>
              <input class="point__destination-input" list="destination-select" id="destination" value="Chamonix" name="destination">
              <datalist id="destination-select">
                <option value="airport"></option>
                <option value="Geneva"></option>
                <option value="Chamonix"></option>
                <option value="hotel"></option>
              </datalist>
            </div>

            <label class="point__time">
              choose time
              <input class="point__input" type="text" value="${this._schedule.timetable.since} — ${this._schedule.timetable.to}" name="time" placeholder="00:00 — 00:00">
            </label>

            <label class="point__price">
              write price
              <span class="point__price-currency">${this._price.currency}</span>
              <input class="point__input" type="text" value="${this._price.value}" name="price">
            </label>

            <div class="point__buttons">
              <button class="point__button point__button--save" type="submit">Save</button>
              <button class="point__button" type="reset">Delete</button>
            </div>

            <div class="paint__favorite-wrap">
              <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite">
              <label class="point__favorite" for="favorite">favorite</label>
            </div>
          </header>

          <section class="point__details">
            <section class="point__offers">
              <h3 class="point__details-title">offers</h3>

              <div class="point__offers-wrap">
                ${this._getTripOffersTemplate()}
              </div>

            </section>
            <section class="point__destination">
              <h3 class="point__details-title">Destination</h3>
              <p class="point__destination-text">${this._description}</p>
              <div class="point__destination-images">
                ${this._getPointImagesTemplate()}
              </div>
            </section>
            <input type="hidden" class="point__total-price" name="total-price" value="">
          </section>
        </form>
      </article>`;

    return nodetripDayItemTemplate;
  }

  get element() {
    return this._element;
  }

  set onSubmit(callback) {
    this._onSubmit = callback;
  }

  set onReset(callback) {
    this._onReset = callback;
  }

  /**
   * @description Метод отрисовки элемента события
   * @return {Node} DOM-элемент карточки задачи
   * @memberof DayItemEdit
   */
  render() {
    this._element = this.template.content.cloneNode(true).firstChild;
    this._nodeItemForm = this._element.querySelector(`form`);

    this._nodeItemForm.addEventListener(`submit`, this._onClickSubmit.bind(this));
    this._nodeItemForm.addEventListener(`reset`, this._onClickReset.bind(this));

    return this._element;
  }

  unrender() {
    this._nodeItemForm.removeEventListener(`submit`, this._onClickSubmit);
    this._nodeItemForm.removeEventListener(`reset`, this._onClickReset);

    this._nodeItemForm = null;
    this._element = null;
  }

  /**
   * @description Создание шаблона заказов при событии маршрута
   * @return {String} Шаблон набора заказов при событии маршрута
   * @memberof DayItemEdit
   */
  _getTripOffersTemplate() {
    let template =
      `<input class="point__offers-input visually-hidden" type="checkbox" id="add-luggage" name="offer" value="add-luggage">
      <label for="add-luggage" class="point__offers-label">
        <span class="point__offer-service">Add luggage</span> + €<span class="point__offer-price">30</span>
      </label>

      <input class="point__offers-input visually-hidden" type="checkbox" id="switch-to-comfort-class" name="offer" value="switch-to-comfort-class">
      <label for="switch-to-comfort-class" class="point__offers-label">
        <span class="point__offer-service">Switch to comfort class</span> + €<span class="point__offer-price">100</span>
      </label>

      <input class="point__offers-input visually-hidden" type="checkbox" id="add-meal" name="offer" value="add-meal">
      <label for="add-meal" class="point__offers-label">
        <span class="point__offer-service">Add meal </span> + €<span class="point__offer-price">15</span>
      </label>

      <input class="point__offers-input visually-hidden" type="checkbox" id="choose-seats" name="offer" value="choose-seats">
      <label for="choose-seats" class="point__offers-label">
        <span class="point__offer-service">Choose seats</span> + €<span class="point__offer-price">5</span>
      </label>`;

    // this._offers.forEach((offer) => {
    //   template +=
    //     `<li>
    //       <button class="trip-point__offer">${offer.caption} +${offer.price.currency}&nbsp;${offer.price.value}</button>
    //     </li>`;
    // });

    return template;
  }

  _getTravelWaySelectTemplate() {
    const template =
      `<div class="travel-way__select">
        <div class="travel-way__select-group">
          <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travel-way" value="taxi">
          <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>

          <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travel-way" value="bus">
          <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>

          <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travel-way" value="train">
          <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>

          <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travel-way" value="train" checked>
          <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>
        </div>

        <div class="travel-way__select-group">
          <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travel-way" value="check-in">
          <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>

          <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travel-way" value="sight-seeing">
          <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
        </div>
      </div>`;

    return template;
  }

  _getPointImagesTemplate() {
    const template =
      `<img src="${this._picture}" alt="picture from place" class="point__destination-image">`;

    // Картинок может быть несколько

    return template;
  }

  _onClickSubmit(evt) {
    evt.preventDefault();

    if (this._onSubmit instanceof Function) {
      this._onSubmit();
    }
  }

  _onClickReset(evt) {
    evt.preventDefault();

    if (this._onReset instanceof Function) {
      this._onReset();
    }
  }
}
