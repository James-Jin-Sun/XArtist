"use client"

import Navbar from "../components/NavBar";
import React from "react";
import { Slider } from "@material-tailwind/react";

import { Component, useEffect, useState, useRef } from "react";
import ImageCanvas from "../components/ImageCanvas";  // for Latent Space Explorer
import XYPlot from "../components/XYPlot";  
import * as tf from "@tensorflow/tfjs";  // for Latent Space Explorer
import gaussian from "gaussian";  // for Latent Space Explorer
import encodedData from "../encoded.json";  // for Latent Space Explorer

import "../page.module.css";  // for Latent Space Explorer

const MODEL_PATH = "models/generatorjs/model.json";

interface Props {
}

const Explore = () => {
  const [dots, setDots] = useState([]);
  const [image, setImage] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imgLoading, setImgLoading] = useState(true);


  // *** Storage array and timer reference for scheduled processing ***
  const coordinatesRef = useRef([]);
  const timerRef = useRef(null);

  const opencvLoaded = useOpenCV();  // for bicubic + sharpening
  
  // // *** Buffer state to handle debouncing ***
  // const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    // Generate 3,000 random dots
    const generatedDots = [];
    for (let i = 0; i < 1000; i++) {
      generatedDots.push({
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5 ) * 2,
      });
    }
    setDots(generatedDots);
    console.log(generatedDots);
    setLoading(false)
  }, []);

  useEffect(() => {
    // Generate 3,000 random dots
    convertDotToImg(0.1, 0.1)
    setImgLoading(false)
  }, []);

  // fetching images
  const convertDotToImg = async (x, y) => {
    try {
      const x_f = x
      const y_f = y
      const response = await fetch(`http://127.0.0.1:5000/api/explorer/fetch_dots_to_img?1st_dot=${x_f}&2nd_dot=${y_f}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      }); // Adjust the API endpoint as necessary
      if (!response.ok) throw new Error('Failed to fetch');
      const imgResp = await response.json();
      console.log("Dots to img: ", imgResp);
      if (imgResp.data) {
        setImage(imgResp.data);
      } else {
        console.error('No image data found');
      }
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  // *** Scheduled Timer Function ***
  useEffect(() => {
    const processCoordinates = () => {
      if (coordinatesRef.current.length > 0) {
        const { x, y } = coordinatesRef.current.shift();
        convertDotToImg(x, y);
      }
    };

    timerRef.current = setInterval(processCoordinates, 1); // Process every 0.5 seconds

    return () => clearInterval(timerRef.current);
  }, [opencvLoaded]);

  // *** Hover handler to store coordinates ***
  const handleHover = ({ x, y }) => {
    // convertDotToImg(x, y);
    // console.log(x, y);
    coordinatesRef.current.push({ x, y });
  };

  // // *** Debounced hover handler ***
  // const handleHover = ({ x, y }) => {
  //   console.log(x, y);
  //   if (hoverTimeoutRef.current) {
  //     clearTimeout(hoverTimeoutRef.current);
  //   }
  //   hoverTimeoutRef.current = setTimeout(() => {
  //     convertDotToImg(x, y);
  //   }, 3000); // 3 seconds delay
  // };

  return (
    <>
      {loading ? (<div className="flex justify-center items-center w-full">
        <svg className="animate-spin h-8 w-8 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      </div>) : (<div style={styles.container}>
      <div style={styles.left}>
        <XYPlot
          data={dots}
          width={500 - 10 - 10}
          height={500 - 20 - 10}
          xAccessor={d => d.x}
          yAccessor={d => d.y}
          // colorAccessor={d => d[2]}
          margin={{ top: 20, bottom: 10, left: 10, right: 10 }}
          onHover={handleHover} // *** Updated to use debounced handler ***
          // onHover={({ x, y }) => {
          //   console.log(x, y)
          //   convertDotToImg(x, y);
          // }}


        />
        {/* {isHovering && <div style={styles.hoverText}>Hovering</div>} */}
      </div>
      <div style={styles.right}>
        { !image ? (<div className="flex justify-center items-center w-full">
        <svg className="animate-spin h-8 w-8 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      </div>) : (<img
          src={`data:image/png;base64,${image}`}
          alt="Art Animation"
          style={{ width: '400px', height: '400px' }}
          className="object-cover object-center w-full h-256 max-w-full"
        // onMouseEnter={() => setIsPlaying(false)}
        // onMouseLeave={() => setIsPlaying(true)}
        />)}

        {/* <ImageCanvas /> */}
      </div>
    </div >)}
    </>
    
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100vh',
  },
  left: {
    width: '50%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    width: '50%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default Explore;