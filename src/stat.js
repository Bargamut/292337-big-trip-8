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
  const nodeMainContent = document.querySelector(`.main`);
  const nodeStatistics = document.querySelector(`.statistic`);

  document.querySelector(`.view-switch`).addEventListener(`click`, (evt) => {
    evt.preventDefault();

    const viewType = evt.target.getAttribute(`href`);

    if (viewType === `#stats`) {
      nodeMainContent.classList.add(`visually-hidden`);
      nodeStatistics.classList.remove(`visually-hidden`);

      updateComponents();
    } else if (viewType === `#table`) {
      nodeMainContent.classList.remove(`visually-hidden`);
      nodeStatistics.classList.add(`visually-hidden`);
    }
  });

  renderCharts();
  updateComponents();
});

const filterDayItems = (dayItems) => {
  return dayItems;
};

/**
 * @description Обновить компоненты
 */
const updateComponents = () => {
  const filteredTasks = filterDayItems(currentDayItems);

  componentChartMoney.update(filteredTasks);
  componentChartTransport.update(filteredTasks);
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
