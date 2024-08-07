import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { api } from '../../apis/customAxios';
import { useCookies } from 'react-cookie';

const ChatRoom = ({ roomId, title, leaderNickname, memberCnt }) => {
    const [nowMemberCnt, setNowMemberCnt] = useState('');

    const getNowMemberCnt = async () => {
        // try {
        //     const data = await api.get(`/chat/${roomId}`, {
        //         headers: {
        //             Authorization: cookies.token,
        //         },
        //     });
        //     console.log(data);
        //     setChatRooms(data);
        // } catch (error) {
        //     console.error('Error fetching chat rooms:', error);
        // }
    };

    useEffect(() => {
        // 서버에서 채팅방 가져옴
        getNowMemberCnt();
    }, []);

    return (
        <Container>
            <Grid container sx={{ padding: 0, margin: 0 }}>
                <Grid xs={12} sx={{ padding: 0, margin: 0 }} display="flex" justifyContent="center">
                    <Box sx={{ padding: 0, margin: 0 }}>
                        <Button sx={{ width: 350, height: 150, padding: 0 }} variant="outlined">
                            <Grid container sx={{ pt: 2, margin: 0, width: '100%', height: '100%' }}>
                                <Grid xs={12} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                    <Typography sx={{ fontSize: 23, color: 'black', textAlign: 'left', ml: 2 }}>
                                        {title}
                                    </Typography>
                                </Grid>
                                <Grid xs={12} sx={{ height: 40 }}></Grid>
                                <Grid xs={6} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                    <Typography sx={{ fontSize: 20, color: 'black', textAlign: 'left', ml: 2 }}>
                                        {leaderNickname}
                                    </Typography>
                                </Grid>
                                <Grid xs={6}>
                                    <Typography sx={{ fontSize: 20, color: 'black', textAlign: 'right', mr: 2 }}>
                                        {memberCnt}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};
export default ChatRoom;
