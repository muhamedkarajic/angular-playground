/// <reference lib="webworker" />

import { EntityClient } from "./shared/models/entity/entity-client";

addEventListener('message', ({ data }) => {
  const x = new EntityClient();

  postMessage('hi');
});


export function example() {
  if (typeof Worker !== 'undefined') {
    // Create a new
    const worker = new Worker(new URL('./app.worker', import.meta.url));
    worker.onmessage = ({ data }) => {
      console.log(`page got message: ${data}`);
    };
    worker.postMessage('hello');
  } else {
    console.error('Worker not supported.');
  }
}