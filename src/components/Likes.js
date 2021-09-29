import React, { useEffect, useState } from "react";
import { IoHeart } from "react-icons/io5";

export default function Likes() {
  const likedImagesStored = JSON.parse(window.localStorage.getItem("likes"));
  const [likedImages, setLikedImages] = useState(likedImagesStored);
  const [noImages, setNoImages] = useState(true);

  useEffect(() => {
    Object.keys(likedImagesStored).length !== 0 ? setNoImages(false) : setNoImages(true);
  }, [likedImages]);

  const unlike = (imageId) => {
    const filtered = Object.keys(likedImages)
      .filter((id) => id != imageId)
      .reduce((obj, key) => {
        obj[key] = likedImages[key];
        return obj;
      }, {});
    setLikedImages({ ...filtered });
    window.localStorage.setItem("likes", JSON.stringify(filtered));
  };

  const renderLikedImages = () => {
    return (
      <section className="likedImages-section">
        {Object.keys(likedImages).map((imageId, index) => {
          const { roverName, imgUrl, cameraName, earthDate } = likedImages[imageId];
          return (
            <figure key={index} className="likedImageBackground float-left">
              <img className="slide" src={imgUrl} alt={`Mars captured with ${cameraName}`} />
              <figcaption className="mt-3">
                <p>{roverName} Rover</p>
                <p>{cameraName}</p>
                <p>{earthDate}</p>
                <button className="heartBtn h2" aria-label="unlike" onClick={() => unlike(imageId)}>
                  <IoHeart style={{ stroke: "white", strokeWidth: "10" }} />
                </button>
              </figcaption>
            </figure>
          );
        })}
      </section>
    );
  };

  const renderMessage = () => {
    return <h3 className="text-center m-5">You haven't liked any images!</h3>;
  };

  return (
    <div className="d-flex flex-column">
      <button className="blackBtn position-fixed mt-4">Go Back</button>
      <div className="mt-4" />
      <div>{noImages ? renderMessage() : renderLikedImages()}</div>
    </div>
  );
}
