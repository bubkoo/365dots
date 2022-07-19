let cacheByDate = {};

module.exports = {
  cache(search, svg) {
    const now = new Date();
    const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    if (!cacheByDate[date]) {
      cacheByDate = {};
      cacheByDate[date] = {};
    }

    const cache = cacheByDate[date];
    if (svg) {
      cache[search] = svg;
    } else {
      return cache[search];
    }
  },
};
