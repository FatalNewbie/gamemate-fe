import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { useEffect, useState } from 'react';
import { api } from '../../apis/customAxios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import profilePlaceholder from '../../assets/profile_placeholder.png';

const ChatRoom = ({ roomId, title, leaderNickName, memberCnt, leaderProfile }) => {
    const [nowMemberCnt, setNowMemberCnt] = useState('');
    // 쿠키
    const [cookies] = useCookies(['token']);
    const navigate = useNavigate();

    const getNowMemberCnt = async () => {
        try {
            const data = await api.get(`/chat/${roomId}`, {
                headers: {
                    Authorization: cookies.token,
                },
            });
            setNowMemberCnt(data);
        } catch (error) {
            console.error('Error fetching chat rooms:', error);
        }
    };

    const chatRoomBtnHandler = () => {
        navigate('/ChatWindow', {
            state: { roomId: roomId, title: title, leaderNickname: leaderNickName, memberCnt: memberCnt },
        });
    };

    useEffect(() => {
        // 서버에서 채팅방 가져옴
        getNowMemberCnt();
    }, []);

    return (
        <Box>
            <Grid container sx={{ padding: 0, margin: 0 }}>
                <Grid xs={12} sx={{ padding: 0, margin: 0 }} display="flex" justifyContent="center">
                    <Box sx={{ padding: 0, margin: 0 }}>
                        <Button
                            sx={{
                                width: 350,
                                height: 150,
                                padding: 0,
                                mb: 3,
                                boxShadow: 2, // 기본 그림자 효과
                                borderColor: '#d3d3d3', // 테두리 색상을 회색으로 설정
                                '&:hover': {
                                    boxShadow: 4, // 호버 시 그림자 효과를 더 강하게
                                    borderColor: '#d3d3d3', // 호버 시 테두리 색상 유지
                                    backgroundColor: 'transparent', // 호버 시 배경색 유지
                                },
                            }}
                            variant="outlined"
                            onClick={chatRoomBtnHandler}
                        >
                            <Grid container sx={{ pt: 2, margin: 0, width: '100%', height: '100%' }}>
                                <Grid xs={12} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                    <Typography
                                        sx={{
                                            fontSize: 25,
                                            color: 'black',
                                            textAlign: 'left',
                                            ml: 2,
                                            fontWeight: 600,
                                            fontFamily: '"Sunflower", sans-serif',
                                        }}
                                    >
                                        {title}
                                    </Typography>
                                </Grid>
                                <Grid xs={12} sx={{ height: 40 }}></Grid>
                                <Grid xs={6} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                    <Avatar
                                        alt="profile"
                                        src={leaderProfile || profilePlaceholder}
                                        sx={{
                                            width: 35, // 원하는 크기로 설정
                                            height: 35,
                                            border: '2px solid white', // 테두리 추가
                                            ml: 1,
                                            mb: 0.5,
                                            mt: 0.5,
                                        }}
                                    ></Avatar>
                                    <Typography
                                        sx={{
                                            fontSize: 29,
                                            color: 'black',
                                            textAlign: 'left',
                                            ml: 1.0,
                                            mt: 0.2,
                                            mb: 1,
                                            fontWeight: 600,
                                            fontFamily: '"Gamja Flower", sans-serif',
                                        }}
                                    >
                                        {leaderNickName}
                                    </Typography>
                                </Grid>
                                <Grid xs={6}>
                                    <Box
                                        sx={{
                                            backgroundColor: 'rgb(12, 9, 151)', // 배경색 설정
                                            borderRadius: '8px', // 모서리를 둥글게
                                            width: 80,
                                            height: 30,
                                            display: 'flex', // Flexbox 사용
                                            justifyContent: 'flex-end', // 오른쪽 정렬
                                            alignItems: 'center', // 세로 중앙 정렬
                                            ml: 9.0,
                                            mt: 1.5,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: 20,
                                                color: 'white',
                                                textAlign: 'right',
                                                mr: 2.5,
                                                mt: 1.5,
                                                mb: 1,
                                            }}
                                        >
                                            {nowMemberCnt} / {memberCnt}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
export default ChatRoom;
