import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate 추가
import '../GameMate/GameMatePost.css';
import KakaoMap from './KakaoMap';
import { api } from '../../apis/customAxios';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';
import DateDisplay from '../../components/DateDisplay';
import EditCommentModal from './EditCommentModal';
import EditRecommentModal from './EditRecommentModal';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Avatar, Snackbar, Alert, useStepContext } from '@mui/material';

const { kakao } = window;

const GameMatePost = () => {
    //token 관련 설정
    const [cookies] = useCookies(['token']);
    const { username } = jwtDecode(cookies.token);

    const navigate = useNavigate();

    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);

    const [comment, setComment] = useState('');
    const [recomment, setRecomment] = useState('');
    const [replyToCommentId, setReplyToCommentId] = useState(null); // 대댓글을 달 댓글 ID

    //무한 스크롤 관련
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    //댓글 수정 관련
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentComment, setCurrentComment] = useState(null);

    const [openCommentId, setOpenCommentId] = useState(null); // 현재 열려있는 댓글 ID

    //웹소켓 관련
    const stompClientRef = useRef(null);

    //채팅방ID
    const [chatRoomId, setChatRoomId] = useState(null);

    //메이트신청하기 버튼 관련
    const [mateApplyBtnText, setMateApplyBtnText] = useState('메이트 신청하기'); // 버튼 텍스트 상태
    const [mateApplyBtnColor, setMateApplyBtnColor] = useState('#3d3da3'); // 버튼 색상 상태
    const [mateApplyBtnDisabled, setMateApplyBtnDisabled] = useState(false); // 버튼 비활성화 상태
    const [mateRecruitCompleted, setMateRecruitCompleted] = useState(false);

    //댓글 수정하기
    const handleEditCommentClick = (comment) => {
        setOpenCommentId(comment.id); // 클릭한 댓글 ID를 저장
        setCurrentComment(comment);
        setModalOpen(true);
        console.log('모달열림');
    };

    const handleEditReCommentClick = (recomment) => {
        setOpenCommentId(recomment.id); // 클릭한 댓글 ID를 저장
        setCurrentComment(recomment);
        setModalOpen(true);
        console.log('모달열림');
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentComment(null);
        setOpenCommentId(null);
    };

    //친구 추가하기
    const [open, setOpen] = useState(false);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleSnackbarClose = () => {
        setIsSnackbarOpen(false);
    };

    const handleFriendRequest = async (receiverId) => {
        try {
            const response = await api.post(
                '/friend/',
                {
                    receiverId: receiverId,
                },
                {
                    headers: {
                        Authorization: cookies.token,
                    },
                }
            );

            setOpen(false);
            setSnackbarMessage(response.data.message);
            setIsSnackbarOpen(true);
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    useEffect(() => {
        showPost();
    }, [id]);

    useEffect(() => {
        if (page >= 0) {
            fetchComments(page);
        }
    }, [page]); // page가 변경될 때마다 실행

    //컴포넌트 마운트시 백에서 채팅방ID가져옴
    useEffect(() => {
        try {
            getChatRoomId();
        } catch (error) {
            console.error('Error get chatRoomId', error);
        }

        //클린업함수. 다른창 넘어갈때 웹소켓 연결해제
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, []);

    // 채팅방ID가져와서 chatRoomId에 값 들어가면 웹소켓 연결 시작
    useEffect(() => {
        if (chatRoomId !== null) {
            connectWebSocket();
        }
    }, [chatRoomId]);

    const showPost = async () => {
        const response = await api.get(`/posts/${id}`, {
            headers: {
                Authorization: cookies.token,
            },
        });
        console.log(response);
        setPost(response.data);
    };

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/post/${id}/comment?page=${page}&size=5`, {
                headers: {
                    Authorization: cookies.token,
                },
            });
            const newPosts = response.data; // "content" 배열을 가져옵니다.
            setComments((prev) => [...prev, ...newPosts.content]);
            setHasMore(!response.data.last);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const lastGameElementRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleRecommentChange = (e) => {
        setRecomment(e.target.value);
    };

    const handleCommentSubmit = async () => {
        // 댓글 전송 로직 (API 호출 등)
        const response = await api.post(
            `/post/${id}/comment`,
            {
                content: comment, // 요청 본문에 content를 포함
            },
            {
                headers: {
                    Authorization: cookies.token,
                },
            }
        );
        setComment(''); // 댓글 입력 초기화
        window.location.reload();
    };

    const handleRecommentSubmit = async (commentId) => {
        // 댓글 전송 로직 (API 호출 등)
        const response = await api.post(
            `/post/${id}/comment`,
            {
                parentCommentId: commentId,
                content: recomment,
            },
            {
                headers: {
                    Authorization: cookies.token,
                },
            }
        );
        setRecomment(''); // 댓글 입력 초기화
        setReplyToCommentId(null); // 대댓글 ID 초기화
        window.location.reload(); // 페이지 새로고침
    };

    const handleEditClick = (post) => {
        navigate(`/gamemate/posts/${id}/write`, { state: { post } });
    };

    const handleUpdateComment = (commentId, newContent) => {
        console.log('newContent:', newContent);
        const updatedComments = comments.map((comment) =>
            comment.id === commentId ? { ...comment, content: newContent } : comment
        );
        console.log('업데이트된 댓글 목록:', updatedComments); // 업데이트된 댓글 목록 로그
        setComments(updatedComments);
    };

    const handleUpdateRecomment = (commentId, newContent) => {
        window.location.reload();
    };

    //댓글 삭제하기
    const handleDeleteComment = (commentId) => {
        const confirmDelete = window.confirm('삭제하시겠습니까?');
        if (confirmDelete) {
            // API 호출하여 댓글 삭제
            api.delete(`/post/${id}/comment/${commentId}`, {
                headers: {
                    Authorization: cookies.token,
                },
            })
                .then((response) => {
                    // 삭제 후 댓글 목록 업데이트
                    window.location.reload();
                })
                .catch((error) => {
                    console.error('댓글 삭제 중 오류 발생:', error);
                });
        }
    };

    const handleReplyClick = (commentId) => {
        // 클릭한 댓글 ID로 상태 업데이트
        setReplyToCommentId(commentId === replyToCommentId ? null : commentId);
    };

    //댓글 삭제하기
    const handleDeletePost = (postId) => {
        const confirmDelete = window.confirm(
            '글을 삭제하면 채팅방도 함께 사라지고 다시 되돌릴 수 없습니다.\n삭제하시겠습니까?'
        );
        if (confirmDelete) {
            // API 호출하여 댓글 삭제
            api.delete(`/posts/${postId}`, {
                headers: {
                    Authorization: cookies.token,
                },
            })
                .then((response) => {
                    // 방삭제 메시지 발행
                    publishDestroyMessage();
                    // 삭제 후 댓글 목록 업데이트
                    navigate('/gamemate');
                })
                .catch((error) => {
                    console.error('글 삭제 중 오류 발생:', error);
                });
        }
    };

    //백에서 게시글id로 채팅방 id가져옴.
    const getChatRoomId = async () => {
        const response = await api.get(`/chat/post/${id}`, {
            headers: {
                Authorization: cookies.token,
            },
        });

        setChatRoomId(response);
    };

    // 웹소켓 연결
    const connectWebSocket = async () => {
        var socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            connectHeaders: {
                Authorization: cookies.token,
            },
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                stompClientRef.current = client;
                console.log('websocket successfully connected');
                subscribe(client);
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

    // 게시글에 해당되는 채팅방 구독
    const subscribe = (client) => {
        console.log('subscribe to ' + chatRoomId);
        if (!chatRoomId) {
            console.error('roomId is undefined in onConnected');
            return;
        }

        if (!client) {
            console.error('stompClient is null in onConnected');
            return;
        }

        try {
            // 구독 요청을 보냅니다.
            const subscription = client.subscribe('/topic/chat/' + chatRoomId, null, {
                ack: 'auto', // 자동 메시지 확인
            });
        } catch (error) {
            console.error('Error during subscription:', error);
        } finally {
            console.log(`Successfully subscribed to room ${chatRoomId}`);
        }
    };

    // 메이트신청버튼 핸들러
    const mateApplyBtnHandler = (event) => {
        // 채팅방참가신청메시지 발행
        if (stompClientRef.current) {
            let chatMessage = {
                writer: post.nickname,
                content: 'invite message',
                chatRoomId: chatRoomId,
                type: 'INVITE',
            };

            stompClientRef.current.publish({
                destination: '/app/message/send/' + chatRoomId,
                headers: {},
                body: JSON.stringify(chatMessage),
            });
        } else {
            console.error('STOMP client is not connected.');
            console.log(stompClientRef.current);
        }

        setMateApplyBtnText('신청 완료');
        setMateApplyBtnColor('#A9A9A9');
        setMateApplyBtnDisabled(true);
    };

    //
    const publishDestroyMessage = () => {
        // 방 폭파메시지 발행
        if (stompClientRef.current) {
            let chatMessage = {
                writer: post.nickname,
                content: 'DESTROY',
                chatRoomId: chatRoomId,
                type: 'DESTROY',
            };

            stompClientRef.current.publish({
                destination: '/app/message/send/' + chatRoomId,
                headers: {},
                body: JSON.stringify(chatMessage),
            });
        } else {
            console.error('STOMP client is not connected.');
            console.log(stompClientRef.current);
        }
    };

    if (!post) {
        return <div>로딩 중...</div>; // post가 없을 때 로딩 메시지 출력
    }

    return (
        <div className="gamemate-post-container">
            <div className="post-card">
                <h2 className="game-title">{post.gameTitle}</h2>

                <div className="profile-box">
                    <div className="user-profile">
                        <div className="left-section">
                            <Avatar
                                src={post.userProfile} // S3 URL
                                alt="User Profile"
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                onError={(e) => {
                                    e.target.onerror = null; // prevents looping
                                    e.target.src = 'path/to/default/image.png'; // 대체 이미지 경로
                                }}
                            />
                            <span className="writer-nickname">{post.nickname}</span>
                        </div>
                        <DateDisplay dateString={post.createdDate} />
                    </div>
                </div>
                {/* 2행 2열로 배치할 부분 */}
                <div className="status-grid">
                    <div className="status-item">
                        <span className="status-label">온/오프</span>
                        <span className="status-icon">{post.status}</span>
                    </div>
                    <div className="status-item">
                        <span className="status-label">모집 인원</span>
                        <span className="status-icon">{post.mateCnt}명</span>
                    </div>
                    <div className="status-item">
                        <span className="status-label">장르</span>
                        <span className="status-icon">{post.gameGenre}</span>
                    </div>
                    <div className="status-item">
                        <span className="status-label">지역</span>
                        <span className="status-icon">
                            {post.status === 'ON'
                                ? '온라인'
                                : post.mateRegionSi
                                ? post.mateRegionSi + ' ' + post.mateRegionGu
                                : '미정'}
                        </span>
                    </div>
                </div>

                <p className="post-content">{post.mateContent}</p>

                <div>
                    {post.mateLocation && (
                        <>
                            <h3>위치</h3>
                            <div>{post.mateLocation}</div>
                            <div className="map-placeholder">
                                {post && post.latitude !== null ? (
                                    <KakaoMap post={post} />
                                ) : (
                                    <p>위치 정보가 없습니다.</p> // 위치 정보가 없을 때 보여줄 내용
                                )}
                            </div>
                        </>
                    )}
                </div>

                <>
                    {username === post.username && (
                        <div className="post-edit-box">
                            <button className="post-edit-button" onClick={() => handleEditClick(post)}>
                                수정
                            </button>
                            <button className="post-delete-button" onClick={() => handleDeletePost(post.id)}>
                                삭제
                            </button>
                        </div>
                    )}
                </>

                <>
                    {username !== post.username && (
                        <div className="apply-button-box">
                            <button
                                className="apply-button"
                                onClick={mateApplyBtnHandler}
                                style={{
                                    backgroundColor: post.mateCnt === post.memberCnt ? 'gray' : mateApplyBtnColor,
                                }}
                                disabled={post.mateCnt === post.memberCnt || mateApplyBtnDisabled}
                            >
                                {post.mateCnt === post.memberCnt ? '메이트 모집 완료' : mateApplyBtnText}
                            </button>
                        </div>
                    )}
                </>

                <h3 className="comment-cnt">댓글 {post.commentCnt}</h3>

                {comments && comments.length === 0 ? (
                    <div className="no-comments-message">댓글이 없습니다.</div>
                ) : (
                    comments.map((comment, index) => (
                        <div
                            ref={comments.length === index + 1 ? lastGameElementRef : null}
                            key={comment.id}
                            className="comment-box"
                        >
                            <div className="comment-mid-box">
                                {openCommentId === comment.id &&
                                    isModalOpen && ( // 추가된 조건
                                        <EditCommentModal
                                            isOpen={isModalOpen} // 모달 열림
                                            onClose={handleCloseModal}
                                            comment={currentComment} // 현재 댓글 전달
                                            onUpdate={handleUpdateComment} // 댓글 업데이트 핸들러
                                            id={id}
                                        />
                                    )}
                                <div>
                                    <div className="comment-header">
                                        <Avatar
                                            src={comment.userProfile} // S3 URL
                                            alt="User Profile"
                                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                            onError={(e) => {
                                                e.target.onerror = null; // prevents looping
                                                e.target.src = 'path/to/default/image.png'; // 대체 이미지 경로
                                            }}
                                        />
                                        <div className="comment-nickname">
                                            <strong>{comment.nickname}</strong>
                                            {username !== comment.username && (
                                                <PersonAddAltIcon
                                                    onClick={() => handleFriendRequest(comment.userId)}
                                                    sx={{ fontSize: 'medium', pl: '7px' }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="comment-content-box">
                                        <div className="comment-created-date">
                                            <DateDisplay dateString={post.createdDate} />
<<<<<<< HEAD
                                            {!post.deletedDate === null && (
=======
                                            {!post.deletedDate && (
>>>>>>> 7e04a0467f9e7f7628cd05b34632151e01d40d30
                                                <div
                                                    className="recomment-button"
                                                    onClick={() => handleReplyClick(comment.id)}
                                                >
                                                    답글
                                                </div>
                                            )}
                                        </div>
                                        <div className="comment-content">{comment.content}</div>
                                    </div>
                                </div>

                                <div className="comment-edit-box">
                                    {comment.deletedDate ? null : username === comment.username ? (
                                        <>
                                            <button
                                                className="edit-button"
                                                onClick={() => handleEditCommentClick(comment)}
                                            >
                                                수정
                                            </button>
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDeleteComment(comment.id)}
                                            >
                                                삭제
                                            </button>
                                        </>
                                    ) : (
                                        <button className="report-button">신고</button>
                                    )}
                                </div>
                            </div>
                            {replyToCommentId === comment.id && (
                                <div className="recomment-input-header">
                                    <input
                                        type="text"
                                        placeholder="댓글을 작성하세요."
                                        value={recomment}
                                        onChange={handleRecommentChange}
                                        className="comment-input"
                                        required
                                    />
                                    <button
                                        onClick={() => handleRecommentSubmit(comment.id)}
                                        className="recomment-submit-button"
                                        disabled={!recomment.trim()}
                                    >
                                        <strong>등록</strong>
                                    </button>
                                </div>
                            )}

                            {comment.recomments.length > 0 && (
                                <div className="recomment-box">
                                    {comment.recomments.map((recomment) => (
                                        <div className="recomment-mid-box">
                                            <div className="recomment-endbox" key={recomment.id}>
                                                {openCommentId === recomment.id &&
                                                    isModalOpen && ( // 추가된 조건
                                                        <EditRecommentModal
                                                            isOpen={isModalOpen} // 모달 열림
                                                            onClose={handleCloseModal}
                                                            comment={currentComment} // 현재 댓글 전달
                                                            onUpdate={handleUpdateRecomment} // 댓글 업데이트 핸들러
                                                            id={id}
                                                        />
                                                    )}
                                                <div className="recomment-header">
                                                    <Avatar
                                                        src={recomment.userProfile} // S3 URL
                                                        alt="User Profile"
                                                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                                        onError={(e) => {
                                                            e.target.onerror = null; // prevents looping
                                                            e.target.src = 'path/to/default/image.png'; // 대체 이미지 경로
                                                        }}
                                                    />
                                                    <span className="recomment-nickname">
                                                        <strong>{recomment.nickname}</strong>
                                                        {username !== recomment.username && (
                                                            <PersonAddAltIcon
                                                                onClick={() => handleFriendRequest(recomment.userId)}
                                                                sx={{ fontSize: 'medium', pl: '7px' }}
                                                            />
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="comment-content-box">
                                                    <div className="comment-created-date">
                                                        <DateDisplay dateString={post.createdDate} />
                                                    </div>
                                                    <div className="recomment-content">{recomment.content}</div>
                                                </div>
                                            </div>
                                            <div className="recomment-edit-box">
                                                {username === recomment.username ? (
                                                    <>
                                                        <button
                                                            className="edit-button"
                                                            onClick={() => handleEditReCommentClick(recomment)}
                                                        >
                                                            수정
                                                        </button>
                                                        <button
                                                            className="delete-button"
                                                            onClick={() => handleDeleteComment(recomment.id)}
                                                        >
                                                            삭제
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button className="report-button">신고</button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
            <div className="comment-input-header">
                <input
                    type="text"
                    placeholder="댓글을 작성하세요."
                    value={comment}
                    onChange={handleCommentChange}
                    className="comment-input"
                    required
                />
                <button onClick={handleCommentSubmit} className="comment-submit-button" disabled={!comment.trim()}>
                    <strong>등록</strong>
                </button>
            </div>
            <Snackbar
                open={isSnackbarOpen}
                autoHideDuration={1000}
                onClose={handleSnackbarClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                sx={{
                    top: '50%',
                    width: '80%',
                    maxWidth: '400px', // 최대 너비 설정 (모바일 화면 대응)
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="success"
                    sx={{
                        width: '100%',
                        backgroundColor: 'rgba(10, 8, 138, 0.8)', // 배경 색상
                        color: '#ffffff', // 텍스트 색상
                        fontSize: '11px',
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default GameMatePost;
