import React, { useEffect, useState } from 'react';
import '../GameMate/GameMatePost.css';
import KakaoMap from './KakaoMap';
import { api } from '../../apis/customAxios';
import axios from 'axios';
import userEvent from '@testing-library/user-event';

const { kakao } = window;

const GameMate = () => {
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');
    const [recomment, setRecomment] = useState('');
    const [replyToCommentId, setReplyToCommentId] = useState(null); // 대댓글을 달 댓글 ID

    const handleReplyClick = (commentId) => {
        // 클릭한 댓글 ID로 상태 업데이트
        setReplyToCommentId(commentId === replyToCommentId ? null : commentId);
    };

    useEffect(() => {
        showPost();
    }, []);

    const showPost = async () => {
        const response = await api.get('/api/posts/post/2');
        console.log(response);
        setPost(response);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleRecommentChange = (e) => {
        setRecomment(e.target.value);
    };

    const handleCommentSubmit = async () => {
        // 댓글 전송 로직 (API 호출 등)
        const response = await api.post('/api/post/2/comment', {
            nickname: 'userNickname',
            content: comment,
        });
        setComment(''); // 댓글 입력 초기화
        window.location.reload();
    };

    const handleRecommentSubmit = async (commentId) => {
        // 댓글 전송 로직 (API 호출 등)
        const response = await api.post('/api/post/2/comment', {
            pCommentId: commentId,
            nickname: 'userNickname',
            content: recomment,
        });
        setRecomment(''); // 댓글 입력 초기화
        setReplyToCommentId(null); // 대댓글 ID 초기화
        window.location.reload(); // 페이지 새로고침
    };

    if (!post) {
        return null; // 포스트가 없으면 null 반환
    }

    return (
        <div className="container">
            <div className="post-card">
                <h2 className="game-title">{post.gameTitle}</h2>
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
                        <span className="status-icon">{post.mateRegionGu || '미정'}</span>
                    </div>
                </div>
                <p className="post-content">내용 {post.mateContent}</p>
                <h3>위치</h3>
                <div className="map-placeholder">
                    <KakaoMap post={post} /> {/* KakaoMap 컴포넌트 사용 */}
                </div>

                <h3 className="comment-cnt">댓글 {post.postComments.length}</h3>
                {post.postComments.map((comment, index) => (
                    <div key={comment.id} className="comment-box">
                        <div className="comment-mid-box">
                            <div>
                                <div class="comment-header">
                                    <i class="fas fa-user"></i>
                                    <span class="nickname">
                                        <strong>{comment.nickname}</strong>
                                    </span>
                                </div>
                                <div class="comment-content">{comment.content}</div>
                            </div>
                            <div className="recomment-button" onClick={() => handleReplyClick(comment.id)}>
                                답글
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
                                <button onClick={() => handleRecommentSubmit(comment.id)} className="submit-button">
                                    <strong>등록</strong>
                                </button>
                            </div>
                        )}

                        {comment.recomments.length > 0 && (
                            <div className="recomment-box">
                                {comment.recomments.map((recomment) => (
                                    <p key={recomment.id}>
                                        <div class="recomment-header">
                                            <i class="fas fa-user"></i>
                                            <span class="nickname">
                                                <strong>{recomment.nickname}</strong>
                                            </span>
                                        </div>
                                        <div class="recomment-content">{recomment.content}</div>
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <div className="comment-input-header">
                    <input
                        type="text"
                        placeholder="댓글을 작성하세요."
                        value={comment}
                        onChange={handleCommentChange}
                        className="comment-input"
                    />
                    <button onClick={handleCommentSubmit} className="submit-button">
                        <strong>등록</strong>
                    </button>
                </div>
                <div className="apply-button-box">
                    <button className="apply-button">메이트 신청하기</button>
                </div>
            </div>
        </div>
    );
};

export default GameMate;
