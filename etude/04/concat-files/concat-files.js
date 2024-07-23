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
    files.forEach((file, index) => this.readFileWithSaving(file, index, (readError) => {
      if (readError) {
        hasError = true
        return indexCallback(readError)
      }
      if (++completed === files.length && !hasError) {
        this.writeFile(destination, indexCallback)
      }
    }))
  }

  readFileWithSaving (file, index, cb) {
    this.fs.readFile(file, (error, data) => {
      if (error) {
        return cb(error)
      }
      console.log('read', file)
      this.queue.setDataViaIndex(Buffer.from(data).toString(), index)
      cb()
    })
  }

  writeSavedData (destination, cb) {
    this.fs.writeFile(destination, this.queue.getConcatedDatas(), cb)
  }
}
