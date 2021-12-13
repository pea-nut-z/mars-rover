import React, { useEffect, useState } from "react";
import * as ioIcons from "react-icons/io5";
import ImageCard from "../components/ImageCard";

export default function Likes({ likes }) {
  const [noImages, setNoImages] = useState(true);
  const [likedImages, setLikedImages] = useState(likesData);
  const [lastDeleted, setLastDeleted] = useState([]);

  useEffect(() => {
    Object.keys(likesData).length !== 0 ? setNoImages(false) : setNoImages(true);
  }, [likedImages]);

  const unlike = (image) => {
    setLastDeleted([image]);
    const newLikes = filterLikes(likedImages, image);
    setLikedImages(newLikes);
    window.localStorage.setItem("likes", JSON.stringify(newLikes));
    removeBtn();
  };

  const removeBtn = () => {
    setTimeout(() => {
      setLastDeleted([]);
    }, 2000);
  };

  const undo = () => {
    const newlikes = likedImages.concat(lastDeleted);
    setLikedImages(newlikes);
    setLastDeleted([]);
    window.localStorage.setItem("likes", JSON.stringify(newlikes));
  };

  const renderLikedImages = () => {
    return (
      <section>
        {/* <section className="likedImages-section"> */}
        {likedImages.map((image, index) => {
          const { rover, img_src, camera, earth_date } = image;
          return (
            <figure key={index} className="imageCardBackground">
              <img className="slide" src={img_src} alt={`Mars captured with ${camera.full_name}`} />
              <figcaption className="mt-3">
                <p>{rover.name} Rover</p>
                <p>{camera.full_name}</p>
                <p>{earth_date}</p>
                <button className="heartBtn" aria-label="Unlike image" onClick={() => unlike(image)}>
                  <ioIcons.IoHeart className="heartBtn" />
                </button>
              </figcaption>
            </figure>
          );
        })}
      </section>
    );
  };

  // const renderMessage = () => {
  //   return <h3 className="text-center m-5">You haven't liked any images!</h3>;
  // };

  return (
    <div className="vw-100 vh-100 d-flex flex-column">
      {/* <div>{noImages ? renderMessage() : renderLikedImages()}</div> */}
      {/* <button
        className={`btn btn-dark border border-light undoBtn ${
          lastDeleted.length > 0 ? "active" : ""
        }`}
        aria-label="Undo deleted image"
        onClick={undo}
      >
        Unliked! Click to Undo
      </button> */}
      <ImageCard />
    </div>
  );
}
