import '../GameMate/GameMate.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from './InfiniteScroll';

const GameMate = () => {
    const [status, setStatus] = useState('on'); // 기본 상태를 'on'으로 설정
    const apiUrl = status === 'on' ? '/posts' : '/posts';

    const navigate = useNavigate();

    const handlePostClick = () => {
        navigate(`/gamemate/posts/new`);
    };

    return (
        <div className="gamemate-container">
            <div className="onoff-choice">
                <button
                    onClick={() => setStatus('on')}
                    className={`online-posts ${status === 'on' ? 'active' : ''}`} // 활성화된 상태에 따라 클래스 추가
                >
                    온라인
                </button>
                <button
                    onClick={() => setStatus('off')}
                    className={`offline-posts ${status === 'off' ? 'active' : ''}`} // 활성화된 상태에 따라 클래스 추가
                >
                    오프라인
                </button>
            </div>
            <InfiniteScroll status={status} apiUrl={apiUrl} />
            <button className="write-button" onClick={() => handlePostClick()}>
                <img src="/icons/pencil.png" alt="글쓰기" className="write-icon" />
            </button>
        </div>
    );
};
export default GameMate;
