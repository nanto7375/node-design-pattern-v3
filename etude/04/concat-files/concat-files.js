export class FileConcator {
  fs
  queue

  constructor (fs, dataQueue) {
    this.fs = fs
    this.queue = dataQueue
  }

  concatFiles (files, destination, indexCallback) {
    let completed = 0
    let hasError = false
    files.forEach((file, index) => this.readFile(file, (readError, data) => {
      if (readError) {
        hasError = true
        return indexCallback(readError)
      }
      if (hasError) {
        return
      }

      this.queue.setDataWithIndex(Buffer.from(data).toString(), index)

      if (++completed === files.length) {
        this.writeFile(destination, (writeError) => {
          try {
            if (writeError) {
              return indexCallback(writeError)
            }
            console.log('concate files')
            return indexCallback()
          } finally {
            this.queue.removeAll()
          }
        })
      }
    }))
  }

  readFile (file, done) {
    this.fs.readFile(file, (readError, data) => {
      if (readError) {
        return done(readError)
      }
      console.log('read', file)

      done(null, Buffer.from(data).toString())
    })
  }

  writeFile (destination, cb) {
    this.fs.writeFile(destination, this.queue.getConcatedDatas(), (writeError) => {
      if (writeError) {
        return cb(writeError)
      }
      console.log('write', destination)
      return cb()
    })
  }
}
