import React, { useEffect, useState } from "react";
import "./App.css";
// 2021-6-16

function App() {
  const [frontViewImg, setFrontViewImg] = useState();
  const [otherImgs, setotherImgs] = useState([]);
  const [cameraLabels, setCameraLabels] = useState([]);

  const getTodayDate = () => {
    const date = new Date();
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate() - 1;
    return [year, month, day];
  };

  const getPreviousMonthDate = (year, month) => {
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

  const getOtherImgs = (year, month, day) => {
    const camerasAbbr = ["RHAZ", "MAST", "CHEMCAM", "MAHLI", "MARDI", "NAVCAM"];
    const camerasFullNames = [
      "Rear Hazard Avoidance Camera",
      "Mast Camera",
      "Chemistry and Camera Complex",
      "Mars Hand Lens Imager",
      "Mars Descent Imager",
      "Navigation Camera",
    ];
    const selectedImg = [];
    const selectedCameras = [];
    camerasAbbr.forEach((camera, index) => {
      const API_URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?camera=${camera}&earth_date=${year}-${month}-${day}&page=1&api_key=${process.env.REACT_APP_API_KEY}`;
      fetch(API_URL)
        .then((res) => res.json())
        .then((data) => {
          if (data.photos.length === 0) {
            return;
          } else {
            const image = data.photos[0];
            selectedImg.push(image);
            selectedCameras.push(camerasFullNames[index]);
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setotherImgs([...otherImgs, ...selectedImg]);
          setCameraLabels([...cameraLabels, ...selectedCameras]);
        });
    });
  };

  const getPhotos = (array) => {
    let [year, month, day] = array;
    const API_URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?camera=FHAZ&earth_date=${year}-${month}-${day}&page=1&api_key=${process.env.REACT_APP_API_KEY}`;
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data.photos.length === 0) {
          if (day === 1) {
            const previousMonthDate = getPreviousMonthDate(year, month);
            getPhotos(previousMonthDate);
          } else {
            getPhotos([year, month, day - 1]);
          }
        } else {
          const image = data.photos[0];
          getOtherImgs(year, month, day);
          setFrontViewImg(image);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const todayDate = getTodayDate();
    getPhotos(todayDate);
  }, []);

  return (
    <div>
      <div id="title">
        <h1>Lastest images of Mars</h1>
        <h3>on {frontViewImg && frontViewImg.earth_date}</h3>
      </div>
      <div id="images-container">
        {frontViewImg && (
          <div className="image-container">
            <img
              className="fetched-img"
              src={frontViewImg.img_src}
              alt="Image of Mars taken by Curiosity Rover"
            />
            <h4>Front Hazard Avoidance Camera</h4>
          </div>
        )}
        <div id="other-imgs-container">
          {otherImgs &&
            otherImgs.map((image, index) => {
              console.log("check", image);
              return (
                <div className="image-container">
                  <img
                    className="fetched-img"
                    key={index}
                    src={image.img_src}
                    alt="Image of Mars taken by Curiosity Rover"
                  />
                  <h4>{cameraLabels[index]}</h4>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
