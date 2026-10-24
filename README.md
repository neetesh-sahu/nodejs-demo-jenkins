# Elevate Labs Internship - Task 1 (Node.js App)

A simple Node.js + Express web app.

## Endpoints
| Route | Description |
|-------|-------------|
| `/` | Home page (HTML) |
| `/api/hello?name=Neetesh` | Returns a greeting as JSON |
| `/api/info` | App and server info |
| `/health` | Health check |

## Run locally
```bash
npm install
npm start
# open http://localhost:3000
```

## Run with Docker
```bash
docker build -t elevate-task1 .
docker run -d -p 3000:3000 --name task1 elevate-task1
```

## Project structure
```
.
├── server.js
├── package.json
├── public/index.html
├── Dockerfile
└── README.md
```
