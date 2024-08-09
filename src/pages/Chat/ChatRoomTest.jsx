import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { api } from '../../apis/customAxios';
import { useCookies } from 'react-cookie';

const ChatRoomTest = () => {
    const [cookies] = useCookies(['token']);
    // 채팅방제목인풋
    const [inputTitle, setInputTitle] = useState('');
    // 채팅방인원인풋
    const [inputMemberCnt, setinputMemberCnt] = useState('');
    // 채팅방번호 인풋
    const [inputRoomId, setInputRoomId] = useState('');
    // 초대인원 인풋
    const [inputMemberUsername, setInputMemberUsername] = useState('');

    const inputTitleHandler = (event) => {
        setInputTitle(event.target.value);
    };

    const inputMemberCntHandler = (event) => {
        setinputMemberCnt(event.target.value);
    };

    const inputRoomIdHandler = (event) => {
        setInputRoomId(event.target.value);
    };

    const inputMemberUsernameHandler = (event) => {
        setInputMemberUsername(event.target.value);
    };

    const CreateRoomBtnHandler = async () => {
        try {
            const response = await api.post(
                '/chat/',
                {
                    chatTitle: inputTitle,
                    memberCnt: inputMemberCnt,
                },
                {
                    headers: {
                        Authorization: cookies.token,
                    },
                    withCredentials: true, // 쿠키 포함 설정
                }
            );

            console.log(response);
        } catch (error) {
            console.error('Error creating chat room:', error);
        }
    };

    const CreateAddMemberBtnHandler = async () => {
        try {
            const response = await api.post(
                '/chat/addmember',
                {
                    chatRoomId: inputRoomId,
                    addMemberUsername: inputMemberUsername,
                },
                {
                    headers: {
                        Authorization: cookies.token,
                    },
                    withCredentials: true, // 쿠키 포함 설정
                }
            );

            console.log(response);
        } catch (error) {
            console.error('Error addMember:', error);
        }
    };

    return (
        <Container maxWidth="lg">
            <Grid container spacing={2}>
                <Grid xs={12}>
                    <Box sx={{ mt: 3 }}>
                        <TextField
                            id="outlined-basic"
                            label="방제목"
                            variant="outlined"
                            value={inputTitle}
                            onChange={inputTitleHandler}
                        />
                    </Box>
                    <Box sx={{ mt: 3 }}>
                        <TextField
                            id="outlined-basic"
                            label="참가인원"
                            variant="outlined"
                            value={inputMemberCnt}
                            onChange={inputMemberCntHandler}
                        />
                    </Box>
                </Grid>
                <Grid xs={12}>
                    <Box>
                        <Button variant="contained" sx={{ ml: 5, mt: 3, p: 2 }} onClick={CreateRoomBtnHandler}>
                            채팅방생성
                        </Button>
                    </Box>
                </Grid>
                <Grid xs={12}>
                    <Box sx={{ mt: 3 }}>
                        <TextField
                            id="outlined-basic"
                            label="방ID"
                            variant="outlined"
                            value={inputRoomId}
                            onChange={inputRoomIdHandler}
                        />
                    </Box>
                </Grid>
                <Grid xs={12}>
                    <Box sx={{ mt: 3 }}>
                        <TextField
                            id="outlined-basic"
                            label="추가멤버 아이디"
                            variant="outlined"
                            value={inputMemberUsername}
                            onChange={inputMemberUsernameHandler}
                        />
                    </Box>
                </Grid>
                <Grid xs={12}>
                    <Box>
                        <Button variant="contained" sx={{ ml: 5, mt: 3, p: 2 }} onClick={CreateAddMemberBtnHandler}>
                            멤버추가
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ChatRoomTest;
