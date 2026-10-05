const express = require('express');
const cors = require('cors');
const path = require('path');
const {
  ArrayService,
  answerTutorQuestion,
  TUTOR_QA,
  VIVA_QUESTIONS
} = require('./arrayService');

const app = express();
const PORT = process.env.PORT || 3001;

// Global simulation state for ArrayLab
const arrayService = new ArrayService([10, 20, 30, 40, 50]);

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static frontend files (index.html, style.css, script.js)
app.use(express.static(__dirname));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    project: 'ArrayLab',
    message: 'Backend server is active and running',
    timestamp: new Date().toISOString()
  });
});

// 1. Get current array state and memory mapping
app.get('/api/array', (req, res) => {
  res.json({
    success: true,
    ...arrayService.getState()
  });
});

// 2. Reset array to initial state
app.post('/api/array/reset', (req, res) => {
  const result = arrayService.reset();
  res.json(result);
});

// 3. Insert element at position
app.post('/api/array/insert', (req, res) => {
  try {
    const { value, position } = req.body;
    const result = arrayService.insert(value, position);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 4. Delete element at position
app.post('/api/array/delete', (req, res) => {
  try {
    const { position } = req.body;
    const result = arrayService.delete(position);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 5. Update element at position
app.post('/api/array/update', (req, res) => {
  try {
    const { position, value } = req.body;
    const result = arrayService.update(position, value);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 6. Search for value
app.post('/api/array/search', (req, res) => {
  try {
    const { value } = req.body;
    const result = arrayService.search(value);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 7. Sort array
app.post('/api/array/sort', (req, res) => {
  const result = arrayService.sort();
  res.json(result);
});

// 8. Reverse array
app.post('/api/array/reverse', (req, res) => {
  const result = arrayService.reverse();
  res.json(result);
});

// 9. Traverse array
app.post('/api/array/traverse', (req, res) => {
  const result = arrayService.traverse();
  res.json(result);
});

// 10. Get operation history
app.get('/api/array/history', (req, res) => {
  res.json({
    success: true,
    history: arrayService.getHistory()
  });
});

// 11. AI Study Assistant endpoint
app.post('/api/tutor/ask', (req, res) => {
  const { question } = req.body;
  const answer = answerTutorQuestion(question);
  res.json({
    success: true,
    question,
    answer
  });
});

app.get('/api/tutor/questions', (req, res) => {
  res.json({
    success: true,
    questions: [
      'What is an array?',
      'Why is array access O(1)?',
      'Explain insertion in an array.',
      'What is linear search?',
      'Why does deletion take O(n)?',
      'Array vs linked list'
    ]
  });
});

// 12. Viva Questions endpoint
app.get('/api/viva', (req, res) => {
  res.json({
    success: true,
    questions: VIVA_QUESTIONS
  });
});

// Fallback route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`ArrayLab Backend server running on http://localhost:${PORT}`);
});
