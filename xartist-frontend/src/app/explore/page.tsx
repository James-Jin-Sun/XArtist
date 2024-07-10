"use client"

import Navbar from "../components/NavBar";
import React from "react";
import { Slider } from "@material-tailwind/react";

import { Component } from "react";  // for Latent Space Explorer
import ImageCanvas from "../components/ImageCanvas";  // for Latent Space Explorer
import XYPlot from "../components/XYPlot";  // for Latent Space Explorer
import * as tf from "@tensorflow/tfjs";  // for Latent Space Explorer
import gaussian from "gaussian";  // for Latent Space Explorer
import encodedData from "../encoded.json";  // for Latent Space Explorer

import "../page.module.css";  // for Latent Space Explorer

const MODEL_PATH = "models/generatorjs/model.json";

interface Props {
}

class Explore extends Component<{}, { model, digitImg, mu, sigma:any}> {
  constructor(props) {
    super(props);
    this.getImage = this.getImage.bind(this);

    //this.norm = gaussian(0, 1);

    this.state = {
      model: null,
      digitImg: tf.zeros([28, 28]),
      mu: 0,
      sigma: 0
    };
  }

  componentDidMount() {
    tf
      .loadLayersModel(MODEL_PATH)
      .then(model => this.setState({ model }))
      .then(() => this.getImage())
      .then(digitImg => this.setState({ digitImg }));
  }

  async getImage() {
    const { model, mu, sigma } = this.state;
    const zSample = tf.tensor([[mu, sigma]]);
    return model
      .predict(zSample)
      .mul(tf.scalar(255.0))
      .reshape([28, 28]);
  }

  render() {
    return this.state.model === null ? (
      <div>Loading, please wait</div>
    ) : (
      <div className="App">
        <h1>Latent Space Explorer</h1>
        <div className="ImageDisplay">
          <ImageCanvas
            width={500}
            height={500}
            imageData={this.state.digitImg}
          />
        </div>

        <div className="ChartDisplay">
          <XYPlot
            data={encodedData}
            width={500 - 10 - 10}
            height={500 - 20 - 10}
            xAccessor={d => d[0]}
            yAccessor={d => d[1]}
            colorAccessor={d => d[2]}
            margin={{ top: 20, bottom: 10, left: 10, right: 10 }}
            onHover={({ x, y }) => {
              this.setState({ sigma: y, mu: x });
              this.getImage().then(digitImg => this.setState({ digitImg }));
            }}
          />
        </div>
      </div>
    );
  }
}

export default Explore;

// const Explore = () => {
//   // console.log(categories);
//   return (
//       <div className=" py-24 sm:py-32">
//         <div className="mx-auto grid max-w-7xl gap-x-10 gap-y-20 px-6 lg:px-8 xl:grid-cols-2">
//           <div className="max-w-2xl">
//             <div className="grid gap-x-8 gap-y-12">
//               <img
//                 className="object-cover object-center xl:col-span-1"
//                 src="https://www.researchgate.net/profile/Sergei-Astapov/publication/261467229/figure/fig2/AS:667663588143121@1536194812400/Three-clusters-in-a-three-dimensional-feature-space-Features-represent-energy-ratios-and.png"
//                 alt="feature space"
//                 style={{ height: 512, width: 512 }}
//               />
//               <div className="flex w-96 flex-col gap-2">
//                 <Slider size="lg" defaultValue={50} />
//                 <h3 className="text-base font-semibold leading-1 tracking-tight text-gray-900">Feature 1</h3>
//               </div>
//               <div className="flex w-96 flex-col gap-2">
//                 <Slider size="lg" color="blue" defaultValue={50} />
//                 <h3 className="text-base font-semibold leading-1 tracking-tight text-gray-900">Feature 2</h3>
//               </div>
//               <div className="flex w-96 flex-col gap-2">
//                 <Slider size="lg" color="green" defaultValue={50} />
//                 <h3 className="text-base font-semibold leading-1 tracking-tight text-gray-900">Feature 3</h3>
//               </div>
              
//               <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Control Panel</h2>
              
//             </div>
//           </div>
            
//           <div className="max-w-2xl">  
//             <img
//               className="object-cover object-center xl:col-span-1"
//               src="https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
//               alt="nature image"
//               style={{ height: 512, width: 512 }}
//             />
//             <h3 className="text-base font-semibold leading-1 tracking-tight text-gray-900">Output Image</h3>
//           </div>
//         </div>
//       </div>
//   );
// };

// export default Explore;