export default interface DateWeather {
  date: string
  weather: {
    emoji: string
    code: number
    description: string
  }
  place: {
    latitude: number
    longitude: number
  }
}
