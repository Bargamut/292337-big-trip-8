import Component from './component';
import moment from 'moment';

/**
 * @description Класс компонента дня маршрута
 * @class TripDay
 */
export default class TripDay extends Component {
  /**
   * @description Конструктор класса TripDay
   * @memberof TripDay
   */
  constructor({date, index, items = []}) {
    super();

    this._date = date;
    this._dayNumber = index;
    this._dayItems = items;
  }

  /**
   * @description Геттер шаблона
   * @memberof TripDay
   */
  get template() {
    const nodeTripDay = document.createElement(`template`);

    nodeTripDay.innerHTML =
      `<section class="trip-day">
        <article class="trip-day__info">
          <span class="trip-day__caption">Day</span>
          <p class="trip-day__number">${this._dayNumber}</p>
          <h2 class="trip-day__title">${moment(this._date).format(`MMM D`)}</h2>
        </article>

        <div class="trip-day__items"></div>
      </section>`;

    return nodeTripDay;
  }
}
