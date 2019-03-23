import Component from './component';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

/**
 * @description Класс компонента события маршрута
 * @export
 * @class DayItemEdit
 * @extends {Component}
 */
export default class DayItemEdit extends Component {
  /**
   * @description Конструктор класса DayItemEdit
   * @param {Object} item Объект описания события маршрута
   * @param {Map} dataDestinations Map описания пунктов прибытия
   * @param {Array} dataItemsTypes Массив описания событий маршрута
   * @param {Map} dataOffers Map описания заказов при событии маршрута
   * @memberof DayItemEdit
   */
  constructor(item, dataDestinations, dataItemsTypes, dataOffers) {
    super();
    this._icon = item.icon;
    this._destination = item.destination;
    this._caption = item.caption;
    this._description = item.description;
    this._picture = item.picture;
    this._time = item.time;
    this._price = item.price;
    this._offers = item.offers;

    this._destinations = dataDestinations;
    this._dataItems = dataItemsTypes;
    this._dataOffers = dataOffers;

    this._onClickSubmit = this._onClickSubmit.bind(this);
    this._onClickDelete = this._onClickDelete.bind(this);
    this._onSubmit = null;
    this._onDelete = null;

    this._isFavorite = false;

    this._onChangeFavorite = this._onChangeFavorite.bind(this);
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

              <div class="travel-way__select">
                ${this._getTravelWaySelectTemplate()}
              </div>
            </div>

            <div class="point__destination-wrap">
              <label class="point__destination-label" for="destination">${this._caption}</label>
              <input class="point__destination-input" list="destination-select" id="destination" value="${this._destination}" name="destination">
              ${this._getDestinationsListTemplate()}
            </div>

            <label class="point__time">
              choose time
              <input class="point__input" type="text" value="${this._time.since} — ${this._time.to}" name="time" placeholder="00:00 — 00:00">
            </label>

            <label class="point__price">
              write price
              <span class="point__price-currency">&euro;</span>
              <input class="point__input" type="text" value="${this._price}" name="price">
            </label>

            <div class="point__buttons">
              <button class="point__button point__button--save" type="submit">Save</button>
              <button class="point__button" type="reset">Delete</button>
            </div>

            <div class="paint__favorite-wrap">
              <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite && `checked`}>
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

  /**
   * @description Сеттер установки обработчика по событию submit
   * @param {Function} callback Функция-обработчик события
   * @memberof DayItemEdit
   */
  set onSubmit(callback) {
    this._onSubmit = callback;
  }

  /**
   * @description Сеттер функции-обработчика удаления события маршрута
   * @param {Function} callback Функция-обработчик
   * @memberof DayItemEdit
   */
  set onDelete(callback) {
    this._onDelete = callback;
  }

  /**
   * @description Обновить данные компонента
   * @param {Object} data Объект данных, описывающих событие
   * @memberof DayItemEdit
   */
  update(data) {
    this._icon = data.icon;
    this._destination = data.destination;
    this._caption = data.caption;
    this._time = data.time;
    this._price = data.price;
    this._offers = data.offers;
  }

  /**
   * @description Разметить данные для обновления компонента
   * на основе данных формы
   * @param {Object} target Целевой объект данных для обновления
   * @return {Object} Объект с функциями переноса данных
   * @memberof DayItemEdit
   */
  createMapper(target) {
    return {
      'travel-way': (value) => {
        const dataItem = this._dataItems.get(value);

        target.icon = dataItem.icon;
        target.caption = dataItem.caption;
      },
      'destination': (value) => (target.destination = value),
      'time': (value) => ([target.time.since, target.time.to] = value.split(` — `)),
      'price': (value) => (target.price = parseInt(value, 10)),
      'offer': (value) => target.offers.add(value)
    };
  }

  /**
   * @description Централизованная установка обработчиков событий
   * @memberof DayItemEdit
   */
  createListeners() {
    const nodeItemForm = this._element.querySelector(`form`);

    nodeItemForm.addEventListener(`submit`, this._onClickSubmit);
    nodeItemForm.addEventListener(`reset`, this._onClickDelete);
    this._element.querySelector(`.point__favorite`).addEventListener(`click`, this._onChangeFavorite);

    flatpickr(this._element.querySelector(`.point__input[name="time"]`), {
      mode: `range`,
      locale: {
        rangeSeparator: ` — `
      },
      enableTime: true,
      altInput: true,
      altFormat: `H:i`,
      dateFormat: `H:i`,
      time_24hr: true // eslint-disable-line
    });
  }

  /**
   * @description Централизованное снятие обработчиков событий
   * @memberof DayItemEdit
   */
  removeListeners() {
    const nodeItemForm = this._element.querySelector(`form`);

    nodeItemForm.removeEventListener(`submit`, this._onClickSubmit);
    nodeItemForm.removeEventListener(`reset`, this._onClickDelete);
    this._element.querySelector(`.point__favorite`).removeEventListener(`click`, this._onChangeFavorite);

    this._nodeItemForm = null;
  }

  /**
   * @description Обновление содержимого DOM компонента
   * @memberof DayItemEdit
   */
  _partialUpdate() {
    this._element.innerHTML = this.template.content.cloneNode(true).firstChild.innerHTML;
  }

  /**
   * @description Создание шаблона заказов при событии маршрута
   * @return {String} Шаблон набора заказов при событии маршрута
   * @memberof DayItemEdit
   */
  _getTripOffersTemplate() {
    let template = ``;

    this._dataOffers.forEach((offer, offerType) => {
      template +=
        `<input class="point__offers-input visually-hidden" type="checkbox" id="${offerType}" name="offer" value="${offerType}" ${this._offers.has(offerType) && `checked`}>
        <label for="${offerType}" class="point__offers-label">
          <span class="point__offer-service">${offer.caption}</span> + &euro;<span class="point__offer-price">${offer.price}</span>
        </label>`;
    });

    return template;
  }

  /**
   * @description Формирование раскрывающегося списка видов путешествия
   * @return {String} Шаблон раскрывающегося списка
   * @memberof DayItemEdit
   */
  _getTravelWaySelectTemplate() {
    let template = ``;
    let travelWayGroups = {};

    this._dataItems.forEach((item, itemType) => {
      if (typeof travelWayGroups[item.group] === `undefined`) {
        travelWayGroups[item.group] = ``;
      }

      travelWayGroups[item.group] +=
        `<input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-${itemType}" name="travel-way" value="${itemType}" ${ item.icon === this._icon && `checked`}>
        <label class="travel-way__select-label" for="travel-way-${itemType}">${item.icon} ${itemType}</label>`;
    });

    Object.values(travelWayGroups).forEach(function (templatePart) {
      template +=
        `<div class="travel-way__select-group">
          ${templatePart}
        </div>`;
    });

    return template;
  }

  /**
   * @description Формирование изображений достопримечательностей
   * @return {String} Шаблон изображения достопримечательностей
   * @memberof DayItemEdit
   */
  _getPointImagesTemplate() {
    const template =
      `<img src="${this._picture}" alt="picture from place" class="point__destination-image">`;

    return template;
  }

  /**
   * @description Формирование перечня пункцтов прибытия
   * @return {String} Шаблон списка пунктов прибытия
   * @memberof DayItemEdit
   */
  _getDestinationsListTemplate() {
    let template = ``;

    for (let destinations of this._destinations.values()) {
      destinations.forEach(function (destination) {
        template += `<option value="${destination}"></option>`;
      });
    }

    return `<datalist id="destination-select">${template}</datalist>`;
  }

  /**
   * @description Преобразовать данные формы в данные события
   * @param {FormData} formData Данные формы
   * @return {Object} Объект данных карточки
   * @memberof DayItemEdit
   */
  _processForm(formData) {
    const tempEntry = {
      icon: ``,
      destination: ``,
      caption: ``,
      time: {
        since: ``,
        to: ``
      },
      price: 0,
      offers: new Set()
    };

    const itemEditMapper = this.createMapper(tempEntry);

    for (const [property, value] of formData.entries()) {
      if (itemEditMapper[property]) {
        itemEditMapper[property](value);
      }
    }

    return tempEntry;
  }

  /**
   * @description Обработчик события отправки изменений формы
   * @param {Event} evt - объект события
   * @memberof DayItemEdit
   */
  _onClickSubmit(evt) {
    evt.preventDefault();

    const nodeForm = this._element.querySelector(`form`);

    const formData = new FormData(nodeForm);
    const newData = this._processForm(formData);

    if (this._onSubmit instanceof Function) {
      this._onSubmit(newData);
    }

    this.update(newData);
  }

  /**
   * @description Обработчик удаления события маршрута
   * @param {Event} evt - объект события
   * @memberof DayItemEdit
   */
  _onClickDelete(evt) {
    evt.preventDefault();

    if (this._onDelete instanceof Function) {
      this._onDelete();
    }
  }

  /**
   * @description Функция-обработчик переключения
   * режима избранного события
   * @memberof DayItemEdit
   */
  _onChangeFavorite() {
    this._isFavorite = !this._isFavorite;

    this.removeListeners();
    this._partialUpdate();
    this.createListeners();
  }
}
