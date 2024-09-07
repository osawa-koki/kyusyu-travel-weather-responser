
function doPost(e) {
  const properties = PropertiesService.getScriptProperties();
  const out = ContentService.createTextOutput();
  out.setMimeType(ContentService.MimeType.JSON);

  const body = JSON.parse(e.postData.contents);

  if (e.parameter.type === 'url_verification') {
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

  const challenge = body.challenge;
  out.setContent(JSON.stringify({ message: 'OK', challenge }));
  return out;
}

