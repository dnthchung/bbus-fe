import { v4 as uuidv4 } from 'uuid'

//path :   fe/src/helpers/generate-rollNumber.ts
// const generateRollNumber = (): string => {
//   return `HS${uuidv4()}`
// }

const generateRollNumber = (): string => {
  return `HS${uuidv4()}`
}

export default generateRollNumber
