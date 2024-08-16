import React, { useEffect, useState, useRef, useCallback } from 'react';
import PostListCard from '../../components/GameMate/PostListCard';
import '../../components/GameMate/PostListCard.css';
import { useNavigate } from 'react-router-dom';
import { api } from '../../apis/customAxios';
import { useCookies } from 'react-cookie';

const InfiniteScroll = ({ status, apiUrl }) => {
    const [cookies] = useCookies(['token']);

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    const size = 7; // 한 번에 가져올 데이터의 수
    const navigate = useNavigate();

    const fetchGames = async (pageNumber) => {
        try {
            setLoading(true);
            const response = await api.get(`${apiUrl}?page=${pageNumber}&size=${size}&status=${status}`, {
                headers: {
                    Authorization: cookies.token,
                },
            });
            const newPosts = response.data.content; // "content" 배열을 가져옵니다.
            setPosts((prev) => [...prev, ...newPosts]);
            setHasMore(!response.data.last);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    //status에 따라서 post, page hasmore 초기화
    useEffect(() => {
        setPosts([]);
        setPage(0);
        setHasMore(true);

        // 새로운 status에 따라 첫 페이지 데이터 가져오기
        fetchGames(0);
    }, [status]); // status가 변경될 때마다 실행

    useEffect(() => {
        if (page > 0) {
            fetchGames(page);
        }
    }, [page]); // page가 변경될 때마다 실행

    const lastGameElementRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore, status]
    );

    const handlePostClick = (id) => {
        navigate(`/gamemate/posts/${id}`);
    };

    if (loading && posts.length === 0) {
        return <div variant="h6">Loading...</div>;
    }

    return (
        <div>
            {posts.length === 0 ? (
                <p>아직 글이 없습니다.</p>
            ) : (
                posts.map((post, index) => (
                    <div
                        ref={posts.length === index + 1 ? lastGameElementRef : null}
                        key={index}
                        onClick={() => handlePostClick(post.id)}
                    >
                        <PostListCard {...post} />
                    </div>
                ))
            )}
            <div id="loading">{loading && <p>Loading...</p>}</div>
        </div>
    );
};

export default InfiniteScroll;
