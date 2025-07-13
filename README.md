# GeminiSEO: AI-Powered Content Optimization Tool

This is a Next.js application built with Firebase Studio that leverages the power of Google's Gemini models through Genkit to provide a suite of AI-powered SEO content analysis and generation tools.

The application is designed to help content creators, marketers, and SEO specialists improve their web content for better search engine visibility and user engagement.

## Features

- **SEO Audit:** Analyzes provided content and offers a concise report on areas for improvement based on modern SEO best practices (like E-E-A-T and Helpful Content).
- **Content Rewriter:** Rewrites existing content to be more engaging and SEO-friendly.
- **FAQ Generator:** Automatically creates a list of relevant Frequently Asked Questions (FAQs) and their answers based on the input content.
- **Meta Info Generator:** Generates optimized meta titles (under 60 characters) and descriptions (under 160 characters) for your content.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **AI/Backend:** [Genkit](https://firebase.google.com/docs/genkit) with [Google's Gemini models](https://ai.google.dev/)
- **UI:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/)

### 1. Environment Setup

The Genkit backend requires a Google AI API key to function.

1.  Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  In the root of the project, create a new file named `.env`.
3.  Add your API key to the `.env` file like this:

    ```bash
    GOOGLE_API_KEY="YOUR_API_KEY_HERE"
    ```

### 2. Install Dependencies

Install the necessary npm packages by running the following command in your terminal:

```bash
npm install
```

### 3. Running the Application Locally

This project consists of two main parts that need to run concurrently during development:

1.  **The Next.js Frontend:** This is the user interface of your application.
2.  **The Genkit Backend:** This is a local development server that runs your AI flows.

You'll need to open two separate terminal windows or tabs to run both.

**Terminal 1: Start the Genkit Backend**

In your first terminal, run the following command to start the Genkit development server. This server watches for changes in your AI flow files (`src/ai/flows/`).

```bash
npm run genkit:watch
```

You should see output indicating that the Genkit server is running and your flows are available.

**Terminal 2: Start the Next.js Frontend**

In your second terminal, run the following command to start the Next.js development server.

```bash
npm run dev
```

This will start the frontend application, typically on port 9002.

Once both servers are running, you can open your browser and navigate to `http://localhost:9002` to see the application in action.

## Project Structure

Here's a brief overview of the key directories:

-   **/src/app/**: Contains the main pages and layout of the Next.js application. `page.tsx` is the entry point for the UI.
-   **/src/ai/flows/**: This is where the backend logic lives. Each file defines a specific AI capability (e.g., `seo-audit.ts`, `content-rewriter.ts`).
-   **/src/ai/genkit.ts**: Configures the global Genkit instance and specifies the AI model to be used.
-   **/src/components/**: Contains reusable React components, including the UI elements from ShadCN.
-   **/public/**: For static assets like images and fonts.

## Working on the Backend (Genkit)

All backend logic is handled by Genkit flows located in `/src/ai/flows/`.

-   **Defining a Flow:** A flow is an async function defined with `ai.defineFlow()`. It specifies input and output schemas using Zod.
-   **Defining a Prompt:** A prompt is defined with `ai.definePrompt()`. It includes the instructions for the LLM and references input variables using Handlebars syntax (e.g., `{{{content}}}`).
-   **Schemas (Input/Output):** We use Zod (`z`) to define the expected structure of data going into a flow (`inputSchema`) and the data coming out (`outputSchema`). This provides strong typing and helps ensure the LLM returns data in the correct format.
-   **Exporting:** Each flow file exports a wrapper function that calls the flow, along with the input and output TypeScript types.

When you modify any file inside `/src/ai/flows/`, the `genkit:watch` process will automatically reload the flow, making it immediately available to your frontend.

## Publishing to GitHub

To share your project and collaborate with others, you can publish it to GitHub.

1.  **Initialize Git:**
    If you haven't already, initialize a Git repository in your project folder.
    ```bash
    git init -b main
    ```

2.  **Add Files:**
    Stage all your project files for the first commit.
    ```bash
    git add .
    ```

3.  **Commit Files:**
    Commit the staged files with a message.
    ```bash
    git commit -m "Initial commit"
    ```

4.  **Create a GitHub Repository:**
    - Go to [GitHub](https://github.com) and log in.
    - Click on the `+` icon in the top-right corner and select "New repository".
    - Give your repository a name (e.g., `gemini-seo-app`) and an optional description.
    - Make sure the repository is set to "Public" or "Private" as you prefer.
    - **Do not** initialize the repository with a README, .gitignore, or license, as you already have these files.
    - Click "Create repository".

5.  **Link to GitHub Repository:**
    On your new repository's page, GitHub will show you a URL. Copy it and run the following command in your terminal, replacing the URL with your own.
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
    ```

6.  **Push to GitHub:**
    Push your local repository to GitHub.
    ```bash
    git push -u origin main
    ```

Now your code is live on GitHub!
