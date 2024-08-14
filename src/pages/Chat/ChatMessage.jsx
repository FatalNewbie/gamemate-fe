import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useEffect, useState, useRef } from 'react';
import { api } from '../../apis/customAxios';
import { useCookies } from 'react-cookie';
import profilePlaceholder from '../../assets/profile_placeholder.png';
import Avatar from '@mui/material/Avatar';

function ChatMessage({
    chatRoomId,
    content,
    id,
    time,
    type,
    writer,
    userNickname,
    leaderNickname,
    reloadMessage,
    writerId,
    writerProfile,
    reRenderingMessages,
}) {
    // 쿠키
    const [cookies] = useCookies(['token']);
    // 컴포넌트 제거 상태 추가
    const isRemovedRef = useRef(false);

    useEffect(() => {
        // console.log(`writer is ${writer}`);
        //console.log(`userNickName is ${userNickname}`);
        //console.log(`writer id is ${writerId}`);
    }, []);

    const rejectButtonHandler = async (event) => {
        isRemovedRef.current = true;
        try {
            const response = await api.delete(`/message/${id}`, {
                headers: {
                    Authorization: cookies.token,
                },
            });

            console.log(response);
        } catch (error) {
            console.error('Error deleting message:', error);
        } finally {
            reRenderingMessages();
        }
    };

    const acceptButtonHandler = async (event) => {
        isRemovedRef.current = true;
        try {
            const response = await api.post(
                `/chat/addmember`,
                {
                    chatRoomId: chatRoomId,
                    writerId: writerId,
                },
                {
                    headers: {
                        Authorization: cookies.token,
                    },
                }
            );

            console.log(response);
        } catch (error) {
            console.error('Error addmember:', error);
        } finally {
            try {
                const response = await api.delete(`/message/${id}`, {
                    headers: {
                        Authorization: cookies.token,
                    },
                });

                console.log(response);
            } catch (error) {
                console.error('Error deleting message:', error);
            } finally {
                reRenderingMessages();
            }
        }
    };

    // 컴포넌트가 제거된 경우 null 반환
    if (isRemovedRef.current) return null;

    // --------------------------------------------------------------------상대방 메시지--------------------------------------------------------------------------
    if (type === 'CHAT' && writer !== userNickname) {
        return (
            <Box>
                <Grid container>
                    <Grid
                        xs={2}
                        justifyContent="center" // 가로 중앙 정렬
                        alignItems="center" // 세로 중앙 정렬
                        style={{ height: '100%' }} // Grid의 높이를 100%로 설정
                    >
                        <Avatar
                            alt="profile"
                            src={writerProfile || profilePlaceholder}
                            sx={{
                                width: 45, // 원하는 크기로 설정
                                height: 45,
                                border: '2px solid white', // 테두리 추가
                                mt: 1.5,
                            }}
                        />
                    </Grid>

                    <Grid xs={10}>
                        <Box>
                            <Grid container sx={{ mb: 1.2 }}>
                                <Grid xs={12} sx={{ mb: 0.3 }}>
                                    <Typography
                                        sx={{ fontSize: 20, fontWeight: 600, fontFamily: '"Gamja Flower", sans-serif' }}
                                    >
                                        {writer}
                                    </Typography>
                                </Grid>
                                <Grid xs={12}>
                                    <Typography
                                        sx={{
                                            fontSize: '18px', //채팅 글씨 크기 이거임----------------------------------------상대방 메시지내용 글씨 크기
                                            backgroundColor: 'RGB(227,254,147)',
                                            display: 'inline-block', // 텍스트 길이만큼만 배경색 적용
                                            borderRadius: '5px', // 모서리 둥글게
                                            pr: 1,
                                            pl: 1,
                                            pt: 0,
                                            pb: 0,
                                            fontWeight: 400,
                                            fontFamily: '"Noto Sans KR", sans-serif',
                                        }}
                                    >
                                        {content}
                                    </Typography>
                                </Grid>
                                <Grid xs={12}>
                                    <Typography sx={{ fontSize: 13, color: 'gray' }}>{time}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        );
    }

    // --------------------------------------------------------------------내 메시지--------------------------------------------------------------------------
    if (type === 'CHAT' && writer === userNickname) {
        return (
            <Box>
                <Grid container sx={{ mb: 1.2 }}>
                    <Grid xs={12} sx={{ textAlign: 'right' }}>
                        <Typography
                            sx={{
                                fontSize: '18px', //채팅 글씨 크기 이거임---------------------------------------- 상대방 메시지내용 글씨 크기
                                textAlign: 'right',
                                backgroundColor: 'RGB(210,207,254)',
                                display: 'inline-block', // 텍스트 길이만큼만 배경색 적용
                                pr: 1,
                                pl: 1,
                                pt: 0,
                                pb: 0,
                                borderRadius: '5px', // 모서리 둥글게
                                fontWeight: 400,
                                fontFamily: '"Noto Sans KR", sans-serif',
                            }}
                        >
                            {content}
                        </Typography>
                    </Grid>
                    <Grid xs={12}>
                        <Typography sx={{ fontSize: 13, color: 'gray', textAlign: 'right' }}>{time}</Typography>
                    </Grid>
                </Grid>
            </Box>
        );
    }

    // --------------------------------------------------------------------입장신청 메시지--------------------------------------------------------------------------
    if (type === 'INVITE' && userNickname === leaderNickname)
        return (
            <Box>
                <Grid container>
                    <Grid xs={12}>
                        <Box>
                            <Grid
                                container
                                spacing={1}
                                sx={{ boxShadow: 2, borderRadius: 2, pt: 1, pb: 1, bgcolor: 'grey.300' }}
                            >
                                <Grid xs={12}>
                                    <Typography sx={{ fonstSize: 17, textAlign: 'center' }}>
                                        '{writer}' 가 채팅방에 들어오고 싶어합니다.
                                    </Typography>
                                </Grid>
                                <Grid
                                    xs={6}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        sx={{
                                            width: 90,
                                            bgcolor: 'rgb(37, 177, 62)',
                                            '&:hover': {
                                                bgcolor: 'rgb(28, 140, 48)', // 마우스 오버 시 색상
                                            },
                                        }}
                                        onClick={acceptButtonHandler}
                                    >
                                        수락
                                    </Button>
                                </Grid>
                                <Grid
                                    xs={6}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        sx={{
                                            width: 90,
                                            bgcolor: 'rgb(251, 13, 0)',
                                            '&:hover': {
                                                bgcolor: 'rgb(230, 10, 0)', // 마우스 오버 시 색상
                                            },
                                        }}
                                        onClick={rejectButtonHandler}
                                    >
                                        거절
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                    <Grid xs={12}>
                        <Typography sx={{ fontSize: 13, color: 'gray', textAlign: 'right' }}>{time}</Typography>
                    </Grid>
                </Grid>
            </Box>
        );
}
export default ChatMessage;
