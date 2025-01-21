import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Slider from "react-slick";
import "../Styles/lookbook.css";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

function importAll(r) {
  let images = {};
  r.keys().forEach((item) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

const slider_images = importAll(
  require.context("../assets/images/closeups", false, /\.jpg$/)
);

const lookbook_images = importAll(require.context('../assets/images/lookbook', false, /\.jpg$/));




const Lookbook = () => {

  var settings = {
    dots: true,
    infinite: true,
    speed: 100,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0,
        },
      },
      {
        breakpoint: 300,
        settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 0,
            dots: false,
        },
      },
    ],
  };

  return (
    <div className="container">
      {/* <Navbar /> */}
      <div className="lookbook">
        <div className="lookbook-header">
          <h1>Of Your Holiday Wardrobe</h1>
          <h2>January, 2025</h2>
        </div>
        <div className="slider-container">
          <Slider {...settings}>
            <div>
              <img
                src={slider_images["c1.jpg"]}
                alt="Model 1"
                className="carousel-image"
              />
            </div>
            <div>
              <img
                src={slider_images["c2.jpg"]}
                alt="Model 2"
                className="carousel-image"
              />
            </div>
            <div>
              <img
                src={slider_images["c3.jpg"]}
                alt="Model 3"
                className="carousel-image"
              />
            </div>
            <div>
              <img
                src={slider_images["c4.jpg"]}
                alt="Model 4"
                className="carousel-image"
              />
            </div>
            <div>
              <img
                src={slider_images["c5.jpg"]}
                alt="Model 5"
                className="carousel-image"
              />
            </div>
            <div>
              <img
                src={slider_images["c6.jpg"]}
                alt="Model 6"
                className="carousel-image"
              />
            </div>
            <div>
              <img
                src={slider_images["c7.jpg"]}
                alt="Model 7"
                className="carousel-image"
              />
            </div>
            <div>
              <img
                src={slider_images["c8.jpg"]}
                alt="Model 8"
                className="carousel-image"
              />
            </div>
            <div>
              <img
                src={slider_images["c9.jpg"]}
                alt="Model 9"
                className="carousel-image"
              />
            </div>
            <div>
              <img
                src={slider_images["c10.jpg"]}
                alt="Model 10"
                className="carousel-image"
              />
            </div>
            <div>
              <img
                src={slider_images["c11.jpg"]}
                alt="Model 10"
                className="carousel-image"
              />
            </div>
            <div>
              <img
                src={slider_images["c12.jpg"]}
                alt="Model 10"
                className="carousel-image"
              />
            </div>
          </Slider>
        </div>
        {/* Additional Images Section */}
        <div className="additional-images">
          <img src={lookbook_images["lookbook_1.jpg"]} alt="Look 1" className="full-width-image" />
          <img src={lookbook_images["lookbook_2.jpg"]} alt="Look 2" className="full-width-image" />
        </div>
      </div>
    </div>
  );
};

export default Lookbook;
