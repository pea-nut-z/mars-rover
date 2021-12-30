export const fakeWeatherData1 = {
  atmo_opacity: "Sunny",
  local_uv_irradiance_index: "Moderate",
  max_temp: -12,
  min_temp: -34,
  season: "Month 3",
  sol: 1234,
  sunrise: "01:23",
  sunset: "12:34",
  terrestrial_date: "2033-06-30T00:00:00.000Z",
  wind_direction: "West",
  wind_speed: "40km/h",
};

export const fakeWeatherData2 = {
  atmo_opacity: "Cloudy",
  local_uv_irradiance_index: "Low",
  max_temp: -56,
  min_temp: -78,
  season: "Month 7",
  sol: 5678,
  sunrise: "04:56",
  sunset: "06:59",
  terrestrial_date: "2033-06-30T00:00:00.000Z",
  wind_direction: null,
  wind_speed: null,
};

export const fakeJunImgData = {
  photos: [
    {
      camera: { full_name: "Camera name" },
      earth_date: "2033-06-30",
      img_src: "https://fakeImg.JPG",
    },
  ],
};

export const fakeJulImgData = {
  photos: [
    {
      camera: { full_name: "Camera name" },
      earth_date: "2033-07-01",
      img_src: "https://fakeImg2.JPG",
    },
  ],
};

export const fakeNewsData = {
  articles: [
    {
      description: "News description.",
      publishedAt: "2033-06-30T00:00:00Z",
      title: "News title",
      url: "https://www.newsurl.com",
      urlToImage: "https://fakeImg.JPG",
    },
    {
      description: "News description.",
      publishedAt: "2033-06-30T00:00:00Z",
      title: "News title",
      url: "https://www.newsurl.com",
      urlToImage: "https://fakeImg.JPG",
    },
  ],
};
