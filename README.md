# DevDistruct - Live React Code Editor

## Overview

DevDistruct is a live code editor built using React and Sandpack, allowing users to write, edit, and execute React code in real time. The project also integrates external package installation and AI-powered code suggestions using the Gemini API.

## Features

### Core Features

- **Live Code Editing**: Uses Sandpack to enable real-time code editing with a preview pane.
- **External Library Installation**: Implements a terminal (XTerm.js) to install and use NPM packages dynamically.
- **AI-Powered Code Suggestions**: Uses the Gemini API to suggest and improve code snippets.
- **User-Friendly Interface**: Provides a clean and intuitive UI with proper error handling and console output.
- **Theme Switching**: Supports dark and light mode for better user experience.

### Upcoming Features

- **File Management within the Editor** (Planned for future updates).
- **Auto-suggestions and Linting Support** (Bonus feature).

## Technologies Used

- **Frontend**: React, Sandpack
- **Terminal**: XTerm.js
- **AI Integration**: Google Gemini API
- **UI Styling**: Tailwind CSS

## Installation & Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/BHSajuu/Live-React-Code-Editor.git
   cd Live-React-Code-Editor
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up your environment variables in a `.env` file:
   ```sh
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Usage

- Write and edit React code in the editor.
- Install external libraries using the integrated terminal (`npm install <package-name>`).
- Click on "Get AI Suggestions" to improve your code using the Gemini API.
- Switch between dark and light mode as per preference.
