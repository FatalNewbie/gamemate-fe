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
    // 로딩
    const [isLoading, setIsLoading] = useState(true);

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
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // 서버에서 채팅방 가져옴
        getAllChatRooms();
    }, []);

    useEffect(() => {
        getAllChatRooms();
    }, [cookies.token]);

    useEffect(() => {
        chatRooms.forEach((chatRoom) => {
            console.log(`${chatRoom.id}, ${chatRoom.title}`);
        });
    }, [chatRooms]);

    if (isLoading) {
        return <div>roading...</div>;
    }

    if (chatRooms.length === 0) {
        return <div>참여한 채팅방이 없습니다. 게임메이트 메뉴에서 원하는 채팅방에 참여해보세요!</div>;
    }

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
