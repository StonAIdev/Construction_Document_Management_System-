import * as React from 'react';
import { Helmet } from "react-helmet";
import Header from "../components/Header/Header";
import WhyStonAI from "../components/WhyStonAI/WhyStonAI";

import Offerings from "../components/Offerings/Offerings";

import BlueSection from "../components/BlueSection/BlueSection";
import Footer from "../components/Footer/Footer";

import LandingVideo from '../components/LandingVideo/LandingVideo';



const Landing = ({ setUser }) => {





  return (
    <>
      <Helmet>
        <title>Landing | StonAi</title>
      </Helmet>


      <div id="Header" ><Header /></div>
      <div id="WhyStonAI" ><WhyStonAI /></div>
      <div><LandingVideo /></div>
      <div id="Offerings" ><Offerings /></div>
      {/* <div id="Pricing" ><Pricing/></div> */}
      <div id="BlueSection" ><BlueSection /></div>
      <div id="Footer" ><Footer /></div>
      
      
      {/* <Aboutus/> */}
      
    </>
  );
};

export default Landing;
