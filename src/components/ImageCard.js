import React, { useState, useEffect } from "react";
import * as ioIcons from "react-icons/io5";
import * as helper from "../helper";
import Carousel from "react-bootstrap/Carousel";

export default function ImageCard({ images, renderLikesOnly, renderSlideOnly }) {
  const [likes, setLikes] = useState([]);
  const [lastDeleted, setLastDeleted] = useState([]);

  useEffect(() => {
    const likesData = JSON.parse(window.localStorage.getItem("likes"));
    setLikes(likesData || []);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("likes", JSON.stringify(likes));
  }, [likes]);

  const toggleLike = (image, status) => {
    status === "unlike" && setLastDeleted([image]);
    const newLikes = helper.filterLikes(likes, image, status);
    setLikes(newLikes);
    window.localStorage.setItem("likes", JSON.stringify(newLikes));
    removeBtn();
  };

  const removeBtn = () => {
    setTimeout(() => {
      setLastDeleted([]);
    }, 5000);
  };

  const undo = () => {
    const newlikes = likes.concat(lastDeleted);
    setLikes(newlikes);
    setLastDeleted([]);
    window.localStorage.setItem("likes", JSON.stringify(newlikes));
  };

  const renderImages = () => {
    return images.map((image, index) => {
      const { rover, img_src, camera, earth_date } = image;
      return (
        <figure key={index} className="imageCardBackground">
          <a target={"_blank"} rel={"noopener noreferrer"} href={img_src}>
            <img
              data-testid="image"
              className="slide"
              src={img_src}
              alt={`Mars captured with ${camera.full_name}`}
            />
          </a>
          <figcaption className="mt-3">
            <p>{rover.name} Rover</p>
            <p>{camera.full_name}</p>
            <p>{earth_date}</p>
            <button className="heartBtn" aria-label="Toggle like">
              {likes.some((like) => like.id === image.id) ? (
                <ioIcons.IoHeart
                  data-testid="unlike-button"
                  className="heartBtn"
                  onClick={() => toggleLike(image, "unlike")}
                />
              ) : (
                <ioIcons.IoHeartOutline
                  data-testid="like-button"
                  className="heartBtn"
                  onClick={() => toggleLike(image, "like")}
                />
              )}
            </button>
          </figcaption>
        </figure>
      );
    });
  };

  const renderLikes = () => {
    return likes.map((image, index) => {
      const { rover, img_src, camera, earth_date } = image;
      return (
        <figure key={index} className="imageCardBackground">
          <a target={"_blank"} rel={"noopener noreferrer"} href={img_src}>
            <img
              data-testid="image"
              className="slide"
              src={img_src}
              alt={`Mars captured with ${camera.full_name}`}
            />
          </a>
          <figcaption className="mt-3">
            <p>{rover.name} Rover</p>
            <p>{camera.full_name}</p>
            <p>{earth_date}</p>
            <button
              data-testid="unlike-button"
              className="heartBtn"
              aria-label="unlike"
              onClick={() => toggleLike(image, "unlike")}
            >
              <ioIcons.IoHeart className="heartBtn" />
            </button>
          </figcaption>
        </figure>
      );
    });
  };
  const renderSlide = () => {
    return (
      <Carousel style={{ zIndex: 2 }}>
        {images.map((image, index) => {
          const camera = image.camera.full_name;
          return (
            <Carousel.Item key={index} interval={2000}>
              <figure>
                <a target={"_blank"} rel={"noopener noreferrer"} href={image.img_src}>
                  <img
                    data-testid="image"
                    className="w-100 h-100"
                    src={image.img_src}
                    alt={`Mars captured by ${image.rover.name} rover's ${camera}`}
                  />
                </a>

                <Carousel.Caption>
                  <button className="heartBtn" aria-label="Toggle like">
                    {likes.some((like) => like.id === image.id) ? (
                      <ioIcons.IoHeart
                        data-testid="unlike-button"
                        onClick={() => toggleLike(image, "unlike")}
                      />
                    ) : (
                      <ioIcons.IoHeartOutline
                        data-testid="like-button"
                        onClick={() => toggleLike(image, "like")}
                      />
                    )}
                  </button>
                  <figcaption className="slide-caption">{camera}</figcaption>
                </Carousel.Caption>
              </figure>
            </Carousel.Item>
          );
        })}
      </Carousel>
    );
  };

  const renderMessage = () => {
    return (
      <h3 data-testid="message-box" className="text-center m-5">
        Oops, no images to show.
      </h3>
    );
  };

  return (
    <div>
      {renderLikesOnly && likes && likes.length > 0
        ? renderLikes()
        : renderSlideOnly
        ? renderSlide()
        : images && images.length > 0
        ? renderImages()
        : renderMessage()}
      <button
        data-testid="undo-button"
        className={`btn btn-dark border border-light popupBox ${
          lastDeleted.length > 0 ? "active" : ""
        }`}
        aria-label="Undo deleted image"
        onClick={undo}
      >
        Click to Undo
      </button>
    </div>
  );
}
