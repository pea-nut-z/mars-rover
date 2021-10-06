import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  allCameras,
  camerasAvailable,
  allCamerasAbb,
  getTodayDate,
  getFilteredImgUrl,
} from "../helper";

export default function MoreImages() {
  const [year, month, day] = getTodayDate();
  const [selectedRover, setSelectedRover] = useState("curiosity");
  const [selectedCamera, setSelectedCamera] = useState(allCamerasAbb[0]);
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
      const likedImagesStored = JSON.parse(window.localStorage.getItem("likes"));
      setLikedImages(likedImagesStored || {});
    }
  }, []);

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

  const renderFilteredImages = () => {
    return (
      <section>
        {/* {console.log({ images })} */}
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
                {/* <button className="heartBtn h2" aria-label="unlike" onClick={() => unlike(imageId)}>
                <IoHeart style={{ stroke: "white", strokeWidth: "10" }} />
              </button> */}
              </figcaption>
            </figure>
          );
        })}
      </section>
    );
  };

  return (
    <div>
      <select
        className="rovers"
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
        className="cameras"
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

      {imagesFetched && renderFilteredImages()}
    </div>
  );
}
