import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AppBar, Toolbar } from "@material-ui/core";
import Logo from "./Assets/LogoStonai.png";
import "./MainNavbar.css";
import ButtonStyled from "../Reusable Components/Buttons/ButtonStyled";

function MainNavbar(props) {
  const navigate = useNavigate();
  const scrollToDemo = () => {
    document.getElementById("Demo").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const scrollToOfferings = () => {
    document.getElementById("Offerings").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const scrollToWhyStonAI = () => {
    document.getElementById("WhyStonAI").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const DemoClickHandler = async () => {
    // await navigate("/AboutusPage", { replace: true });
    window.location.href = "https://stonai.com/AboutusPage#Demon";
    // scrollToDemo();
  };
  const offeringClickHandler = async () => {
    await navigate("/landing", { replace: true });
    scrollToOfferings();
  };
  const whyStonAiClickHandler = async () => {
    await navigate("/landing", { replace: true });
    scrollToWhyStonAI();
  };
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light NavStyle">
      <a href="landing#Header">
        <img src={Logo} alt="StonAI" style={{ width: "100px" }} />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        class="collapse navbar-collapse textPosition bg-light navColapseStyle"
        id="navbarSupportedContent"
      >
        <ul class="navbar-nav d-flex align-items-center">
          <li class="nav-item">
            <a class="nav-link navText" onClick={whyStonAiClickHandler}>
              Why StonAI
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link navText" onClick={offeringClickHandler}>
              Offerings
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link navText"
              onClick={() =>
                (window.location.href =
                  "https://stonai.com/AboutusPage#AboutUs")
              }
            >
              About Us
            </a>
          </li>

          <li
            class="nav-item navButtonMargin"
            style={{ marginInline: "0.3rem", marginLeft: "0px" }}
          >
            <ButtonStyled
              border="2px solid var(--blue)"
              paddingInline=".7rem"
              paddingBlock="0.2rem"
              borderRadius="8px"
              width="100%"
              onClick={() => navigate("/Login#", { replace: true })}
            >
              <a class="nav-link navText p-0" style={{ color: "var(--blue)" }}>
                Log In
              </a>
            </ButtonStyled>
          </li>

          <li
            class="nav-item navButtonMargin"
            style={{ marginInline: "0.3rem" }}
          >
            <ButtonStyled
              backgroundColor="var(--blue)"
              border="2px solid var(--blue)"
              paddingInline=".7rem"
              paddingBlock="0.2rem"
              borderRadius="8px"
              width="100%"
              onClick={DemoClickHandler}
            >
              <a class="nav-link navText p-0" style={{ color: "white" }}>
                Demo
              </a>
            </ButtonStyled>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default MainNavbar;
