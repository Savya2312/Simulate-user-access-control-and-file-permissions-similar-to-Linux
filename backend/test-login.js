const axios = require('axios');

const testLogin = async () => {
  try {
    console.log('Testing login with root:root...');
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'root',
      password: 'root'
    });
    console.log('Login Success!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Login Failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testLogin();
