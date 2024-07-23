export class FileConcator {
  _fs
  _queue

  constructor (fs, queue) {
    this._fs = fs
    this._queue = queue
  }

  concatFiles (files, destination, cb) {
    let completed = 0
    let hasError = false
    files.forEach((file, index) => this._readFileWithSaving(file, index, (readError) => {
      if (readError) {
        hasError = true
        return cb(readError)
      }
      if (this._isAllCompleted(++completed, files.length, hasError)) {
        this._writeSavedDatas(destination, cb)
      }
    }))
  }

  _readFileWithSaving (file, index, cb) {
    this._fs.readFile(file, (error, data) => {
      if (error) {
        return cb(error)
      }
      console.log('read', file)
      this._queue.setDataViaIndex(Buffer.from(data).toString(), index)
      cb()
    })
  }

  _writeSavedDatas (destination, cb) {
    this._fs.writeFile(destination, this._queue.getConcatedDatas(), cb)
  }

  _isAllCompleted (completedLength, filesLength, hasError) {
    return completedLength === filesLength && !hasError
  }
}
