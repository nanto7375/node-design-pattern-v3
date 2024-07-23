import fs from 'fs'
import { FileConcator } from './concat-files.js'

// 4-1 파일 연결 (callback style)
// 1. file 모두 읽기
// 2. 읽은 파일의 내용들 합치기
// 3. destination파일에 저장하기
// *파일 목록 순서대로 내용을 합쳐야 한다

const [,, destination, ...files] = process.argv

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
fileConcator.concatFiles(files, destination, (error) => {
  if (error) {
    console.log(error)
    return process.exit(1)
  }
  console.log('finish')
})
