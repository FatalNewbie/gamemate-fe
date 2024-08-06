import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Chip, Divider, Grid, IconButton, Button } from '@mui/material';
import { ChatBubbleOutline, PersonAdd, ArrowBack  } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import profilePlaceholder from '../../assets/profile_placeholder.png';
import './Recommend.css';

const Recommend = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.post('http://127.0.0.1:8000/recommendation', {
        preferred_genres: [1, 1, 1, 1, 1],
        play_times: [1, 0, 0, 1, 0, 1, 1]
      });
      setUsers(response.data.similar_users);
    };
    fetchUsers();
  }, []);

  return (
    <Box className="recommend-container">
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ marginBottom: '20px' }}
      >
        뒤로 가기
      </Button>
      <Divider sx={{ backgroundColor: 'rgba(128, 128, 128, 0.3)', width: '100%', mb: 2 }} />
      <Typography variant="h6"
        sx={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 700,
          fontSize: '14pt',
          letterSpacing: '-0.5px',
          marginBottom: '20px',
        }}>
         🕹️ 오늘의 추천 게임메이트
      </Typography>
      
      {users.map((user, index) => (
        <Paper key={index} className="user-card">
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <img src={profilePlaceholder} alt="Profile" className="profile-pic" />
            </Grid>
            <Grid item xs>
              <Box display={"flex"} justifyContent={"space-between"} alignContent={"center"} marginBottom={"7px"}>
                <Typography variant="h6"
                  sx={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 800,
                  fontSize: '12pt',
                  letterSpacing: '-0.5px',
                  marginTop: '5px'
                  }} className="username">
                  {user.recommend_user}
                </Typography>
                <Box className="icon-buttons" display={"flex"} alignContent={'center'}>
                  <IconButton className="icon-button">
                    <ChatBubbleOutline sx = {{fontSize: 15}}/>
                  </IconButton>
                  <IconButton className="icon-button" >
                    <PersonAdd sx = {{fontSize: 15}}/>
                  </IconButton>
                </Box>
              </Box>
              <Box className="tags" marginBottom={'3px'}>
                {user.common_genre.map((genre, index) => (
                  <Chip key={index} label={genre} className="tag" size="small" color="primary" sx = {{fontSize: '10px', fontWeight:200,}}/>
                ))}
              </Box>
              <Box className="tags">
                {user.common_play_time.map((time, index) => (
                  <Chip key={index} label={time} className="tag" size="small" color="primary" variant="outlined" sx = {{fontSize: '10px', fontWeight:200,}}/>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );
};

export default Recommend;
