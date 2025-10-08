"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Tabs,
  Tab,
  Fade,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/navigation";
import { useRegisterMutation, setCredentials } from "@/redux/slice/auth.slice";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { useStep } from "@/hooks/useStep";
import { useFormHandler } from "@/hooks/useForm";
import RenderStepForms from "@/components/auth/register/StepForms";

// Validation Rules
const validationRules = {
  email: (value: string) =>
    !value
      ? "Email is required."
      : !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
        ? "Invalid email format."
        : "",
  password: (value: string) =>
    value.length < 6 ? "Password must be at least 8 characters." : "",
  firstname: (value: string) => (!value ? "First name is required." : ""),
  lastname: (value: string) => (!value ? "Last name is required." : ""),
  bio: (value: string) => (!value ? "Bio is required." : ""),
  title: (value: string) => (!value ? "Title is required." : ""),
  gender: (value: string) => (!value ? "Gender is required." : ""),
  birthdate: (value: string) => (!value ? "Birthdate is required." : ""),
  profession: (value: string) => (!value ? "Profession is required." : ""),
  confirmPassword: (value: string) =>
    !value ? "Confirm Password is required." : "",
};

// region REGISTER COMPONENT
export default function RegisterPage() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();

  const dispatch = useDispatch();

  const { formData, handleChange, validateForm, handleBlur, errors } =
    useFormHandler(
      {
        firstname: "",
        lastname: "",
        email: "",
        bio: "",
        title: "",
        gender: "",
        birthdate: "",
        profession: "",
        password: "",
        confirmPassword: "",
        profileImage: null,
      },
      validationRules
    );

  const { currentTab, handleTabChange } = useStep();

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formDataToSubmit = {
      ...formData,
      profileImage: undefined, // Skip image in the JSON payload
    };

    try {
      console.log("Submitting Data:", formDataToSubmit);
      const response = await register(formDataToSubmit).unwrap();
      dispatch(setCredentials(response));
      toast.success("Registration successful!");
      router.push("/login");
    } catch (error: any) {
      if (error?.data?.details) {
        error.data.details.forEach((detail: any) =>
          toast.error(`${detail.path}: ${detail.message}`)
        );
      } else {
        toast.error(error?.data?.message || "Registration failed.");
      }
    }
  };

  const renderStepContent = () => {
    return (
      <RenderStepForms
        formData={formData}
        handleChange={handleChange}
        handleBlur={handleBlur}
        errors={errors} currentTab={currentTab} />
    )
  };

  // region Main UI
  return (
    <Container className='register-container'>
      <Box className='leftSection'>
        <Box className='formWrapper'>
          <Tabs
            value={currentTab}
            onChange={(_, newValue) => handleTabChange(newValue)}
            centered
            TabIndicatorProps={{ className: 'tabIndicator' }}
          >
            <Tab label="Step 1" />
            <Tab label="Step 2" />
            <Tab label="Step 3" />
          </Tabs>
          <Fade in={true}>
            <div>{renderStepContent()}</div>
          </Fade>
          <Box className='actions'>
            {currentTab > 0 && (
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => handleTabChange(currentTab - 1)}
              >
                Back
              </Button>
            )}
            {currentTab < 2 && (
              <Button
                endIcon={<ArrowForwardIcon />}
                onClick={() => handleTabChange(currentTab + 1)}
              >
                Next
              </Button>
            )}
            {currentTab === 2 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            )}
            {currentTab === 0 && (
              <Button
                variant="text"
                color="primary"
                onClick={() => router.push("/login")}
              >
                Already have an account?
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      <Box className='rightSection'>
        <Box className="overlay"></Box>
        <Box className='animatedText'>
          <Typography variant="h4" className='text'>
            Join Our Community
          </Typography>
          <Typography variant="h4" className='text'>
            Build Connections
          </Typography>
          <Typography variant="h4" className='text'>
            Grow Together
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
