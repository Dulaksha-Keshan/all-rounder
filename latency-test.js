import axios from 'axios';
import { performance } from 'perf_hooks';

/**
 * CONFIGURATION
 * Replace these values with your actual test data
 */
const BASE_URL = 'http://localhost:3000';
const AUTH_TOKEN = 'YOUR_FIREBASE_TOKEN_HERE'; // Requires a valid token
const TEST_USER_ID = 'test-uid-123'; 
const TEST_SCHOOL_ID = '1';

const headers = {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json'
};

async function measure(name, fn) {
    const start = performance.now();
    try {
        await fn();
        const end = performance.now();
        console.log(`✅ ${name}: ${(end - start).toFixed(2)}ms`);
        return end - start;
    } catch (error) {
        console.error(`❌ ${name} failed: ${error.message}`);
        if (error.response) console.error('   Response:', error.response.data);
        return null;
    }
}

async function runTests() {
    console.log('--- Starting Latency Benchmark ---\n');

    // 1. Basic Gateway Latency (Health Check)
    // Measures the overhead of the Gateway itself
    await measure('API Gateway Overhead (/health)', () => 
        axios.get(`${BASE_URL}/health`)
    );

    // 2. Structured Data Retrieval (PostgreSQL via User Service)
    // Fetches school details which are stored in Postgres
    await measure('Structured Data Retrieval (PostgreSQL - /api/schools/:id)', () => 
        axios.get(`${BASE_URL}/api/schools/${TEST_SCHOOL_ID}`, { headers })
    );

    // 3. Unstructured Data Retrieval (MongoDB via Content Service)
    // Fetches the global post feed from MongoDB
    await measure('Unstructured Data Retrieval (MongoDB - /api/posts/feed)', () => 
        axios.get(`${BASE_URL}/api/posts/feed`, { headers })
    );

    // 4. Post Creation Time (Content Service)
    // Includes: Validation, Payload formatting, and MongoDB write
    const postData = {
        title: "Benchmark Post " + Date.now(),
        content: "This is a test post to measure creation latency.",
        category: "Academic",
        visibility: "public"
    };
    
    await measure('Post Creation & Publishing (/api/posts)', () => 
        axios.post(`${BASE_URL}/api/posts`, postData, { headers })
    );

    console.log('\n--- Benchmark Complete ---');
}

if (AUTH_TOKEN === 'YOUR_FIREBASE_TOKEN_HERE') {
    console.error('Error: Please provide a valid AUTH_TOKEN in the script.');
} else {
    runTests();
}
