import React, { useEffect, useState } from "react";
import "./App.css";
import Carousel from "react-bootstrap/Carousel";
import { IoSunnyOutline, IoInformationCircleSharp } from "react-icons/io5";
import Modal from "react-modal";
import info from "./info";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

export default function App() {
  const [images, setImages] = useState([]);
  const [cameras, setCameras] = useState();
  const [weather, setWeather] = useState();
  const [news, setNews] = useState();
  const [imagesFetched, setImagesFetched] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);

  // console.log({ weather });
  // console.log(modalIsOpen);

  const camerasAbbr = ["RHAZ", "MAST", "CHEMCAM", "MAHLI", "MARDI", "NAVCAM"];
  const camerasFullNames = [
    "Rear Hazard Avoidance Camera",
    "Mast Camera",
    "Chemistry and Camera Complex",
    "Mars Hand Lens Imager",
    "Mars Descent Imager",
    "Navigation Camera",
  ];

  useEffect(() => {
    const todayDate = getTodayDate();
    getPhotos(todayDate);
    getWeather();
    // getNews();
  }, []);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

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
    const frontCameraImg = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?camera=FHAZ&earth_date=${year}-${month}-${day}&page=1&api_key=${process.env.REACT_APP_NASA_API_KEY}`;
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
          selectedCameras.push("Front Hazard Avoidance Camera");
          camerasAbbr.forEach((camera, index) => {
            const otherImgs = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?camera=${camera}&earth_date=${year}-${month}-${day}&page=1&api_key=${process.env.REACT_APP_NASA_API_KEY}`;
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
                setImagesFetched(true);
              });
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getWeather = () => {
    const weather = "https://api.maas2.apollorion.com/";
    return fetch(weather)
      .then((res) => res.json())
      .then((data) => {
        setWeather(data);
      });
  };

  const getNews = () => {
    const news = `https://newsapi.org/v2/everything?qInTitle=%22mars%22&domains=nature.com&sortBy=publishedAt&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`;
    fetch(news)
      .then((res) => res.json())
      .then((data) => {
        const { articles } = data;
        const selectedArticles = articles.reduce((arr, article) => {
          const repeated = arr.some((obj) => {
            return obj.title === article.title;
          });
          !repeated && arr.push(article);
          return arr;
        }, []);
        console.log(selectedArticles);
        setNews(selectedArticles);
      });
  };

  const renderWeather = () => {
    const {
      sol,
      atmo_opacity,
      local_uv_irradiance_index,
      max_temp,
      min_temp,
      wind_speed,
      wind_direction,
      sunrise,
      sunset,
    } = weather;

    let earthISOStr = weather.terrestrial_date.split("T")[0].replace(/-/g, "/");
    let earthDate = new Date(earthISOStr).toString().split(" ");
    const [_, earthMonth, earthDay] = earthDate;

    const seasons = ["Autumn", "Winter", "Spring", "Summer"];
    const marsSeasonsEnd = [3, 6, 9, 12];
    const marsMonth = weather.season.split(" ")[1] * 1;
    let marsSeason;

    for (let [index, val] of marsSeasonsEnd.entries()) {
      if (marsMonth <= val) {
        marsSeason = seasons[index];
        break;
      }
    }

    return (
      <div className="container">
        <div className="title">LATEST WEATHER AT ELYSIUM PLANTITIA</div>
        <div className="row">
          <div className="text-right">
            <div className="sol display-4">Sol {sol}</div>
            <div className="h2 gray">
              {earthMonth} {earthDay}
            </div>
            <IoInformationCircleSharp className="h4 text-primary" onClick={openModal} />
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={modalStyles}>
              <div>
                {info.map((item, index) => {
                  return <p key={index}>{item}</p>;
                })}
              </div>
            </Modal>
          </div>
          <div className="divider" />
          <div className="col text-right ">
            <div className="h5">High: {max_temp}°C</div>
            <div className="h5">Low: {min_temp}°C</div>
            <br />
            <div className="gray">Wind Speed: {wind_speed ? wind_speed : "N/A"}</div>
            <div className="gray">
              Wind Direction: {wind_direction ? `${wind_direction} kph` : "N/A"}
            </div>
          </div>

          <div className="col text-right">
            <div className="h5">
              <IoSunnyOutline />
              {atmo_opacity}
            </div>
            <div className="gray">
              <div>{marsSeason}</div>
              <div>UV Index: {local_uv_irradiance_index}</div>
              <div>Sunrise: {sunrise}</div>
              <div>Sunset: {sunset}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderImages = () => {
    return (
      <div className="container d-flex flex-column justify-content-center">
        <div className="title text-center">IMAGES CAPTURED BY CURIOSITY ROVER</div>
        <Carousel style={{ width: 300, height: 300, padding: 30 }}>
          {images.map((image, index) => {
            return (
              <Carousel.Item key={index} interval={2000}>
                <img
                  className="d-block w-100"
                  src={image.img_src}
                  alt={`Mars captured with ${cameras[index]}`}
                />
                <Carousel.Caption>{cameras[index]}</Carousel.Caption>
              </Carousel.Item>
            );
          })}
        </Carousel>
        <div className="h5 text-center">({images[0].earth_date})</div>
      </div>
    );
  };
  const renderNews = () => {
    return (
      <div>
        {news.map((article, index) => {
          let date = article.publishedAt.split("T")[0];
          return (
            <div key={index}>
              <div>{article.title}</div>
              <div>{date}</div>
              <div>{article.description}</div>
              <a href={article.url}>
                <img
                  src={article.urlToImage}
                  alt={`Article ${index} image`}
                  style={{ width: "15%" }}
                ></img>
              </a>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div style={{ height: "100vh" }}>
      <div className="weather-section">{weather && renderWeather()}</div>
      <div className="image-section">{imagesFetched && renderImages()}</div>
      <div>{news && renderNews()}</div>
    </div>
  );
}
