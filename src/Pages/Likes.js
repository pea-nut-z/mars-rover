import React from "react";
import ImageCard from "../components/ImageCard";

export default function Likes() {
  return (
    <div className="image-gallery">
      <ImageCard renderLikesOnly={"true"} />
    </div>
  );
}
