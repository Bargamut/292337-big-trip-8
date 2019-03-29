/**
 * @description Класс обработки данных по паттерну Адаптер
 * @export
 * @class ModelDestination
 */
export default class ModelDestination {
  /**
   * Конструктор касса ModelDestination
   * @param {Array} data Массив данных
   * @memberof ModelDestination
   */
  constructor(data) {
    this.name = data[`name`];
    this.description = data[`description`];
    this.pictures = data[`pictures`];
  }

  /**
   * @description Фабричный метод разбора данных
   * @static
   * @param {Array} data Массив данных
   * @return {ModelDestination} Объект класса ModelDestination с адаптирвоанными данными
   * @memberof ModelDestination
   */
  static parseData(data) {
    return new ModelDestination(data);
  }

  /**
   * @description Фабричный метод разбора группы данных
   * @static
   * @param {Array} data Массив данных
   * @return {Array} Массив объектов класса ModelDestination
   * @memberof ModelDestination
   */
  static parseDatas(data) {
    return data.map(ModelDestination.parseData);
  }
}
