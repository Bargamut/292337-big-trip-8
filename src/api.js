import ModelItem from './model-item';
import ModelOffer from './model-offer';
import ModelDestination from './model-destination';

/**
 * @description Класс API взаимодействия с сервером
 * @export
 * @class API
 */
export default class API {
  /**
   * Конструктор класса API
   * @param {String} endPoint URL сервера
   * @param {String} authorization Данные авторизации
   * @memberof API
   */
  constructor({endPoint, authorization}) {
    this._METHODS = {
      GET: `GET`,
      POST: `POST`,
      PUT: `PUT`,
      DELETE: `DELETE`
    };

    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  /**
   * @description Запрос данных всех опций к точкам маршрута
   * @return {JSON} Данные в JSON-формате
   * @memberof API
   */
  getOffers() {
    return this._load({url: `/offers`})
      .then(this._toJSON)
      .then(ModelOffer.parseDatas);
  }

  /**
   * @description Запрос данных всех точек маршрута
   * @return {JSON} Данные в JSON-формате
   * @memberof API
   */
  getPoints() {
    return this._load({url: `/points`})
      .then(this._toJSON)
      .then(ModelItem.parseDatas);
  }

  /**
   * @description Запрос данных всех направлений
   * @return {JSON} Данные в JSON-формате
   * @memberof API
   */
  getDestinations() {
    return this._load({url: `/destinations`})
      .then(this._toJSON)
      .then(ModelDestination.parseDatas);
  }

  /**
   * @description Послать данные для записи
   * @param {*} {point} Данные точки маршрута
   * @return {JSON} Ответ сервера
   * @memberof API
   */
  createPoint({point}) {
    return this._load({
      url: `points`,
      method: this._METHODS.POST,
      body: JSON.stringify(point),
      headers: new Headers({
        'Content-Type': `application/json`
      })
    }).then(this._toJSON)
      .then(ModelItem.parseData);
  }

  /**
   * @description Послать данные для обновления
   * @param {String} id ID точки маршрута
   * @param {Object} data Данные точки маршрута
   * @return {JSON} Ответ сервера
   * @memberof API
   */
  updatePoint({id, data}) {
    return this._load({
      url: `points/${id}`,
      method: this._METHODS.PUT,
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': `application/json`
      })
    }).then(this._toJSON)
      .then(ModelItem.parseData);
  }

  /**
   * @description Удалить данные
   * @param {String} {id} ID записи
   * @return {Promise}
   * @memberof API
   */
  deletePoint({id}) {
    return this._load({
      url: `points/${id}`,
      method: this._METHODS.DELETE
    });
  }

  /**
   * @description Синхронизировать точки маршрута
   * @param {Array} {points} Массив точек для синхронизации
   * @return {JSON}
   * @memberof API
   */
  syncPoints({points}) {
    return this._load({
      url: `points/sync`,
      method: this._METHODS.POST,
      body: JSON.stringify(points),
      headers: new Headers({
        'Content-Type': `application/json`
      })
    })
      .then(this._toJSON);
  }

  /**
   * @description Сделать запрос
   * @param {Object} params Параметры запроса
   * @param {String} params.url
   * @param {String} [params.method=this._METHODS.GET]
   * @param {*} [params.body=null]
   * @param {Headers} [params.headers=new Headers()]
   * @return {Promise}
   * @memberof API
   */
  _load({url, method = this._METHODS.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(this._checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  /**
   * @description Проверить статус запроса
   * @param {Response} response Объект запроса
   * @return {Response} Объект запроса, если ответ в перечне 2**
   * @memberof API
   */
  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw Error(`${response.status}: ${response.statusText}`);
    }
  }

  /**
   * @description Конвертация объекта запроса в JSON
   * @param {Response} response Объект запроса
   * @return {JSON}
   * @memberof API
   */
  _toJSON(response) {
    return response.json();
  }
}
