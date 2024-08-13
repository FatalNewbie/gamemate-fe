import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/UseAuth'; // 로그인 상태 확인용 커스텀 훅
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home/Home';
import GameList from './pages/GameList/GameList';
import GameDetails from './pages/GameList/GameDetails'; // Correct import path
import GameMate from './pages/GameMate/GameMate';
import GameMatePost from './pages/GameMate/GameMatePost';
import GameMateNew from './pages/GameMate/GameMateNew';
import GamteMateUpdate from './pages/GameMate/GameMateUpdate';
import KakaoSearch from './pages/GameMate/KakaoSearch';
import Chat from './pages/Chat/Chat';
import MyPage from './pages/MyPage/MyPage';
import Recommend from './pages/Recommend/Recommend';
import ReceivedFriendRequests from './pages/Friend/ReceivedFriendRequests';
import SentFriendRequests from './pages/Friend/SentFriendRequests';
import FriendsList from './pages/Friend/FriendList';
import Join from './pages/Auth/Join';
import Login from './pages/Auth/Login';
import JoinAdditional from './pages/Auth/JoinAdditional';
import ProfileImageEdit from './pages/MyPage/ProfileImageEdit';
import ChatRoomTest from './pages/Chat/ChatRoomTest';
import ChatWindow from './pages/Chat/ChatWindow';
import SearchResults from './components/SearchResults';
import { ImportExport } from '@mui/icons-material';

const App = () => {
    const { isLoggedIn } = useAuth();
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        // 로그인 상태를 확인한 후 authChecked를 true로 설정
        if (typeof isLoggedIn === 'boolean') {
            setAuthChecked(true);
        }
    }, [isLoggedIn]);

    if (!authChecked) {
        return <div>Loading...</div>; // 로그인 상태를 확인 중일 때 로딩 표시
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to={isLoggedIn ? '/home' : '/join'} replace />} />
                <Route
                    path="/join"
                    element={
                        <MainLayout headerTitle="게임메이트" showHeader={false} showFooter={false}>
                            <Join />
                        </MainLayout>
                    }
                />
                <Route
                    path="/join-additional"
                    element={
                        <MainLayout headerTitle="게임메이트" showHeader={false} showFooter={false}>
                            <JoinAdditional />
                        </MainLayout>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <MainLayout headerTitle="게임메이트" showHeader={false} showFooter={false}>
                            <Login />
                        </MainLayout>
                    }
                />
                <Route
                    path="/home"
                    element={
                        <MainLayout headerTitle="게임메이트">
                            <Home />
                        </MainLayout>
                    }
                />
                <Route
                    path="/recommend"
                    element={
                        <MainLayout headerTitle="추천 유저">
                            <Recommend />
                        </MainLayout>
                    }
                />
                <Route
                    path="/gamelist"
                    element={
                        <MainLayout headerTitle="게임리스트">
                            <GameList />
                        </MainLayout>
                    }
                />
                <Route
                    path="/search-results"
                    element={
                        <MainLayout headerTitle="검색 결과">
                            <SearchResults />
                        </MainLayout>
                    }
                />
                <Route
                    path="/game/:id" // Define the dynamic route for GameDetails
                    element={
                        <MainLayout headerTitle="게임상세">
                            <GameDetails />
                        </MainLayout>
                    }
                />
                <Route
                    path="/gamemate"
                    element={
                        <MainLayout headerTitle="게임메이트">
                            <GameMate />
                        </MainLayout>
                    }
                />
                <Route
                    path="/gamemate/posts/:id"
                    element={
                        <MainLayout headerTitle="게임메이트">
                            <GameMatePost />
                        </MainLayout>
                    }
                />
                <Route
                    path="/gamemate/posts/:id/write"
                    element={
                        <MainLayout headerTitle="게임메이트">
                            <GamteMateUpdate />
                        </MainLayout>
                    }
                />
                <Route
                    path="/gamemate/posts/new"
                    element={
                        <MainLayout headerTitle="모집하기">
                            <GameMateNew />
                        </MainLayout>
                    }
                />
                <Route
                    path="/gamemate/test"
                    element={
                        <MainLayout headerTitle="카카오 검색 테스트">
                            <KakaoSearch />
                        </MainLayout>
                    }
                />
                <Route
                    path="/chat"
                    element={
                        <MainLayout headerTitle="채팅" showSearchIcon={false}>
                            <Chat />
                        </MainLayout>
                    }
                />
                <Route
                    path="/chattest"
                    element={
                        <MainLayout headerTitle="채팅테스트" showSearchIcon={false}>
                            <ChatRoomTest />
                        </MainLayout>
                    }
                />
                <Route
                    path="/mypage"
                    element={
                        <MainLayout headerTitle="마이페이지" showSearchIcon={false}>
                            <MyPage />
                        </MainLayout>
                    }
                />
                <Route
                    path="/edit-profile"
                    element={
                        <MainLayout headerTitle="프로필 이미지 수정" showSearchIcon={false}>
                            <ProfileImageEdit />
                        </MainLayout>
                    }
                />
                <Route
                    path="/friends"
                    element={
                        <MainLayout headerTitle="친구 목록" showSearchIcon={false}>
                            <FriendsList />
                        </MainLayout>
                    }
                />
                <Route
                    path="/received-friendrequests"
                    element={
                        <MainLayout headerTitle="받은 친구 요청" showSearchIcon={false}>
                            <ReceivedFriendRequests />
                        </MainLayout>
                    }
                />
                <Route
                    path="/sent-friendrequests"
                    element={
                        <MainLayout headerTitle="보낸 친구 요청" showSearchIcon={false}>
                            <SentFriendRequests />
                        </MainLayout>
                    }
                />
                <Route
                    path="/ChatWindow"
                    element={
                        <MainLayout headerTitle="채팅창" showSearchIcon={false}>
                            <ChatWindow />
                        </MainLayout>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
