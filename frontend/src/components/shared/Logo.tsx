import { Typography } from '@mui/material';

import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <div style={{
        display: "flex",
        marginRight: "auto",
        alignItems: "center",
        gap: "10px",
    }}>
        <Link to={"/"}>
        <img src='logo.png' alt='Cipher' width={'55px'} height={'55px'}
        className='image-inverted'
        />
        
        </Link>{""}
        <Typography sx={{
            display: {md: "block", sm:"none", xs: "none"},
            mr: "auto",
            fontWeight: "800",
            textShadow: "2px 2px 20px #000",
        }}>
            <span style={{
                fontSize: "35px"
            }}>CIPHER</span>-GPT
        </Typography>
    </div>
  );
};

export default Logo