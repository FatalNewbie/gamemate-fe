import React from 'react';
import { api } from '../../apis/customAxios';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useCookies } from 'react-cookie';

import ChatRoom from './ChatRoom';

const Chat = () => {
    // 채팅방
    const [chatRooms, setChatRooms] = useState([]);
    // 쿠키
    const [cookies] = useCookies(['token']);

    const getAllChatRooms = async () => {
        try {
            const data = await api.get('/chat/', {
                headers: {
                    Authorization: cookies.token,
                },
            });
            console.log(data);
            setChatRooms(data);
        } catch (error) {
            console.error('Error fetching chat rooms:', error);
        }
    };

    useEffect(() => {
        // 서버에서 채팅방 가져옴
        getAllChatRooms();
    }, []);

    useEffect(() => {
        getAllChatRooms();
    }, [cookies.token]);

    return (
        <Container sx={{ padding: 0, margin: 0 }}>
            <Grid container sx={{ padding: 0, margin: 0 }}>
                <Grid xs={12}>
                    {chatRooms.map((chatRoom) => (
                        // key는 React.js에서만, map안에서 component들을 render할 때 사용한다.
                        <Box key={chatRoom.id} sx={{ padding: 0, margin: 0 }}>
                            {/* 채팅방 목록 가져옴 */}
                            <ChatRoom
                                roomId={chatRoom.id}
                                title={chatRoom.title}
                                leaderNickName={chatRoom.leaderNickname}
                                memberCnt={chatRoom.memberCnt}
                            />
                        </Box>
                    ))}
                </Grid>
            </Grid>
        </Container>
    );
};

export default Chat;
