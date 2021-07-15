import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Carousel from "react-bootstrap/Carousel";
import { IoInformationCircleSharp } from "react-icons/io5";
import Modal from "react-modal";
import {
  weatherUrl,
  getFtImgUrl,
  getOtherImgUrl,
  newsUrl,
  getTodayDate,
  cameraAbbrs,
} from "./helper";
import info from "./info";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    color: "black",
    zIndex: 2,
    transform: "translate(-50%, -50%)",
    maxHeight: "100vh",
  },
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [cameras, setCameras] = useState();
  const [weather, setWeather] = useState();
  const [news, setNews] = useState();
  const [cel, setCel] = useState(true);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [imagesFetched, setImagesFetched] = useState(false);

  useEffect(() => {
    if (process.env.REACT_APP_TEST !== "TRUE") Modal.setAppElement("#root");

    const todayDate = getTodayDate();
    getPhotos(todayDate);
    getWeather();
    getNews();
  }, []);

  const toggleUnit = () => {
    setCel(!cel);
  };

  const convertCelToFah = (cel) => {
    const fah = (cel * 9) / 5 + 32;
    return fah.toFixed(2);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
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

  const getPhotos = (dateArray) => {
    let [year, month, day] = dateArray;
    let selectedImages = [];
    let selectedCameras = [];
    const frontCameraImg = getFtImgUrl(dateArray);
    return axios
      .get(frontCameraImg)
      .then((res) => {
        const imagesFetched = res.data.photos;
        if (imagesFetched.length === 0) {
          if (day === 1) {
            const previousMonthDate = getPreviousMonthDate(year, month);
            getPhotos(previousMonthDate);
          } else {
            getPhotos([year, month, day - 1]);
          }
        } else {
          selectedImages.push(imagesFetched[0]);
          selectedCameras.push("Front Hazard Avoidance Camera");
          cameraAbbrs.forEach((cameraAbbr) => {
            const otherImg = getOtherImgUrl(cameraAbbr, dateArray);
            return axios
              .get(otherImg)
              .then((res) => {
                const imagesFetched = res.data.photos;
                if (imagesFetched.length === 0) {
                  return;
                } else {
                  selectedImages.push(imagesFetched[0]);
                  selectedCameras.push(imagesFetched[0].camera.full_name);
                }
              })
              .finally(() => {
                setImages([...images, ...selectedImages]);
                setCameras(selectedCameras);
                setImagesFetched(true);
                setLoading(false);
              });
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getWeather = () => {
    return axios
      .get(weatherUrl)
      .then((res) => {
        setWeather(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getNews = () => {
    return axios
      .get(newsUrl)
      .then((res) => {
        const { articles } = res.data;
        const selectedArticles = articles.reduce((arr, article) => {
          const repeated = arr.some((obj) => {
            return obj.title === article.title;
          });
          !repeated && arr.push(article);
          return arr;
        }, []);
        setNews(selectedArticles);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
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
      <div data-testid="weather-section" className="weather-section">
        <div className="d-flex justify-content-between">
          <div className="section-title">LATEST WEATHER AT ELYSIUM PLANTITIA</div>

          <div className="unit">
            <label htmlFor="cel" className="label h5">
              °C
            </label>
            <input type="radio" id="cel" name="unit" checked={cel && "checked"} readOnly />
            <button className="unit-toggle" onClick={toggleUnit}></button>
            <label htmlFor="fah" className="label h5">
              °F
            </label>
            <input type="radio" id="fah" name="unit" checked={!cel && "checked"} readOnly />
          </div>
        </div>

        <div className="weather-container d-flex">
          <div className="text-right">
            <div className="sol display-4">Sol {sol}</div>
            <div className="h2 text-muted">
              {earthMonth} {earthDay}
            </div>
            <IoInformationCircleSharp className="h4 text-primary" onClick={openModal} />
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={modalStyles}>
              <div>
                <button className="modalBtn" onClick={closeModal}>
                  Close
                </button>
                {info.map((item, index) => {
                  return <p key={index}>{item}</p>;
                })}
              </div>
            </Modal>
          </div>
          <div className="divider" />
          <div className="col">
            <div className="h5">
              High: {cel ? max_temp + "°C" : convertCelToFah(max_temp) + "°F"}
            </div>
            <div className="h5">Low: {cel ? min_temp + "°C" : convertCelToFah(min_temp) + "°F"}</div>
            <div>
              <div>Wind Speed: {wind_speed ? wind_speed : "N/A"}</div>
              <div>Wind Direction: {wind_direction ? `${wind_direction} kph` : "N/A"}</div>
            </div>
          </div>

          <div className="col text-right">
            <div className="h5">
              {/* <IoSunnyOutline /> */}
              {atmo_opacity}
            </div>
            <div>
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
      <div
        data-testid="image-section"
        className="image-section d-flex align-items-center flex-column"
      >
        <div className="section-title image-title text-white">
          IMAGES CAPTURED BY CURIOSITY ROVER
        </div>
        <Carousel>
          {images.map((image, index) => {
            return (
              <Carousel.Item key={index} interval={2000}>
                <img
                  className="d-block w-100"
                  src={image.img_src}
                  alt={`Mars captured with ${cameras[index]}`}
                />
                <Carousel.Caption>
                  <div className="bg-dark">{cameras[index]}</div>
                </Carousel.Caption>
              </Carousel.Item>
            );
          })}
        </Carousel>
        <div className="h5 mt-2">({images[0].earth_date})</div>
      </div>
    );
  };
  const renderNews = () => {
    return (
      <div className="news-section">
        {news.map((article, index) => {
          let date = article.publishedAt.split("T")[0];
          const { title, description, url, urlToImage } = article;
          return (
            <div key={index} className="news-container d-flex flex-row">
              <a href={url}>
                <img className="news-images" src={urlToImage} alt={`Article ${index}`} />
              </a>
              <div>
                <div className="font-weight-bold">{title}</div>
                <div className="font-italic">{date}</div>
                <div>{description}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div data-testid="container">
      <div className={loading ? "h3 text-center m-5" : undefined}>{loading && "Loading..."}</div>
      {weather && renderWeather()}
      {imagesFetched && !modalIsOpen && renderImages()}
      {news && renderNews()}
    </div>
  );
}
