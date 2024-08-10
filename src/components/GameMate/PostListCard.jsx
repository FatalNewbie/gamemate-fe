import React from 'react';

const PostListCard = ({ username, nickname, status, gameTitle, gameGenre, mateCnt, mateContent }) => {
    return (
        <div className="post-list-card">
            <div className="title-box">
                <div className="title">{gameTitle}</div>
                <div className="location">{status}</div>
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
