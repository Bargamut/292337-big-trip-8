import ModelItem from './model-item';

export default class Provider {
  /**
   * Конструктор класса Provider
   * @param {API} api Инстанс API работы с данными
   * @param {Sotorage} store Инстанс Store хранилища
   * @param {Function} generateId Метод генерации ID записи
   * @memberof Provider
   */
  constructor({api, store, generateId}) {
    this._api = api;
    this._store = store;
    this._generateId = generateId;
    this._needSync = false;

    this._putToStorage = this._putToStorage.bind(this);
  }

  /**
   * @description Запрос данных всех опций к точкам маршрута
   * @return {JSON} Данные в JSON-формате
   * @memberof Provider
   */
  getOffers() {
    return this._api.getOffers();
  }

  /**
   * @description Запрос данных всех точек маршрута
   * @return {JSON} Данные в JSON-формате
   * @memberof Provider
   */
  getPoints() {
    if (Provider.isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          points.forEach(this._putToStorage);

          return points;
        });
    }

    const points = this.getPointsFromStore();

    return Promise.resolve(points);
  }

  /**
   * @description Запросит данные по точкам маршрута
   * из локального хранилища
   * @return {array} Массив данных по точкам маршрута
   * @memberof Provider
   */
  getPointsFromStore() {
    const rawPointsMap = this._store.getAll();
    const rawPoints = Provider.objectToArray(rawPointsMap);

    return ModelItem.parseDatas(rawPoints);
  }

  /**
   * @description Запрос данных всех направлений
   * @return {JSON} Данные в JSON-формате
   * @memberof Provider
   */
  getDestinations() {
    return this._api.getDestinations();
  }

  /**
   * @description Послать данные для записи
   * @param {*} {point} Данные точки маршрута
   * @return {JSON} Ответ сервера
   * @memberof Provider
   */
  createPoint({point}) {
    if (Provider.isOnline()) {
      return this._api.createPoint({point})
        .then(this._putToStorage);
    }

    point.id = this._generateId();
    point = ModelItem.parseData(point);

    this._needSync = true;
    this._putToStorage(point);

    return Promise.resolve(point);
  }

  /**
   * @description Послать данные для обновления
   * @param {String} id ID точки маршрута
   * @param {Object} data Данные точки маршрута
   * @return {JSON} Ответ сервера
   * @memberof Provider
   */
  updatePoint({id, data}) {
    if (Provider.isOnline()) {
      return this._api.updatePoint({id, data})
        .then(this._putToStorage);
    }

    const point = ModelItem.parseData(data);

    this._needSync = true;
    this._putToStorage(point);

    return Promise.resolve(point);
  }

  /**
   * @description Удалить данные
   * @param {String} {id} ID записи
   * @return {Promise}
   * @memberof Provider
   */
  deletePoint({id}) {
    if (Provider.isOnline()) {
      return this._api.deletePoint({id})
        .then(() => {
          this._store.removeItem({id});
        });
    }

    this._needSync = true;
    this._store.removeItem({id});

    return Promise.resolve(id);
  }

  /**
   * @description Синхронизировать данные
   * @return {JSON}
   * @memberof Provider
   */
  syncPoints() {
    return this._api.syncPoints({
      points: Provider.objectToArray(this._store.getAll())
    })
    .then(() => {
      this._needSync = false;
    });
  }

  /**
   * @description Проверить статус подключения
   * @static
   * @return {Boolean}
   * @memberof Provider
   */
  static isOnline() {
    return window.navigator.onLine;
  }

  /**
   * @description Преобразовать объект данныхв массив
   * @param {Object} object Объект данных
   * @static
   * @return {Array} Массив данных
   * @memberof Provider
   */
  static objectToArray(object) {
    return Object.keys(object).map((id) => object[id]);
  }

  /**
   * @description Добавить данные в хранилище
   * @param {ModelItem} point Данные точки маршрута
   * @return {ModelItem} Данные точки маршрута
   * @memberof Provider
   */
  _putToStorage(point) {
    this._store.setItem({
      id: point.id,
      data: point.toRAW()
    });

    return point;
  }
}
