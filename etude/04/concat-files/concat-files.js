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

      console.log('read', file)
      this.queue.setDataViaIndex(Buffer.from(data).toString(), index)

      if (++completed !== files.length || hasError) {
        return
      }
      this.writeFile(destination, this.queue.getConcatedDatas(), indexCallback)
    }))
  }

  readFile (file, done) {
    this.fs.readFile(file, done)
  }

  writeFile (destination, data, cb) {
    this.fs.writeFile(destination, data, cb)
  }
}
