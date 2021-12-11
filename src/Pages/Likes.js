import React, { useEffect, useState } from "react";
import { IoHeart } from "react-icons/io5";

export default function Likes() {
  const likesData = JSON.parse(window.localStorage.getItem("likes"));
  const [noImages, setNoImages] = useState(true);
  const [likedImages, setLikedImages] = useState(likesData);
  const [lastDeleted, setLastDeleted] = useState([]);

  useEffect(() => {
    Object.keys(likesData).length !== 0 ? setNoImages(false) : setNoImages(true);
  }, [likedImages]);

  const unlike = (index) => {
    const deleted = likedImages[index];
    setLastDeleted([deleted]);
    const newLikedImages = likedImages.slice(0, index).concat(likedImages.slice(index + 1));
    setLikedImages([...newLikedImages]);
    window.localStorage.setItem("likes", JSON.stringify(newLikedImages));
    removeLastDeleted();
  };

  const removeLastDeleted = () => {
    setTimeout(() => {
      setLastDeleted([]);
    }, 3000);
  };

  const undo = () => {
    const newLikedImages = likedImages.concat(lastDeleted);
    setLikedImages([...newLikedImages]);
    setLastDeleted([]);
    window.localStorage.setItem("likes", JSON.stringify(newLikedImages));
  };

  const renderLikedImages = () => {
    return (
      <section>
        {/* <section className="likedImages-section"> */}
        {likedImages.map((likedImage, index) => {
          const { rover, img_src, camera, earth_date } = likedImage;
          return (
            <figure key={index} className="likedImageBackground">
              <img className="slide" src={img_src} alt={`Mars captured with ${camera.full_name}`} />
              <figcaption className="mt-3">
                <p>{rover.name} Rover</p>
                <p>{camera.full_name}</p>
                <p>{earth_date}</p>
                <button className="heartBtn" aria-label="Unlike image" onClick={() => unlike(index)}>
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
      <div>{noImages ? renderMessage() : renderLikedImages()}</div>
      <button
        className={lastDeleted.length > 0 ? "btn btn-dark undoBtn active" : "btn btn-dark undoBtn"}
        aria-label="Undo deleted image"
        onClick={undo}
      >
        Unliked! Click to Undo
      </button>
    </div>
  );
}
