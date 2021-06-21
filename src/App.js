import React, { useEffect, useState } from "react";
import "./App.css";
// 2021-6-16

function App() {
  const [frontViewImg, setFrontViewImg] = useState();
  const [otherImgs, setotherImgs] = useState();

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

  const getOtherImgs = async (year, month, day) => {
    const cameras = ["RHAZ", "MAST", "CHEMCAM", "MAHLI", "MARDI", "NAVCAM"];
    const images = [];
    await cameras.forEach((camera) => {
      const API_URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?camera=${camera}&earth_date=${year}-${month}-${day}&page=1&api_key=${process.env.REACT_APP_API_KEY}`;
      fetch(API_URL)
        .then((res) => res.json())
        .then((data) => {
          if (data.photos.length === 0) {
            return;
          }
          const image = data.photos[0];
          images.push(image);
          console.log({ images });
        });
    });
    setotherImgs(images);
  };

  const getPhotos = (array) => {
    let [year, month, day] = array;
    const API_URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?camera=FHAZ&earth_date=${year}-${month}-${day}&page=1&api_key=${process.env.REACT_APP_API_KEY}`;
    fetch(API_URL)
      .then((res) => res.json())
      .then(async (data) => {
        if (data.photos.length === 0) {
          if (day === 1) {
            const previousMonthDate = getPreviousMonthDate(year, month);
            getPhotos(previousMonthDate);
          } else {
            getPhotos([year, month, day - 1]);
          }
        } else {
          const image = data.photos[0];
          await getOtherImgs(year, month, day);

          setFrontViewImg(image);
        }
      })
      .catch((error) => {
        console.log("There is an error.", error);
      });
    // .finally(() => {
    //   console.log(images);

    //   setFrontViewImg(images);
    // });
  };

  useEffect(() => {
    const todayDate = getTodayDate();
    getPhotos(todayDate);
  }, []);

  // useEffect(() => {
  //   console.log(frontViewImg);
  // });

  return (
    <div>
      {otherImgs &&
        otherImgs.map((image, index) => {
          console.log(image);
          return (
            <img key={index} src={image.img_src} alt="Image of Mars taken by Curiosity Rover" />
          );
        })}
      {frontViewImg && (
        <img src={frontViewImg.img_src} alt="Image of Mars taken by Curiosity Rover" />
      )}
    </div>
  );
}

export default App;
