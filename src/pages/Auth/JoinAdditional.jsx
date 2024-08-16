import React, { useState } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const JoinAdditional = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { username, password, nickname } = location.state || {}; // 전달된 상태를 받습니다.

    const genresList = ['FPS', 'RPG', '전략', '액션', '시뮬레이션'];
    const timesList = [
        'AM 9:00 ~ AM 11:00',
        'AM 11:00 ~ PM 2:00',
        'PM 2:00 ~ PM 5:00',
        'PM 5:00 ~ PM 8:00',
        'PM 8:00 ~ PM 11:00',
        'PM 11:00 ~ AM 3:00',
        'AM 3:00 ~ AM 9:00',
    ];

    const [preferredGenres, setPreferredGenres] = useState(Array(genresList.length).fill(false));
    const [playTimes, setPlayTimes] = useState(Array(timesList.length).fill(false));

    const handleGenreChange = (index) => {
        const newGenres = [...preferredGenres];
        newGenres[index] = !newGenres[index];
        setPreferredGenres(newGenres);
    };

    const handleTimeChange = (index) => {
        const newTimes = [...playTimes];
        newTimes[index] = !newTimes[index];
        setPlayTimes(newTimes);
    };

    const handleSubmit = async () => {
        const formattedPreferredGenres = preferredGenres.map((genre) => (genre ? 1 : 0));
        const formattedPlayTimes = playTimes.map((time) => (time ? 1 : 0));

        const postData = {
            username,
            password,
            nickname,
            preferredGenres: formattedPreferredGenres,
            playTimes: formattedPlayTimes,
        };

        console.log('Sending data to backend:', postData);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/join`, postData);

            if (response.status === 200) {
                navigate('/auth');
            }
        } catch (error) {
            console.error('회원가입 실패:', error);
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <Box sx={{ padding: 2, maxWidth: '370px', margin: 'auto', marginTop: '50px' }}>
            <Typography
                variant="h6"
                sx={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 700,
                    fontSize: '16pt',
                    letterSpacing: '-0.5px',
                    marginBottom: '20px',
                }}
            >
                선호 장르 및 시간대 선택
            </Typography>
            <Typography
                variant="h6"
                sx={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 600,
                    fontSize: '10pt',
                    letterSpacing: '-0.5px',
                    marginBottom: '20px',
                }}
            >
                게임 메이트 추천을 위한 정보를 입력해주세요!
            </Typography>
            <Divider sx={{ backgroundColor: 'rgba(128, 128, 128, 0.3)', width: '100%', mb: 2 }} />
            <Box sx={{ marginTop: 3 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 600,
                        fontSize: '13pt',
                    }}
                >
                    👾 선호 장르
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    {genresList.map((genre, index) => (
                        <Box
                            key={genre}
                            onClick={() => handleGenreChange(index)}
                            sx={{
                                padding: '8px 14px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                backgroundColor: preferredGenres[index] ? '#0A088A' : '#5D5AE0',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                textAlign: 'center',
                                transition: 'background-color 0.3s',
                            }}
                        >
                            {genre}
                        </Box>
                    ))}
                </Box>
            </Box>
            <Box sx={{ marginTop: 3 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 600,
                        fontSize: '13pt',
                    }}
                >
                    🎮 플레이 시간대
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    {timesList.map((time, index) => (
                        <Box
                            key={time}
                            onClick={() => handleTimeChange(index)}
                            sx={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                backgroundColor: playTimes[index] ? '#0A088A' : '#5D5AE0',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                textAlign: 'center',
                                transition: 'background-color 0.3s',
                            }}
                        >
                            {time}
                        </Box>
                    ))}
                </Box>
            </Box>
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
                sx={{
                    marginTop: '16px',
                    background: '#0A088A',
                    '&:hover': { backgroundColor: '#5D5AE0' },
                    marginTop: '50px',
                }}
            >
                가입 완료
            </Button>
        </Box>
    );
};

export default JoinAdditional;
