import ChartDataLabels from 'chartjs-plugin-datalabels';
import StatChart from './stat-chart';
import currentDayItems from './make-data';

const componentChartMoney = new StatChart({
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
});

const componentChartTransport = new StatChart({
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
});

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

      updateComponents();
    } else if (viewType === `#table`) {
      nodeTable.classList.remove(`visually-hidden`);
      nodeStats.classList.add(`visually-hidden`);
    }

    return false;
  });

  renderCharts();
  updateComponents();
});

/**
 * @description Отфильтровать события маршрута
 * @param {Array} dayItems Массив данных событий маршрута
 * @return {Array} Отфильтрованный массив событий маршрута
 */
const filterDayItems = (dayItems) => {
  return dayItems;
};

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
  let filteredDayItems = filterDayItems(currentDayItems);

  componentChartMoney.update(filteredDayItems);

  filteredDayItems = filteredDayItems.filter((dayItem) => isTransport(dayItem.type));

  componentChartTransport.update(filteredDayItems);
};

/**
 * @description Отрисовать компоненты графиков статистики
 */
const renderCharts = () => {
  const nodeChartsMoney = document.querySelector(`.statistic__money`);
  const nodeChartsTransport = document.querySelector(`.statistic__transport`);

  componentChartMoney.render();
  componentChartTransport.render();

  nodeChartsMoney.parentNode.replaceChild(
      componentChartMoney.element,
      nodeChartsMoney
  );

  nodeChartsTransport.parentNode.replaceChild(
      componentChartTransport.element,
      nodeChartsTransport
  );

  componentChartMoney.createChart();
  componentChartTransport.createChart();
};
