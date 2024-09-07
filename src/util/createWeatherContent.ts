import DateWeather from '../@types/DateWeather'

interface CreateWeatherContentProps {
  dateWeathers: DateWeather[]
}

export default function createWeatherContent (props: CreateWeatherContentProps): string {
  const {
    dateWeathers
  } = props

  if (dateWeathers.length === 0) {
    return 'No data available.'
  }

  const header = '🌤️🌤️🌤️ 今後の天気予報 🌧️🌧️🌧️'

  const weatherContent = dateWeathers.map(dateWeather => {
    return `📅 ${dateWeather.date} ${dateWeather.weather.emoji} (${dateWeather.weather.description})`
  }).join('\n')

  const footer = 'Have a nice day!'

  return [header, '', weatherContent, '', footer].join('\n')
}
