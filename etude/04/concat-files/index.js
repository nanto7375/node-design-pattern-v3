import fs from 'fs'
import { FileConcator } from './concat-files.js'

class DataQueue {
  queue = []

  setDataViaIndex (data, index) {
    this.queue[index] = data
  }

  getConcatedDatas () {
    return this.queue.join('')
  }
}

const fileConcator = new FileConcator(fs, new DataQueue())
fileConcator.concatFiles(['./files/a.txt', './files/b.txt'], './files/dest.txt', (error) => {
  if (error) {
    console.log(error)
    return process.exit(1)
  }
  console.log('finish')
})
