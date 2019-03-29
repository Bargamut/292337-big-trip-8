/**
 * @description Класс обработки данных по паттерну Адаптер
 * @export
 * @class ModelOffer
 */
export default class ModelOffer {
  /**
   * Конструктор касса ModelOffer
   * @param {Array} data Массив данных
   * @memberof ModelOffer
   */
  constructor(data) {
    this.type = data[`type`];
    this.offers = data[`offers`].reduce((map, obj) => {
      map.set(obj.name, {price: obj.price});

      return map;
    }, new Map());
  }

  /**
   * @description Фабричный метод разбора данных
   * @static
   * @param {Array} data Массив данных
   * @return {ModelOffer} Объект класса ModelOffer с адаптирвоанными данными
   * @memberof ModelOffer
   */
  static parseData(data) {
    return new ModelOffer(data);
  }

  /**
   * @description Фабричный метод разбора группы данных
   * @static
   * @param {Array} data Массив данных
   * @return {Array} Массив объектов класса ModelOffer
   * @memberof ModelOffer
   */
  static parseDatas(data) {
    return data.map(ModelOffer.parseData);
  }
}
