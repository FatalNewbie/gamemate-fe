import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import PostListCard from '../../components/GameMate/PostListCard';
import '../../components/GameMate/PostListCard.css';
import { useNavigate } from 'react-router-dom';

const InfiniteScroll = ({ status }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수 상태 추가
    const size = 6; // 한 번에 가져올 데이터의 수
    const navigate = useNavigate();
    const observer = useRef();

    const loadMorePosts = async () => {
        if (loading || page > totalPages) {
            // 상태가 변경될 때 posts와 페이지를 초기화
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

    useEffect(() => {
        // 상태가 변경될 때 posts와 페이지를 초기화
        setPosts([]);
        setPage(0);
        setTotalPages(0);
        loadMorePosts();
        console.log('status ' + status);
    }, [status]); // status가 변경될 때마다 데이터를 다시 로드

    const handlePostClick = (id) => {
        navigate(`/gamemate/posts/${id}`);
    };

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 1,
        };

        const callback = (entries) => {
            if (entries[0].isIntersecting && !loading && page < totalPages) {
                loadMorePosts();
            }
        };

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
    }, [loading]);

    return (
        <div>
            {posts.map((post, index) => (
                <div key={post.id} onClick={() => handlePostClick(post.id)}>
                    <PostListCard {...post} />
                </div>
            ))}
            <div id="loading">{loading && <p>Loading...</p>}</div>
        </div>
    );
};

export default InfiniteScroll;
