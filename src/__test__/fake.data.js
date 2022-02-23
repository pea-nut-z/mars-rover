export const weatherData1 = {
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

export const weatherData2 = {
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

const image =
  "https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/03390/opgs/edr/fcam/FLB_698438687EDR_F0932080FHAZ00302M_.JPG";

export const junImgData = {
  photos: [
    {
      id: 1234,
      rover: { name: "Curiosity" },
      camera: { full_name: "Front Hazard Avoidance Camera" },
      earth_date: "2033-06-30",
      img_src: image,
    },
  ],
};

export const julImgData = {
  photos: [
    {
      id: 4567,
      rover: { name: "Opportunity" },
      camera: { full_name: "Rear Hazard Avoidance Camera" },
      earth_date: "2033-07-01",
      img_src: image,
    },
  ],
};

// export const likesData = [
//   {
//     id: 1234,
//     rover: { name: "Curiosity" },
//     camera: { full_name: "Camera Name" },
//     earth_date: "2033-07-01",
//     img_src: image,
//   },
// ];

export const newsData = {
  articles: [
    {
      description: "News description.",
      publishedAt: "2033-06-30T00:00:00Z",
      title: "News title",
      url: "https://www.newsurl.com",
      urlToImage: image,
    },
    {
      description: "News description.",
      publishedAt: "2033-06-30T00:00:00Z",
      title: "News title",
      url: "https://www.newsurl.com",
      urlToImage: image,
    },
  ],
};
