import Chart from 'chart.js';
import CartDataLabels from 'chartjs-plugin-datalabels';

document.addEventListener(`DOMContentLoaded`, () => {
  const nodeMainContent = document.querySelector(`.main`);
  const nodeStatistics = document.querySelector(`.statistic`);

  document.querySelector(`.view-switch`).addEventListener(`click`, (evt) => {
    evt.preventDefault();

    const viewType = evt.target.getAttribute(`href`);

    if (viewType === `#stats`) {
      nodeMainContent.classList.add(`visually-hidden`);
      nodeStatistics.classList.remove(`visually-hidden`);
    } else if (viewType === `#table`) {
      nodeMainContent.classList.remove(`visually-hidden`);
      nodeStatistics.classList.add(`visually-hidden`);
    }
  });
});
