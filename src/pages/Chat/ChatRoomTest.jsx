import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useEffect, useState, useRef } from 'react';
import { api } from '../../apis/customAxios';
import { useCookies } from 'react-cookie';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const ChatRoomTest = () => {
    const [cookies] = useCookies(['token']);
    // 채팅방제목인풋
    const [inputTitle, setInputTitle] = useState('');
    // 채팅방인원인풋
    const [inputMemberCnt, setinputMemberCnt] = useState('');
    // 채팅방번호 인풋
    const [inputRoomId, setInputRoomId] = useState('');
    // let stompClient = null;
    const stompClientRef = useRef(null);
    // 로그인한 유저 정보 서버에서 가져와서 들고있는 변수
    const [userNickname, setUserNicnkname] = useState('');
    // 유저정보 불러올떄까지 로딩
    const [isLoading, setIsLoading] = useState(true);

    const inputTitleHandler = (event) => {
        setInputTitle(event.target.value);
    };

    const inputMemberCntHandler = (event) => {
        setinputMemberCnt(event.target.value);
    };

    const inputRoomIdHandler = (event) => {
        setInputRoomId(event.target.value);
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
        var socket = new SockJS(`${process.env.REACT_APP_API_URL}/ws`);

        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000, // 자동 재연결을 위한 지연 시간 (밀리초)
            connectHeaders: {
                Authorization: cookies.token,
            },
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                console.log('온커넥트 호출 ' + inputRoomId);
                stompClientRef.current = client; // 이 부분에서 stompClient를 상태로 설정이 아니고 client할당

                // onConnected(roomId);
                // 그냥 이렇게 해서 onConneted 안에서 StompClient 가져다 써버리면 비동기문제로 StompClient가 null인 상태로 가져와버림.
                // 아래와 같이 함께 넘겨줌.
                //console.log(` stompCleint set후에 검사 : ${stompClient}`);

                subscibeAndSendInvite(client, inputRoomId);
            },
            onStompError: (frame) => {
                console.error(`Broker reported error: ${frame.headers.message}`);
                console.error(`Additional details: ${frame.body}`);
            },
            onWebSocketClose: (event) => {
                console.error(`WebSocket closed: ${event}`);
            },
        });

        client.activate();
    };

    const subscibeAndSendInvite = (client) => {
        console.log(`onConnected called with roomId: ${inputRoomId}`);
        if (!inputRoomId) {
            console.error('roomId is undefined in onConnected');
            return;
        }

        if (!client) {
            console.error('stompClient is null in onConnected');
            return;
        }

        try {
            // 구독 요청을 보냅니다.
            const subscription = client.subscribe('/topic/chat/' + inputRoomId, null, {
                ack: 'auto', // 자동 메시지 확인
            });

            console.log(`Successfully subscribed to room ${inputRoomId}`);
        } catch (error) {
            console.error('Error during subscription:', error);
        } finally {
            sendIntive();
        }
    };

    const sendIntive = () => {
        // 메시지 내용이 비어 있지 않고(messageContent가 존재) stompClient가 유효한 경우에만 메시지를 전송
        if (inputRoomId && stompClientRef.current) {
            console.log('Stompclient in sendMessage is :', stompClientRef.current);
            let chatMessage = {
                writer: userNickname,
                content: 'invite message',
                chatRoomId: inputRoomId,
                type: 'INVITE',
            };

            // stompClient.send 메서드를 사용하여 서버로 메시지를 전송. 이때 메시지는 JSON 형식으로 문자열화(JSON.stringify)
            // 메시지는 /app/message/send/${chatUuid} 경로로 전송
            // stompClient.send('/app/message/send/' + roomId, {}, JSON.stringify(chatMessage));
            // @stomp/stompjs에서는 send대신 publish사용 하는듯함.
            stompClientRef.current.publish({
                destination: '/app/message/send/' + inputRoomId,
                headers: {},
                body: JSON.stringify(chatMessage),
            });
        } else {
            console.error('STOMP client is not connected.');
            console.log(stompClientRef.current);
        }
    };

    // 서버에서 현재 로그인유저의 닉네임을 가져옴
    const getUserNickname = async () => {
        try {
            const response = await api.get(`/user`, {
                headers: {
                    Authorization: cookies.token,
                },
            });
            const data = response;
            console.log(`nickname is ${data}`);
            setUserNicnkname(data);
        } catch (error) {
            console.error('Error fetching get userNickname', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getUserNickname();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

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
                <Grid xs={12}></Grid>
                <Grid xs={12}>
                    <Box>
                        <Button variant="contained" sx={{ ml: 5, mt: 3, p: 2 }} onClick={CreateAddMemberBtnHandler}>
                            방참가신청
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ChatRoomTest;
