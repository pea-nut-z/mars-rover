import React, { useEffect, useState } from "react";
import axios from "axios";
import * as ioIcons from "react-icons/io5";
import Modal from "react-modal";
import * as func from "../helper";
import infoData from "./infoData";
import ImageCard from "../components/ImageCard";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    color: "black",
    transform: "translate(-50%, -50%)",
    maxHeight: "100vh",
  },
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [cameras, setCameras] = useState();
  const [weather, setWeather] = useState();
  const [news, setNews] = useState();
  const [cel, setCel] = useState(true);
  const [modalIsOpen, setIsOpen] = useState(false);
  // const [imagesFetched, setImagesFetched] = useState(false);

  useEffect(() => {
    if (process.env.REACT_APP_TEST !== "TRUE") Modal.setAppElement("#root");
    const todayDate = func.getTodayDate();
    getPhotos(todayDate);
    getWeather();
    getNews();
  }, []);

  // useEffect(() => {
  //   if (images.length !== 0) {
  //     setImagesFetched(true);
  //     setLoading(false);
  //   }
  // }, [images]);

  const toggleUnit = () => {
    setCel(!cel);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const getPhotos = (dateArray) => {
    let [year, month, day] = dateArray;
    let selectedImages = [];
    let selectedCameras = [];
    const frontCameraImg = func.getFtImgUrl(dateArray);
    return axios
      .get(frontCameraImg)
      .then((res) => {
        const imagesFetched = res.data.photos;
        if (imagesFetched.length === 0) {
          if (day === 1) {
            const previousMonthDate = func.getPreviousMonthDate(year, month);
            getPhotos(previousMonthDate);
          } else {
            getPhotos([year, month, day - 1]);
          }
        } else {
          func.getCuriosityCamerasAbb.forEach((cameraAbbr) => {
            const otherImg = func.getImgUrl(cameraAbbr, dateArray);
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
      .get(func.getWeatherUrl)
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
      .get(func.getNewsUrl)
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
      <section data-testid="weather-section" className="section weather-section">
        <h1 className="header">LATEST WEATHER AT ELYSIUM PLANTITIA</h1>
        <div className="unit">
          <label htmlFor="cel" className="label h5">
            °C
          </label>
          <input type="radio" id="cel" name="unit" checked={cel && "checked"} readOnly />
          <button
            data-testid="unit-toggle"
            className="unit-toggle"
            aria-label="Toggle unit"
            onClick={toggleUnit}
          ></button>
          <label htmlFor="fah" className="label h5">
            °F
          </label>
          <input type="radio" id="fah" name="unit" checked={!cel && "checked"} readOnly />
        </div>

        <div className="weather-container">
          <div className="text-right">
            <p className="sol display-4">Sol {sol}</p>
            <p className="h2 text-muted">
              {earthMonth} {earthDay}
            </p>
            <button
              data-testid="info"
              className="openModalBtn h2 text-primary"
              aria-label="Open for more information"
              onClick={openModal}
            >
              <ioIcons.IoInformationCircleSharp />
            </button>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={modalStyles}
              ariaHideApp={process.env.REACT_APP_TEST === "TRUE" ? false : undefined}
            >
              <div data-testid="modal">
                <div className="filler" />
                <button data-testid="closeModalBtn" className="closeModalBtn" onClick={closeModal}>
                  Close
                </button>
                {infoData.map((item, index) => {
                  const details = item.split(":");
                  return (
                    <p key={index} className="mt-3">
                      <span className="font-weight-bold">{details[0]}</span>: {details[1]}
                    </p>
                  );
                })}
              </div>
            </Modal>
          </div>
          <div className="divider" />
          <div className="col">
            <p data-testid="temperature" className="h5 mt-3">
              High: {cel ? max_temp + "°C" : func.convertCelToFah(max_temp) + "°F"}
            </p>
            <p data-testid="temperature" className="h5">
              Low: {cel ? min_temp + "°C" : func.convertCelToFah(min_temp) + "°F"}
            </p>
            <p data-testid="wind">Wind Speed: {wind_speed ? wind_speed : "N/A"}</p>
            <p data-testid="wind">
              Wind Direction: {wind_direction ? `${wind_direction} kph` : "N/A"}
            </p>
          </div>
          <div className="col text-right">
            <p className="h5 mt-3">{atmo_opacity}</p>
            <p>{marsSeason}</p>
            <p> UV Index: {local_uv_irradiance_index}</p>
            <p>Sunrise: {sunrise}</p>
            <p>Sunset: {sunset}</p>
          </div>
        </div>
      </section>
    );
  };

  const renderNews = () => {
    const today = new Date();
    const currentMonth = today.toLocaleString("default", { month: "long" }).toUpperCase();
    return (
      <section className="section news-section">
        <h1 className="header">{currentMonth} NEWS</h1>
        {news.map((article, index) => {
          let date = article.publishedAt.split("T")[0];
          const { title, description, url, urlToImage } = article;
          return (
            <a key={index} className="news-link" href={url}>
              <article className="news-container">
                <img className="news-image" src={urlToImage} alt={`Article ${index}`} />
                <div className="news-desc">
                  <h6 className="font-weight-bold">{title}</h6>
                  <time className="font-italic" dateTime={date}>
                    {date}
                  </time>
                  <p>{description}</p>
                </div>
              </article>
            </a>
          );
        })}
      </section>
    );
  };

  const renderImageSlide = () => {
    return (
      <section className="section image-section">
        <h1 className="header">
          <p>LATEST IMAGES CAPTURED BY</p>
          <p>CURIOSITY ROVER</p>
        </h1>
        <ImageCard images={images} renderSlideOnly="true" />
        <time data-testid="image-date" className="h5 mt-3" dateTime={images[0].earth_date}>
          ({images[0].earth_date})
        </time>
      </section>
    );
  };

  return (
    <main data-testid="home-container" className="home-container">
      <p className={loading ? "h3 text-center m-5" : undefined}>{loading && "Loading..."}</p>
      <div className="home-left">
        {weather && renderWeather()}
        {images.length !== 0 && !modalIsOpen && renderImageSlide()}
      </div>
      <div className="home-right">{news && renderNews()}</div>
    </main>
  );
}
