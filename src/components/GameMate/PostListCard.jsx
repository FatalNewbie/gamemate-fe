import React from 'react';

const PostCard = ({ title, location, genres, icon, participants }) => {
    return (
        <div className="post-card">
            <div className="title-box">
                <div className="title">{title}</div>
                <div className="location">{location}</div>
            </div>
            <div className="genre-container">
                {genres.map((genre, index) => (
                    <span key={index} className="genre">
                        {genre}
                    </span>
                ))}
            </div>
            <div className="post-footer">
                <span className="icon">{icon}</span>
                <span className="participants">{participants}</span>
            </div>
        </div>
    );
};

export default PostCard;
