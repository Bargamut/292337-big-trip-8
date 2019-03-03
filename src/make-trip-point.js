/**
 * @description Создание шаблона заказов в точке маршрута
 * @param {Object} tripPointOffer Объект описания заказа
 * @return {Node} DOM-элемент <template> заказа
 */
const makeTripOffersTemplate = (tripPointOffer) => {
  const nodeTripPointOfferTemplate = document.createElement(`template`);

  nodeTripPointOfferTemplate.innerHTML =
    `<li>
      <button class="trip-point__offer">${tripPointOffer.caption} +${tripPointOffer.price.currency}&nbsp;${tripPointOffer.price.value}</button>
    </li>`;

  return nodeTripPointOfferTemplate;
};

/**
 * @description Создание шаблона точки маршрута
 * @param {Object} tripPoint Объект описания точки маршрута
 * @return {Node} DOM-элемент <template> точки маршрута
 */
const makeTripPointTemplate = (tripPoint) => {
  const nodeTripPointTemplate = document.createElement(`template`);

  nodeTripPointTemplate.innerHTML =
    `<article class="trip-point">
      <i class="trip-icon">${tripPoint.icon}</i>

      <h3 class="trip-point__title">${tripPoint.title}</h3>

      <p class="trip-point__schedule">
        <span class="trip-point__timetable">${tripPoint.timetable.since} — ${tripPoint.timetable.since}</span>
        <span class="trip-point__duration">${tripPoint.duration}</span>
      </p>

      <p class="trip-point__price">${tripPoint.price.currency}&nbsp;${tripPoint.price.value}</p>

      <ul class="trip-point__offers"></ul>
    </article>`;

  for (let key in tripPoint.offers) {
    if (!tripPoint.offers.hasOwnProperty(key)) {
      continue;
    }

    nodeTripPointTemplate.content.querySelector(`.trip-point__offers`).appendChild(
        makeTripOffersTemplate(tripPoint.offers[key]).content.cloneNode(true)
    );
  }

  return nodeTripPointTemplate;
};

export default makeTripPointTemplate;
