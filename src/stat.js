import ChartDataLabels from 'chartjs-plugin-datalabels';
import StatChart from './stat-chart';
import API from './api';
import Store from './store';
import Provider from './provider';
import {SERVER_DATA} from './make-data';

let currentPoints = [];

const api = new API({
  endPoint: SERVER_DATA.END_POINT,
  authorization: SERVER_DATA.AUTHORIZATION
});
const store = new Store({
  keyStorage: SERVER_DATA.POINTS_STORE_KEY,
  storage: localStorage
});
const provider = new Provider({
  api,
  store,
  generateId: () => (Date.now() + Math.random())
});

const chartComponents = new Map([
  [`money`, new StatChart({
    type: `money`,
    width: 900,
    conf: {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `€ ${val}`
          }
        },
        title: {
          display: true,
          text: `MONEY`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    }
  })],
  [`transport`, new StatChart({
    type: `transport`,
    width: 900,
    conf: {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}x`
          }
        },
        title: {
          display: true,
          text: `TRANSPORT`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    }
  })],
  [`time-spend`, new StatChart({
    type: `timespend`,
    width: 900,
    conf: {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}H`
          }
        },
        title: {
          display: true,
          text: `TIME SPENT`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    }
  })]
]);

document.addEventListener(`DOMContentLoaded`, () => {
  const nodeTable = document.querySelector(`#table`);
  const nodeStats = document.querySelector(`#stats`);

  document.querySelector(`.view-switch`).addEventListener(`click`, (evt) => {
    if (!evt.target.classList.contains(`view-switch__item`)) {
      return false;
    }

    evt.preventDefault();

    const viewType = evt.target.getAttribute(`href`);

    document.querySelector(`.view-switch__item--active`)
      .classList.remove(`view-switch__item--active`);

    evt.target.classList.add(`view-switch__item--active`);

    if (viewType === `#stats`) {
      nodeTable.classList.add(`visually-hidden`);
      nodeStats.classList.remove(`visually-hidden`);

      provider.getPoints()
        .then((data) => {
          currentPoints = data;

          renderCharts();
          updateComponents();
        });
    } else if (viewType === `#table`) {
      nodeTable.classList.remove(`visually-hidden`);
      nodeStats.classList.add(`visually-hidden`);
    }

    return false;
  });
});

/**
 * @description Проверить, является ли тип события транспортом
 * @param {String} type Тип точки маршрута
 * @return {Boolean}
 */
const isTransport = (type) => {
  return ![`check-in`, `sightseeing`, `restaurant`].includes(type);
};

/**
 * @description Обновить компоненты
 */
const updateComponents = () => {
  chartComponents.forEach((component, key) => {
    const data = (key === `transport`)
      ? currentPoints.filter((dayItem) => isTransport(dayItem.type))
      : currentPoints;

    component.update(data);
  });
};

/**
 * @description Отрисовать компоненты графиков статистики
 */
const renderCharts = () => {
  chartComponents.forEach((component, key) => {
    if (component.element) {
      return;
    }

    const nodeChart = document.querySelector(`.statistic__${key}`);

    component.render();

    nodeChart.parentNode.replaceChild(component.element, nodeChart);

    component.createChart();
  });
};
