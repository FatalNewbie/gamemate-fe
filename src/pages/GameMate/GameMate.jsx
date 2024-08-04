import '../GameMate/GameMate.css';
import React, { useEffect, useState } from 'react';
import PostListCard from '../../components/GameMate/PostListCard';
import '../../components/GameMate/PostListCard.css';

const GameMate = () => {
    // 더미 데이터
    const [genres, setGenres] = useState(['즐겜러', '사교형', '보드게임']); // 초기 장르 데이터

    return (
        <div className="container">
            <div className="onoff-choice">
                <button class="online">온라인</button>
                <button class="offline">오프라인</button>
            </div>
            <PostListCard
                title="제로월드 방탈출: 콜러"
                location="서울 강남구"
                genres={genres}
                icon="😎즐겜유저"
                participants="2 / 4"
            />
            <PostListCard
                title="제로월드 방탈출: 콜러"
                location="서울 강남구"
                genres={genres}
                icon="😎즐겜유저"
                participants="2 / 4"
            />
        </div>
    );
};
export default GameMate;
