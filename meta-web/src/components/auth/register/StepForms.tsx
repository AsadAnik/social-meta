import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';


// TYPE FOR STEP FORM 1
type StepForm1Props = {
    formData: {
        firstname: string;
        lastname: string;
        email: string;
        bio: string;
        title: string;
        gender: string;
        birthdate: string;
        profession: string;
        password: string;
        confirmPassword: string;
        profileImage: File;
    };
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
    errors: {
        firstname: string;
        lastname: string;
        email: string;
        bio: string;
        title: string;
        gender: string;
        birthdate: string;
        profession: string;
        password: string;
        confirmPassword: string;
        profileImage: string;
    };
};

// region Step Form 1
export const StepForm1 = ({ formData, handleChange, handleBlur, errors }: StepForm1Props): React.ReactNode => {
    return (
        <>
            <Typography variant="h5">Basic Information</Typography>
            <TextField
                fullWidth
                label="First Name"
                name="firstname"
                onChange={handleChange}
                value={formData.firstname || ""}
                margin="normal"
                onBlur={handleBlur}
                error={!!errors.firstname}
                helperText={errors.firstname}
            />
            <TextField
                fullWidth
                label="Last Name"
                name="lastname"
                onChange={handleChange}
                value={formData.lastname || ""}
                margin="normal"
                onBlur={handleBlur}
                error={!!errors.lastname}
                helperText={errors.lastname}
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
}

// TYPE FOR STEP FORM 2
type TStepForm2Props = {
    formData: {
        gender: string;
        birthdate: string;
        profession: string;
    };
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
    errors: {
        gender: string;
        birthdate: string;
        profession: string;
    };
};

// region Step Form 2
export const StepForm2 = ({ formData, handleChange, handleBlur, errors }: TStepForm2Props): React.ReactNode => {
    const genders = ["Male", "Female", "Non-binary", "Other"];
    const professions = ["Student", "Engineer", "Designer", "Developer", "Other"];


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
}


// TYPE FOR STEP FORM 3
type TStepForm3Props = {
    formData: {
        password: string;
        confirmPassword: string;
    };
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
    errors: {
        password: string;
        confirmPassword: string;
    };
};


// region Step Form 3
export const StepForm3 = ({ formData, handleChange, handleBlur, errors }: TStepForm3Props): React.ReactNode => {
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

        </>
    );
}


// TYPPE FOR RENDER STEP FORMS
type TRenderStepFormsProps = {
    currentTab: number;
    formData: {
        firstname: string;
        lastname: string;
        email: string;
        bio: string;
        title: string;
        gender: string;
        birthdate: string;
        profession: string;
        password: string;
        confirmPassword: string;
    };
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
    errors: {
        firstname: string;
        lastname: string;
        bio: string;
        title: string;
        email: string;
        gender: string;
        birthdate: string;
        profession: string;
        password: string;
        confirmPassword: string;
    };
};



// region Render Step Forms
const RenderStepForms = ({ currentTab, formData, handleChange, handleBlur, errors }: TRenderStepFormsProps): React.ReactNode => {
    switch (currentTab) {
        case 0:
            return <StepForm1 formData={formData as any} handleChange={handleChange} handleBlur={handleBlur} errors={errors as any} />;

        case 1:
            return <StepForm2 formData={formData as any} handleChange={handleChange} handleBlur={handleBlur} errors={errors as any} />;

        case 2:
            return <StepForm3 formData={formData as any} handleChange={handleChange} handleBlur={handleBlur} errors={errors as any} />;

        default:
            return null;
    }
}

export default RenderStepForms;