import '../GameMate/GameMate.css';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from './InfiniteScroll';

const GameMate = () => {
    const [status, setStatus] = useState('on'); // 기본 상태는 'on'

    return (
        <div className="container">
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
            <InfiniteScroll status={status} />
        </div>
    );
};
export default GameMate;
