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

      this.queue.setDataViaIndex(data, index)

      if (++completed !== files.length && !hasError) {
        return
      }
      this.writeFile(destination, this.queue.getConcatedDatas(), indexCallback)
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

  writeFile (destination, data, cb) {
    this.fs.writeFile(destination, data, cb)
  }
}
