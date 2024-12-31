const timer = function (func) {
  async function wrapper(...args) {
    const started = performance.now();
    await func(...args);
    const ended = performance.now();
    const duration = (ended - started) / Math.pow(10, 3);

    console.log(`function ${func.name}() take ${duration} seconds to execute`);
  }

  return wrapper;
};

module.exports = {
  timer: timer,
};
