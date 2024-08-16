import React, { useState, useEffect } from 'react';
import { api } from '../../apis/customAxios';
import { useCookies } from 'react-cookie';
import './Modal.css';

const EditCommentModal = ({ isOpen, onClose, comment, onUpdate, id }) => {
    const [cookies] = useCookies(['token']);
    const [newContent, setNewContent] = useState(comment.content);

    useEffect(() => {
        if (comment) {
            setNewContent(comment.content); // 댓글이 변경될 때마다 새로운 내용으로 업데이트
        }
    }, [comment]);

    const handleUpdate = async () => {
        // PUT API 호출
        try {
            const response = await api.put(
                `/post/${id}/comment/${comment.id}`,
                {
                    content: newContent, // 요청 본문에 content를 포함
                },
                {
                    headers: {
                        Authorization: cookies.token,
                    },
                }
            );

            if (response) {
                console.log('업데이트된 댓글 내용:', response.data.content);
                onUpdate(comment.id, newContent); // 업데이트된 댓글 내용으로 상태 변경
                console.log(response.data.content);
                onClose(); // 모달 닫기
            } else {
                // 오류 처리
                console.error('댓글 수정 실패');
            }
        } catch (error) {
            console.error('API 호출 중 오류 발생:', error);
        }
    };

    console.log(isOpen);

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>댓글 수정</h2>
                <textarea
                    className="comment-update-area"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                />
                <div className="update-comment-box">
                    <button onClick={handleUpdate}>수정 완료</button>
                    <button onClick={onClose}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default EditCommentModal;
