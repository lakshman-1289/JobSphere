import axios from 'axios';

const API_URL = 'https://job-portal-ntv9.onrender.com/api/auth';

async function testRegister() {
    try {
        const email = `test_${Date.now()}@example.com`;
        console.log(`Attempting to register with email: ${email}`);
        const response = await axios.post(`${API_URL}/register`, {
            name: 'Test Antigravity',
            email: email,
            password: 'password123',
            role: 'student'
        });
        console.log('Registration Successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Registration Failed:', error.message);
        if (error.response) {
            console.error('Data:', error.response.data);
            console.error('Status:', error.response.status);
        }
    }
}

async function testLogin(email) {
    try {
        console.log(`Attempting to login with email: ${email}`);
        const response = await axios.post(`${API_URL}/login`, {
            email: email,
            password: 'password123'
        });
        console.log('Login Successful:', response.data);
    } catch (error) {
        console.error('Login Failed:', error.message);
        if (error.response) {
            console.error('Data:', error.response.data);
            console.error('Status:', error.response.status);
        }
    }
}

async function main() {
    console.log('Starting backend test...');
    const regData = await testRegister();
    if (regData && (regData.email || regData.token)) { // Adjusted check
        await testLogin(regData.email || `test_${Date.now()}@example.com`); // Fallback if email not in response
    }
}

main();
