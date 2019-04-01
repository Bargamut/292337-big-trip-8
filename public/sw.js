const CACHE_NAME = `STATIC_V1.0`;

const putToWSCache = (evt, response) => {
  caches.open(CACHE_NAME)
    .then((cache) => cache.put(evt.request, response));
};

self.addEventListener(`install`, (evt) => {
  const openCache = caches.open(CACHE_NAME)
    .then((cache) => {
      cache.addAll([
        `./`,
        `./index.html`,
        `./bundle.js`,
        `./css/normalize.css`,
        `./css/main.css`,
        `./img/star.svg`,
        `./img/star--check.svg`
      ]);
    });

  evt.waitUntil(openCache);
});

self.addEventListener(`fetch`, (evt) => {
  evt.respondWith(
      fetch(evt.pequest)
        .then((response) => {
          putToWSCache(evt, response);

          return response.clone();
        })
        .catch(() => {
          return caches.match(evt.request)
            .then((response) => {
              return response.clone();
            })
            .catch((err) => {
              throw err;
            });
        })
  );
});
