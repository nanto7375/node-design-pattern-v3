import fs from 'fs'

class DataQueue {
  queue = []

  setDataWithIndex (data, index) {
    this.queue[index] = data
  }

  getConcatedDatas () {
    return this.queue.join('')
  }
}

const readFile = (file, index, done) => {
  if (file === 'a.txt') {
    return setTimeout(() => {
      fs.readFile(file, (readError, data) => {
        if (readError) {
          return done(readError)
        }
        console.log('read', file)
        done(null, Buffer.from(data).toString(), index)
      })
    }, 1000 * 1)
  }
  fs.readFile(file, (error, data) => {
    if (error) {
      return done(error)
    }
    console.log('read', file)
    done(null, Buffer.from(data).toString(), index)
  })
}

export const concatFiles = (files, destination, indexCallback) => {
  const dataQueue = new DataQueue()

  let completed = 0
  let hasError = false

  const done = (readError, data, index) => {
    if (readError) {
      hasError = true
      return indexCallback(readError)
    }

    dataQueue.setDataWithIndex(data, index)

    if (++completed === files.length && !hasError) {
      fs.writeFile(destination, dataQueue.getConcatedDatas(), (writeError) => {
        if (writeError) {
          return indexCallback(writeError)
        }
        indexCallback()
      })
    }
  }

  files.forEach((file, index) => readFile(file, index, done))
}
