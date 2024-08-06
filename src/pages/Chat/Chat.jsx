import React from 'react';
import { Box, Typography } from '@mui/material';
import { api } from '../../apis/customAxios';
import { useEffect, useState } from 'react';

const Chat = () => {
    // 채팅방
    const [chatRooms, setChatRooms] = useState([]);

    const getAllChatRooms = async () => {
        try {
            const data = await api.get('/chat/');
            setChatRooms(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching chat rooms:', error);
        }
    };

    return (
        <Box>
            <Typography variant="h4">시작해볼까?</Typography>
            {/* 채팅 페이지의 나머지 내용 */}
        </Box>
    );
};

export default Chat;
