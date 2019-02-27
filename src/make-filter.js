export default (id, filter) => {
  const nodeFilterTemplate = document.createElement(`template`);

  nodeFilterTemplate.innerHTML =
    `<input type="radio" id="filter-${id}" name="filter" value="${filter.value}" ${filter.isChecked ? `checked` : ``}>
    <label class="trip-filter__item" for="filter-${id}">${filter.caption}</label>`;

  return nodeFilterTemplate;
};
