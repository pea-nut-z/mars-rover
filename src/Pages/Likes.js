import React from "react";
import ImageCards from "../components/ImageCards";

export default function Likes() {
  return (
    <div className="image-gallery">
      <ImageCards renderLikesOnly={"true"} />
    </div>
  );
}
