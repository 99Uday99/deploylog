# DeployLog 🚀

**DeployLog** is a real-time CI/CD dashboard that visualizes the status of your deployment pipelines. Unlike traditional dashboards that passively pull data, DeployLog engages in an active feedback loop with your CI/CD pipeline, providing instant granular updates from "Queued" to "Success".

## 🎯 Purpose

The main purpose of DeployLog is to provide a **centralized, visual interface** for monitoring software deployments.
It solves the problem of "black box" pipelines where developers have to dig through GitHub Actions logs to see which specific step (Linting, Testing, Building) is currently running.

## 🏗️ Architecture & Workflow

DeployLog acts as both the **Source of Truth** and the **Status Receiver**.

1.  **Trigger**: A developer pushes code to the `main` branch.
2.  **Pipeline Start**: GitHub Actions triggers the `Build and Deploy` workflow.
3.  **Registration**: The workflow sends a `POST` request to DeployLog's API (`/api/deployments`), creating a new deployment record with status **"Queued"**.
4.  **Execution & Feedback**:
    - **Linting**: Workflow updates status to **"Linting"** via `PATCH`.
    - **Testing**: Workflow runs Selenium E2E tests and updates status to **"Testing"**.
    - **Building**: Docker build starts, status updates to **"Building"**.
5.  **Completion**: On success or failure, the final status and logs are sent to the dashboard.
6.  **Real-time UI**: The frontend polls the database every 5 seconds to reflect these changes instantly to the user.

## 🛠️ Tech Stack & Implementation

We chose a modern, robust stack to ensure performance and developer experience.

| Component     | Technology                  | Why It Was Used                                                                                                    |
| :------------ | :-------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| **Framework** | **Next.js 15 (App Router)** | Provides a powerful full-stack environment with easy API route creation and server-side rendering for performance. |
| **Language**  | **TypeScript**              | Ensures type safety across the entire stack (Frontend + API), reducing runtime errors.                             |
| **Styling**   | **Tailwind CSS**            | Allows for rapid UI development with utility classes, creating a clean and responsive design.                      |
| **Database**  | **SQLite**                  | Lightweight, zero-configuration SQL database perfect for development and small-to-medium deployments.              |
| **ORM**       | **Prisma**                  | Simplifies database interactions with a type-safe API, making schema changes and queries intuitive.                |
| **CI/CD**     | **GitHub Actions**          | Built-in automation to orchestrate the pipeline and report status back to our app.                                 |
| **Testing**   | **Selenium WebDriver**      | Performs true End-to-End (E2E) testing by automating a real browser to verify the app works as expected.           |

## 📂 Project Structure

- `app/`
  - `page.tsx`: The main dashboard UI.
  - `api/deployments/`: API endpoints (`GET`, `POST`, `PATCH`) for handling deployment data.
  - `components/`: Reusable UI components like `DeploymentCard`.
- `prisma/`: Contains the `schema.prisma` definition and SQLite database file.
- `.github/workflows/`: Contains `deploy.yml`, the CI/CD pipeline definition.
- `tests/e2e/`: Contains the Selenium automated test scripts.

## 🚀 Getting Started

Follow these steps to run DeployLog locally.

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Jay061205/deploylog.git
    cd deploylog
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Setup Database:**
    Initialize the SQLite database using Prisma.

    ```bash
    npx prisma db push
    ```

4.  **Run the Application:**
    Start the development server.

    ```bash
    npm run dev
    ```

5.  **View Dashboard:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

### Simulate a Deployment

To see the dashboard in action without pushing to GitHub, you can run the simulation script:

```bash
node simulate-pipeline.js
```

This script mimics a real pipeline sending status updates to your local server.
