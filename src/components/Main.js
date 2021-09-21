import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
// import "./App.css";
import Carousel from "react-bootstrap/Carousel";
import { IoInformationCircleSharp, IoHeartOutline, IoHeart } from "react-icons/io5";
import Modal from "react-modal";
import {
  weatherUrl,
  getFtImgUrl,
  getOtherImgUrl,
  newsUrl,
  getTodayDate,
  getPreviousMonthDate,
  convertCelToFah,
  cameraAbbrs,
} from "../helper";
import info from "../info";

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
  const likesData = JSON.parse(window.localStorage.getItem("likes"));
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [cameras, setCameras] = useState();
  const [weather, setWeather] = useState();
  const [news, setNews] = useState();
  const [cel, setCel] = useState(true);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [likedImages, setLikedImages] = useState(likesData || []);
  const [imagesFetched, setImagesFetched] = useState(false);

  useEffect(() => {
    if (process.env.REACT_APP_TEST !== "TRUE") Modal.setAppElement("#root");
    const todayDate = getTodayDate();
    getPhotos(todayDate);
    getWeather();
    getNews();
  }, []);

  useEffect(() => {
    window.localStorage.setItem("likes", JSON.stringify(likedImages));
  }, [likedImages]);

  const toggleUnit = () => {
    setCel(!cel);
  };

  const toggleLike = (imageId) => {
    if (likedImages.includes(imageId)) {
      const removedLikeArray = likedImages.filter((image) => image !== imageId);
      setLikedImages([...removedLikeArray]);
    } else {
      setLikedImages([...likedImages, imageId]);
    }
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
      <section data-testid="weather-section" className="weather-section">
        <div className="d-flex justify-content-between">
          <h1 className="section-title">LATEST WEATHER AT ELYSIUM PLANTITIA</h1>
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
        </div>

        <div className="weather-container d-flex">
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
              <IoInformationCircleSharp />
            </button>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={modalStyles}
              ariaHideApp={process.env.REACT_APP_TEST === "TRUE" ? false : undefined}
            >
              <div data-testid="modal">
                <button data-testid="closeModalBtn" className="closeModalBtn" onClick={closeModal}>
                  Close
                </button>
                {info.map((item, index) => {
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
              High: {cel ? max_temp + "°C" : convertCelToFah(max_temp) + "°F"}
            </p>
            <p data-testid="temperature" className="h5">
              Low: {cel ? min_temp + "°C" : convertCelToFah(min_temp) + "°F"}
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

  const renderImages = () => {
    return (
      <section className="image-section d-flex align-items-center flex-column">
        <div className="w-100">
          <button className="likesBtn" onClick={() => history.push("/likes")}>
            Likes
          </button>
          <button className="moreImagesBtn">More Images</button>
        </div>
        <h1 className="section-title image-title text-white">
          LATEST IMAGES CAPTURED BY CURIOSITY ROVER
        </h1>
        <Carousel>
          {images.map((image, index) => {
            return (
              <Carousel.Item key={index} interval={2000}>
                <figure>
                  <img
                    data-testid="image"
                    className="overlap overlap-2 mw-100 mh-100"
                    src={image.img_src}
                    alt={`Mars captured with ${cameras[index]}`}
                  />
                  <Carousel.Caption>
                    <button
                      className="heartBtn h2"
                      aria-label="Toggle like"
                      onClick={() => toggleLike(image.id)}
                    >
                      {likedImages.includes(image.id) ? <IoHeart /> : <IoHeartOutline />}
                    </button>
                    <figcaption className="bg-dark mb-3">{cameras[index]}</figcaption>
                  </Carousel.Caption>
                </figure>
              </Carousel.Item>
            );
          })}
        </Carousel>
        <time data-testid="image-date" className="h5 mt-3" dateTime={images[0].earth_date}>
          ({images[0].earth_date})
        </time>
      </section>
    );
  };

  const renderNews = () => {
    const today = new Date();
    const currentMonth = today.toLocaleString("default", { month: "long" }).toUpperCase();
    return (
      <section className="news-section">
        <h1 className="section-title image-title text-white">{currentMonth} NEWS</h1>
        {news.map((article, index) => {
          let date = article.publishedAt.split("T")[0];
          const { title, description, url, urlToImage } = article;
          return (
            <article key={index} className="news-container d-flex flex-row">
              <a href={url}>
                <img className="news-images" src={urlToImage} alt={`Article ${index}`} />
              </a>
              <div>
                <h6 className="font-weight-bold">{title}</h6>
                <time className="font-italic" dateTime={date}>
                  {date}
                </time>
                <p>{description}</p>
              </div>
            </article>
          );
        })}
      </section>
    );
  };
  return (
    <main data-testid="container">
      <p className={loading ? "h3 text-center m-5" : undefined}>{loading && "Loading..."}</p>
      {weather && renderWeather()}
      {imagesFetched && !modalIsOpen && renderImages()}
      {news && renderNews()}
    </main>
  );
}
