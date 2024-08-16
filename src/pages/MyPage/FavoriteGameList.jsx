import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Box, Typography, List, ListItem, IconButton, Modal, Button, Snackbar, Alert, Divider } from '@mui/material';
import FavoriteGames from './FavoriteGames';
import { useNavigate } from 'react-router-dom';

const FavoriteGameList = () => {
    const [cookies] = useCookies(['token']);
    const [games, setGames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserGames = async () => {
            try {
                const response = await axios.get('/games/my-games', {
                    headers: {
                        Authorization: cookies.token,
                    },
                    params: { page: 0, size: 10 } // 페이지네이션 설정
                });
                console.log(response.data); // 응답 데이터 구조 확인
                if (response.status === 200 && response.data.data.content) {
                    setGames(response.data.data.content); // 게임 목록 저장
                } else {
                    console.error('Expected data not found in response', response.data);
                }
            } catch (error) {
                console.error('선호 게임 목록을 가져오는 데 실패했습니다:', error);
            }
        };

        fetchUserGames();
    }, [cookies.token]);

    return (
        <FavoriteGames games={games} />
    );
};

export default FavoriteGameList;
