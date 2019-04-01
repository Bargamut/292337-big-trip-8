export default class Provider {
  constructor({api, store}) {
    this._api = api;
    this._store = store;
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
    return this._api.getPoints();
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
    return this._api.createPoint({point});
  }

  /**
   * @description Послать данные для обновления
   * @param {String} id ID точки маршрута
   * @param {Object} data Данные точки маршрута
   * @return {JSON} Ответ сервера
   * @memberof Provider
   */
  updatePoint({id, data}) {
    return this._api.updatePoint({id, data});
  }

  /**
   * @description Удалить данные
   * @param {String} {id} ID записи
   * @return {Promise}
   * @memberof Provider
   */
  deletePoint({id}) {
    return this._api.deletePoint({id});
  }
}
