// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home/Home';
import GameList from './pages/GameList/GameList';
import GameMate from './pages/GameMate/GameMate';
import Chat from './pages/Chat/Chat';
import MyPage from './pages/MyPage/MyPage';
import Join from './pages/Auth/Join';
import Login from './pages/Auth/Login';
import ChatRoomTest from './pages/Chat/ChatRoomTest';
import ChatWindow from './pages/Chat/ChatWindow';

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
                    path="/gamelist"
                    element={
                        <MainLayout headerTitle="게임리스트">
                            <GameList />
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
