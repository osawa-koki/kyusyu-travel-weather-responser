import main from '../index'
import { Istest } from '../@types/IsTest'
import { dummyEventPostData } from './dummyEventPostData'

export default function testMentioned() {
  const e: GoogleAppsScript.Events.DoPost & Istest = {
    ...dummyEventPostData,
    postData: {
      ...dummyEventPostData.postData,
      contents: JSON.stringify({})
    }
  }
  const response = main(e)

  const data = JSON.parse(response.getContent())

  Logger.log(JSON.stringify(data, null, 2))

  if (data.message !== 'Success') {
    throw new Error('Invalid message')
  }

  Logger.log(`Test ${testMentioned.name} passed!!!`)
}
