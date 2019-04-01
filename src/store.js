export default class Store {
  /**
   * RКонструктор класса Store
   * @param {String} keyStorage Ключ записи хранилища
   * @param {Storage} storage Инстанс хранилища
   * @memberof Store
   */
  constructor({keyStorage, storage}) {
    this._storeKey = keyStorage;
    this._storage = storage;
  }

  /**
   * @description Запрос конкретной записи
   * @param {String} {id} ID точки маршрута
   * @return {Object}
   * @memberof Store
   */
  getItem({id}) {
    return this.getAll()[id];
  }

  /**
   * @description Записать данные конкретной точки
   * @param {String} id ID точки маршрута
   * @memberof Store
   */
  setItem({id, data}) {
    const items = this.getAll();

    items[id] = data;

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(items)
    );
  }

  /**
   * @description Удалить запись из хранилища
   * @param {String} {id} ID точки маршрута
   * @memberof Store
   */
  removeItem({id}) {
    const items = this.getAll();

    delete items[id];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(items)
    );
  }

  /**
   * @description Запросить все данные из
   * хранилища по ключу
   * @return {Object} Объект сериалзизованных данных
   * @memberof Store
   */
  getAll() {
    const emptyItems = {};
    const items = this._storage.getItem(this._storeKey);

    if (!items) {
      return emptyItems;
    }

    try {
      return JSON.parse(items);
    } catch (err) {
      return emptyItems;
    }
  }
}
