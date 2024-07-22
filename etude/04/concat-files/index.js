import { concatFiles } from './concat-files.js'
import fs from 'fs'

// 4-1 파일 연결
// 1. file 모두 읽기
// 2. 읽은 파일의 내용들 합치기
// 3. dest파일에 저장하기

const [,, dest, ...files] = process.argv

concatFiles(dest, (error, data) => {
  if (error) {
    console.log(error)
    process.exit(1)
  }
  fs.writeFile(dest, data, () => {
    console.log('finish')
  })
}, ...files)
