import makeFilter from './make-filter';

document.addEventListener(`DOMContentLoaded`, () => {
  const eventFilters = {
    everything: {
      caption: `Everything`,
      value: `everything`,
      isChecked: true
    },
    future: {
      caption: `Future`,
      value: `future`
    },
    past: {
      caption: `Past`,
      value: `past`
    }
  };

  renderFilters(document.querySelector(`.trip-filter`), eventFilters);
});

const renderFilters = function (nodeFiltersBar, eventFilters = {}) {
  const docFragmentFilters = document.createDocumentFragment();

  for (let key in eventFilters) {
    if (!eventFilters.hasOwnProperty(key)) {
      continue;
    }

    docFragmentFilters.appendChild(
        makeFilter(key, eventFilters[key]).content.cloneNode(true)
    );
  }

  nodeFiltersBar.innerHTML = ``;
  nodeFiltersBar.appendChild(docFragmentFilters);
};
