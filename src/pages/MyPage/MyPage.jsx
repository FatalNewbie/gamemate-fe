import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Button } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'; // 아래 방향 화살표 아이콘 임포트
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080'; // 백엔드 서버 주소

const MyPage = () => {

    const [user, setUser] = useState(null); // 사용자 정보를 저장할 상태

    useEffect(() => {

        const fetchUserData = async () => {
            try {
                const response = await axios.get('/mypage'); // 사용자 정보 API 호출
                setUser(response.data); // 사용자 정보를 상태에 저장
            } catch (error) {
                console.error('사용자 정보를 가져오는 데 실패했습니다:', error);
            }
        };

        fetchUserData(); // 데이터 가져오기
    }, []);

    if (!user) {
        return <Typography>로딩 중...</Typography>; // 데이터가 로드되기 전 표시할 내용
    }

    return (
        <Box sx={{ padding: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                {/* 프로필 이미지 공간 */}
                <Avatar sx={{ width: 70, height: 70 }}>N</Avatar>
                <Box sx={{ marginLeft: 2 }}>
                    <Typography variant="h5">{user.nickname}</Typography>
                    <Typography variant="body2">@{user.username}</Typography>
                    <Typography variant="body2">@type</Typography>
                </Box>
            </Box>

            <Box sx={{
                bgcolor: '#fff',
                paddingTop: 2,
                paddingRight: 2,
                paddingBottom: 0,
                paddingLeft: 2,
                borderRadius: 1,
                minHeight: '100px',
                marginBottom: 2,
                boxShadow:3
            }}>
                <Typography variant="h6" gutterBottom>친구 목록</Typography>
                {/* 친구 목록 공간 */}
                친구 목록이 여기에 표시됩니다.
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2}}>
                    <Button>
                        <ArrowDropDownIcon />
                    </Button>
                </Box>
            </Box>

            <Box sx={{
                bgcolor: '#fff',
                paddingTop: 2,
                paddingRight: 2,
                paddingBottom: 0,
                paddingLeft: 2,
                borderRadius: 1,
                minHeight: '100px',
                marginBottom: 2,
                boxShadow:3
            }}>
                <Typography variant="h6" gutterBottom>선호 게임 목록</Typography>
                {/* 선호 게임 목록 공간 */}
                선호 게임 목록이 여기에 표시됩니다.
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2}}>
                    <Button>
                        <ArrowDropDownIcon />
                    </Button>
                </Box>
            </Box>

            <Box sx={{
                bgcolor: '#fff',
                paddingTop: 2,
                paddingRight: 2,
                paddingBottom: 0,
                paddingLeft: 2,
                borderRadius: 1,
                minHeight: '100px',
                marginBottom: 2,
                boxShadow:3
            }}>
                <Typography variant="h6" gutterBottom>내가 쓴 글 목록</Typography>
                {/* 내가 쓴 글 목록 공간 */}
                내가 쓴 글 목록이 여기에 표시됩니다.
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2}}>
                    <Button>
                        <ArrowDropDownIcon />
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default MyPage;

// const MyPage = () => {
//     return (
//         <Box>
//             <Typography variant="h4">마이 페이지</Typography>
//             {/* 마이 페이지의 나머지 내용 */}
//         </Box>
//     );
// };
//
// export default MyPage;
