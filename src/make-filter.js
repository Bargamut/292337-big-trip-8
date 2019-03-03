/**
 * @description Создание шаблона фильтра
 * @param {Object} filter Объект описания фильтра
 * @return {Node} DOM-элемент <template> фильтра
 */
const makeFilterTemplate = (filter) => {
  const nodeFilterTemplate = document.createElement(`template`);

  nodeFilterTemplate.innerHTML =
    `<input type="radio" id="filter-${filter.id}" name="filter" value="${filter.value}" ${filter.isChecked ? `checked` : ``}>
    <label class="trip-filter__item" for="filter-${filter.id}">${filter.caption}</label>`;

  return nodeFilterTemplate;
};

export default makeFilterTemplate;
