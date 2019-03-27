import Component from './component';
import Chart from 'chart.js';

export default class StatChart extends Component {
  constructor(chart) {
    super();

    this._type = chart.type;
    this._width = chart.width;
    this._height = chart.height;
    this._conf = chart.conf;

    // Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
    this._BAR_HEIGHT = 55;

    this._chart = null;
  }

  get template() {
    const nodeChartTemplate = document.createElement(`template`);

    nodeChartTemplate.innerHTML =
      `<canvas class="statistic__${this._type}" width="${this._width}"></canvas>`;

    return nodeChartTemplate;
  }

  /**
   * @description Обновление графика
   * @param {Array} dayItems Массив событий маршрута
   * @memberof StatChart
   */
  update(dayItems) {
    const processedData = this._processDayItems(dayItems);

    this._chart.data.labels = [...processedData.keys()].map((elem) => `${elem}`);
    this._chart.data.datasets = [{
      data: [...processedData.values()].map((elem) => elem.total)
    }];

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

        if (target.has(label)) {
          target.get(label).total += value.price;
          return;
        }

        target.set(label, {
          total: 1
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

    return tempEntry;
  }
}
