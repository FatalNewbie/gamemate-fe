import React from 'react';
import { detailDate } from '../../utils/detailDate';

const PostListCard = ({ nickname, status, gameTitle, gameGenre, mateCnt, mateRegionSi, mateRegionGu, createdDate }) => {
    //api에 있는 detailPost.createdAt를 바꿔주는 것
    const nowDate = detailDate(new Date(createdDate));

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
                <span className="time-ago">{nowDate}</span>
                <span className="participants">1 / {mateCnt}</span>
            </div>
        </div>
    );
};

export default PostListCard;
