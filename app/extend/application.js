const cache = {};

module.exports = {
  cache(search, svg) {
    if (svg) {
      cache[search] = svg;
    } else {
      return cache[search];
    }
  },
};
