import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useLocation } from 'react-router-dom';
import ChatMessage from './ChatMessage';
import { api } from '../../apis/customAxios';
import { useCookies } from 'react-cookie';

const ChatWindow = () => {
    // useLcation사용하여 navigate하면서 넘겨준 값 가져옴
    const location = useLocation();
    const { roomId, title, leaderNickName, memberCnt } = location.state || {};

    // 쿠키
    const [cookies] = useCookies(['token']);

    // let stompClient = null;
    const [stompClient, setStompClient] = useState(null);

    // 브로드캐스트 받은 메시지
    const [messages, setMessages] = useState([]);
    // 유저가 입력한 메시지
    const [inputMessage, setInputMessage] = useState('');

    // 스크롤을 자동으로 하단으로 내리기 위한 ref
    const messagesEndRef = useRef(null);

    // 로그인한 유저 정보 서버에서 가져와서 들고있는 변수
    const [userNickname, setUserNicnkname] = useState('');

    // 유저정보 불러올떄까지 로딩
    const [isLoading, setIsLoading] = useState(true);

    // 구독을 담당하는 useEffect
    useEffect(() => {
        // 이전 메시지 삭제.
        setMessages([]);

        // 이전 메시지들 DB에서 가져옴.
        getPrevMessages();

        // /ws 경로로 새로운 SockJS 소켓을 생성합니다.
        // SockJS는 웹소켓을 지원하지 않는 브라우저에서도 동작할 수 있도록 도와주는 라이브러리입니다.
        var socket = new SockJS('http://localhost:8080/ws');

        // 생성된 SockJS 소켓을 사용하여 STOMP 클라이언트를 생성합니다.
        // STOMP는 메시징 프로토콜로, 웹소켓을 통해 메시지를 주고받을 수 있게 합니다.
        //  최신 @stomp/stompjs 라이브러리에서는 Stomp.over 메서드가 팩토리를 받아야 합니다.
        //stompClient = Stomp.over(socket);
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000, // 자동 재연결을 위한 지연 시간 (밀리초)
            connectHeaders: {
                login: leaderNickName,
                Authorization: cookies.token,
            },
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                console.log('온커넥트 호출 ' + roomId);
                setStompClient(client); // 이 부분에서 stompClient를 상태로 설정

                // onConnected(roomId);
                // 그냥 이렇게 해서 onConneted 안에서 StompClient 가져다 써버리면 비동기문제로 StompClient가 null인 상태로 가져와버림.
                // 아래와 같이 함께 넘겨줌.

                onConnected(client, roomId);
            },
            onStompError: (frame) => {
                console.error(`Broker reported error: ${frame.headers.message}`);
                console.error(`Additional details: ${frame.body}`);
            },
            onWebSocketClose: (event) => {
                console.error(`WebSocket closed: ${event}`);
            },
        });

        // stompClient.connect 메소드를 사용하여 서버에 연결
        // login 옵션으로 세션 스토리지에서 가져온 유저네임을 전달
        // 연결이 성공하면 onConnected 콜백 함수가 호출되며, 연결이 실패하면 onError 콜백 함수가 호출
        // login 메소드로 인증을 요청하는데 백에서 이 인증을 받는 부분을 구현하여 인증기능 추가 가능.
        // stompClient.connect(
        //     {
        //         login: user,
        //     },
        //     function () {
        //         console.log('온커넥트 호출');
        //         onConnected(roomId);
        //     }
        //     //onError
        // );

        client.activate();

        // 마운트 시: 컴포넌트가 마운트될 때, useEffect의 첫 번째 인자인 콜백 함수가 실행됩니다.
        // 클린업 함수: return () => { ... } 형태로 작성된 클린업 함수는 컴포넌트가 언마운트되거나, useEffect가 다시 실행되기 전에 호출됩니다.
        // 언마운트 시: 컴포넌트가 언마운트될 때 클린업 함수가 호출됩니다.
        // 의존성 변경 시: useEffect의 두 번째 인자인 의존성 배열(dependency array)에 포함된 값이 변경될 때도 클린업 함수가 호출됩니다.
        return () => {
            if (client) {
                client.deactivate();
            }
        };

        // ???
        setMessages([]);
    }, [roomId]);

    const onConnected = (client, roomId) => {
        // // Subscribe to the Public Topic
        // stompClient.subscribe('/topic/chat/' + roomId, onMessageReceived, {
        //     ack: 'auto', // 자동 메시지 확인
        // });
        // console.log(`Successfully subscribed to room ${roomId}`);

        console.log(`onConnected called with roomId: ${roomId}`);
        if (!roomId) {
            console.error('roomId is undefined in onConnected');
            return;
        }

        if (!client) {
            console.error('stompClient is null in onConnected');
            return;
        }

        try {
            // 구독 요청을 보냅니다.
            const subscription = client.subscribe('/topic/chat/' + roomId, onMessageReceived, {
                ack: 'auto', // 자동 메시지 확인
            });

            console.log(`Successfully subscribed to room ${roomId}`);
        } catch (error) {
            console.error('Error during subscription:', error);
        }
    };

    const onMessageReceived = (payload) => {
        let message = JSON.parse(payload.body);
        console.log(message);
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    const sendMessage = () => {
        console.log(inputMessage);
        console.log(inputMessage.trim());

        // 입력된 메시지 내용을 가져오고, trim() 메서드를 사용하여 앞뒤 공백을 제거합니다.
        let messageContent = inputMessage.trim();

        // 메시지 내용이 비어 있지 않고(messageContent가 존재) stompClient가 유효한 경우에만 메시지를 전송
        if (messageContent && stompClient) {
            console.log('Stompclient in sendMessage is :', stompClient);
            let chatMessage = {
                writer: leaderNickName,
                content: inputMessage,
                chatRoomId: roomId,
                type: 'CHAT',
            };

            // stompClient.send 메서드를 사용하여 서버로 메시지를 전송. 이때 메시지는 JSON 형식으로 문자열화(JSON.stringify)
            // 메시지는 /app/message/send/${chatUuid} 경로로 전송
            // stompClient.send('/app/message/send/' + roomId, {}, JSON.stringify(chatMessage));
            // @stomp/stompjs에서는 send대신 publish사용 하는듯함.
            stompClient.publish({
                destination: '/app/message/send/' + roomId,
                headers: {},
                body: JSON.stringify(chatMessage),
            });
        } else {
            console.error('STOMP client is not connected.');
            console.log(stompClient);
        }
    };

    // 이전 메시지 가져오는 함수.
    const getPrevMessages = async () => {
        try {
            const response = await api.get(`/message/${roomId}`, {
                headers: {
                    Authorization: cookies.token,
                },
            });
            const data = response;
            console.log('message is');
            console.log(response);
            // 받아온 값이 배열이 아닐 경우 Message를 빈배열로 저장
            if (Array.isArray(data)) {
                setMessages(data);
            } else {
                setMessages([]);
            }
        } catch (error) {
            console.error('Error fetching get messages:', error);
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

    // 스크롤 맨 아래로 옮기는 함수
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // 전송버튼 핸들러
    const sendMessageBtnHandler = () => {
        sendMessage();
        // 채팅입력창 비우기
        setInputMessage('');
    };

    // 채팅입력창 핸들러
    const inputMessageHandler = (event) => {
        setInputMessage(event.target.value);
    };

    const handleKeyDownHandler = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessageBtnHandler();
        }
    };

    useEffect(() => {
        getUserNickname();
    }, []);

    // 메시지 추가시마다 스크롤 맨 아래로
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <Box>
                <Grid container>
                    <Grid xs={12}>
                        <p>{title}</p>
                    </Grid>
                    <Grid xs={12} sx={{ height: 600, overflow: 'auto' }}>
                        {messages.map((message) => (
                            <Box key={message.id}>
                                <ChatMessage
                                    chatRoomId={message.chatRoomId}
                                    content={message.content}
                                    id={message.id}
                                    time={message.time}
                                    type={message.type}
                                    writer={message.writer}
                                    userNickname={userNickname}
                                ></ChatMessage>
                            </Box>
                        ))}
                        <div ref={messagesEndRef} />
                    </Grid>

                    <Grid xs={8}>
                        <TextField
                            id="outlined-basic"
                            variant="outlined"
                            value={inputMessage}
                            onChange={inputMessageHandler}
                            onKeyDown={handleKeyDownHandler}
                            sx={{ width: '100%' }}
                        />
                    </Grid>
                    <Grid xs={4}>
                        <Button
                            variant="contained"
                            onClick={sendMessageBtnHandler}
                            sx={{ height: '100%', width: 100, ml: 2 }}
                        >
                            전송
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};
export default ChatWindow;
