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
  }

  /**
   * @description Привести структуру данных к серверному варианту
   * @return {Object}
   * @memberof ModelOffer
   */
  toRAW() {
    return {
      'id': this.id,
      'title': this.title,
      'due_date': this.dueDate,
      'tags': [...this.tags.values()],
      'picture': this.picture,
      'repeating_days': this.repeatingDays,
      'color': this.color,
      'is_favorite': this.isFavorite,
      'is_done': this.isDone,
    };
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
