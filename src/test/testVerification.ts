import { Istest } from '../@types/IsTest'
import main from '../index'
import { dummyEventPostData } from './dummyEventPostData'

export default function testVerification() {
  const properties = PropertiesService.getScriptProperties()
  const token = properties.getProperty('SLACK_VERIFICATION_TOKEN')!
  const e: GoogleAppsScript.Events.DoPost & Istest = {
    ...dummyEventPostData,
    postData: {
      ...dummyEventPostData.postData,
      contents: JSON.stringify({
        type: 'url_verification',
        token,
        challenge: 'challenge-test-data'
      })
    }
  }
  const response = main(e)

  const data = JSON.parse(response.getContent())
  Logger.log(JSON.stringify(data, null, 2))

  if (data.message !== 'Verification') {
    throw new Error('Invalid message')
  }
  if (data.challenge !== 'challenge-test-data') {
    throw new Error('Invalid challenge')
  }

  Logger.log(`Test ${testVerification.name} passed!!!`)
}
