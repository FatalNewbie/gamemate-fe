import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import PostListCard from '../../components/GameMate/PostListCard';
import '../../components/GameMate/PostListCard.css';
import { useNavigate } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

const InfiniteScroll = ({ status, apiUrl }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수 상태 추가
    const size = 7; // 한 번에 가져올 데이터의 수
    const navigate = useNavigate();
    const observer = useRef();

    const loadMorePosts = async () => {
        if (loading || page > totalPages) {
            console.log(totalPages);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`/posts?page=${page}&size=${size}&status=${status}`);
            const newPosts = response.data.data.content; // "content" 배열을 가져옵니다.
            setPosts((prev) => [...prev, ...newPosts]);
            setTotalPages(response.data.data.totalPages); // 총 페이지 수 업데이트
            setPage((prev) => prev + 1);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostClick = (id) => {
        navigate(`/gamemate/posts/${id}`);
    };

    useEffect(() => {
        loadMorePosts();
        setPosts([]);
        setPage(0);
        setTotalPages(0);
    }, [status]);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        };

        const callback = (entries) => {
            if (entries[0].isIntersecting && !loading && page < totalPages) {
                loadMorePosts();
            }
        };

        // 새로운 옵저버 생성
        observer.current = new IntersectionObserver(callback, options);
        const currentObserver = observer.current;

        const target = document.querySelector('#loading');

        if (currentObserver) {
            if (target) {
                currentObserver.observe(target);
            }
        }

        return () => {
            if (currentObserver && target) {
                currentObserver.unobserve(target);
            }
        };
    }, [loading, page, totalPages]);

    return (
        <div>
            {posts.map((post, index) => (
                <div key={index} onClick={() => handlePostClick(post.id)}>
                    <PostListCard {...post} />
                </div>
            ))}
            <div id="loading">{loading && <p>Loading...</p>}</div>
        </div>
    );
};

export default InfiniteScroll;
