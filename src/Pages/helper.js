// FOR TESTING
let testYear, testMonth, testDay;

// CAMERAS
export const allCamerasAbb = [
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

export const allCameras = {
  1: "Front Hazard Avoidance Camera",
  2: "Rear Hazard Avoidance Camera",
  3: "Mast Camera",
  4: "Chemistry and Camera Complex",
  5: "Mars Hand Lens Imager",
  6: "Mars Descent Imager",
  7: "Navigation Camera",
  8: "Panoramic Camera",
  9: "Miniature Thermal Emission Spectrometer (Mini-TES)",
};

export const camerasAvailable = {
  curiosity: [1, 2, 3, 4, 5, 6, 7],
  opportunity: [1, 2, 7, 8, 9],
  spirit: [1, 2, 7, 8, 9],
};

export const curiosityCamerasAbb = ["RHAZ", "MAST", "CHEMCAM", "MAHLI", "MARDI", "NAVCAM"];

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

  curiosityCamerasAbb.forEach((abbr) => {
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

export const filterLikes = (likedImages, imageId, roverName, imgUrl, cameraName, earthDate) => {
  let filtered;
  if (likedImages.hasOwnProperty(imageId)) {
    filtered = Object.keys(likedImages)
      .filter((id) => id != imageId)
      .reduce((obj, key) => {
        obj[key] = likedImages[key];
        return obj;
      }, {});
  } else {
    filtered = {
      ...likedImages,
      [imageId]: {
        roverName,
        imgUrl,
        cameraName,
        earthDate,
      },
    };
  }
  console.log({ filtered });

  return filtered;
};

// API
export const weatherUrl = "https://api.maas2.apollorion.com/";
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

export const newsUrl = `https://newsapi.org/v2/everything?qInTitle=%22mars%22&domains=nature.com&sortBy=publishedAt&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`;

//STYLE
export const styleHeart = {
  stroke: "black",
  strokeWidth: "10",
};
