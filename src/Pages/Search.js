import React, { useState } from "react";
import axios from "axios";
import * as helper from "../helper";
import ImageCards from "../components/ImageCards";

export default function Search() {
  const [year, month, day] = helper.getTodayDate();
  const [selectedRover, setSelectedRover] = useState();
  const [selectedCamera, setSelectedCamera] = useState();
  const [selectedDate, setSelectedDate] = useState(
    `${year}-${month > 9 ? month : "0" + month}-${day > 9 ? day : "0" + day}`
  );
  const [images, setImages] = useState([]);
  const [imagesFetched, setImagesFetched] = useState(false);
  const [showMsg, setShowMsg] = useState(false);

  const getFilteredImgs = () => {
    const selectedCameraAbb = helper.allCamerasAbb[selectedCamera];
    const filteredImgs = helper.getFilteredImgUrl(selectedRover, selectedCameraAbb, selectedDate);
    return axios
      .get(filteredImgs)
      .then((res) => {
        setImages(res.data.photos);
        setImagesFetched(true);
      })
      .catch((error) => {
        console.error(error);
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
    <div data-testid="search-container" className="search-container">
      <div className="search-text-container">
        <h2>Search For Images</h2>
        <p>
          *Note - NASA does not have images for every date. Try selecting Curiosity Rover / Front
          Camera / 2022-09-20
        </p>
      </div>
      <form className="filters">
        <select
          data-testid="rover-dropdown"
          className="filter"
          aria-label="Select rover"
          onChange={(e) => {
            setSelectedRover(e.target.value);
          }}
        >
          <option hidden>Select Rover</option>
          <option data-testid="curiosity" value="curiosity">
            Curiosity
          </option>
          <option value="opportunity">Opportunity</option>
          <option value="spirit">Spirit</option>
        </select>

        <select
          data-testid="camera-dropdown"
          className="filter"
          aria-label="Select camera"
          defaultValue="Select camera"
          onChange={(e) => {
            setSelectedCamera(e.target.value);
          }}
          disabled={!selectedRover && true}
        >
          <option hidden>Select Camera</option>
          {helper.allCameras.map((camera, index) => {
            const camerasAvailable = helper.getCamerasAvailable[selectedRover] || [];
            const disable = !camerasAvailable.includes(index + 1) && true;
            return (
              <option
                data-testid={index === 0 ? "front-camera" : "camera-option"}
                key={index}
                value={index}
                disabled={disable}
              >
                {camera}
              </option>
            );
          })}
        </select>

        <input
          data-testid="date-picker"
          className="filter"
          aria-label="Select date"
          type="date"
          id="start"
          name="start"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
          }}
        />
        <button
          data-testid="search-button"
          type="button"
          className="search-btn btn btn-dark"
          aria-label="search images"
          onClick={checkFields}
        >
          Search
        </button>
      </form>
      <div
        data-testid="message-box"
        className={`btn btn-dark border border-light popup-box ${showMsg ? "active" : ""}`}
        aria-label="Empty field alert"
      >
        {!selectedRover ? "Select a rover!" : "Select a camera!"}
      </div>
      <div className="image-gallery">{imagesFetched && <ImageCards images={images} />}</div>
    </div>
  );
}
