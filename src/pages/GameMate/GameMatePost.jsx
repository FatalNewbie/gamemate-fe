import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // useNavigate 추가
import '../GameMate/GameMatePost.css';
import KakaoMap from './KakaoMap';
import { api } from '../../apis/customAxios';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';
import DateDisplay from '../../components/DateDisplay';

const { kakao } = window;

const GameMate = () => {
    const [cookies] = useCookies(['token']);

    const { username } = jwtDecode(cookies.token);

    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState(null);

    const [comment, setComment] = useState('');
    const [recomment, setRecomment] = useState('');
    const [replyToCommentId, setReplyToCommentId] = useState(null); // 대댓글을 달 댓글 ID

    const handleReplyClick = (commentId) => {
        // 클릭한 댓글 ID로 상태 업데이트
        setReplyToCommentId(commentId === replyToCommentId ? null : commentId);
    };

    useEffect(() => {
        showPost();
        showComments();
    }, []);

    const showPost = async () => {
        const response = await api.get(`/posts/${id}`, {
            headers: {
                Authorization: cookies.token,
            },
        });
        console.log(response);
        setPost(response.data);
    };

    const showComments = async () => {
        const response = await api.get(`/post/${id}/comment?page=0&size=10`, {
            headers: {
                Authorization: cookies.token,
            },
        });
        console.log(response.data);
        setComments(response.data);
    };

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
                pCommentId: commentId,
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

    if (!post || !comments) {
        return <div>로딩 중...</div>; // post가 없을 때 로딩 메시지 출력
    }

    return (
        <div className="gamemate-post-container">
            <div className="post-card">
                <h2 className="game-title">{post.gameTitle}</h2>
                <>
                    {username === post.username && (
                        <div className="post-edit-box">
                            <button className="post-edit-button">수정</button>
                            <button className="post-delete-button">삭제</button>
                        </div>
                    )}
                </>
                <div className="profile-box">
                    <div className="user-profile">
                        <div className="left-section">
                            <img src="" alt="글쓰기" className="write-icon" />
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
                                <KakaoMap post={post} /> {/* KakaoMap 컴포넌트 사용 */}
                            </div>
                        </>
                    )}
                </div>

                <div className="apply-button-box">
                    <button className="apply-button">메이트 신청하기</button>
                </div>
                <h3 className="comment-cnt">댓글 {post.commentCnt}</h3>

                {comments && comments.content.length === 0 ? (
                    <div className="no-comments-message">댓글이 없습니다.</div>
                ) : (
                    comments.content.map((comment, index) => (
                        <div key={comment.id} className="comment-box">
                            <div className="comment-mid-box">
                                <div>
                                    <div className="comment-header">
                                        <i className="fas fa-user"></i>
                                        <span className="comment-nickname">
                                            <strong>{comment.nickname}</strong>
                                        </span>
                                    </div>
                                    <div className="comment-created-date">
                                        <DateDisplay dateString={post.createdDate} />
                                    </div>
                                    <div className="comment-content">{comment.content}</div>
                                </div>
                                <div className="comment-endbox">
                                    <div className="recomment-button" onClick={() => handleReplyClick(comment.id)}>
                                        답글
                                    </div>
                                    <div className="options">
                                        <button className="dots-icon" aria-haspopup="true" aria-expanded="false">
                                            <span className="dot"></span>
                                            <span className="dot"></span>
                                            <span className="dot"></span>
                                        </button>

                                        <div className="options-menu">
                                            {username === comment.username ? (
                                                <>
                                                    <button className="edit-button">수정</button>
                                                    <button className="delete-button">삭제</button>
                                                </>
                                            ) : (
                                                <button className="report-button">신고</button>
                                            )}
                                        </div>
                                    </div>
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
                                    />
                                    <button
                                        onClick={() => handleRecommentSubmit(comment.id)}
                                        className="comment-submit-button"
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
                                                <div className="recomment-header">
                                                    <i className="fas fa-user"></i>
                                                    <span className="recomment-nickname">
                                                        <strong>{recomment.nickname}</strong>
                                                    </span>
                                                </div>
                                                <div className="comment-created-date">
                                                    <DateDisplay dateString={post.createdDate} />
                                                </div>
                                                <div className="recomment-content">{recomment.content}</div>
                                            </div>
                                            <div className="options">
                                                <button
                                                    className="dots-icon"
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                >
                                                    <span className="dot"></span>
                                                    <span className="dot"></span>
                                                    <span className="dot"></span>
                                                </button>

                                                <div className="options-menu">
                                                    {username === recomment.username ? (
                                                        <>
                                                            <button className="edit-button">수정</button>
                                                            <button className="delete-button">삭제</button>
                                                        </>
                                                    ) : (
                                                        <button className="report-button">신고</button>
                                                    )}
                                                </div>
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
                />
                <button onClick={handleCommentSubmit} className="comment-submit-button">
                    <strong>등록</strong>
                </button>
            </div>
        </div>
    );
};

export default GameMate;
