"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Tabs,
  Tab,
  Avatar,
  IconButton,
  Fade,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import registerStyles from "@/styles/auth/register.module.scss";
import { useRouter } from "next/navigation";
import { useRegisterMutation, setCredentials } from "@/redux/slice/auth.slice";
import { useDispatch } from "react-redux";
import toaster from "react-hot-toast";
import { useStep } from "@/hooks/useStep";
import { useFormHandler } from "@/hooks/useForm";

const genders = ["Male", "Female", "Non-binary", "Other"];
const professions = ["Student", "Engineer", "Designer", "Developer", "Other"];

// Validation Rules
const validationRules = {
  email: (value: string) =>
    !value
      ? "Email is required."
      : !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
      ? "Invalid email format."
      : "",
  password: (value: string) =>
    value.length < 6 ? "Password must be at least 6 characters." : "",
  firstName: (value: string) => (!value ? "First name is required." : ""),
  lastName: (value: string) => (!value ? "Last name is required." : ""),
  bio: (value: string) => (!value ? "Bio is required." : ""),
  title: (value: string) => (!value ? "Title is required." : ""),
  gender: (value: string) => (!value ? "Gender is required." : ""),
  birthdate: (value: string) => (!value ? "Birthdate is required." : ""),
  profession: (value: string) => (!value ? "Profession is required." : ""),
  passsword: (value: string) => (!value ? "Password is required." : ""),
  confirmPassword: (value: string) =>
    !value ? "Confirm Password is required." : "",
};

export default function RegisterPage() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();

  const { formData, handleChange, validateForm, handleBlur, errors } =
    useFormHandler(
      {
        firstName: "",
        lastName: "",
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

    // Prepare the JSON payload
    const formDataToSubmit = {
      ...formData,
      profileImage: undefined, // Skip image in the JSON payload
    };

    console.log("Form data to submit:", formDataToSubmit);

    try {
      const response = await register(formDataToSubmit).unwrap();
      dispatch(setCredentials(response));
      toaster.success("Registration successful!");
      router.push("/");
    } catch (error: any) {
      toaster.error(error?.data?.message || "Registration failed.");
    }
  };

  const renderStepContent = () => {
    switch (currentTab) {
      case 0:
        return (
          <>
            <Typography variant="h5">Basic Information</Typography>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              onChange={handleChange}
              value={formData.firstName}
              margin="normal"
              onBlur={handleBlur}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              onChange={handleChange}
              value={formData.lastName}
              margin="normal"
              onBlur={handleBlur}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              margin="normal"
              onBlur={handleBlur}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Bio"
              name="bio"
              onChange={handleChange}
              value={formData.bio}
              margin="normal"
              onBlur={handleBlur}
              error={!!errors.bio}
              helperText={errors.bio}
            />
            <TextField
              fullWidth
              label="Title"
              name="title"
              onChange={handleChange}
              value={formData.title}
              margin="normal"
              onBlur={handleBlur}
              error={!!errors.title}
              helperText={errors.title}
            />
          </>
        );
      case 1:
        return (
          <>
            <Typography variant="h5">Profile Details</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={(event) => handleChange(event as any)}
                error={!!errors.gender}
              >
                {genders.map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              type="date"
              label="Birthdate"
              name="birthdate"
              onChange={handleChange}
              value={formData.birthdate}
              InputLabelProps={{ shrink: true }}
              margin="normal"
              onBlur={handleBlur}
              error={!!errors.birthdate}
              helperText={errors.birthdate}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Profession</InputLabel>
              <Select
                name="profession"
                value={formData.profession}
                onChange={(event) => handleChange(event as any)}
                error={!!errors.profession}
              >
                {professions.map((profession) => (
                  <MenuItem key={profession} value={profession}>
                    {profession}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="h5">Security & Profile</Typography>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              onChange={handleChange}
              value={formData.password}
              margin="normal"
              onBlur={handleBlur}
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              onChange={handleChange}
              value={formData.confirmPassword}
              margin="normal"
              onBlur={handleBlur}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            <Box marginTop={2} textAlign="center">
              {formData.profileImage ? (
                <Avatar
                  src={URL.createObjectURL(formData.profileImage)}
                  className={registerStyles.avatar}
                />
              ) : (
                <Avatar className={registerStyles.avatar}>
                  <CloudUploadIcon />
                </Avatar>
              )}
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleChange}
                  name="profileImage"
                />
                Upload Profile Picture
              </IconButton>
            </Box>
          </>
        );
    }
  };
  return (
    <Container className={registerStyles.container}>
      <Box className={registerStyles.leftSection}>
        <Box className={registerStyles.formWrapper}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue) => handleTabChange(newValue)}
            centered
            TabIndicatorProps={{ className: registerStyles.tabIndicator }}
          >
            <Tab label="Step 1" />
            <Tab label="Step 2" />
            <Tab label="Step 3" />
          </Tabs>
          <Fade in={true}>
            <div>{renderStepContent()}</div>
          </Fade>
          <Box className={registerStyles.actions}>
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
      {/* Right Section */}
      <Box className={registerStyles.rightSection}>
        <Box className="overlay"></Box>
        <Box className={registerStyles.animatedText}>
          <Typography variant="h4" className={registerStyles.text}>
            Join Our Community
          </Typography>
          <Typography variant="h4" className={registerStyles.text}>
            Build Connections
          </Typography>
          <Typography variant="h4" className={registerStyles.text}>
            Grow Together
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
