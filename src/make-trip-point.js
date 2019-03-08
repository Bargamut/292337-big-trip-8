/**
 * @description Создание шаблона заказов при событии маршрута
 * @param {Object} tripDayItemOffer Объект описания заказа
 * @return {Node} DOM-элемент <template> заказа
 */
const makeTripOffersTemplate = (tripDayItemOffer) => {
  const nodeTripDayItemOfferTemplate = document.createElement(`template`);

  nodeTripDayItemOfferTemplate.innerHTML =
    `<li>
      <button class="trip-point__offer">${tripDayItemOffer.caption} +${tripDayItemOffer.price.currency}&nbsp;${tripDayItemOffer.price.value}</button>
    </li>`;

  return nodeTripDayItemOfferTemplate;
};

/**
 * @description Создание шаблона события маршрута
 * @param {Object} tripDayItem Объект описания события маршрута
 * @return {Node} DOM-элемент <template> события маршрута
 */
const makeTripDayItemTemplate = (tripDayItem) => {
  const nodetripDayItemTemplate = document.createElement(`template`);

  nodetripDayItemTemplate.innerHTML =
    `<article class="trip-point">
      <i class="trip-icon">${tripDayItem.icon}</i>

      <h3 class="trip-point__title">${tripDayItem.title}</h3>

      <p class="trip-point__schedule">
        <span class="trip-point__timetable">${tripDayItem.schedule.timetable.since} — ${tripDayItem.schedule.timetable.to}</span>
        <span class="trip-point__duration">${tripDayItem.schedule.duration}</span>
      </p>

      <p class="trip-point__price">${tripDayItem.price.currency}&nbsp;${tripDayItem.price.value}</p>

      <ul class="trip-point__offers"></ul>
    </article>`;

  tripDayItem.offers.forEach((offer) => {
    nodetripDayItemTemplate.content.querySelector(`.trip-point__offers`).appendChild(
        makeTripOffersTemplate(offer).content.cloneNode(true)
    );
  });

  return nodetripDayItemTemplate;
};

export default makeTripDayItemTemplate;
