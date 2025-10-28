import * as React from 'react';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import axios from "axios";
import { Formik } from "formik";
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@material-ui/core";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import FacebookIcon from "../icons/Facebook";
import GoogleIcon from "../icons/Google";
import { url } from "../url";
import Header from "../components/Header/Header";
import WhyStonAI from "../components/WhyStonAI/WhyStonAI";
import FloatImage from "../components/FloatImage/FloatImage";
import Offerings from "../components/Offerings/Offerings";
import LandingCycle from "../components/LandingCycle/LandingCycle";
import BlueSection from "../components/BlueSection/BlueSection";
import Footer from "../components/Footer/Footer";
import Notification from "./Notification";
import EmptyFolder from '../Reusable Components/Empty Folder/EmptyFolder';
import img from "../components/FloatImage/Asserts/Network.png"
import Pricing from '../components/Pricing/Pricing';
import Aboutus from './Aboutus';
import LandingVideo from '../components/LandingVideo/LandingVideo';



const Landing = ({ setUser }) => {
  const navigate = useNavigate();


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


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
