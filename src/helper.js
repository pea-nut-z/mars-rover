// FOR TESTING
let testYear, testMonth, testDay;

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

export const cameraAbbrs = ["RHAZ", "MAST", "CHEMCAM", "MAHLI", "MARDI", "NAVCAM"];

export const validateOtherImgUrl = (url) => {
  const validUrls = [];
  const validRHAZUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?camera=RHAZ&earth_date=${testYear}-${testMonth}-${testDay}&page=1&api_key=${process.env.REACT_APP_NASA_API_KEY}`;

  cameraAbbrs.forEach((abbr) => {
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

// API
export const weatherUrl = "https://api.maas2.apollorion.com/";
export const getFtImgUrl = (dateArray) => {
  [testYear, testMonth, testDay] = dateArray;
  const [year, month, day] = dateArray;
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?camera=FHAZ&earth_date=${year}-${month}-${day}&page=1&api_key=${process.env.REACT_APP_NASA_API_KEY}`;
  return url;
};
export const getOtherImgUrl = (cameraAbbr, dateArray) => {
  const [year, month, day] = dateArray;
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?camera=${cameraAbbr}&earth_date=${year}-${month}-${day}&page=1&api_key=${process.env.REACT_APP_NASA_API_KEY}`;
  return url;
};
export const newsUrl = `https://newsapi.org/v2/everything?qInTitle=%22mars%22&domains=nature.com&sortBy=publishedAt&apiKey=2b3dfedeebaa4614884f4827585c6c76`;
