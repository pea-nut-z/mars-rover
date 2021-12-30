import React, { useState } from "react";
import axios from "axios";
import * as func from "../helper";
import ImageCard from "../components/ImageCard";

export default function Search() {
  const [year, month, day] = func.getTodayDate();
  const [selectedRover, setSelectedRover] = useState();
  const [selectedCamera, setSelectedCamera] = useState();
  const [selectedDate, setSelectedDate] = useState(`${year}-${month}-${day}`);
  const [images, setImages] = useState([]);
  const [imagesFetched, setImagesFetched] = useState(false);
  const [showMsg, setShowMsg] = useState(false);

  const getFilteredImgs = () => {
    const selectedCameraAbb = func.getAllCamerasAbb[selectedCamera];
    const filteredImgs = func.getFilteredImgUrl(selectedRover, selectedCameraAbb, selectedDate);
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

  const checkFields = () => {
    setShowMsg(false);
    if (selectedRover && selectedCamera) {
      getFilteredImgs();
    } else {
      setShowMsg(true);
    }
  };

  return (
    <div className="search-container">
      <form className="filters">
        <select
          className="filter"
          aria-label="Select rover"
          onChange={(e) => {
            setSelectedRover(e.target.value);
          }}
        >
          <option hidden>Select Rover</option>
          <option value="curiosity">Curiosity</option>
          <option value="opportunity">Opportunity</option>
          <option value="spirit">Spirit</option>
        </select>

        <select
          className="filter"
          aria-label="Select camera"
          defaultValue="Select camera"
          onChange={(e) => {
            setSelectedCamera(e.target.value);
          }}
          disabled={!selectedRover && true}
        >
          <option hidden>Select Camera</option>
          {func.getAllCameras.map((camera, index) => {
            const available = func.getCamerasAvailable[selectedRover] || [];
            const disable = !available.includes(index + 1) && true;
            return (
              <option key={index} value={index} disabled={disable}>
                {camera}
              </option>
            );
          })}
        </select>

        <input
          className="filter"
          aria-label="Select date"
          type="date"
          id="start"
          name="start"
          defaultValue={`${year}-${month}-${day > 9 ? day : "0" + day}`}
          onChange={(e) => {
            setSelectedDate(e.target.value);
          }}
        />
        <button
          type="button"
          className="searchBtn btn btn-dark"
          aria-label="search images"
          onClick={checkFields}
        >
          Search
        </button>
      </form>
      <div
        className={`btn btn-dark border border-light popupBox ${showMsg ? "active" : ""}`}
        aria-label="Empty field alert"
      >
        {!selectedRover ? "Select a rover!" : "Select a camera!"}
      </div>
      <div className="image-gallery">{imagesFetched && <ImageCard images={images} />}</div>
    </div>
  );
}
