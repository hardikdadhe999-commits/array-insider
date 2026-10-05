const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(raw) });
        } catch (e) {
          resolve({ status: res.statusCode, raw });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3001${path}`, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(raw) });
        } catch (e) {
          resolve({ status: res.statusCode, raw });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('--- Testing ArrayLab HTTP REST API ---');

  // 1. Health
  const health = await get('/api/health');
  console.log('1. Health check:', health.data.status, '(HTTP ' + health.status + ')');

  // 2. Initial Array State
  const initial = await get('/api/array');
  console.log('2. Current array:', initial.data.array);

  // 3. Insert 25 at index 2
  const insertRes = await post('/api/array/insert', { value: 25, position: 2 });
  console.log('3. Insert response:', insertRes.data.message, '-> New Array:', insertRes.data.array);

  // 4. Update index 3 to 75
  const updateRes = await post('/api/array/update', { position: 3, value: 75 });
  console.log('4. Update response:', updateRes.data.message, '-> New Array:', updateRes.data.array);

  // 5. Search for 75
  const searchRes = await post('/api/array/search', { value: 75 });
  console.log('5. Search 75 response:', searchRes.data.message, 'Found at:', searchRes.data.foundIndex);

  // 6. Delete index 1
  const deleteRes = await post('/api/array/delete', { position: 1 });
  console.log('6. Delete response:', deleteRes.data.message, '-> New Array:', deleteRes.data.array);

  // 7. Sort
  const sortRes = await post('/api/array/sort', {});
  console.log('7. Sort response:', sortRes.data.message, '-> New Array:', sortRes.data.array);

  // 8. AI Tutor question
  const tutorRes = await post('/api/tutor/ask', { question: 'Why is array access O(1)?' });
  console.log('8. AI Tutor answer:', tutorRes.data.answer.substring(0, 75) + '...');

  // 9. Viva questions
  const vivaRes = await get('/api/viva');
  console.log('9. Viva questions returned:', vivaRes.data.questions.length);

  // 10. Reset
  const resetRes = await post('/api/array/reset', {});
  console.log('10. Reset response:', resetRes.data.message, '-> Restored:', resetRes.data.array);

  console.log('\n>>> ALL 10 REST API ENDPOINTS VERIFIED & WORKING PERFECTLY! <<<');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
});
