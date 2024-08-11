import React, { useState } from 'react';
import { Box, Typography, Button, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const JoinAdditional = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { username, password, nickname } = location.state || {}; // 전달된 상태를 받습니다.

    const genresList = ['FPS', 'RPG', '전략', '액션', '시뮬레이션'];
    const timesList = ['AM 9:00 ~ AM 11:00', 'AM 11:00 ~ PM 2:00', 'PM 2:00 ~ PM 5:00', 'PM 5:00 ~ PM 8:00',
        'PM 8:00 ~ PM 11:00', 'PM 11:00 ~ AM 3:00', 'AM 3:00 ~ AM 9:00'];

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
        const formattedPreferredGenres = preferredGenres.map(genre => genre ? 1 : 0);
        const formattedPlayTimes = playTimes.map(time => time ? 1 : 0);

        const postData = {
            username,
            password,
            nickname,
            preferredGenres: formattedPreferredGenres,
            playTimes: formattedPlayTimes
        };

        console.log("Sending data to backend:", postData);

        try {
            const response = await axios.post('http://localhost:8080/join', postData);

            if (response.status === 200) {
                navigate('/login');
            }
        } catch (error) {
            console.error('회원가입 실패:', error);
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <Box sx={{ padding: 2, maxWidth: '370px', margin: 'auto', marginTop: '50px' }}>
            <Typography variant="h4" align="center">선호 장르 및 시간대 선택</Typography>
            <Box sx={{ marginTop: 3 }}>
                <Typography variant="h6">선호 장르</Typography>
                {genresList.map((genre, index) => (
                    <FormControlLabel
                        key={genre}
                        control={<Checkbox checked={preferredGenres[index]} onChange={() => handleGenreChange(index)} />}
                        label={genre}
                    />
                ))}
            </Box>
            <Box sx={{ marginTop: 3 }}>
                <Typography variant="h6">플레이 시간대</Typography>
                {timesList.map((time, index) => (
                    <FormControlLabel
                        key={time}
                        control={<Checkbox checked={playTimes[index]} onChange={() => handleTimeChange(index)} />}
                        label={time}
                    />
                ))}
            </Box>
            <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} sx={{ marginTop: '16px' }}>
                가입 완료
            </Button>
        </Box>
    );
};

export default JoinAdditional;
