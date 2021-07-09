export const getTodayDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day];
};

export const camerasAbbr = ["RHAZ", "MAST", "CHEMCAM", "MAHLI", "MARDI", "NAVCAM"];
// export const camerasFullNames = [
//   "Rear Hazard Avoidance Camera",
//   "Mast Camera",
//   "Chemistry and Camera Complex",
//   "Mars Hand Lens Imager",
//   "Mars Descent Imager",
//   "Navigation Camera",
// ];

// API
export const weatherUrl = "https://api.maas2.apollorion.com/";
export const getFtImgUrl = (dateArray) => {
  const [year, month, day] = dateArray;
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?camera=FHAZ&earth_date=${year}-${month}-${day}&page=1&api_key=${process.env.REACT_APP_NASA_API_KEY}`;
  return url;
};
export const getOtherImgUrl = (cameraAbbr, dateArray) => {
  const [year, month, day] = dateArray;
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?camera=${cameraAbbr}&earth_date=${year}-${month}-${day}&page=1&api_key=${process.env.REACT_APP_NASA_API_KEY}`;
  return url;
};
