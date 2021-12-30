// FOR TESTING
let testYear, testMonth, testDay;

// CAMERAS
export const getAllCamerasAbb = [
  "FHAZ",
  "RHAZ",
  "MAST",
  "CHEMCAM",
  "MAHLI",
  "MARDI",
  "NAVCAM",
  "PANCAM",
  "MINITES",
];

export const getAllCameras = [
  "Front Hazard Avoidance Camera",
  "Rear Hazard Avoidance Camera",
  "Mast Camera",
  "Chemistry and Camera Complex",
  "Mars Hand Lens Imager",
  "Mars Descent Imager",
  "Navigation Camera",
  "Panoramic Camera",
  "Miniature Thermal Emission Spectrometer (Mini-TES)",
];

export const getCamerasAvailable = {
  curiosity: [1, 2, 3, 4, 5, 6, 7],
  opportunity: [1, 2, 7, 8, 9],
  spirit: [1, 2, 7, 8, 9],
};

export const getCuriosityCamerasAbb = ["RHAZ", "MAST", "CHEMCAM", "MAHLI", "MARDI", "NAVCAM"];

// FUNCTIONS
export const getTodayDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day];
};

export const getPreviousMonthDate = (year, month) => {
  const monthsWith30Days = [4, 6, 9, 11];
  const preMonth = month === 1 ? 12 : month - 1;
  let preYear = year;
  let preDay;

  if (preMonth === 2) {
    preDay = 28;
  } else if (monthsWith30Days.includes(preMonth)) {
    preDay = 30;
  } else {
    preYear = preMonth === 12 && year - 1;
    preDay = 31;
  }
  return [preYear, preMonth, preDay];
};

export const convertCelToFah = (cel) => {
  const fah = (cel * 9) / 5 + 32;
  return fah.toFixed(2);
};

export const validateOtherImgUrl = (url) => {
  const validUrls = [];
  const validRHAZUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?camera=RHAZ&earth_date=${testYear}-${testMonth}-${testDay}&page=1&api_key=${process.env.REACT_APP_NASA_API_KEY}`;

  getCuriosityCamerasAbb.forEach((abbr) => {
    if (abbr === "RHAZ") return;
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?camera=${abbr}&earth_date=${testYear}-${testMonth}-${testDay}&page=1&api_key=${process.env.REACT_APP_NASA_API_KEY}`;
    validUrls.push(url);
  });
  const result = validUrls.includes(url)
    ? "valid"
    : validRHAZUrl === url
    ? "valid & RHAZ"
    : undefined;
  return result;
};

export const filterLikes = (likes, image, status) => {
  let result;
  if (status === "unlike") {
    result = likes.filter((like) => like.id !== image.id);
  } else {
    result = [...likes, image];
  }
  return result;
};

// API
export const getWeatherUrl = "https://api.maas2.apollorion.com/";
export const getImgUrl = (cameraAbbr, dateArray) => {
  const [year, month, day] = dateArray;
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?camera=${cameraAbbr}&earth_date=${year}-${month}-${day}&page=1&api_key=${process.env.REACT_APP_NASA_API_KEY}`;
  return url;
};
export const getFtImgUrl = (dateArray) => {
  [testYear, testMonth, testDay] = dateArray;
  const [year, month, day] = dateArray;
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?camera=FHAZ&earth_date=${year}-${month}-${day}&page=1&api_key=${process.env.REACT_APP_NASA_API_KEY}`;
  return url;
};
// export const getOtherImgUrl = (cameraAbbr, dateArray) => {
//   const [year, month, day] = dateArray;
//   const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?camera=${cameraAbbr}&earth_date=${year}-${month}-${day}&page=1&api_key=${process.env.REACT_APP_NASA_API_KEY}`;
//   return url;
// };

export const getFilteredImgUrl = (rover, camera, date) => {
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?camera=${camera}&earth_date=${date}&api_key=${process.env.REACT_APP_NASA_API_KEY}`;
  return url;
};

export const getNewsUrl = `https://newsapi.org/v2/everything?qInTitle=%22mars%22&domains=nature.com&sortBy=publishedAt&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`;
