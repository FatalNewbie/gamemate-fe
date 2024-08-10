import React from 'react';

const PostListCard = ({
    username,
    nickname,
    status,
    gameTitle,
    gameGenre,
    mateCnt,
    mateContent,
    mateRegionSi,
    mateRegionGu,
}) => {
    return (
        <div className="post-list-card">
            <div className="title-box">
                <div className="title">{gameTitle}</div>
                <div className="location">
                    {status === 'ON'
                        ? '온라인'
                        : status === 'OFF' && !mateRegionSi
                        ? '장소 미정'
                        : `${mateRegionSi} ${mateRegionGu}`}
                </div>
            </div>
            <div className="genre-container">
                <span className="genre">{gameGenre}</span>
            </div>
            <div className="post-footer">
                <span className="icon">아이콘</span>
                <span className="nickname">{nickname}</span>
                <span className="participants">1 / {mateCnt}</span>
            </div>
        </div>
    );
};

export default PostListCard;
