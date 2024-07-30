// src/components/Footer.js
import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, SportsEsports, Group, QuestionAnswer, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // CSS 파일 경로 수정

const Footer = () => {
    const [value, setValue] = React.useState('home');
    const navigate = useNavigate();

    const handleChange = (event, newValue) => {
        setValue(newValue);
        navigate(newValue);
    };

    return (
        <BottomNavigation
            value={value}
            onChange={handleChange}
            sx={{
                height: '70px', // 높이 설정
                fontFamily: 'Roboto, sans-serif', // 폰트 패밀리 설정
                '& .Mui-selected': {
                    color: '#0A088A', // 선택된 아이콘과 텍스트의 색상
                },
                '& .MuiBottomNavigationAction-root': {
                    color: '#21272A', // 선택되지 않은 아이콘과 텍스트의 색상
                },
                paddingLeft: '10px', // 좌우 패딩 추가
                paddingRight: '10px', // 좌우 패딩 추가
                borderTop: '0.1px solid #e0e0e0', // 상단에 얇은 실선 추가
            }}
        >
            <BottomNavigationAction
                label="홈"
                value="/home"
                icon={<Home />}
                showLabel={true}
                disableRipple
                sx={{
                    '& .MuiBottomNavigationAction-label': {
                        fontFamily: 'Roboto, sans-serif', // roboto-thin 적용
                        fontSize: '0.6rem', // 텍스트 크기 고정
                    },
                    '& .MuiSvgIcon-root': {
                        fontSize: '1.8rem',
                        color: value === '/home' ? '#0A088A' : '#21272A',
                    },
                    '&:hover': {
                        backgroundColor: 'transparent',
                    },
                    '&:focus': {
                        backgroundColor: 'transparent',
                    },
                }}
            />
            <BottomNavigationAction
                label="게임리스트"
                value="/gamelist"
                icon={<SportsEsports />}
                showLabel={true}
                disableRipple
                sx={{
                    '& .MuiBottomNavigationAction-label': {
                        fontFamily: 'Roboto, sans-serif', // roboto-thin 적용
                        fontSize: '0.6rem', // 텍스트 크기 고정
                    },
                    '& .MuiSvgIcon-root': {
                        fontSize: '1.8rem',
                        color: value === '/gamelist' ? '#0A088A' : '#21272A',
                    },
                    '&:hover': {
                        backgroundColor: 'transparent',
                    },
                    '&:focus': {
                        backgroundColor: 'transparent',
                    },
                }}
            />
            <BottomNavigationAction
                label="게임메이트"
                value="/gamemate"
                icon={<Group />}
                showLabel={true}
                disableRipple
                sx={{
                    '& .MuiBottomNavigationAction-label': {
                        fontFamily: 'Roboto, sans-serif', // roboto-thin 적용
                        fontSize: '0.6rem', // 텍스트 크기 고정
                    },
                    '& .MuiSvgIcon-root': {
                        fontSize: '1.8rem',
                        color: value === '/gamemate' ? '#0A088A' : '#21272A',
                    },
                    '&:hover': {
                        backgroundColor: 'transparent',
                    },
                    '&:focus': {
                        backgroundColor: 'transparent',
                    },
                }}
            />
            <BottomNavigationAction
                label="채팅"
                value="/chat"
                icon={<QuestionAnswer />}
                showLabel={true}
                disableRipple
                sx={{
                    '& .MuiBottomNavigationAction-label': {
                        fontFamily: 'Roboto, sans-serif', // roboto-thin 적용
                        fontSize: '0.6rem', // 텍스트 크기 고정
                    },
                    '& .MuiSvgIcon-root': {
                        fontSize: '1.5rem',
                        color: value === '/chat' ? '#0A088A' : '#21272A',
                    },
                    '&:hover': {
                        backgroundColor: 'transparent',
                    },
                    '&:focus': {
                        backgroundColor: 'transparent',
                    },
                }}
            />
            <BottomNavigationAction
                label="마이페이지"
                value="/mypage"
                icon={<Person />}
                showLabel={true}
                disableRipple
                sx={{
                    '& .MuiBottomNavigationAction-label': {
                        fontFamily: 'Roboto, sans-serif', // roboto-thin 적용
                        fontSize: '0.6rem', // 텍스트 크기 고정
                    },
                    '& .MuiSvgIcon-root': {
                        fontSize: '1.8rem',
                        color: value === '/mypage' ? '#0A088A' : '#21272A',
                    },
                    '&:hover': {
                        backgroundColor: 'transparent',
                    },
                    '&:focus': {
                        backgroundColor: 'transparent',
                    },
                }}
            />
        </BottomNavigation>
    );
};

export default Footer;
