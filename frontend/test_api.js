import axios from 'axios';

const baseURL = 'http://localhost:8080/api';
const timestamp = Math.floor(Date.now() / 1000);
const email = `test${timestamp}@example.com`;
const pass = 'Password123';

async function run() {
    try {
        console.log('--- Phase 1: Register ---');
        // Phase 1: Register (Using many fields to avoid null constraints)
        await axios.post(`${baseURL}/auth/register`, {
            name: 'Test',
            nombre: 'Test',
            firstName: 'Test',
            lastName: 'User',
            apellido: 'User',
            email: email,
            correo: email,
            password: pass
        });
        console.log('Reg OK');

        console.log('--- Phase 2: Login ---');
        const login = await axios.post(`${baseURL}/auth/login`, { email, password: pass });
        const user = login.data.user;
        const token = login.data.token || login.data.jwt || login.data.accessToken;

        console.log('LOGIN SUCCESS');
        console.log('Full User Data Keys:', Object.keys(user));
        console.log('Full User Data:', JSON.stringify(user, null, 2));

        const headers = { 'Authorization': `Bearer ${token}` };

        // Phase 3: Try booking with Robust Payload (Nested objects)
        const bookingData = {
            startDate: '2028-01-01',
            endDate: '2028-01-05',
            product: { id: 1 },
            user: { email: email, id: user.id }
        };

        console.log('--- Phase 3: Booking with Robust Payload ---');
        try {
            const b1 = await axios.post(`${baseURL}/bookings`, bookingData, { headers });
            console.log('BOOKING ROBUST SUCCESS:', b1.status);
        } catch (err) {
            console.log('BOOKING ROBUST FAILED:', err.response?.status, JSON.stringify(err.response?.data));
        }

        // Phase 4: Try booking with Minimal Payload (Only IDs)
        const bookingData2 = {
            startDate: '2028-01-06',
            endDate: '2028-01-10',
            product: { id: 1 },
            user: { id: user.id }
        };
        console.log('--- Phase 4: Booking with Minimal Payload (IDs) ---');
        try {
            const b2 = await axios.post(`${baseURL}/bookings`, bookingData2, { headers });
            console.log('BOOKING MINIMAL SUCCESS:', b2.status);
        } catch (err) {
            console.log('BOOKING MINIMAL FAILED:', err.response?.status, JSON.stringify(err.response?.data));
        }

    } catch (e) {
        console.log('FATAL:', e.response?.status, JSON.stringify(e.response?.data));
    }
}

run();
