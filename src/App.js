import React, { useEffect, useState } from "react";
import "./App.css";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
// 2021-6-16

function App() {
  const [images, setImages] = useState([]);
  const [cameras, setCameras] = useState();
  const [fetchDone, setFetchDone] = useState(false);

  const camerasAbbr = ["RHAZ", "MAST", "CHEMCAM", "MAHLI", "MARDI", "NAVCAM"];
  const camerasFullNames = [
    "Rear Hazard Avoidance Camera",
    "Mast Camera",
    "Chemistry and Camera Complex",
    "Mars Hand Lens Imager",
    "Mars Descent Imager",
    "Navigation Camera",
  ];

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

  const getPhotos = (array) => {
    let [year, month, day] = array;
    let selectedImages = [];
    let selectedCameras = [];
    const frontCameraImg = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?camera=FHAZ&earth_date=${year}-${month}-${day}&page=1&api_key=${process.env.REACT_APP_API_KEY}`;
    fetch(frontCameraImg)
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
          selectedImages.push(data.photos[0]);
          camerasAbbr.forEach((camera, index) => {
            const otherImgs = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?camera=${camera}&earth_date=${year}-${month}-${day}&page=1&api_key=${process.env.REACT_APP_API_KEY}`;
            fetch(otherImgs)
              .then((res) => res.json())
              .then((data) => {
                if (data.photos.length === 0) {
                  return;
                } else {
                  selectedImages.push(data.photos[0]);
                  selectedCameras.push(camerasFullNames[index]);
                }
              })
              .finally(() => {
                setImages([...images, ...selectedImages]);
                setCameras(selectedCameras);
                setFetchDone(true);
              });
          });
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
    <div style={{ display: "block", width: 700, padding: 30 }}>
      <div id="title">
        <h1>How's Mars looking </h1>
        <h3>on {fetchDone && images[0].earth_date}</h3>
      </div>
      <Carousel>
        {fetchDone &&
          images.map((image, index) => {
            // console.log("check", image);
            return (
              <Carousel.Item key={index} style={{ height: "300px" }}>
                <img
                  className="d-block w-100"
                  src={image.img_src}
                  alt={`Mars captured with ${cameras[index]}`}
                  style={{ height: "300px" }}
                />
                <Carousel.Caption>{cameras[index]}</Carousel.Caption>
              </Carousel.Item>
            );
          })}
      </Carousel>
    </div>
  );
}

export default App;
