import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080'; // 백엔드 서버 주소

const App = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStartRegister = () => {
    setIsRegistering(true);
  };

  const handleEmailRegister = async () => {
    try {
      const response = await axios.post('/join', {
        username,
        password,
        nickname,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert(response.data); // 성공 메시지
      setUsername('');
      setPassword('');
      setNickname('');

      if (response.ok) {
        // 회원가입 성공 시 루트 페이지로 이동
        navigate('/login');
        alert('회원가입이 완료되었습니다. 로그인해주세요.');
      }
    } catch (error) {
      if (error.response) {
        // 서버에서 반환한 에러 메시지
        setError(error.response.data);
      } else {
        // 네트워크 관련 에러
        setError('회원가입에 실패했습니다.');
      }
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '50px' }}>
      {isRegistering ? (
        <Box sx={{
          marginTop: 5,
          paddingTop: 10,
          paddingBottom: 10,
          paddingRight: 2,
          paddingLeft: 2,
          boxShadow: 3
        }}>
          <Typography variant="h4" align="center">회원가입</Typography>
          <Typography variant="body2" align="center">
            이미 계정이 있으신가요? <Button onClick={() => alert("로그인 페이지로 이동")}>로그인</Button>
          </Typography>
          {error && <Typography color="error" align="center">{error}</Typography>}
          <TextField
            label="이메일 입력"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="비밀번호 입력"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="닉네임 입력"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleEmailRegister} sx={{ marginTop: '16px' }}>
            이메일로 시작하기
          </Button>
        </Box>
      ) : (
        <Box sx={{ paddingTop: 20 }}>
          <Button variant="outlined" fullWidth onClick={handleStartRegister} style={{ marginTop: '10px' }}>
            Google 계정으로 시작하기
          </Button>
          <Button variant="outlined" fullWidth onClick={handleStartRegister} style={{ marginTop: '10px' }}>
            Naver 계정으로 시작하기
          </Button>
          <Button variant="outlined" fullWidth onClick={handleStartRegister} style={{ marginTop: '10px' }}>
            이메일 계정으로 시작하기
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default App;
