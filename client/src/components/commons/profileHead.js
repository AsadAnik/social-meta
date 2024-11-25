import React, { useState, useRef, useEffect } from 'react';
import { Grid, Paper, Avatar, IconButton } from '@mui/material';
import { CameraAlt, AddAPhoto } from '@mui/icons-material';
import { connect } from "react-redux";

const styles = {
  paper: {
    marginTop: '1rem',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '8px',
  },
  coverWrapper: {
    position: 'relative',
    height: '300px',
    width: '100%',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  coverOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s',
  },
  profileSection: {
    position: 'relative',
    marginLeft: '2rem',
    marginTop: '-75px',
  },
  profileWrapper: {
    position: 'relative',
    width: 'fit-content',
    '&:hover .profileOverlay': {
      opacity: 1,
    },
  },
  profilePic: {
    width: 150, // Dimensions must be numbers, not strings.
    height: 150,
    borderRadius: '50%',
    border: '4px solid #fff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  profileOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    opacity: 0,
    transition: 'opacity 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6) !important',
    color: '#fff !important',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.8) !important',
    },
  },
  cameraIcon: {
    fontSize: '1.8rem', // Increase size of camera icon for better visibility
  },
  infoSection: {
    padding: '1.5rem 2rem',
  },
  name: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  bio: {
    fontSize: '16px',
    marginBottom: '12px',
  },
  stats: {
    fontSize: '14px',
    '& span': {
      fontWeight: 'bold',
    },
  },
};

const ProfileHead = (props) => {
  const profilePath = "/profileUpload";
  const coverPath = "/coverUpload";

  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);

  const [themeMode, setThemeMode] = useState({
    backgroundColor: '',
    cardBorder: '',
    textColor: ''
  });

  const [coverImage, setCoverImage] = useState(`${coverPath}/demoCover.jpeg`);
  const [profileImage, setProfileImage] = useState(`${profilePath}/${props.profilePhoto}`);
  const [showCoverOverlay, setShowCoverOverlay] = useState(false);
  const [showProfileOverlay, setShowProfileOverlay] = useState(false); // New state for profile overlay

  useEffect(() => {
    if (props.Settings?.themeMode) {
      const { backgroundColor, cardBorder, textColor } = props.Settings.themeMode;
      setThemeMode({ backgroundColor, cardBorder, textColor });
    }
  }, [props.Settings]);

  const handleFileChange = (event, type) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'cover') {
        setCoverImage(url);
      } else {
        setProfileImage(url);
      }
      console.log(`Uploading ${type} image:`, file);
    }
  };

  return (
    <Paper sx={styles.paper} style={{ background: themeMode.backgroundColor, border: themeMode.cardBorder }}>
      {/* Cover Photo */}
      {/* Cover Photo */}
      <div
        style={styles.coverWrapper}
        onMouseEnter={() => setShowCoverOverlay(true)}
        onMouseLeave={() => setShowCoverOverlay(false)}
      >
        <img
          src={coverImage}
          alt="Cover"
          style={styles.coverPhoto}
        />
        {showCoverOverlay && (
          <div style={styles.coverOverlay}>
            <IconButton
              onClick={() => coverInputRef.current?.click()}
              sx={styles.cameraButton}
            >
              <CameraAlt sx={styles.cameraIcon} />
            </IconButton>
          </div>
        )}
        <input
          type="file"
          ref={coverInputRef}
          hidden
          onChange={(e) => handleFileChange(e, 'cover')}
          accept="image/*"
        />
      </div>


      {/* Profile Picture */}
      <div
        style={styles.profileWrapper}
        onMouseEnter={() => setShowProfileOverlay(true)}
        onMouseLeave={() => setShowProfileOverlay(false)}
      >
        <Avatar
          src={profileImage}
          alt="Profile Photo"
          sx={styles.profilePic}
        />
        {showProfileOverlay && (
          <div style={{ ...styles.profileOverlay, opacity: 1 }}>
            <IconButton
              onClick={() => profileInputRef.current?.click()}
              sx={styles.cameraButton}
            >
              <CameraAlt sx={styles.cameraIcon} />
            </IconButton>
          </div>
        )}
        <input
          type="file"
          ref={profileInputRef}
          hidden
          onChange={(e) => handleFileChange(e, 'profile')}
          accept="image/*"
        />
      </div>

    </Paper>
  );
};


const mapStateToProps = (state) => ({
  Settings: state.Settings
});

export default connect(mapStateToProps)(ProfileHead);

