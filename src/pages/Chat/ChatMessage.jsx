import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { api } from '../../apis/customAxios';
import { useCookies } from 'react-cookie';

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
}) {
    // 쿠키
    const [cookies] = useCookies(['token']);

    useEffect(() => {
        // console.log(`writer is ${writer}`);
        //console.log(`userNickName is ${userNickname}`);
        //console.log(`writer id is ${writerId}`);
    }, []);

    const rejectButtonHandler = async (event) => {
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
            reloadMessage();
        }
    };

    const acceptButtonHandler = async (event) => {
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
                reloadMessage();
            }
        }
    };

    if (type === 'CHAT' && writer !== userNickname) {
        return (
            <Box>
                <Grid container sx={{ mb: 1.2 }}>
                    <Grid xs={12} sx={{ mb: 0.3 }}>
                        <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>{writer}</Typography>
                    </Grid>
                    <Grid xs={12}>
                        <Typography sx={{ fonstSize: 25 }}>{content}</Typography>
                    </Grid>
                    <Grid xs={12}>
                        <Typography sx={{ fontSize: 13, color: 'gray' }}>{time}</Typography>
                    </Grid>
                </Grid>
            </Box>
        );
    }

    if (type === 'CHAT' && writer === userNickname) {
        return (
            <Box>
                <Grid container sx={{ mb: 1.2 }}>
                    <Grid xs={12}>
                        <Typography sx={{ fonstSize: 25, textAlign: 'right' }}>{content}</Typography>
                    </Grid>
                    <Grid xs={12}>
                        <Typography sx={{ fontSize: 13, color: 'gray', textAlign: 'right' }}>{time}</Typography>
                    </Grid>
                </Grid>
            </Box>
        );
    }

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
