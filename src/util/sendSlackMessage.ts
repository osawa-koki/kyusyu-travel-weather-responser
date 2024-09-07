export default function sendSlackMessage(url, message: string): GoogleAppsScript.URL_Fetch.HTTPResponse {
  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      text: message
    })
  });

  return response;
}