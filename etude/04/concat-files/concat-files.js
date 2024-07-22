import fs from 'fs'

class DataQueue {
  q = []

  push (data) {
    this.q.push(Buffer.from(data).toString())
  }

  concatAllData () {
    return this.q.join('')
  }
}

const queue = new DataQueue()

const readFile = (file, dest, cb) => {
  fs.readFile(file, (error, data) => {
    if (error) {
      return cb(error)
    }
    console.log('read', file)
    queue.push(data)
    cb()
  })
}

export const concatFiles = (dest, cb, ...files) => {
  const iterate = (index) => {
    if (index === files.length) {
      return cb(null, queue.concatAllData())
    }
    readFile(files[index], dest, (error) => {
      if (error) {
        return cb(error)
      }
      iterate(index + 1)
    })
  }
  iterate(0)
}
