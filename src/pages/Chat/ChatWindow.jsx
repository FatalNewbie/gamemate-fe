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
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

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

    // 채팅창 최하단부의 div를 가리키는 Ref
    const messagesEndRef = useRef(null);

    // 채팅들을 감싼 div, 채팅창 div를 가리키는 Ref
    // null을 주고 시작해도 아래 보면 채팅창을 감싼 div의 ref={chatContainerRef} 하였음.
    // null로 초기화하고 렌더링시 ref={chatContainerRef}에 의해 이 ref는 바로 채팅창 div를 가리키게 됨.
    const chatContainerRef = useRef(null);

    // 이전 스크롤 위치 ref
    // 새로운 메시지가 왔을때 스크롤의 위치가 어디에 있었는가를 판별할 ref
    const previousScrollPositionRef = useRef(0);

    // 사용자 스크롤 상태 관리
    const [isUserScrolled, setIsUserScrolled] = useState(false);

    // 로그인한 유저 정보 서버에서 가져와서 들고있는 변수
    const [userNickname, setUserNicnkname] = useState('');

    // 유저정보 불러올떄까지 로딩
    const [isLoading, setIsLoading] = useState(true);

    // 새로운 메시지 도착 알림 버튼의 display 속성값. 초기값 display=none
    const [newMessageArriveBtnDisplay, setNewMessageArriveBtnDisplay] = useState('none');

    // 최하단으로 스크롤 내리버는 버튼의 display 속성값. 초기값 display=none
    const [scrollToBottomBtnDisplay, setScrollToBottomBtnDisplay] = useState('none');

    // 클라이언트가 받은 메시지들중에 가장 오래된 메시지의 id. 이 변수도 서버로 함께보냄.
    // const [lastMessageId, setLastMessageId] = useState(-1);
    const lastMessageIdRef = useRef(-1);

    // 부모 메시지를 리렌더링하기 위해 있는 useState.
    const [updateFlag, setUpdateFlag] = useState(0);

    // 새로운 메시지 도착인지 아닌지 구별하는 flagRef
    // messages의 값의 변경을 통한 useEffect 콜링시 새로운 메시지가 도착한 것인지, 이전 메시지를 가져온 것인지의 판단을 이 플래그 변수로 함.
    // 초기값을 false로 하여 방에 들어오자마자 받은 메시지는 새로운 메시지가 아님을 설정.
    const newMessageArriveRef = useRef(false);

    // 채팅방에 처음 들어왔을때 스크롤 최하단으로 내리기위해 방에 첫 입장임을 나타내기 위한 flagRef
    const isFirstRender = useRef(true);

    // 나가기 버튼 모달
    const [exitModalOpen, setExitModalOpen] = useState(false);

    // 나가기 버튼 표시 여부
    const [showExitButton, setShowExitButton] = useState(false);

    // 구독을 담당하는 useEffect
    useEffect(() => {
        // 이전 메시지 삭제.
        setMessages([]);

        // 이전 메시지들 DB에서 가져옴.
        getPrevMessages();

        // /ws 경로로 새로운 SockJS 소켓을 생성합니다.
        // SockJS는 웹소켓을 지원하지 않는 브라우저에서도 동작할 수 있도록 도와주는 라이브러리입니다.
        var socket = new SockJS(`${process.env.REACT_APP_API_URL}/ws`);

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
        // 새메시지 판별 플래그 true로 바꿈.
        newMessageArriveRef.current = true;
        console.log('메시지 들어왔습니다. 새로운 메시지가 들어왔나요?' + newMessageArriveRef.current);
        let message = JSON.parse(payload.body);
        console.log(message);
        // 현재 스크롤 위치와 높이 정보를 저장
        previousScrollPositionRef.current = {
            scrollTop: chatContainerRef.current.scrollTop,
            clientHeight: chatContainerRef.current.clientHeight,
            scrollHeight: chatContainerRef.current.scrollHeight,
        };
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
        //처음 렌더링시에는 위치 못가져감.
        if (chatContainerRef.current) {
            //메시지 가져오전의 현재위치를 따서 저장함.
            previousScrollPositionRef.current = {
                scrollTop: chatContainerRef.current.scrollTop,
                clientHeight: chatContainerRef.current.clientHeight,
                scrollHeight: chatContainerRef.current.scrollHeight,
            };
        }

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

                // 이전 스크롤 높이 저장 초기에 메시지를 가져올때 chatContainerRef.current(현재 스크롤위치)값이 null인 경우를 건너뜀
                if (chatContainerRef.current !== null) {
                    //prevScrollHeightRef.current = chatContainerRef.current.scrollHeight;
                }

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
            } else {
                setMessages([]);
            }
        } catch (error) {
            console.error('Error fetching get messages:', error);
        }
    };

    // 서버에서 현재 로그인유저의 닉네임을 가져옴
    const getUserNickname = async () => {
        let data;
        try {
            const response = await api.get(`/user`, {
                headers: {
                    Authorization: cookies.token,
                },
            });
            data = response;
            console.log(`nickname is ${data}`);
            setUserNicnkname(data);
        } catch (error) {
            console.error('Error fetching get userNickname', error);
        } finally {
            setIsLoading(false);
            // 방장닉네임과 유저닉네임이 다르면 나가기 버튼 표시
            if (leaderNickname !== data) {
                setShowExitButton(true);
            }
        }
    };

    // 스크롤 맨 아래로 옮기는 함수
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToBottomAnimation = () => {
        const scrollContainer = chatContainerRef.current;
        if (!scrollContainer) return;

        const targetScrollTop = scrollContainer.scrollHeight; // 목표 스크롤 위치
        const startScrollTop = scrollContainer.scrollTop; // 현재 스크롤 위치
        const distance = targetScrollTop - startScrollTop; // 이동할 거리
        const duration = 500; // 애니메이션 지속 시간 (밀리초)
        const startTime = performance.now(); // 애니메이션 시작 시간

        const animation = (currentTime) => {
            const elapsedTime = currentTime - startTime; // 경과 시간
            const progress = Math.min(elapsedTime / duration, 1); // 진행 비율 (0에서 1까지)

            // easing 함수 (예: easeInOut)
            const easing = (t) => t * t * (3 - 2 * t); // 부드러운 진행을 위한 easing

            // 현재 스크롤 위치 계산
            const scrollTop = startScrollTop + distance * easing(progress);
            scrollContainer.scrollTop = scrollTop;

            if (progress < 1) {
                requestAnimationFrame(animation); // 애니메이션 계속 진행
            }
        };

        requestAnimationFrame(animation); // 애니메이션 시작
    };

    const reRenderingMessages = () => {
        setUpdateFlag((prev) => prev + 1);
    };

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

    // 새로운 메시지 도착 버튼 클릭핸들러
    const newMessageArriveBtnHandler = (event) => {
        // 스크롤을 최하단으로
        scrollToBottom();
        // 이 버튼을 숨김
        setNewMessageArriveBtnDisplay('none');
        // 새로운 메시지 확인 플래그를 다시 false로 바꿈.
        newMessageArriveRef.current = false;
    };

    // 맨 아래로 버튼 클릭핸들러
    const scrollToBottomBtnHandler = (event) => {
        // 새로운 메시지 도착 버튼 숨김
        setNewMessageArriveBtnDisplay('none');
        //scrollToBottomAnimation();
        scrollToBottom();
    };

    // 나가기 버튼 핸들러
    const exitBtnHandler = () => {
        setExitModalOpen(true); // 모달 열기
    };

    // 나가기 모달 확인 버튼 핸들러
    const exitModalAcceptBtnHandler = async () => {
        try {
            const response = await api.delete(`/chat/deletemember/${roomId}`, {
                headers: {
                    Authorization: cookies.token,
                },
            });
        } catch (error) {
            console.error('exit chatroom error ' + error);
        } finally {
            window.history.back(); // 이전 페이지로 이동
        }
    };

    // 나가기 모달 취소 버튼 핸들러
    const exitModalCancelBtnHandler = () => {
        setExitModalOpen(false); // 모달 닫기
    };

    // 스크롤 이벤트 핸들러. 스크롤이 정한 위치보다 위로 올라가면 서버로부터 이전 메시지를 더 가져옴.
    const handleScroll = () => {
        // scrollTop: 현재 스크롤 위치(상단에서 얼마나 스크롤했는지)를 나타냅니다.
        // scrollHeight: 전체 콘텐츠의 높이(스크롤 가능한 전체 높이)를 나타냅니다.
        // clientHeight: 현재 뷰포트(스크롤 가능한 영역)의 높이를 나타냅니다.
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;

        // 최상단에서 특정 높이(예: 50px) 아래로 스크롤했는지 확인
        const threshold = 50; // 기준 높이 (픽셀)
        const isAboveThreshold = scrollTop <= threshold;

        // 최하단에 도달했을 때
        const isAtBottom = scrollTop + clientHeight >= scrollHeight;

        // 최하단으로부터 특정 픽셀 위로 올라갔는지 확인
        const isAboveFromBottom = scrollHeight - scrollTop - clientHeight >= 400;

        // 기준 높이에 도달했을 때 추가 메시지 로드
        if (isAboveThreshold) {
            getPrevMessages();
        }

        // 스크롤이 채팅창 최하단 도달했을시 최하단이동버튼 안보이게.
        if (isAtBottom) {
            setScrollToBottomBtnDisplay('none');
        }

        if (isAboveFromBottom) {
            //맨밑으로 내려가기 버튼 보이게 설정.
            setScrollToBottomBtnDisplay('block');
        }

        // 사용자가 스크롤을 올렸는지 체크 사용자가 스크롤을 올리면 true, 맨 아래로 내리면 false
        setIsUserScrolled(scrollTop + clientHeight < scrollHeight);
    };

    // 마운트시 실행되는 useEffect
    useEffect(() => {
        getUserNickname();
    }, []);

    // chatContainerRef가 채팅창DOM를 가르키기 시작할때 동작하는 useEffect
    useEffect(() => {
        getUserNickname();

        // chatContainerRef가 가리키는 DOM 요소, 채팅창 div를 가져옴.
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            console.log('스크롤 이벤트 리스너 추가');
            // chatContainerRef가 가리키는 채팅창 DOM 요소에 scroll이라는 이벤트 발생시 handleScroll 호출.
            // scroll 이벤트는 여러가지가 있음 : 마우스 휠 스크롤, 터치 스크롤, 키보드 스크롤 등등
            chatContainer.addEventListener('scroll', handleScroll); // 스크롤 이벤트 리스너 추가
        }
        return () => {
            if (chatContainer) {
                console.log('스크롤 이벤트 리스너 해제');
                chatContainer.removeEventListener('scroll', handleScroll); // 컴포넌트 언마운트 시 리스너 제거
            }
        };
    }, [chatContainerRef.current]);

    // 새로운 메시지가 도착해서 그 메시지가 messages에 담기고 리렌더링 후 호출.
    useEffect(() => {
        // DOM이 준비되어 내가 원하던 처음들어오는 경우를 걸르는...?? 그런 느낌
        if (chatContainerRef.current) {
            // 채팅방 처음 들어왔을때
            if (isFirstRender.current) {
                // 스크롤 최하단으로 내리고 flag값 false로.
                console.log('처음 들어온거라 내림!');
                scrollToBottom();
                isFirstRender.current = false;
                return;
            }

            // 이전 스크롤 위치와 높이 정보를 가져옵니다. 이전은 메시지 도착 직전을 의미.
            const { scrollTop, clientHeight, scrollHeight } = previousScrollPositionRef.current;

            // 이전 스크롤이 바닥에 있었는지 확인
            const wasScrollBottom = scrollTop + clientHeight >= scrollHeight;

            // 이전 스크롤이 최하단이라면
            if (wasScrollBottom) {
                // 스크롤을 최하단으로
                scrollToBottom();
            }
            // 이전 스크롤이 최하단이 아니고, 새로운 메시지가 도착하여 messages 배열이 변경된 것이라면
            else if (newMessageArriveRef.current) {
                setNewMessageArriveBtnDisplay('block');
            }

            // 위의 모든 상황이 아니라면 남은 상황은 이전 메시지를 가져와서 화면 위쪽에 뿌려준 상황만 남음. 이때는 이 상황에 맞는 스크롤 위치 계산 필요.
            else {
                // 리렌더링 후의 새로운 scrollHeight를 가져옵니다.
                const newScrollHeight = chatContainerRef.current.scrollHeight;

                // 이전 scrollTop과 새로운 scrollHeight를 기반으로 스크롤 위치를 계산합니다.
                const scrollDifference = newScrollHeight - scrollHeight; // 메시지 추가로 인해 발생한 높이 차이

                // 새로운 scrollTop을 설정합니다.
                chatContainerRef.current.scrollTop = scrollTop + scrollDifference;
            }
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
            <Grid
                container
                sx={{
                    borderTop: '1px solid #ccc', // 위쪽 테두리
                }}
            >
                <Grid
                    xs={9}
                    sx={{
                        borderLeft: '1px solid #ccc', // 왼쪽 테두리
                    }}
                >
                    <Box
                        display="flex"
                        justifyContent="left" // 수평 중앙 정렬
                        alignItems="center" // 수직 중앙 정렬
                        sx={{ height: '100%', pl: 1, pb: 1.5 }} // Box의 높이를 100%로 설정
                    >
                        <Typography sx={{ fontSize: 23, fontWeight: 600, fontFamily: '"Sunflower", sans-serif' }}>
                            {title}
                        </Typography>
                    </Box>
                </Grid>
                <Grid
                    xs={3}
                    sx={{
                        borderRight: '1px solid #ccc', // 오른쪽 테두리
                    }}
                >
                    <Box
                        display="flex"
                        justifyContent="center" // 수평 중앙 정렬
                        alignItems="center" // 수직 중앙 정렬
                        sx={{ height: '100%' }} // Box의 높이를 100%로 설정
                    >
                        {showExitButton && (
                            <Button onClick={exitBtnHandler}>
                                <LogoutIcon sx={{ ml: 7 }} />
                            </Button>
                        )}
                    </Box>
                </Grid>
                <Grid
                    xs={12}
                    sx={{
                        height: 630, // -------------------------------------------------채팅 입력창 높이
                        overflowY: 'scroll',
                        borderLeft: '1px solid #ccc', // 왼쪽 테두리
                        borderRight: '1px solid #ccc', // 오른쪽 테두리
                        borderBottom: '1px solid #ccc', // 아래쪽 테두리
                        padding: '10px',
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
                                writerProfile={message.writerProfile}
                                userNickname={userNickname}
                                leaderNickname={leaderNickname}
                                reloadMessage={getPrevMessages}
                                reRenderingMessages={reRenderingMessages}
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
                    <Button
                        variant="contained"
                        sx={{
                            position: 'absolute',
                            borderRadius: '50%', // 동그란 모양
                            display: scrollToBottomBtnDisplay,
                            minWidth: '0', // 최소 너비 제거
                            minHeight: '0', // 최소 높이 제거
                            width: '50px', // 버튼의 너비
                            height: '50px', // 버튼의 높이
                            justifyContent: 'center',
                            alignItems: 'center',
                            right: '15px', // 오른쪽에서 20px 떨어진 위치
                            bottom: '15px', // 첫 번째 버튼 위에 위치하도록 조정
                            padding: 0, // 패딩을 없애서 내용이 찌그러지지 않게
                        }}
                        onClick={scrollToBottomBtnHandler}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="35" // 아이콘 크기 조정
                            height="35" // 아이콘 크기 조정
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ color: 'white', marginTop: '8px' }} // 아이콘 색상 조정
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </Button>
                </Grid>
                <Grid xs={9} sx={{ height: 90 }}>
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        value={inputMessage}
                        onChange={inputMessageHandler}
                        onKeyDown={handleKeyDownHandler}
                        multiline
                        rows={3} // 기본 줄 수
                        maxRows={4} // 최대 줄 수
                        sx={{
                            width: 280,
                            mt: 1,
                            '& .MuiInputBase-root': {
                                height: '85px', // 고정 높이 설정
                                overflowY: 'auto', // 세로 스크롤 추가
                                display: 'flex', // flexbox로 설정
                                alignItems: 'flex-start', // 내용이 상단에 위치
                                padding: '3px 0px 0px 6px', // 좌우 패딩 설정
                                boxSizing: 'border-box', // 박스 모델 설정
                                fontFamily: '"Noto Sans KR", sans-serif', // 글씨체 설정
                            },
                            '& textarea': {
                                overflowY: 'auto', // textarea에 스크롤 추가
                                height: 'auto', // 자동 높이 조정
                                resize: 'none', // 크기 조정 비활성화
                                padding: '0', // 패딩 제거
                                boxSizing: 'border-box', // 박스 모델 설정
                            },
                        }}
                    />
                </Grid>
                <Grid xs={3}>
                    <Button
                        variant="contained"
                        onClick={sendMessageBtnHandler}
                        sx={{ height: 40, width: 40, ml: 2, mt: 1, padding: 0 }}
                    >
                        전송
                    </Button>
                </Grid>
            </Grid>
            {/* 모달 */}
            <Dialog open={exitModalOpen} onClose={exitModalCancelBtnHandler}>
                <DialogTitle></DialogTitle>
                <DialogContent>
                    <DialogContentText>정말 나가시겠습니까?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={exitModalAcceptBtnHandler} color="primary">
                        확인
                    </Button>
                    <Button onClick={exitModalCancelBtnHandler} color="primary">
                        취소
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
export default ChatWindow;

// useState인 messages의 값을 setMessages를 호출하여 변경함. 이로 인해 messages의 값이 변경된다면
// -> React는 해당 상태가 변경되었음을 감지
// -> 상태가 변경되면, React는 그 컴포넌트를 리렌더링함. 이 과정에서 현재 컴포넌트의 JSX가 다시 평가
// -> 리렌더링이 완료된 후, useEffect 훅이 호출됨. 이때 messages 배열이 의존성 배열에 포함되어 있으므로, messages가 변경된 후에 해당 useEffect 안의 내용이 실행

// -> messages 배열이 변경되면 리렌더링이 먼저 발생하고, 그 이후에 useEffect의 내용이 실행됨.
