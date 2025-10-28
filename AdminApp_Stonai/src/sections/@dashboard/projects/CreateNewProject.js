import React, { useState, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import CreateProjectStepOne from './CreateProjectStepOne';
import CreateProjectStepTwo from './CreateProjectStepTwo';
import CreateProjectStepThree from './CreateProjectStepThree';
import CreateProjectStepFour from './CreateProjectStepFour';

const steps = [
  ' Enterprise',
  ' Project Details',
  ' Project Entities',
  "Project Admin's Department"
];

export default function CreateNewEnterprise() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const enterpriseData = React.useRef({
    enterprise_name: '',
    enterprise_location: '',
    enterprise_id: ''
  });
  const userData = React.useRef({
    username: '',
    email_address: '',
    user_role: '',
    firstName: '',
    lastName: ''
  });
  const projectData = React.useRef({
    project_name: '',
    enterprise_id: '',
    plot_number: '',
    sector_number: '',
    area: '',
    city: '',
    county: '',
    specifyContractScope: '',
    specifyWorkScope: '',
    country: '',
    project_type: '',
    contract_scope: '',
    work_scope: '',
    start_date: '',
    end_date: '',
    user_id: '',
    departments: [],
    project_admin: ''
  });

  const [newProject, setNewProject] = React.useState('');

  const isStepOptional = (step) => {
    let bool = true;
    if (step === 1) {
      bool = true;
    } else {
      bool = false;
    }
    return bool;
  };

  const isStepSkipped = (step) => {
    let bool = true;
    if (skipped.has(step)) {
      bool = true;
    } else {
      bool = false;
    }
    return bool;
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  function getStepperForm() {
    let form;
    if (activeStep === 0) {
      form = (
        <CreateProjectStepOne
          enterpriseData={enterpriseData}
          // setEnterpriseData={setEnterpriseData}
          handleNext={handleNext}
        />
      );
    } else if (activeStep === 1) {
      form = (
        <CreateProjectStepThree
          projectData={projectData}
          // setProjectData={setProjectData}
          handleNext={handleNext}
          enterpriseData={enterpriseData}
        />
      );
    } else if (activeStep === 2) {
      form = (
        <CreateProjectStepTwo
          projectData={projectData}
          enterpriseData={enterpriseData}
          // setUserData={setUserData}
          handleNext={handleNext}
          newProject={newProject}
          setNewProject={setNewProject}
        />
      );
    } else if (activeStep === 3) {
      form = (
        <CreateProjectStepFour
          projectData={projectData}
          // setProjectData={setProjectData}
          handleNext={handleNext}
          newProject={newProject}
          setNewProject={setNewProject}
        />
      );
    }

    return form;
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};

          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <>
          <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </>
      ) : (
        <>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          {getStepperForm()}

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />

            {activeStep !== 0 ? (
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            ) : null}
          </Box>
        </>
      )}
    </Box>
  );
}
