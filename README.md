# ArrayLab - Interactive Array Simulation & Backend REST API

A full-stack interactive academic project simulating Array Data Structure operations, memory address calculations, algorithmic step breakdowns, and AI viva tutor with a Node.js + Express REST API backend.

---

## 🚀 Features

- **Interactive Cyberpunk Visualizer:** Animated DOM cells with active highlights, pop animations, and responsive layout.
- **Node.js & Express REST Backend:** Robust server handling array state, memory layouts, step logging, and input validations.
- **Contiguous Memory Mapping:** Dynamic formula calculation:
  $$\text{Address}(A[i]) = \text{Base Address} + (i \times \text{Element Size})$$
- **Live Operation Logs & Explanations:** Detailed step-by-step logs for insertions, deletions, linear searches, and sorts.
- **AI Study Assistant:** Integrated backend endpoint answering questions on array mechanics, time complexity, and data structures.
- **15 Comprehensive Professor Viva Questions:** Complete academic viva revision accordion questions and answers.
- **Automatic Fallback:** Gracefully falls back to local simulation if the backend server is temporarily offline.

---

## 🛠️ REST API Endpoints

| Method | Endpoint | Description | Payload Example |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & uptime | None |
| `GET` | `/api/array` | Get array state & memory addresses | None |
| `POST` | `/api/array/insert` | Insert element at index with shifting | `{"value": 25, "position": 2}` |
| `POST` | `/api/array/delete` | Delete element at index with shifting | `{"position": 1}` |
| `POST` | `/api/array/update` | Direct $O(1)$ random-access write | `{"position": 3, "value": 75}` |
| `POST` | `/api/array/search` | Linear search with comparison tracking | `{"value": 30}` |
| `POST` | `/api/array/sort` | Sort array in ascending order | `{}` |
| `POST` | `/api/array/reverse` | Reverse array elements symmetrically | `{}` |
| `POST` | `/api/array/traverse` | Traverse all elements sequentially | `{}` |
| `POST` | `/api/array/reset` | Reset to initial `[10, 20, 30, 40, 50]` | `{}` |
| `GET` | `/api/array/history` | Get recent operation logs | None |
| `POST` | `/api/tutor/ask` | Ask AI Study Tutor questions | `{"question": "Why is array access O(1)?"}` |
| `GET` | `/api/viva` | Fetch 15 academic viva review questions | None |

---

## 🏃 Running the Application

### 1. Start the Backend Server
```bash
npm start
# or
node server.js
```
The server will start listening at:
`http://localhost:3001`

### 2. Open the Frontend
- Visit `http://localhost:3001` in your web browser, OR
- Open `c:\Users\hardik\Documents\Array Insider.html` directly. The page will automatically detect the backend running on port 3001 and show a glowing green **"Backend: ONLINE (Port 3001)"** status badge.

### 3. Run Backend Unit & Integration Tests
```bash
# Internal logic and algorithm tests:
node testArray.js

# End-to-end HTTP REST API tests:
node testHttpApi.js
```
