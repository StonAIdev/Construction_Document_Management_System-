import React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#784af4",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

const steps = ["Upload", "Document Details", "Upload Status"];

export default function FileUploadsStepper({
  setActiveStep,
  activeStep,
  setCompleted,
  completed,
}) {
  //   const [activeStep, setActiveStep] = React.useState(0);
  //   const [completed, setCompleted] = React.useState({});

  // const totalSteps = () => {
  //   return steps.length;
  // };

  // const completedSteps = () => {
  //   return Object.keys(completed).length;
  // };

  // const isLastStep = () => {
  //   return activeStep === totalSteps() - 1;
  // };

  // const allStepsCompleted = () => {
  //   return completedSteps() === totalSteps();
  // };

  // const handleNext = () => {
  //   const newActiveStep =
  //     isLastStep() && !allStepsCompleted()
  //       ? // It's the last step, but not all steps have been completed,
  //         // find the first step that has been completed
  //         steps.findIndex((step, i) => !(i in completed))
  //       : activeStep + 1;
  //   setActiveStep(newActiveStep);
  // };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  // const handleStep = (step) => () => {
  //   setActiveStep(step);
  // };

  // const handleComplete = () => {
  //   const newCompleted = completed;
  //   newCompleted[activeStep] = true;
  //   setCompleted(newCompleted);
  //   handleNext();
  // };

  // const handleReset = () => {
  //   setActiveStep(0);
  //   setCompleted({});
  // };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Stepper
        nonLinear
        alternativeLabel
        activeStep={activeStep}
        connector={<QontoConnector />}
      >
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]} expanded={true}>
            <StepLabel color="inherit">{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
