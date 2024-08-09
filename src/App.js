import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home/Home';
import GameList from './pages/GameList/GameList';
import GameDetails from './pages/GameList/GameDetails'; // Correct import path
import GameMate from './pages/GameMate/GameMate';
import GameMatePost from './pages/GameMate/GameMatePost';
import GameMateNew from './pages/GameMate/GameMateNew';
import InfiniteScroll from './pages/GameMate/InfiniteScroll';
import Chat from './pages/Chat/Chat';
import MyPage from './pages/MyPage/MyPage';
import Recommend from './pages/Recommend/Recommend';
import FriendRequests from './pages/Friend/FriendRequests';
import FriendsList from './pages/Friend/FriendList';
import Join from './pages/Auth/Join';
import Login from './pages/Auth/Login';
import ChatRoomTest from './pages/Chat/ChatRoomTest';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route
                    path="/join"
                    element={
                        <MainLayout headerTitle="게임메이트">
                            <Join />
                        </MainLayout>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <MainLayout headerTitle="게임메이트">
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
                        <MainLayout headerTitle="무한스크롤 테스트">
                            <InfiniteScroll />
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
                    path="/friend-req"
                    element={
                        <MainLayout headerTitle="친구 요청" showSearchIcon={false}>
                            <FriendRequests />
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
            </Routes>
        </Router>
    );
};

export default App;
