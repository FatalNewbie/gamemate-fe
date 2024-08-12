import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api2 } from '../../apis/customAxios';
import { useCookies } from 'react-cookie';
import {
    Box,
    Modal,
    Typography,
    Divider,
    Button,
    IconButton,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    CircularProgress,
    Snackbar,
    Alert,
    Chip
} from '@mui/material';
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
    const [apiError, setApiError] = useState(false);
    const [popularGames, setPopularGames] = useState([]);
    const [loadingNews, setLoadingNews] = useState(false);
    const [loadingGames, setLoadingGames] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [cookies] = useCookies(['token']);

    

    const convertToFeatureArray = (data, referenceList) => {
        const featureArray = new Array(referenceList.length).fill(0);
        data.forEach(id => {
            featureArray[id - 1] = 1;
        });
        return featureArray;
    };

    const fetchGameNews = async () => {
        setLoadingNews(true);
        try {
            const response = await axios.get('https://api.rawg.io/api/games', {
                params: {
                    key: '8b526997b9d046b6b4fd9fe6d865dd06',
                    dates: '2021-01-01,2021-12-31',
                    ordering: '-added',
                    page_size: 5,
                },
            });
            setGameNews(
                response.data.results.map((game) => ({
                    title: game.name,
                    content: game.released,
                    image: game.background_image,
                    description: game.description_raw,
                }))
            );
        } catch (error) {
            console.error('Error fetching game news:', error);
            setApiError(true); 
        } finally {
            setLoadingNews(false);
        }
    };

    const fetchPopularGames = async () => {
        setLoadingGames(true);
        try {
            const response = await axios.get('https://api.rawg.io/api/games', {
                params: {
                    key: '8b526997b9d046b6b4fd9fe6d865dd06',
                    ordering: '-rating',
                    page_size: 5,
                },
            });
            setPopularGames(
                response.data.results.map((game, index) => ({
                    title: game.name,
                    image: game.background_image,
                    rank: index + 1,
                }))
            );
        } catch (error) {
            console.error('Error fetching popular games:', error);
            setApiError(true); 
        } finally {
            setLoadingGames(false);
        }
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = cookies.token;
                const genresList = ['FPS', 'RPG', '전략', '액션', '시뮬레이션'];
                const timesList = ['AM 9:00 ~ AM 11:00', 'AM 11:00 ~ PM 2:00', 'PM 2:00 ~ PM 5:00', 'PM 5:00 ~ PM 8:00',
                      'PM 8:00 ~ PM 11:00', 'PM 11:00 ~ AM 3:00', 'AM 3:00 ~ AM 9:00'];

                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get('/info', {
                    headers: {
                        Authorization: `${token}`,
                    },
                });


                const user = response.data.data;
                const userFeatures = {
                    preferred_genres: convertToFeatureArray(user.preferredGenres, genresList),
                    play_times: convertToFeatureArray(user.playTimes, timesList),
                };

                const response2 = await api2.post(
                    '/recommendation',
                    userFeatures,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setUsers(response2.data.similar_users);
                
            } catch (error) {
                console.error('Error fetching user info or recommendations:', error);
                setUsers([]);
            }
        };

        fetchUserInfo();
    }, [cookies.token]);

    useEffect(() => {
        fetchGameNews();
        fetchPopularGames();
    }, []);

    const handleFriendRequest = async () => {
        try {
          const token = cookies.token;
          const response = await axios.post('/friend/', {
            receiverId: selectedUser.id,
          }, {
            headers: {
              Authorization: `${token}`,
            },
          });
    
          const updatedUsers = users.map(user =>
            user.id === selectedUser.id ? { ...user, requested: true } : user
          );
    
          setUsers(updatedUsers);
          setOpen(false);
          setSnackbarMessage(response.data.data.message);
          setIsSnackbarOpen(true);
        } catch (error) {
          console.error('Error sending friend request:', error);
        }
      };

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
        users[(currentIndex + 1) % users.length],
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
        autoplaySpeed: 3000,
    };

    const handleSnackbarClose = () => {
        setIsSnackbarOpen(false);
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
                <Box display={'flex'} alignContent={'center'} justifyContent={'space-between'}>
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
                        }}
                    >
                        <a href="/recommend" className="more-link">
                            더 보기 &gt;
                        </a>
                    </Typography>
                </Box>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" position="relative" width="100%">
                <Box>
                    <IconButton
                        onClick={handlePrev}
                        className="carousel-button"
                        sx={{ position: 'absolute', left: '15%', top: '20%', zIndex: 2 }}
                    >
                        <ArrowBackIos />
                    </IconButton>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        className="user-card-container"
                        mx={1}
                    >
                        {visibleUsers.map(
                            (user, index) =>
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
                                        <Avatar
                                            src={user.userProfile} // S3 URL
                                            alt="User Profile"
                                            style={{
                                                width: '60px', height: '60px',
                                                transform: index === 1 ? 'scale(1.7)' : 'scale(0.9)',
                                                opacity: index === 1 ? 1 : 0.6,
                                                transition: 'transform 0.3s, opacity 0.3s',
                                                marginLeft: 6,
                                                marginRight: 6,
                                                marginBottom: index === 1 ? '40px' : '0px',
                                            }}
                                            onError={(e) => {
                                                e.target.onerror = null; // prevents looping
                                                e.target.src = {profilePlaceholder}; // 대체 이미지 경로
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
                        )}
                    </Box>
                    <IconButton
                        onClick={handleNext}
                        className="carousel-button"
                        sx={{ position: 'absolute', right: '15%', top: '20%', zIndex: 2 }}
                    >
                        <ArrowForwardIos />
                    </IconButton>
                    <Box>
                        {visibleUsers.map(
                            (user, index) =>
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
                                                <Box
                                                    className="tags"
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center', // 중앙 정렬
                                                        alignItems: 'center', // 수직 정렬
                                                        gap: 1,
                                                        flexWrap: 'wrap',
                                                        marginTop: '10px',
                                                    }}
                                                >
                                                    {visibleUsers[1].common_genre.map((genre, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={genre}
                                                            size="small"
                                                            sx={{
                                                                fontSize: '10px',
                                                                backgroundColor: 'rgba(10, 8, 138, 0.8)',
                                                                color: 'white',
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                                <Box
                                                    className="modal-tags"
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center', // 중앙 정렬
                                                        alignItems: 'center', // 수직 정렬
                                                        gap: 1,
                                                        flexWrap: 'wrap',
                                                        marginTop: '10px',
                                                    }}
                                                >
                                                    {visibleUsers[1].common_play_time.map((time, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={time}
                                                            size="small"
                                                            sx={{
                                                                fontSize: '10px',
                                                                backgroundColor: 'rgba(93, 90, 224, 0.8)',
                                                                color: 'white',
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            </>
                                        )}
                                    </Box>
                                )
                        )}
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
                >
                    🔥 스팀 인기 게임
                </Typography>
                {loadingGames ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <CircularProgress />
                        {apiError && (
                            <Typography
                                variant="body1"
                                color="error"
                                sx={{
                                    marginTop: '20px',
                                    fontFamily: 'Roboto, sans-serif',
                                    fontWeight: 500,
                                }}
                            >
                                잠시 후 다시 시도해주세요.
                            </Typography>
                        )}
                    </Box>
                ) : (
                    <List>
                        {popularGames.map((game, index) => (
                            <ListItem key={index} component={Paper} sx={{ mb: 2 }}>
                                <ListItemAvatar>
                                    <Avatar src={game.image} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                            {`${game.rank}. ${game.title}`}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
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
                >
                    📰 업데이트된 스팀 게임
                </Typography>
                {loadingNews ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <CircularProgress />
                        {apiError && (
                            <Typography
                                variant="body1"
                                color="error"
                                sx={{
                                    marginTop: '20px',
                                    fontFamily: 'Roboto, sans-serif',
                                    fontWeight: 500,
                                }}
                            >
                                잠시 후 다시 시도해주세요.
                            </Typography>
                        )}
                    </Box>
                ) : (
                    <List>
                        {gameNews.map((news, index) => (
                            <ListItem key={index} component={Paper} sx={{ mb: 2 }}>
                                <ListItemAvatar>
                                    <Avatar src={news.image} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                            {news.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
                                            {news.content}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="user-info-modal"
                aria-describedby="user-info-modal-description"
            >
                <Box className="modal-box"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 1,
                    }}
                >
                    {selectedUser && (
                        <>
                            <Avatar
                                            src={selectedUser.userProfile} // S3 URL
                                            alt="Profile"
                                            className="modal-profile-pic"
                                            style={{
                                                width: '80px', height: '80px',
                                            }}
                                            onError={(e) => {
                                                e.target.onerror = null; // prevents looping
                                                e.target.src = {profilePlaceholder}; // 대체 이미지 경로
                                            }}
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
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontFamily: 'Roboto, sans-serif',
                                        fontWeight: 600,
                                        fontSize: '10pt',
                                        letterSpacing: '-0.5px',
                                    }}
                                >
                                    공통 장르
                                </Typography>
                                {selectedUser.common_genre.map((genre, index) => (
                                    <span key={index} className="tag1">
                                        {genre}
                                    </span>
                                ))}
                            </Box>
                            <Box className="modal-tags">
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontFamily: 'Roboto, sans-serif',
                                        fontWeight: 600,
                                        fontSize: '10pt',
                                        letterSpacing: '-0.5px',
                                    }}
                                >
                                    공통 시간대
                                </Typography>
                                {selectedUser.common_play_time.map((time, index) => (
                                    <span key={index} className="tag2">
                                        {time}
                                    </span>
                                ))}
                            </Box>
                            <Box mt={2}>
                                <Button variant="outlined" onClick={handleFriendRequest}>
                                    친구 요청
                                </Button>
                                <Button variant="contained" onClick={handleClose} style={{ marginLeft: '8px' }}>
                                    닫기
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>

            {/* 친구 요청 완료 알림 */}
            <Snackbar
                open={isSnackbarOpen}
                autoHideDuration={1000}
                onClose={handleSnackbarClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                sx={{
                    top: '50%',
                    width: '80%', 
                    maxWidth: '400px', // 최대 너비 설정 (모바일 화면 대응)
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ 
                    width: '100%',
                    backgroundColor: 'rgba(10, 8, 138, 0.8)', // 배경 색상
                    color: '#ffffff', // 텍스트 색상
                    fontSize: '11px',
                    }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Home;
