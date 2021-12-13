import React, { useState, useEffect } from "react";
import * as ioIcons from "react-icons/io5";
import * as func from "../helper";

export default function ImageCard({ images }) {
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    const likesData = JSON.parse(window.localStorage.getItem("likes"));
    setLikes(likesData || []);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("likes", JSON.stringify(likes));
  }, [likes]);

  const toggleLike = (image) => {
    const newLikes = func.filterLikes(likes, image);
    setLikes(newLikes);
  };

  const renderImages = () => {
    return images.map((image, index) => {
      const { rover, img_src, camera, earth_date } = image;
      return (
        <figure key={index} className="imageCardBackground">
          <img className="slide" src={img_src} alt={`Mars captured with ${camera.full_name}`} />
          <figcaption className="mt-3">
            <p>{rover.name} Rover</p>
            <p>{camera.full_name}</p>
            <p>{earth_date}</p>
            <button className="heartBtn" aria-label="Toggle like" onClick={() => toggleLike(image)}>
              {likes.some((like) => like.id === image.id) ? (
                <ioIcons.IoHeart className="heartBtn" />
              ) : (
                <ioIcons.IoHeartOutline className="heartBtn" />
              )}
            </button>
          </figcaption>
        </figure>
      );
    });
  };

  const renderMessage = () => {
    return <h3 className="text-center m-5">You haven't liked any images!</h3>;
  };

  return <div>{images.length > 0 ? renderImages() : renderMessage()}</div>;
}
