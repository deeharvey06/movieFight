const debounce = (func, delay) => {
  let timeoutId;
  return (...arg) => {
    if (timeoutId) clearInterval(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(null, arg);
    }, delay);
  }
}