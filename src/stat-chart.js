import Component from './component';
import Chart from 'chart.js';
import moment from 'moment';
import TripTotalCost from './trip-total-cost';

export default class StatChart extends Component {
  /**
   * Конструктор класса StateChart
   * @param {Object} chart Объект данных для графика
   * @param {Object} chart.conf Конфиг графика
   * @param {String} chart.type Тип данных для графика
   * @param {Number} chart.width Ширина графика
   * @param {Number} chart.height Высота графика
   * @memberof StatChart
   */
  constructor(chart) {
    super();

    // Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
    this._BAR_HEIGHT = 55;

    this._conf = chart.conf;
    this._type = chart.type;
    this._width = chart.width;
    this._height = chart.height || this._BAR_HEIGHT * this._conf.data.labels.length;

    this._chart = null;
  }

  /**
   * @description Возвращаем шаблон компонента графика
   * @readonly
   * @memberof StatChart
   * @return {Node} DOM-элемент <template> графика
   */
  get template() {
    const nodeChartTemplate = document.createElement(`template`);

    nodeChartTemplate.innerHTML =
      `<canvas class="statistic__${this._type}" width="${this._width}" height="${this._height}"></canvas>`;

    return nodeChartTemplate;
  }

  /**
   * @description Обновление графика
   * @param {Array} dayItems Массив событий маршрута
   * @memberof StatChart
   */
  update(dayItems) {
    const processedData = this._processDayItems(dayItems);

    this._height = this._BAR_HEIGHT * processedData.size;
    this._chart.canvas.height = this._height;

    this._chart.data.labels = [...processedData.keys()].map((key) => `${key}`);
    this._chart.data.datasets[0].data = [...processedData.values()].map((elem) => elem.total);

    this._chart.resize();
    this._chart.update();
  }

  /**
   * @description Разметить данные для обновления компонента
   * на основе типа данных компонента
   * @static
   * @param {Object} target Целевой объект данных для обновления
   * @return {Object} Объект с функциями переноса данных
   * @memberof StatChart
   */
  static createMapper(target) {
    return {
      money: (value) => {
        const label = `${value.icon} ${value.type.toUpperCase()}`;
        const totalPrice = TripTotalCost.countPointsTotalCost(0, value);

        if (target.has(label)) {
          target.get(label).total += totalPrice;
          return;
        }

        target.set(label, {
          total: totalPrice
        });
      },
      transport: (value) => {
        const label = `${value.icon} ${value.type.toUpperCase()}`;

        if (target.has(label)) {
          target.get(label).total++;
          return;
        }

        target.set(label, {
          total: 1
        });
      },
      timespend: (value) => {
        const label = `${value.icon} ${value.type.toUpperCase()}`;
        const duration = StatChart.countDuration(value.time);

        if (target.has(label)) {
          target.get(label).total += duration;
          return;
        }

        target.set(label, {
          total: duration
        });
      }
    };
  }

  /**
   * @description Создание графика
   * @memberof StatChart
   */
  createChart() {
    this._chart = new Chart(this._element, this._conf);
  }

  /**
   * @description Преобразовать в данные для графика
   * @param {Array} dataDayItems
   * @return {Map} Преобразованные данные для графика
   * @memberof StatChart
   */
  _processDayItems(dataDayItems) {
    const tempEntry = new Map();
    const statMapper = StatChart.createMapper(tempEntry);

    dataDayItems.forEach((item) => {
      if (statMapper[this._type]) {
        statMapper[this._type](item);
      }
    });

    if (this._type === `timespend`) {
      tempEntry.forEach((elem) => {
        elem.total = Math.floor(elem.total);
      });
    }

    return tempEntry;
  }

  /**
   * @description Вычислить продолжительность
   * @static
   * @return {String} Продолжительность в формате "H[h] m[m]"
   * @memberof DayItem
   */
  static countDuration({since, to}) {
    const a = moment(since);
    const b = moment(to);
    const duration = moment.duration(b.diff(a));

    return duration.asHours();
  }
}
