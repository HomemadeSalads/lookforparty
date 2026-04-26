import React, { useContext, useState } from 'react';
//import axios from "axios"
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext.js';

const LoginPage = () => {
  const [inputs, setInputs] = useState({
      username:null,
      password:""
    });
  
  const [error, setErr] = useState(false);
  const handleChange = (e) =>{
      setInputs(prev=>({...prev, [e.target.name]: e.target.value }));
  };

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) =>{
    e.preventDefault();
    try{
      await login(inputs)
      console.log("Login complete?")
      navigate("/");
    } catch(err){
      setErr(err)
      console.log(error)
    }
  }

  //testing text inputs
  console.log(inputs)

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Login</h1>
        <div style={styles.divider}></div>
        
        <form style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button} onClick={handleLogin}>
            Enter
          </button>
        </form>
        <p style={styles.footerText}>
          Don't have an account? <Link to="../register" style={styles.link}>Register here</Link>
        </p>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        body {
          margin: 0;
          padding: 0;
          /* New Background Image */
          background-image: url('https://images.alphacoders.com/110/1105802.jpg');
          background-size: cover;
          background-attachment: fixed;
          background-position: center;
          font-family: 'Georgia', serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        input:focus {
          outline: none;
          background: rgba(61, 43, 31, 0.6) !important;
          border-color: #d4a373 !important;
          box-shadow: 0 0 12px rgba(212, 163, 115, 0.4);
        }
        input::placeholder {
          color: rgba(233, 237, 201, 0.3);
        }
        button:hover {
          background-color: #a67c52 !important;
          letter-spacing: 2px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
        }
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #2b1d12; }
        ::-webkit-scrollbar-thumb { background: #5d4037; border-radius: 5px; }
      `}} />
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: 'rgba(43, 29, 18, 0.85)', // Semi-transparent wood
    backdropFilter: 'blur(10px)',
    padding: '50px 40px',
    borderRadius: '15px',
    border: '1px solid rgba(212, 163, 115, 0.2)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)',
    width: '100%',
    maxWidth: '360px',
    textAlign: 'center',
  },
  title: {
    color: '#d4a373', 
    fontSize: '36px',
    margin: '0 0 10px 0',
    textTransform: 'uppercase',
    letterSpacing: '4px',
    fontWeight: 'normal',
  },
  divider: {
    height: '1px',
    width: '80px',
    backgroundColor: '#d4a373',
    margin: '0 auto 40px auto',
    opacity: 0.6,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  inputGroup: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    color: '#e9edc9',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    paddingLeft: '2px',
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid #5d4037',
    padding: '14px',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '16px',
    transition: 'all 0.3s ease',
  },
  button: {
    marginTop: '10px',
    backgroundColor: '#8b5e34',
    color: '#fff',
    padding: '16px',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '15px',
    textTransform: 'uppercase',
    transition: 'all 0.4s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
  },
  footerText: {
    color: 'rgba(233, 237, 201, 0.6)',
    marginTop: '30px',
    fontSize: '13px',
  },
  link: {
    color: '#d4a373',
    cursor: 'pointer',
    textDecoration: 'underline',
  }
};

export default LoginPage;