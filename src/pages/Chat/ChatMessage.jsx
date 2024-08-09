import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

function ChatMessage({ chatRoomId, content, id, time, type, writer, userNickname }) {
    useEffect(() => {
        // console.log(`writer is ${writer}`);
        // console.log(`userNickName is ${userNickname}`);
    }, []);

    if (type === 'CHAT' && writer !== userNickname) {
        return (
            <Container>
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
            </Container>
        );
    }

    if (type === 'CHAT' && writer === userNickname) {
        return (
            <Container>
                <Grid container sx={{ mb: 1.2 }}>
                    <Grid xs={12}>
                        <Typography sx={{ fonstSize: 25, textAlign: 'right' }}>{content}</Typography>
                    </Grid>
                    <Grid xs={12}>
                        <Typography sx={{ fontSize: 13, color: 'gray', textAlign: 'right' }}>{time}</Typography>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}
export default ChatMessage;
