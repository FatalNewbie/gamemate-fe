import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate 추가
import { Avatar } from '@mui/material';
import '../GameMate/GameMatePost.css';
import KakaoMap from './KakaoMap';
import { api } from '../../apis/customAxios';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';
import DateDisplay from '../../components/DateDisplay';
import EditCommentModal from './EditCommentModal';
import EditRecommentModal from './EditRecommentModal';

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
                    setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
                    console.log('댓글이 삭제되었습니다:', response.data);
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

    useEffect(() => {
        showPost();
    }, [id]);

    useEffect(() => {
        if (page >= 0) {
            fetchGames(page);
        }
    }, [page]); // page가 변경될 때마다 실행

    const showPost = async () => {
        const response = await api.get(`/posts/${id}`, {
            headers: {
                Authorization: cookies.token,
            },
        });
        console.log(response);
        setPost(response.data);
    };

    // const showComments = async () => {
    //     const response = await api.get(`/post/${id}/comment?page=0&size=10`, {
    //         headers: {
    //             Authorization: cookies.token,
    //         },
    //     });
    //     console.log(response.data);
    //     setComments(response.data);
    // };

    const fetchGames = async () => {
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
                            <button className="post-delete-button">삭제</button>
                        </div>
                    )}
                </>

                <>
                    {username !== post.username && (
                        <div className="apply-button-box">
                            <button className="apply-button">메이트 신청하기</button>
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
                                        </div>
                                    </div>
                                    <div className="comment-content-box">
                                        <div className="comment-created-date">
                                            <DateDisplay dateString={post.createdDate} />
                                            <div
                                                className="recomment-button"
                                                onClick={() => handleReplyClick(comment.id)}
                                            >
                                                답글
                                            </div>
                                        </div>
                                        <div className="comment-content">{comment.content}</div>
                                    </div>
                                </div>

                                <div className="comment-edit-box">
                                    {username === comment.username ? (
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
        </div>
    );
};

export default GameMatePost;
