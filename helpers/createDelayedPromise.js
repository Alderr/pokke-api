/*
> basically w/ a promise argument;
> return a new function that executes the promise
*/
const createDelayedPromise = func => () => new Promise((resolve, reject) => func(resolve, reject));

module.exports = createDelayedPromise;
