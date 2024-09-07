import DateWeather from "./@types/DateWeather";
import OpenMeteoDaily from "./@types/OpenMeteoDaily";
import createWeatherContent from "./util/createWeatherContent";
import sendSlackMessage from "./util/sendSlackMessage";
import urlGenerator from "./util/urlGenerator";
import weatherCode2Emoji from "./util/weatherCode2Emoji";

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

  const { datePlaces } = JSON.parse(properties.getProperty('DATE_PLACES')!)

  const dateWeatherSets: DateWeather[] = []

  for (const datePlace of datePlaces) {
    const { date, latitude, longitude } = datePlace
    const url = urlGenerator({ latitude, longitude })
    const response = UrlFetchApp.fetch(url)
    const json: OpenMeteoDaily = JSON.parse(response.getContentText())
    const dates = json.daily.time
    const index = dates.indexOf(date)
    if (index === -1) {
      Logger.log(`No data for ${date}`)
      continue
    }
    const weatherCode = json.daily.weather_code[index]
    const { emoji, description } = weatherCode2Emoji({ weatherCode })
    dateWeatherSets.push({
      date,
      weather: {
        emoji,
        code: weatherCode,
        description
      },
      place: {
        latitude,
        longitude
      }
    }
    )
    Logger.log(date, emoji, description)
  }

  const sortedDateWeatherSets = dateWeatherSets.sort((a, b) => a.date.localeCompare(b.date))

  const message = createWeatherContent({ dateWeathers: sortedDateWeatherSets })

  sendSlackMessage(url, message)

  return out;
}

declare let global: { doPost: (e: any) => void }
global.doPost = main

export default main

