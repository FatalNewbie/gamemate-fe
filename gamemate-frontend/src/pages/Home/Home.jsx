import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Modal, Typography, Button, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import profilePlaceholder from '../../assets/profile_placeholder.png';
import './Home.css';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.post('http://127.0.0.1:8000/recommendation', {
        preferred_genres: [1, 1, 1, 1, 1],
        play_times: [1, 0, 0, 1, 0, 1, 1]
      });
      setUsers(response.data.similar_users);
    };
    fetchUsers();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? users.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === users.length - 1 ? 0 : prevIndex + 1));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const visibleUsers = [
    users[(currentIndex - 1 + users.length) % users.length],
    users[currentIndex],
    users[(currentIndex + 1) % users.length]
  ];

  return (
    <Box>
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 700,
            fontSize: '14pt',
            letterSpacing: '-0.5px',
            marginBottom: '20px',
          }}
        >
        🕹️ 오늘의 추천 게임메이트
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 700,
            fontSize: '10pt',
            letterSpacing: '-0.5px',
            marginBottom: '20px',
          }}>
          <a href="/recommend" className="more-link">더 보기 &gt;</a>
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center" position="relative" width="100%">
        <IconButton onClick={handlePrev} className="carousel-button" sx={{ position: 'absolute', left: '0', zIndex: 1 }}>
          <ArrowBackIos />
        </IconButton>
        <Box display="flex" justifyContent="center" alignItems="center" className="user-card-container" mx={1}>
            {visibleUsers.map((user, index) => (
              user && (
                <Box
                  key={index}
                  className={`user-card ${index === 1 ? 'active' : 'inactive'}`}
                  onClick={index === 1 ? handleOpen : null}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 'none',
                    marginTop: '20px',
                    boxShadow: 'none',
                  }}
                >
                  <img
                    src={profilePlaceholder}
                    alt="Profile"
                    className="profile-pic"
                    style={{
                      transform: index === 1 ? 'scale(1.1)' : 'scale(0.9)',
                      opacity: index === 1 ? 1 : 0.6,
                      transition: 'transform 0.3s, opacity 0.3s',
                      marginLeft: index !== 0 ? '10px' : '14px',
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 700,
                      fontSize: index === 1 ? '14pt' : '10pt',
                      letterSpacing: '-0.5px',
                      marginTop: '10px',
                      textAlign: 'center',
                      color: index !== 1 ? 'gray' : 'black',
                    }}
                    className="username"
                  >
                    {user.recommend_user}
                  </Typography>
                </Box>
              )
            ))}
        </Box>
        <IconButton onClick={handleNext} className="carousel-button" sx={{ position: 'absolute', right: '0', zIndex: 1 }}>
          <ArrowForwardIos />
        </IconButton>
      </Box>
      <Box my={2} display="flex" justifyContent="center" width="100%">
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FFui3t%2FbtqLGYa9nYl%2FrjBvHRfM11PVO1cVyHmyl1%2Fimg.jpg" alt="광고 배너" className="ad-banner-img" />
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="user-info-modal"
        aria-describedby="user-info-modal-description"
      >
        <Box className="modal-box">
          {visibleUsers[1] && (
            <>
              <img
                src={profilePlaceholder}
                alt="Profile"
                className="modal-profile-pic"
              />
              <Typography
                id="user-info-modal"
                variant="h6"
                sx={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 700,
                  fontSize: '16pt',
                  letterSpacing: '-0.5px',
                }}
              >
                {visibleUsers[1].recommend_user}
              </Typography>
              <Box className="modal-tags">
                <Typography variant="body1" sx={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 600,
                  fontSize: '12pt',
                  letterSpacing: '-0.5px',
                }}>공통 장르</Typography>
                {visibleUsers[1].common_genre.map((genre, index) => (
                  <span key={index} className="tag">{genre}</span>
                ))}
              </Box>
              <Box className="modal-tags">
              <Typography variant="body1" sx={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 600,
                  fontSize: '12pt',
                  letterSpacing: '-0.5px',
                }}>공통 시간대</Typography>
                {visibleUsers[1].common_play_time.map((time, index) => (
                  <span key={index} className="tag">{time}</span>
                ))}
              </Box>
              <Box mt={2}>
                <Button variant="outlined" onClick={() => alert('프로필 보기')}>
                  프로필 보기
                </Button>
                <Button variant="contained" onClick={handleClose} style={{ marginLeft: '8px' }}>
                  닫기
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Home;
