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
    const { roomId, title, leaderNickname, memberCnt } = location.state || {};

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

    // 현재의 스크롤 위치 ref
    const chatContainerRef = useRef(null);

    // 이전 스크롤 위치 ref
    const prevScrollHeightRef = useRef(0); // 이전 스크롤 높이를 저장할 ref

    // 사용자 스크롤 상태 관리
    const [isUserScrolled, setIsUserScrolled] = useState(false);

    // 로그인한 유저 정보 서버에서 가져와서 들고있는 변수
    const [userNickname, setUserNicnkname] = useState('');

    // 유저정보 불러올떄까지 로딩
    const [isLoading, setIsLoading] = useState(true);

    // 새로운 메시지 도착 알림 버튼의 display 속성값. 초기값 display=none
    const [newMessageArriveBtnDisplay, setNewMessageArriveBtnDisplay] = useState('none');

    // 서버에서 일정수의 채팅을 가져오기 위해 필요한 변수. 클라이언트에서 받은 메시지들 중 마지막 메시지의 id
    // const [lastMessageId, setLastMessageId] = useState(-1);
    const lastMessageIdRef = useRef(-1);

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
                login: leaderNickname,
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

    //웹소켓 연결성공시 호출, 구독요청
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

    // 웹소캣으로부터 메시지를 받았을때 처리하는 함수
    const onMessageReceived = (payload) => {
        let message = JSON.parse(payload.body);
        console.log(message);
        // 이전 메시지 상태를 가져와서 새로운 메시지를 추가
        setMessages((prevMessages) => {
            // 새로운 메시지를 포함한 새로운 배열 생성
            const updatedMessages = [...prevMessages, message];

            // 메시지를 정렬하여 'invite' 타입이 맨 마지막으로 가도록 함
            return updatedMessages.sort((a, b) => {
                if (a.type === 'INVITE' && b.type !== 'INVITE') return 1; // a가 'invite'이면 뒤로
                if (a.type !== 'INVITE' && b.type === 'INVITE') return -1; // b가 'invite'이면 앞으로
                return 0; // 같으면 순서 유지
            });
        });

        // 새로운 메시지 받았을때 스크롤이 최하단이 아니라면 새로운메시지버튼 보이게
        console.log('isUserScrolled? : ' + isUserScrolled);
        if (isUserScrolled) {
            setNewMessageArriveBtnDisplay('block');
        }
    };

    // 메시지 보내는 함수. 발행처리
    const sendMessage = () => {
        console.log(inputMessage);
        console.log(inputMessage.trim());

        // 입력된 메시지 내용을 가져오고, trim() 메서드를 사용하여 앞뒤 공백을 제거합니다.
        let messageContent = inputMessage.trim();

        // 메시지 내용이 비어 있지 않고(messageContent가 존재) stompClient가 유효한 경우에만 메시지를 전송
        if (messageContent && stompClient) {
            console.log('Stompclient in sendMessage is :', stompClient);
            let chatMessage = {
                writer: userNickname,
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

    // DB에서 이전 채팅 메시지 가져오는 함수.
    const getPrevMessages = async () => {
        try {
            console.log('lastMessageIdRef is : ' + lastMessageIdRef.current);
            const response = await api.get(`/message/${roomId}/${lastMessageIdRef.current}`, {
                headers: {
                    Authorization: cookies.token,
                },
            });
            const data = response.reverse();
            console.log('message is');
            console.log(response);
            // 받아온 값이 배열이 아닐 경우 Message를 빈배열로 저장
            if (Array.isArray(data)) {
                // 메시지를 정렬하여 상태에 저장. 초대 메시지를 맨 아래로
                const sortedMessages = data.sort((a, b) => {
                    // a가 'invite' 타입이면 1을 반환하여 b보다 뒤로 이동
                    if (a.type === 'INVITE' && b.type !== 'INVITE') return 1;
                    // b가 'invite' 타입이면 -1을 반환하여 a보다 앞으로 이동
                    if (a.type !== 'INVITE' && b.type === 'INVITE') return -1;
                    return 0; // 두 메시지 타입이 같으면 변화 없음
                });

                // 이전 스크롤 높이 저장
                prevScrollHeightRef.current = chatContainerRef.current.scrollHeight;

                // 기존 메시지와 새 메시지를 병합
                setMessages((prevMessages) => [...sortedMessages, ...prevMessages]);
                // 마지막 메시지 ID 업데이트 (가장 오래된 메시지의 ID를 사용할 경우)
                console.log('sortedMessages.length is : ' + sortedMessages.length);
                if (sortedMessages.length > 0) {
                    console.log('sortedMessages is');
                    console.log(sortedMessages);
                    lastMessageIdRef.current = sortedMessages[0].id;
                    console.log('Updated lastMessageId to: ' + lastMessageIdRef.current); // 확인용 로그
                }

                // 메시지 업데이트 후 스크롤 위치 조정
                // const newScrollHeight = chatContainerRef.current.scrollHeight; // 새 스크롤 높이
                // chatContainerRef.current.scrollTop = newScrollHeight - prevScrollHeightRef.current; // 이전 위치로 스크롤 이
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

    // 스크롤이 맨 아래에 있는지 확인하는 함수
    // const isScrolledToBottom = () => {
    //     if (!chatContainerRef.current) return true;
    //     const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    //     return scrollTop + clientHeight >= scrollHeight - 5; // 약간의 여유를 두기 위해 -5
    // };

    // 전송버튼 핸들러
    const sendMessageBtnHandler = () => {
        sendMessage();
        // 채팅입력창 비우기
        setInputMessage('');
        // 채팅창 맨 아래로 스크롤
        scrollToBottom();
    };

    // 채팅입력창 핸들러
    const inputMessageHandler = (event) => {
        setInputMessage(event.target.value);
    };

    // 엔터키 눌렀을때 핸들러 (메시지 전송)
    const handleKeyDownHandler = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessageBtnHandler();
        }
    };

    // 새로운 메시지 도착 버튼 클릭했을때 핸들러
    const newMessageArriveBtnHandler = (event) => {
        scrollToBottom();
        setNewMessageArriveBtnDisplay('none');
    };

    // 스크롤 이벤트 핸들러, 스크롤의 현재위치를 받아와
    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        // console.log(`scoroll in bottom? : ${!(scrollTop + clientHeight < scrollHeight)}`);

        // 최상단에서 특정 높이(예: 50px) 아래로 스크롤했는지 확인
        const threshold = 50; // 기준 높이 (픽셀)
        const isAboveThreshold = scrollTop <= threshold;

        // 기준 높이에 도달했을 때 추가 메시지 로드
        if (isAboveThreshold) {
            getPrevMessages();
        }

        // 사용자가 스크롤을 올렸는지 체크 사용자가 스크롤을 올리면 true, 맨 아래로 내리면 false
        setIsUserScrolled(scrollTop + clientHeight < scrollHeight);
    };

    // useEffect
    useEffect(() => {
        getUserNickname();
    }, []);

    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            console.log('스크롤 이벤트 리스너 추가');
            chatContainer.addEventListener('scroll', handleScroll); // 스크롤 이벤트 리스너 추가
        }
        return () => {
            if (chatContainer) {
                console.log('스크롤 이벤트 리스너 해제');
                chatContainer.removeEventListener('scroll', handleScroll); // 컴포넌트 언마운트 시 리스너 제거
            }
        };
    }, [chatContainerRef.current]);

    // 새로운 메시지가 도착해서 그 메시지가 messages에 담겼을때
    useEffect(() => {
        // 스크롤이 최하단에 있다면 스크롤 최하단으로 내려 새로운 메시지 보임
        if (!isUserScrolled) {
            scrollToBottom();
        }

        if (chatContainerRef.current !== null) {
            const newScrollHeight = chatContainerRef.current.scrollHeight;
            chatContainerRef.current.scrollTop = newScrollHeight - prevScrollHeightRef.current;
        }

        // 메시지들이 차지하는 높이 확인
        if (chatContainerRef.current) {
            const totalHeight = Array.from(chatContainerRef.current.children).reduce((acc, child) => {
                return acc + child.offsetHeight;
            }, 0);
            console.log('Total height of messages:', totalHeight); // 총 높이 출력
        }
    }, [messages]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Box>
            <Grid container>
                <Grid xs={12}>
                    <p>{title}</p>
                </Grid>
                <Grid
                    xs={12}
                    sx={{
                        height: 550,
                        overflowY: 'scroll',

                        border: '1px solid #ccc', // 선택적으로 경계선 추가
                        padding: '10px', // 선택적으로 패딩 추가
                        '&::-webkit-scrollbar': {
                            width: '8px', // 스크롤바의 너비
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#888', // 스크롤바의 색상
                            borderRadius: '4px', // 스크롤바의 모서리를 둥글게
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: '#555', // 스크롤바를 호버했을 때의 색상
                        },
                    }}
                    ref={chatContainerRef}
                >
                    {messages.map((message) => (
                        <Box key={message.id}>
                            <ChatMessage
                                chatRoomId={message.chatRoomId}
                                content={message.content}
                                id={message.id}
                                time={message.time}
                                type={message.type}
                                writer={message.writer}
                                writerId={message.writerId}
                                userNickname={userNickname}
                                leaderNickname={leaderNickname}
                                reloadMessage={getPrevMessages}
                            ></ChatMessage>
                        </Box>
                    ))}

                    <div ref={messagesEndRef} />
                </Grid>
                <Grid xs={12} sx={{ position: 'relative' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            position: 'absolute',
                            bottom: '0px',
                            display: newMessageArriveBtnDisplay,
                            zIndex: 1000,
                            left: '50%', // 수평 중앙 정렬
                            transform: 'translateX(-50%)', // 버튼의 가로 중앙을 맞춤
                            width: '100%',
                            borderRadius: '8px 8px 0 0', // 왼쪽 위, 오른쪽 위 모서리만 둥글게 설정,
                            pb: 0.1,
                            mb: 0.2,
                            opacity: 0.8, // 투명도를 80%로 설정
                            transition: 'opacity 0.3s ease', // 부드러운 전환 효과
                            '&:hover': {
                                opacity: 1, // 호버 시 투명도를 100%로 설정
                            },
                        }}
                        onClick={newMessageArriveBtnHandler}
                    >
                        새로운 메시지가 도착했습니다!
                    </Button>
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
    );
};
export default ChatWindow;
