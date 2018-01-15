'use strict'

// Generator returns data from promise with timeout

function * getStreams (cloudwatchlogs, params) {
  let done = false
  while (!done) {
    yield new Promise((resolve, reject) => {
      cloudwatchlogs.describeLogStreams(params)
        .promise().then((data) => {
        if (data.nextToken) {
          params.nextToken = data.nextToken
        } else {
          done = true
        }
        resolve(data)
      }).catch(reject)
    })
  }
}

const isPromise = obj => Boolean(obj) && typeof obj.then === 'function'

const next = (iter, callback, prev = undefined) => {
  const item = iter.next(prev)
  const value = item.value

  if (item.done) return callback(prev)

  if (isPromise(value)) {
    value.then(val => {
      setImmediate(() => next(iter, callback, val))
    })
  } else {
    setImmediate(() => next(iter, callback, value))
  }
}

const gensync = (fn) =>
  (...args) => new Promise(resolve => {
    next(fn(...args), val => resolve(val))
  })

/* How to use gensync() */

const asyncFunc = gensync(function * (instance ,param) {
  const logs = getStreams(instance, param)
  let result = []
  let partResult = yield logs.next().value // returns promise
  result = result.concat(partResult.logStreams)
  while (partResult && partResult.nextToken) {
    partResult = yield logs.next().value
    if (partResult && partResult.logStreams) result = result.concat(partResult.logStreams)
  }
  yield {logStreams: result}
})

module.exports.collect = asyncFunc