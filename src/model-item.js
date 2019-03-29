import {mapItemsTypes} from './make-data';

/**
 * @description Класс обработки данных по паттерну Адаптер
 * @export
 * @class ModelItem
 */
export default class ModelItem {
  /**
   * Конструктор касса ModelItem
   * @param {Array} data Массив данных
   * @memberof ModelItem
   */
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.destination = data[`destination`].name;
    this.description = data[`destination`].description;
    this.pictures = data[`destination`].pictures;
    this.time = {
      since: data[`date_from`],
      to: data[`date_to`]
    };
    this.price = data[`base_price`];
    this.offers = data[`offers`].reduce((map, offer) => {
      map.set(offer.title, offer);

      return map;
    }, new Map());

    const itemType = mapItemsTypes.get(data[`type`]);

    this.icon = itemType.icon;
    this.caption = itemType.caption;
  }

  /**
   * @description Привести структуру данных к серверному варианту
   * @return {Object}
   * @memberof ModelItem
   */
  toRAW() {
    return {
      'id': this.id,
      'type': this.type,
      'destination': {
        name: this.destination,
        description: this.description,
        pictures: this.pictures
      },
      'date_from': this.time.since,
      'date_to': this.time.to,
      'base_price': this.price,
      'offers': [...this.offers]
    };
  }

  /**
   * @description Фабричный метод разбора данных
   * @static
   * @param {Array} data Массив данных
   * @return {ModelItem} Объект класса Model с адаптирвоанными данными
   * @memberof Model
   */
  static parseData(data) {
    return new ModelItem(data);
  }

  /**
   * @description Фабричный метод разбора группы данных
   * @static
   * @param {Array} data Массив данных
   * @return {Array} Массив объектов класса ModelItem
   * @memberof ModelItem
   */
  static parseDatas(data) {
    return data.map(ModelItem.parseData);
  }
}
