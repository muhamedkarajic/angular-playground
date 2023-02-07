/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  let i = 0;

  while (i <= 10_000_000_000) {
    i++;
  }

  postMessage(i);
});
