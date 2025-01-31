import React, { useEffect } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, SportsEsports, Group, QuestionAnswer, Person } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css';

const Footer = ({ setActivePage, activePage }) => {
    const location = useLocation();
//     const [value, setValue] = React.useState('home');
    const navigate = useNavigate();

    const handleChange = (event, newValue) => {
        setActivePage(newValue);
        navigate(newValue);
    };

    useEffect(() => {
        setActivePage(location.pathname);
    }, [location.pathname, setActivePage]);

    return (
        <BottomNavigation
            value={activePage}
            onChange={handleChange}
            sx={{
                height: '70px',
                width: '390px',
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: 'Roboto, sans-serif',
                '& .Mui-selected': {
                    color: '#0A088A',
                },
                '& .MuiBottomNavigationAction-root': {
                    color: '#21272A',
                    flex: 1,
                },
                paddingLeft: '10px',
                paddingRight: '10px',
                borderTop: '0.1px solid #e0e0e0',
            }}
        >
            <BottomNavigationAction
                label="홈"
                value="/home"
                icon={<Home />}
                showLabel={true}
                disableRipple
                sx={{
                    padding: '0px',
                    '& .MuiBottomNavigationAction-label': {
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: '0.6rem',
                    },
                    '& .MuiSvgIcon-root': {
                        fontSize: '1.8rem',
                        color: activePage === '/home' ? '#0A088A' : '#21272A',
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
                    padding: '0px',
                    '& .MuiBottomNavigationAction-label': {
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: '0.6rem',
                    },
                    '& .MuiSvgIcon-root': {
                        fontSize: '1.8rem',
                        color: activePage === '/gamelist' ? '#0A088A' : '#21272A',
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
                    padding: '0px',
                    '& .MuiBottomNavigationAction-label': {
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: '0.6rem',
                    },
                    '& .MuiSvgIcon-root': {
                        fontSize: '1.8rem',
                        color: activePage === '/gamemate' ? '#0A088A' : '#21272A',
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
                    padding: '0px',
                    '& .MuiBottomNavigationAction-label': {
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: '0.6rem',
                    },
                    '& .MuiSvgIcon-root': {
                        fontSize: '1.8rem',
                        color: activePage === '/chat' ? '#0A088A' : '#21272A',
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
                    padding: '0px',
                    '& .MuiBottomNavigationAction-label': {
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: '0.6rem',
                    },
                    '& .MuiSvgIcon-root': {
                        fontSize: '1.8rem',
                        color: activePage === '/mypage' ? '#0A088A' : '#21272A',
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
