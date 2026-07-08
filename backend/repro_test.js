
const http = require('http');
const fs = require('fs');

function log(message) {
    fs.appendFileSync('repro_log.txt', message + '\n');
    // console.log(message); // Still log to console just in case
}

function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = body ? JSON.parse(body) : {};
                    resolve({ status: res.statusCode, data: parsed, headers: res.headers });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body, headers: res.headers });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function testBackend() {
    try {
        log('--- Starting Backend Test (HTTP) ---');

        // 1. Register Student
        const studentEmail = `student_${Date.now()}@test.com`;
        log(`Registering Student: ${studentEmail}`);
        const studentRes = await request({
            hostname: '127.0.0.1',
            port: 5001,
            path: '/api/auth/register',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            name: 'Test Student',
            email: studentEmail,
            password: 'password123',
            role: 'student'
        });

        if (studentRes.status !== 200 && studentRes.status !== 201) {
            log('Student registration failed: ' + JSON.stringify(studentRes.data));
            return;
        }
        const studentToken = studentRes.data.token;
        log('Student registered. Token received.');

        // 2. Register Recruiter
        const recruiterEmail = `recruiter_${Date.now()}@test.com`;
        log(`Registering Recruiter: ${recruiterEmail}`);
        const recruiterRes = await request({
            hostname: '127.0.0.1',
            port: 5001,
            path: '/api/auth/register',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            name: 'Test Recruiter',
            email: recruiterEmail,
            password: 'password123',
            role: 'recruiter',
            company: 'Test Company'
        });

        if (recruiterRes.status !== 200 && recruiterRes.status !== 201) {
            log('Recruiter registration failed: ' + JSON.stringify(recruiterRes.data));
            return;
        }
        const recruiterToken = recruiterRes.data.token;
        log('Recruiter registered. Token received.');

        // 3. Post a Job
        log('Posting a Job...');
        const jobRes = await request({
            hostname: '127.0.0.1',
            port: 5001,
            path: '/api/jobs',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${recruiterToken}`
            }
        }, {
            title: 'Backend Developer',
            company: 'Test Company',
            description: 'We need a backend developer.',
            salary: '100000',
            location: 'Remote',
            skillsRequired: ['Node.js', 'Express', 'MongoDB']
        });

        if (jobRes.status !== 200 && jobRes.status !== 201) {
            log('Job posting failed: ' + JSON.stringify(jobRes.data));
        } else {
            log('Job posted successfully.');
        }

        // 4. Get Jobs as Student
        log('Fetching Jobs as Student...');
        const getJobsRes = await request({
            hostname: '127.0.0.1',
            port: 5001,
            path: '/api/jobs',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${studentToken}`
            }
        });

        log(`Jobs Fetch Status: ${getJobsRes.status}`);
        const jobs = getJobsRes.data;

        if (Array.isArray(jobs)) {
            log(`Jobs fetched count: ${jobs.length}`);
            if (jobs.length > 0) {
                log('SUCCESS: Jobs are being returned.');
                log('First job title: ' + jobs[0].title);
            } else {
                log('WARNING: Jobs array is empty.');
            }
        } else {
            log('FAILURE: API did not return an array. ' + JSON.stringify(jobs));
        }

    } catch (error) {
        log('Test failed with error: ' + error);
        log(error.stack);
    }
}

testBackend();
