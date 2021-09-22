import React, { useEffect, useState } from "react";

export default function Likes() {
  const likedImages = JSON.parse(window.localStorage.getItem("likes"));
  const renderLikedImages = () => {
    return (
      <section className="likedImages-section">
        {Object.keys(likedImages).map((imageId) => {
          const { roverName, imgUrl, cameraName, earthDate } = likedImages[imageId];
          return (
            <figure className="likeImageBackground float-left">
              <img className="slide" src={imgUrl} alt={`Mars captured with ${cameraName}`} />
              <figcaption>
                <p>{roverName} Rover</p>
                <p>{cameraName}</p>
                <p>{earthDate}</p>
              </figcaption>
            </figure>
          );
        })}
      </section>
    );
  };
  return <div>{likedImages.length !== 0 && renderLikedImages()}</div>;
}
