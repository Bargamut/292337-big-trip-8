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
   * @description Запрос данных
   * @return {JSON} Данные в JSON-формате
   * @memberof API
   */
  getOffers() {
    return this._load({url: `/offers`})
      .then(this._toJSON)
      .then(ModelOffer.parseDatas);
  }

  /**
   * @description Запрос данных
   * @return {JSON} Данные в JSON-формате
   * @memberof API
   */
  getPoints() {
    return this._load({url: `/points`})
      .then(this._toJSON)
      .then(ModelItem.parseDatas);
  }

  /**
   * @description Запрос данных
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
   * @param {*} {task} Данные задачи
   * @return {JSON} Ответ сервера
   * @memberof API
   */
  create({task}) {
    return this._load({
      url: `tasks`,
      method: this._METHODS.POST,
      body: JSON.stringify(task),
      headers: new Headers({
        'Content-Type': `application/json`
      })
    }).then(this._toJSON)
      .then(ModelItem.parseItem);
  }

  /**
   * @description Послать данные для обновления
   * @param {*} id Данные задачи
   * @param {*} data Данные задачи
   * @return {JSON} Ответ сервера
   * @memberof API
   */
  update({id, data}) {
    return this._load({
      url: `tasks/${id}`,
      method: this._METHODS.PUT,
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': `application/json`
      })
    }).then(this._toJSON)
      .then(ModelItem.parseItem);
  }

  /**
   * @description Удалить данные
   * @param {String} {id} ID записи
   * @return {Promise}
   * @memberof API
   */
  delete({id}) {
    return this._load({
      url: `tasks/${id}`,
      method: this._METHODS.DELETE
    });
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
        // eslint-disable-next-line
        console.log(`Fetch error: ${err}`);
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