import React, { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
  
  const [inputs, setInputs] = useState({
    username:null,
    email:null,
    password:""
  });
  const navigate = useNavigate()
  //const [err, setErr] = useState(false);
  const handleChange = (e) =>{
    setInputs(prev=>({...prev, [e.target.name]: e.target.value }));
  };

  // send req to backend via axios 
  const handleClick = async (e) =>{
    e.preventDefault();
    try{
      await axios.post("http://localhost:8800/api/auth/register",inputs)
      navigate("../login");
    } catch (err){
        console.log("error");
    }
  }

  // log for testing input box
  //console.log(inputs);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Register</h1>
        <div style={styles.divider}></div>
      
        <form style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

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
          <button type="submit" style={styles.button} onClick={handleClick}>
            Create Account
          </button>

        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        body {
          margin: 0;
          padding: 0;
          background-image: url('https://i.pinimg.com/originals/3b/0e/47/3b0e471c8ab0445943318ba98ac9b13c.jpg');
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
          background: rgba(61, 43, 31, 0.5) !important;
          border-color: #d4a373 !important;
          box-shadow: 0 0 10px rgba(212, 163, 115, 0.3);
        }
        button:hover {
          background-color: #a67c52 !important;
          letter-spacing: 1px;
        }
        /* Vintage Scrollbar */
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
    // Deep wood brown with 85% opacity
    backgroundColor: 'rgba(43, 29, 18, 0.85)', 
    backdropFilter: 'blur(8px)',
    padding: '40px',
    borderRadius: '15px',
    border: '1px solid rgba(212, 163, 115, 0.2)', // Subtle gold border
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
    width: '100%',
    maxWidth: '380px',
    textAlign: 'center',
  },
  title: {
    color: '#d4a373', // Warm amber/gold
    fontSize: '32px',
    margin: '0 0 10px 0',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  divider: {
    height: '2px',
    width: '50px',
    backgroundColor: '#d4a373',
    margin: '0 auto 30px auto',
    borderRadius: '2px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: '#e9edc9', // Soft cream
    fontSize: '13px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent dark fields
    border: '1px solid #5d4037',
    padding: '12px',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '16px',
    transition: 'all 0.3s ease',
  },
  button: {
    marginTop: '15px',
    backgroundColor: '#8b5e34', // Rich wood button
    color: '#fff',
    padding: '15px',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
    textTransform: 'uppercase',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
  },
};

export default RegistrationPage;