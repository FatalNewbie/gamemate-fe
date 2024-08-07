import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Modal, Typography, Divider, Button, IconButton, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import profilePlaceholder from '../../assets/profile_placeholder.png';
import './Home.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [gameNews, setGameNews] = useState([]);
  const [popularGames, setPopularGames] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

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

  useEffect(() => {
    const fetchGameNews = async () => {
      try {
        const response = await axios.get('https://api.rawg.io/api/games', {
          params: {
            key: '8b526997b9d046b6b4fd9fe6d865dd06',
            dates: '2021-01-01,2021-12-31',
            ordering: '-added',
            page_size: 5
          }
        });
        setGameNews(response.data.results.map(game => ({
          title: game.name,
          content: game.released,
          image: game.background_image,
          description: game.description_raw
        })));
      } catch (error) {
        console.error('Error fetching game news:', error);
      }
    };

    const fetchPopularGames = async () => {
      try {
        const response = await axios.get('https://api.rawg.io/api/games', {
          params: {
            key: '8b526997b9d046b6b4fd9fe6d865dd06',
            ordering: '-rating',
            page_size: 5
          }
        });
        setPopularGames(response.data.results.map((game, index) => ({
          title: game.name,
          image: game.background_image,
          rank: index + 1
        })));
      } catch (error) {
        console.error('Error fetching popular games:', error);
      }
    };

    fetchGameNews();
    fetchPopularGames();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? users.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === users.length - 1 ? 0 : prevIndex + 1));
  };

  const handleOpen = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const visibleUsers = [
    users[(currentIndex - 1 + users.length) % users.length],
    users[currentIndex],
    users[(currentIndex + 1) % users.length]
  ];

  const banners = [
    'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FFui3t%2FbtqLGYa9nYl%2FrjBvHRfM11PVO1cVyHmyl1%2Fimg.jpg',
    'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FqZhFG%2FbtqLGYPLiBS%2Fc9cNPA1RJNCYhw8bLhHlSK%2Fimg.png',
    'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fbza9gv%2FbtqL2wykAuZ%2FKhtxVo2RlmPiS5szqs2Q91%2Fimg.png',
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  };

  return (
    <Box>
      <Divider sx={{ backgroundColor: 'rgba(128, 128, 128, 0.3)', width: '100%', mb: 2 }} />
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <Box
            key={index}
            component="img"
            src={banner}
            alt={`Banner ${index + 1}`}
            sx={{ width: '100%', height: 'auto' }}
          />
        ))}
      </Slider>
      <Box>
        <Box display={"flex"} alignContent={"center"} justifyContent={"space-between"}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 700,
              fontSize: '14pt',
              letterSpacing: '-0.5px',
              marginBottom: '20px',
              marginTop: '30px',
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
              marginTop: '35px',
            }}>
            <a href="/recommend" className="more-link">더 보기 &gt;</a>
          </Typography>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center" position="relative" width="100%">
        <Box>
          <IconButton onClick={handlePrev} className="carousel-button" sx={{ position: 'absolute', left: '15%', top: '20%', zIndex: 2 }}>
            <ArrowBackIos />
          </IconButton>
          <Box display="flex" justifyContent="center" alignItems="center" className="user-card-container" mx={1}>
            {visibleUsers.map((user, index) => (
              user && (
                <Box
                  key={index}
                  className={`user-card ${index === 1 ? 'active' : 'inactive'}`}
                  onClick={index === 1 ? () => handleOpen(user) : null}
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
                      transform: index === 1 ? 'scale(1.7)' : 'scale(0.9)',
                      opacity: index === 1 ? 1 : 0.6,
                      transition: 'transform 0.3s, opacity 0.3s',
                      marginLeft: index !== 0 ? '10px' : '14px',
                      marginBottom: index === 1 ? '40px' : '0px',
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
          <IconButton onClick={handleNext} className="carousel-button" sx={{ position: 'absolute', right: '15%', top: '20%', zIndex: 2 }}>
            <ArrowForwardIos />
          </IconButton>
          <Box>
            {visibleUsers.map((user, index) => (
              user && (
                <Box
                  key={index}
                  className={`user-card ${index === 1 ? 'active' : 'inactive'}`}
                  onClick={index === 1 ? () => handleOpen(user) : null}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 'none',
                    marginTop: '-50px',
                    boxShadow: 'none',
                  }}
                >
                  {index === 1 && (
                    <>
                      <Box sx={{ mt: 2 }}>
                        {visibleUsers[1].common_genre.map((genre, index) => (
                          <span key={index} className="tag3">{genre}</span>
                        ))}
                      </Box>
                      <Box className="modal-tags">
                        {visibleUsers[1].common_play_time.map((time, index) => (
                          <span key={index} className="tag4">{time}</span>
                        ))}
                      </Box>
                    </>
                  )}
                </Box>
              )
            ))}
          </Box>
        </Box>
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(128, 128, 128, 0.3)', width: '100%', mb: 2 }} />
      

      {/* 인기 게임 목록 섹션 */}
      <Box mt={4} p={2}>
      <Typography
            variant="h6"
            sx={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 700,
              fontSize: '12pt',
              letterSpacing: '-0.5px',
              marginBottom: '20px',
            }}
          >🔥 스팀 인기 게임</Typography>
        <List>
          {popularGames.map((game, index) => (
            <ListItem key={index} component={Paper} sx={{ mb: 2 }}>
              <ListItemAvatar>
                <Avatar src={game.image} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, fontSize: '0.875rem' }}
                  >
                    {`${game.rank}. ${game.title}`}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
      
      <Divider sx={{ backgroundColor: 'rgba(128, 128, 128, 0.3)', width: '100%', mb: 2 }} />

      {/* 게임 뉴스 섹션 */}
      <Box mt={4} p={2}>
      <Typography
            variant="h6"
            sx={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 700,
              fontSize: '12pt',
              letterSpacing: '-0.5px',
              marginBottom: '20px',
            }}
          >📰 업데이트된 스팀 게임</Typography>
        <List>
          {gameNews.map((news, index) => (
            <ListItem key={index} component={Paper} sx={{ mb: 2 }}>
              <ListItemAvatar>
                <Avatar src={news.image} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, fontSize: '0.875rem' }}
                  >
                    {news.title}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, fontSize: '0.75rem' }}
                  >
                    {news.content}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>

      
      

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="user-info-modal"
        aria-describedby="user-info-modal-description"
      >
        <Box className="modal-box">
          {selectedUser && (
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
                {selectedUser.recommend_user}
              </Typography>
              <Box className="modal-tags">
                <Typography variant="body1" sx={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 600,
                  fontSize: '10pt',
                  letterSpacing: '-0.5px',
                }}>공통 장르</Typography>
                {selectedUser.common_genre.map((genre, index) => (
                  <span key={index} className="tag1">{genre}</span>
                ))}
              </Box>
              <Box className="modal-tags">
                <Typography variant="body1" sx={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 600,
                  fontSize: '10pt',
                  letterSpacing: '-0.5px',
                }}>공통 시간대</Typography>
                {selectedUser.common_play_time.map((time, index) => (
                  <span key={index} className="tag2">{time}</span>
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
