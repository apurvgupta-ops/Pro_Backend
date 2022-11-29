// we can go with try-catch async await || promise

module.exports = (func) => (req, res, next) =>
  Promise.resolve(func(req, res, next)).catch(next);
