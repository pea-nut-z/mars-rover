import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoInformationCircleSharp, IoHeartOutline, IoHeart } from "react-icons/io5";

import {
  allCameras,
  camerasAvailable,
  allCamerasAbb,
  getTodayDate,
  getFilteredImgUrl,
  filterLikes,
  styleHeart,
} from "./helper";

export default function Search() {
  const [year, month, day] = getTodayDate();
  const [selectedRover, setSelectedRover] = useState("curiosity");
  const [selectedCamera, setSelectedCamera] = useState(allCamerasAbb[1]);
  const [selectedDate, setSelectedDate] = useState(`${year}-${month}-${day}`);
  const [camerasToSelect, setcamerasToSelect] = useState();
  const [images, setImages] = useState([]);
  const [likedImages, setLikedImages] = useState();
  const [imagesFetched, setImagesFetched] = useState(false);

  useEffect(() => {
    setcamerasToSelect(selectedRover);
  }, [selectedRover]);

  useEffect(() => {
    if (process.env.REACT_APP_TEST !== "TRUE") {
      const likesData = JSON.parse(window.localStorage.getItem("likes"));
      setLikedImages(likesData || {});
    }
  }, []);

  // useEffect(() => {
  //   if (process.env.REACT_APP_TEST !== "TRUE") {
  //     window.localStorage.setItem("likes", JSON.stringify(likedImages));
  //   }
  // }, [likedImages]);

  const getFilteredImgs = () => {
    const filteredImgs = getFilteredImgUrl(selectedRover, selectedCamera, selectedDate);
    return axios
      .get(filteredImgs)
      .then((res) => {
        setImages(res.data.photos);
        setImagesFetched(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleLike = (likedImages, imageId, roverName, imgUrl, cameraName, earthDate) => {
    const newLikes = filterLikes(likedImages, imageId, roverName, imgUrl, cameraName, earthDate);
    setLikedImages(newLikes);
  };

  const renderFilteredImages = () => {
    return (
      <section>
        {images.map((image, index) => {
          const imageId = image.id;
          const roverName = image.rover.name;
          const imgUrl = image.img_src;
          const cameraName = image.camera.full_name;
          const earthDate = image.earth_date;
          return (
            <figure key={index} className="likedImageBackground float-left">
              <img className="slide" src={imgUrl} alt={`Mars captured with ${cameraName}`} />
              <figcaption className="mt-3">
                <p>{roverName} Rover</p>
                <p>{cameraName}</p>
                <p>{earthDate}</p>
                <button
                  className="heartBtn h2"
                  aria-label="Toggle like"
                  onClick={() =>
                    toggleLike(likedImages, imageId, roverName, imgUrl, cameraName, earthDate)
                  }
                >
                  {likedImages.hasOwnProperty(imageId) ? (
                    <IoHeart style={styleHeart} />
                  ) : (
                    <IoHeartOutline style={styleHeart} />
                  )}
                </button>
              </figcaption>
            </figure>
          );
        })}
      </section>
    );
  };

  return (
    <div>
      <div className="filters">
        <select
          className="filter"
          defaultValue="curiosity"
          onChange={(e) => {
            setSelectedRover(e.target.value);
          }}
        >
          <option value="curiosity">Curiosity</option>
          <option value="opportunity">Opportunity</option>
          <option value="spirit">Spirit</option>
        </select>

        <select
          className="filter"
          onChange={(e) => {
            setSelectedCamera(e.target.value);
          }}
        >
          {selectedRover &&
            camerasAvailable[selectedRover].map((index) => {
              const camera = allCameras[index];
              return (
                <option key={index} value={allCamerasAbb[index]}>
                  {camera}
                </option>
              );
            })}
        </select>
        <input
          className="filter"
          type="date"
          id="start"
          name="start"
          defaultValue={`${year}-${month}-${day > 9 ? day : "0" + day}`}
          onChange={(e) => {
            setSelectedDate(e.target.value);
          }}
        />
        <button aria-label="search images" onClick={getFilteredImgs}>
          Search
        </button>
      </div>
      {imagesFetched && renderFilteredImages()}
    </div>
  );
}
