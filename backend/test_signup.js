
import fetch from 'node-fetch';
import https from 'https';

const agent = new https.Agent({
    rejectUnauthorized: false
});

const signup = async () => {
    const formData = {
        username: 'testuser_' + Date.now(), // Ensure unique
        password: 'password123',
        email: `test_${Date.now()}@example.com`,
        fullName: 'Test User'
    };

    console.log("Attempting signup with:", formData);

    try {
        const res = await fetch('https://localhost:5000/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            agent: agent
        });

        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", data);

    } catch (e) {
        console.error("Request failed:", e);
    }
};

signup();
