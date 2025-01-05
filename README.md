# Task Queue System

## Overview

This is a backend service that processes tasks asynchronously using a queue-based system with Redis, built with NestJS. The system supports retry logic, dead-letter queue (DLQ), and task processing. The key features include task management, retry logic, and DLQ monitoring.

## Features

- **Task Management**:
  - Add tasks to the queue.
  - Process tasks asynchronously.
  - Support for delayed task visibility.
  
- **Retry Logic**:
  - Tasks will be retried a configurable number of times in case of failure.
  - Exponential backoff strategy for retries.
  
- **Dead-Letter Queue (DLQ)**:
  - Failed tasks are moved to a separate DLQ after exhausting all retries.
  - View and delete tasks from DLQ.

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) version 14 or higher.
- [Redis](https://redis.io/) server installed and running (can be installed locally or using Docker).

### Install Dependencies

1. Clone the repository:
   ```bash
   git clone https://github.com/Hensh99/Task-Queue-System.git
   cd Task-Queue-System
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

### Run Redis (if not using Docker)

1. To install Redis on your local machine, follow the instructions for your OS on the [Redis official website](https://redis.io/download).

2. Start the Redis server:
   ```bash
   redis-server
   ```

### Run Redis with Docker

If you prefer to run Redis using Docker, use the following commands:

```bash
docker pull redis
docker run --name redis-container -p 6379:6379 -d redis
```

### Running the Application

1. Start the NestJS application:
   ```bash
   npm run start
   ```

   The application will be available at `http://localhost:3000`.

## Endpoints

### 1. **Add Task**
- **Endpoint**: `POST /tasks`
- **Request Body**:
  ```json
  {
    "type": "string",
    "payload": "object",
    "visibility_time": "datetime" // ISO 8601 format for delayed visibility
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "status": "Task added to queue"
  }
  ```

### 2. **View DLQ**
- **Endpoint**: `GET /dlq`
- **Response**:
  ```json
  [
    {
      "id": "string",
      "type": "string",
      "payload": "object",
      "error": "string"
    }
  ]
  ```

### 3. **Clear DLQ**
- **Endpoint**: `DELETE /dlq`
- **Response**:
  ```json
  {
    "status": "DLQ cleared"
  }
  ```

### Testing the Endpoints

#### Test `POST /tasks` to Add a Task
- **URL**: `http://localhost:3000/tasks`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "type": "email",
    "payload": { "to": "user@example.com" },
    "visibility_time": "2025-01-06T10:00:00Z"
  }
  ```

#### Test `GET /dlq` to View Dead-Letter Queue (DLQ)
- **URL**: `http://localhost:3000/dlq`
- **Method**: `GET`
- **Response**: 
  - You should see a list of tasks in the DLQ if there are any failed tasks.

#### Test `DELETE /dlq` to Clear DLQ
- **URL**: `http://localhost:3000/dlq`
- **Method**: `DELETE`
- **Response**:
  - You should receive a message indicating that the DLQ has been cleared:
  ```json
  {
    "status": "DLQ cleared"
  }
  ```

### Task Retry Logic

When a task fails, it will be retried up to a configurable number of attempts. If all attempts fail, the task will be moved to the DLQ.

To simulate a failure:
1. Modify the `TasksProcessor` to deliberately fail a task (e.g., by throwing an error).
2. Submit a task via the `POST /tasks` endpoint.
3. Check the retry attempts in the logs (they should increment).
4. After exhausting retries, the task will be moved to the DLQ.

### Monitoring

- Monitor the logs to check the status of task processing:
  - **Success**: Task was processed successfully.
  - **Retry**: Task is being retried.
  - **Failure**: Task failed after the maximum retry attempts and moved to DLQ.
