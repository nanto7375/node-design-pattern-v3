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
      this.queue.setDataWithIndex(Buffer.from(data).toString(), index)

      if (++completed === files.length && !hasError) {
        this.writeFile(destination, (writeError) => {
          console.log('concate files')
          this.queue.removeAll()
          return indexCallback(writeError)
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
      console.log('write', destination)
      return cb(writeError)
    })
  }
}
