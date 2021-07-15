// FOR TESTING
let testYear, testMonth, testDay;

export const getTodayDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day];
};

export const cameraAbbrs = ["RHAZ", "MAST", "CHEMCAM", "MAHLI", "MARDI", "NAVCAM"];

// export const camerasFullNames = [
//   "Rear Hazard Avoidance Camera",
//   "Mast Camera",
//   "Chemistry and Camera Complex",
//   "Mars Hand Lens Imager",
//   "Mars Descent Imager",
//   "Navigation Camera",
// ];

export const checkImgUrl = (url) => {
  const validUrls = [];
  cameraAbbrs.forEach((abbr) => {
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?camera=${abbr}&earth_date=${testYear}-${testMonth}-${testDay}&page=1&api_key=${process.env.REACT_APP_NASA_API_KEY}`;
    validUrls.push(url);
  });
  return validUrls.includes(url);
};

// API
export const weatherUrl = "https://api.maas2.apollorion.com/";
export const getFtImgUrl = (dateArray) => {
  [testYear, testMonth, testDay] = dateArray;
  const [year, month, day] = dateArray;
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?camera=FHAZ&earth_date=${year}-${month}-${day}&page=1&api_key=${process.env.REACT_APP_NASA_API_KEY}`;
  return url;
};

export const newsUrl = `https://newsapi.org/v2/everything?qInTitle=%22mars%22&domains=nature.com&sortBy=publishedAt&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`;

// ???
export const getOtherImgUrl = (cameraAbbr, dateArray) => {
  const [year, month, day] = dateArray;
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?camera=${cameraAbbr}&earth_date=${year}-${month}-${day}&page=1&api_key=${process.env.REACT_APP_NASA_API_KEY}`;
  return url;
};
