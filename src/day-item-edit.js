import Component from './component';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import _ from 'lodash';

const MILLISECONDS = 1000;
const ANIMATION_TIMEOUT = 600;

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

    this._id = item.id;
    this._type = item.type;
    this._icon = item.icon;
    this._destination = item.destination;
    this._caption = item.caption;
    this._description = item.description;
    this._pictures = item.pictures;
    this._time = item.time;
    this._price = item.price;
    this._offers = item.offers;

    this._destinations = dataDestinations;
    this._dataItems = dataItemsTypes;
    this._dataOffers = dataOffers;

    this._onClickSubmit = this._onClickSubmit.bind(this);
    this._onClickDelete = this._onClickDelete.bind(this);
    this._onPressEscape = this._onPressEscape.bind(this);
    this._onSubmit = null;
    this._onDelete = null;
    this._onEscape = null;

    this._isFavorite = item.isFavorite;

    this._onChangeType = this._onChangeType.bind(this);
    this._onChangeDestination = this._onChangeDestination.bind(this);
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

            <div class="point__time">
              choose time
              <input class="point__input" type="text" value="" name="date-start" placeholder="19:00">
              <input class="point__input" type="text" value="" name="date-end" placeholder="21:00">
            </div>

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
   * @description Сеттер функции-обработчика выхода из режима редактирования
   * @param {Function} callback Функция-обработчик
   * @memberof DayItemEdit
   */
  set onEscape(callback) {
    this._onEscape = callback;
  }

  /**
   * @description Обновить данные компонента
   * @param {Object} data Объект данных, описывающих событие
   * @memberof DayItemEdit
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
   * @description Заблокировать элементы управления
   * @param {String} type Тип блокировки
   * @memberof DayItemEdit
   */
  block(type) {
    switch (type) {
      case `submit`:
        this._element.querySelector(`.point__button--save`).textContent = `Saving...`;
        break;
      case `delete`:
        this._element.querySelector(`button[type="reset"]`).textContent = `Deleting...`;
        break;
      default: break;
    }

    for (const node of this._element.querySelector(`form`).elements) {
      node.disabled = true;
    }
  }

  /**
   * @description Разблокировать элементы управления
   * @param {String} type Тип блокировки
   * @memberof DayItemEdit
   */
  unblock(type) {
    switch (type) {
      case `submit`:
        this._element.querySelector(`.point__button--save`).textContent = `Save`;
        break;
      case `delete`:
        this._element.querySelector(`button[type="reset"]`).textContent = `Delete`;
        break;
      default: break;
    }

    for (const node of this._element.querySelector(`form`).elements) {
      node.disabled = false;
    }
  }

  /**
   * @description Потрясти форму события маршрута
   * @memberof DayItemEdit
   */
  shake() {
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;
    this._element.style.border = `1px solid red`;

    setTimeout(() => {
      this._element.style.animation = ``;
      this._element.style.border = ``;
    }, ANIMATION_TIMEOUT);
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

        target.type = value;
        target.icon = dataItem.icon;
        target.caption = dataItem.caption;
      },
      'destination': (value) => (target.destination = value),
      'date-start': (value) => (target.time.since = value * MILLISECONDS),
      'date-end': (value) => (target.time.to = value * MILLISECONDS),
      'price': (value) => (target.price = parseInt(value, 10)),
      'favorite': (value) => (target.isFavorite = value),
      'offer': (value) => (target.offers.get(value).accepted = true)
    };
  }

  /**
   * @description Централизованная установка обработчиков событий
   * @memberof DayItemEdit
   */
  createListeners() {
    const nodeItemForm = this._element.querySelector(`form`);
    const nodeTypeSelect = this._element.querySelector(`.travel-way__select`);
    const nodeItemFavorite = this._element.querySelector(`.point__favorite`);
    const nodeTimeStart = this._element.querySelector(`.point__input[name="date-start"]`);
    const nodeTimeEnd = this._element.querySelector(`.point__input[name="date-end"]`);
    const nodeDestination = this._element.querySelector(`#destination`);

    const timeConfig = {
      'enableTime': true,
      'altInput': true,
      'altFormat': `H:i`,
      'dateFormat': `U`,
      'time_24hr': true
    };

    nodeDestination.addEventListener(`change`, this._onChangeDestination);
    nodeTypeSelect.addEventListener(`change`, this._onChangeType);
    nodeItemForm.addEventListener(`submit`, this._onClickSubmit);
    nodeItemForm.addEventListener(`reset`, this._onClickDelete);
    nodeItemFavorite.addEventListener(`click`, this._onChangeFavorite);

    document.addEventListener(`keyup`, this._onPressEscape);

    const startInstanse = flatpickr(
        nodeTimeStart,
        Object.assign({}, timeConfig, {
          defaultDate: this._time.since,
          maxDate: this._time.to,
          onChange: (selectedDates, dateStr) => {
            stopInstanse.set(`minDate`, dateStr);
          }
        })
    );

    const stopInstanse = flatpickr(
        nodeTimeEnd,
        Object.assign({}, timeConfig, {
          defaultDate: this._time.to,
          minDate: this._time.since,
          onChange: (selectedDates, dateStr) => {
            startInstanse.set(`maxDate`, dateStr);
          }
        })
    );
  }

  /**
   * @description Централизованное снятие обработчиков событий
   * @memberof DayItemEdit
   */
  removeListeners() {
    const nodeItemForm = this._element.querySelector(`form`);
    const nodeTypeSelect = this._element.querySelector(`.travel-way__select`);
    const nodeItemFavorite = this._element.querySelector(`.point__favorite`);
    const nodeDestination = this._element.querySelector(`#destination`);

    nodeDestination.removeEventListener(`change`, this._onChangeDestination);
    nodeTypeSelect.removeEventListener(`change`, this._onChangeType);
    nodeItemForm.removeEventListener(`submit`, this._onClickSubmit);
    nodeItemForm.removeEventListener(`reset`, this._onClickDelete);
    nodeItemFavorite.removeEventListener(`click`, this._onChangeFavorite);

    document.removeEventListener(`keyup`, this._onPressEscape);

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

    template = [...(this._offers || [])].reduce((tplString, data) => {
      const [offerName, offer] = data;
      const offerID =
        `${offerName.toLowerCase().replace(/ /, `-`)}-${this._id}`;

      tplString +=
        `<input class="point__offers-input visually-hidden" type="checkbox" id="${offerID}" name="offer" value="${offerName}" ${offer.accepted ? `checked` : ``}>
        <label for="${offerID}" class="point__offers-label">
          <span class="point__offer-service">${offerName}</span> + &euro;<span class="point__offer-price">${offer.price}</span>
        </label>`;

      return tplString;
    }, template);

    return template;
  }

  /**
   * @description Формирование раскрывающегося списка видов путешествия
   * @return {String} Шаблон раскрывающегося списка
   * @memberof DayItemEdit
   */
  _getTravelWaySelectTemplate() {
    const travelWayGroups = [...this._dataItems].reduce(
        (gropuTemplates, data) => {
          const [itemType, item] = data;

          if (typeof gropuTemplates[item.group] === `undefined`) {
            gropuTemplates[item.group] = ``;
          }

          gropuTemplates[item.group] +=
            `<input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-${itemType}" name="travel-way" value="${itemType}" ${ item.icon === this._icon ? `checked` : ``}>
            <label class="travel-way__select-label" for="travel-way-${itemType}">${item.icon} ${itemType}</label>`;

          return gropuTemplates;
        }, {});

    return Object.values(travelWayGroups).reduce((template, templatePart) => {
      template +=
        `<div class="travel-way__select-group">
          ${templatePart}
        </div>`;

      return template;
    }, ``);
  }

  /**
   * @description Формирование изображений достопримечательностей
   * @return {String} Шаблон изображения достопримечательностей
   * @memberof DayItemEdit
   */
  _getPointImagesTemplate() {
    let template = ``;

    if (typeof this._pictures !== `undefined`) {
      template = [...(this._pictures || [])].reduce((tplString, picture) => {
        tplString += `<img src="${picture.src}" alt="${picture.description}" class="point__destination-image">`;

        return tplString;
      }, template);
    }

    return template;
  }

  /**
   * @description Формирование перечня пункцтов прибытия
   * @return {String} Шаблон списка пунктов прибытия
   * @memberof DayItemEdit
   */
  _getDestinationsListTemplate() {
    let template = ``;

    for (let destination of this._destinations.keys()) {
      template += `<option value="${destination}"></option>`;
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
      type: ``,
      icon: ``,
      isFavorite: false,
      destination: ``,
      description: this._description,
      pictures: this._pictures,
      caption: ``,
      time: {
        since: 0,
        to: 0
      },
      price: 0,
      offers: _.cloneDeep(this._dataOffers.get(this._type))
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
   * @description Функция-обработчик обновления
   * места назначения
   * @param {Event} evt Объект события
   * @memberof DayItemEdit
   */
  _onChangeDestination(evt) {
    const destinationData = this._destinations.get(evt.target.value);

    if (typeof destinationData !== `undefined`) {
      this._destination = evt.target.value;
      this._description = destinationData.description;
      this._pictures = destinationData.pictures;

      this.removeListeners();
      this._partialUpdate();
      this.createListeners();
    }
  }

  /**
   * @description Функция-обработчик обновления
   * типа события маршрута
   * @param {Event} evt Объект события
   * @memberof DayItemEdit
   */
  _onChangeType(evt) {
    this._type = evt.target.value;

    const dataItem = this._dataItems.get(this._type);

    this._icon = dataItem.icon;
    this._caption = dataItem.caption;
    this._offers = _.cloneDeep(this._dataOffers.get(this._type)) || new Map();

    this.removeListeners();
    this._partialUpdate();
    this.createListeners();
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
      this._onDelete({id: this._id});
    }
  }

  /**
   * @description Обработчик выхода из режима редактирования
   * @param {Event} evt - объект события
   * @memberof DayItemEdit
   */
  _onPressEscape(evt) {
    evt.preventDefault();

    if (this._onEscape instanceof Function) {
      this._onEscape(evt);
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
