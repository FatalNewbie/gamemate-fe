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
import UserPostsList from './pages/MyPage/UserPostsList';
import FavoriteGameList from './pages/MyPage/FavoriteGameList';
import Recommend from './pages/Recommend/Recommend';
import ReceivedFriendRequests from './pages/Friend/ReceivedFriendRequests';
import SentFriendRequests from './pages/Friend/SentFriendRequests';
import FriendsList from './pages/Friend/FriendList';
import Auth from './pages/Auth/Auth';
//import Login from './pages/Auth/Login';
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
                <Route path="/" element={<Navigate to={isLoggedIn ? '/home' : '/auth'} replace />} />
                <Route
                    path="/auth"
                    element={
                        isLoggedIn ? (
                            <Navigate to="/home" replace />
                        ) : (
                            <MainLayout headerTitle="ci/cd테스트" showHeader={false} showFooter={false}>
                                <Auth />
                            </MainLayout>
                        )
                    }
                />
                {/* <Routey
                    path="/auth"
                    element={
                        <MainLayout headerTitle="ci/cd테스트" showHeader={false} showFooter={false}>
                            <Auth />
                        </MainLayout>
                    }
                /> */}
                <Route
                    path="/join-additional"
                    element={
                        isLoggedIn ? (
                            <Navigate to="/home" replace />
                        ) : (
                            <MainLayout headerTitle="ci/cd테스트" showHeader={false} showFooter={false}>
                                <JoinAdditional />
                            </MainLayout>
                        )
                    }
                />
                <Route
                    path="/home"
                    element={
                        !isLoggedIn ? (
                            <Navigate to="/auth" replace />
                        ) : (
                            <MainLayout headerTitle="ci/cd테스트">
                                <Home />
                            </MainLayout>
                        )
                    }
                />
                <Route
                    path="/recommend"
                    element={
                        !isLoggedIn ? (
                            <Navigate to="/auth" replace />
                        ) : (
                            <MainLayout headerTitle="추천 유저">
                                <Recommend />
                            </MainLayout>
                        )
                    }
                />
                <Route
                    path="/gamelist"
                    element={
                        !isLoggedIn ? (
                            <Navigate to="/auth" replace />
                        ) : (
                            <MainLayout headerTitle="게임리스트">
                                <GameList />
                            </MainLayout>
                        )
                    }
                />
                <Route
                    path="/search-results"
                    element={
                        !isLoggedIn ? (
                            <Navigate to="/auth" replace />
                        ) : (
                            <MainLayout headerTitle="검색 결과">
                                <SearchResults />
                            </MainLayout>
                        )
                    }
                />
                <Route
                    path="/game/:id" // Define the dynamic route for GameDetails
                    element={
                        !isLoggedIn ? (
                            <Navigate to="/auth" replace />
                        ) : (
                            <MainLayout headerTitle="게임상세">
                                <GameDetails />
                            </MainLayout>
                        )
                    }
                />
                <Route
                    path="/gamemate"
                    element={
                        !isLoggedIn ? (
                            <Navigate to="/auth" replace />
                        ) : (
                            <MainLayout headerTitle="ci/cd테스트">
                                <GameMate />
                            </MainLayout>
                        )
                    }
                />
                <Route
                    path="/gamemate/posts/:id"
                    element={
                        !isLoggedIn ? (
                            <Navigate to="/auth" replace />
                        ) : (
                            <MainLayout headerTitle="ci/cd테스트">
                                <GameMatePost />
                            </MainLayout>
                        )
                    }
                />
                <Route
                    path="/gamemate/posts/new"
                    element={
                        !isLoggedIn ? (
                            <Navigate to="/auth" replace />
                        ) : (
                            <MainLayout headerTitle="모집하기">
                                <GameMateNew />
                            </MainLayout>
                        )
                    }
                />
                <Route
                    path="/gamemate/posts/:id/write"
                    element={
                        !isLoggedIn ? (
                            <Navigate to="/auth" replace />
                        ) : (
                            <MainLayout headerTitle="ci/cd테스트">
                                <GamteMateUpdate />
                            </MainLayout>
                        )
                    }
                />
                <Route
                    path="/chat"
                    element={
                        !isLoggedIn ? (
                            <Navigate to="/auth" replace />
                        ) : (
                            <MainLayout headerTitle="채팅" showSearchIcon={false}>
                                <Chat />
                            </MainLayout>
                        )
                    }
                />
                <Route
                    path="/chattest"
                    element={
                        !isLoggedIn ? (
                            <Navigate to="/auth" replace />
                        ) : (
                            <MainLayout headerTitle="채팅테스트" showSearchIcon={false}>
                                <ChatRoomTest />
                            </MainLayout>
                        )
                    }
                />
                <Route
                    path="/mypage"
                    element={
                        !isLoggedIn ? (
                            <Navigate to="/auth" replace />
                        ) : (
                            <MainLayout headerTitle="마이페이지" showSearchIcon={false}>
                                <MyPage />
                            </MainLayout>
                        )
                    }
                />
                <Route
                    path="/favoritegamelist"
                    element={
                        !isLoggedIn ? (
                            <Navigate to="/auth" replace />
                        ) : (
                            <MainLayout headerTitle="선호 게임 목록" showSearchIcon={false}>
                                <FavoriteGameList />
                            </MainLayout>
                        )
                    }
                />
                <Route
                    path="/posts/user/list"
                    element={
                        !isLoggedIn ? (
                            <Navigate to="/auth" replace />
                        ) : (
                            <MainLayout headerTitle="내가 쓴 글 목록" showSearchIcon={false}>
                                <UserPostsList />
                            </MainLayout>
                        )
                    }
                />
                <Route
                    path="/edit-profile"
                    element={
                        !isLoggedIn ? (
                            <Navigate to="/auth" replace />
                        ) : (
                            <MainLayout headerTitle="프로필 이미지 수정" showSearchIcon={false}>
                                <ProfileImageEdit />
                            </MainLayout>
                        )
                    }
                />
                <Route
                    path="/friends"
                    element={
                        !isLoggedIn ? (
                            <Navigate to="/auth" replace />
                        ) : (
                            <MainLayout headerTitle="친구 목록" showSearchIcon={false}>
                                <FriendsList />
                            </MainLayout>
                        )
                    }
                />
                <Route
                    path="/received-friendrequests"
                    element={
                        !isLoggedIn ? (
                            <Navigate to="/auth" replace />
                        ) : (
                            <MainLayout headerTitle="받은 친구 요청" showSearchIcon={false}>
                                <ReceivedFriendRequests />
                            </MainLayout>
                        )
                    }
                />
                <Route
                    path="/sent-friendrequests"
                    element={
                        !isLoggedIn ? (
                            <Navigate to="/auth" replace />
                        ) : (
                            <MainLayout headerTitle="보낸 친구 요청" showSearchIcon={false}>
                                <SentFriendRequests />
                            </MainLayout>
                        )
                    }
                />
                <Route
                    path="/ChatWindow"
                    element={
                        !isLoggedIn ? (
                            <Navigate to="/auth" replace />
                        ) : (
                            <MainLayout headerTitle="채팅창" showSearchIcon={false}>
                                <ChatWindow />
                            </MainLayout>
                        )
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
