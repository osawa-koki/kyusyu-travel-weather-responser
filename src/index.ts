import sendSlackMessage from "./util/sendSlackMessage";

function main(e) {
  const properties = PropertiesService.getScriptProperties();
  const out = ContentService.createTextOutput();
  out.setMimeType(ContentService.MimeType.JSON);

  const body = JSON.parse(e.postData.contents);

  if (body.type === 'url_verification') {
    const secret = properties.getProperty('SLACK_VERIFICATION_SECRET');
    if (e.parameter.secret !== secret) {
      out.setContent(JSON.stringify({ message: 'Forbidden' }));
      return out;
    }
    const challenge = body.challenge;
    out.setContent(JSON.stringify({
      message: 'Verification',
      challenge
    }));
    return out;
  }

  const url = properties.getProperty('SLACK_WEBHOOK_URL');
  sendSlackMessage(url, 'hello world');

  out.setContent(JSON.stringify({ message: 'OK' }));
  return out;
}

declare let global: { doPost: (e: any) => void }
global.doPost = main

export default main

