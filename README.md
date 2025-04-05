# 📘 AI Reading Assistant

A powerful browser extension that enhances your web reading experience with AI-powered summarization, key point extraction, term explanations, and text-to-speech capabilities.

## ✨ Description

AI Reading Assistant transforms how you consume online content by providing instant access to AI-powered tools that help you understand and interact with web content more efficiently. Using Google's Gemini 1.5 Flash AI model and the Web Speech API, this extension offers a suite of features designed to make reading online content faster, more accessible, and more productive.

Whether you're researching, studying, or just browsing the web, AI Reading Assistant helps you quickly grasp the essential information without getting overwhelmed by lengthy articles or complex terminology.

## 🚀 Live Demo

Visit our website: [https://chirag127.github.io/AI-Reading-Assistant/](https://chirag127.github.io/AI-Reading-Assistant/)

## 🛠️ Tech Stack / Tools Used

- **Frontend**:
  - JavaScript
  - HTML/CSS
  - Chrome Extension APIs
  - Web Speech API

- **Backend**:
  - Node.js
  - Express.js
  - Google Gemini 1.5 Flash API

- **Deployment**:
  - Backend hosted on Render
  - GitHub Pages for landing page

## 📦 Installation Instructions

### Manual Installation

1. Clone this repository:
   ```
   git clone https://github.com/chirag127/AI-Reading-Assistant.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top-right corner

4. Click "Load unpacked" and select the `extension` folder from the cloned repository

5. The extension should now appear in your browser toolbar

### Backend Setup (for developers)

1. Navigate to the backend directory:
   ```
   cd AI-Reading-Assistant/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` and add your Google Gemini API key

4. Start the server:
   ```
   npm start
   ```

## 🔧 Usage

Once installed, AI Reading Assistant adds a toolbar to every webpage you visit:

1. **Summarize Articles**: Click the "Summarize" button to get an instant summary of the current page
2. **Extract Key Points**: Click the "Key Points" button to extract the most important information
3. **Explain Terms**: Select any text and click "Explain" to get an AI-powered explanation
4. **Text-to-Speech**: Use the "Speak" button to have content read aloud with text highlighting
5. **Customize Settings**: Access the extension popup to adjust summary mode, speech rate (up to 32x), pitch, and voice selection

## 🧪 Features

- **Smart Summarization**: Get instant summaries in brief, detailed, or bullet-point format
- **Key Point Extraction**: Identify the core ideas and takeaways from any content
- **Term Explanation**: Get contextual explanations for unfamiliar terms or concepts
- **Advanced Text-to-Speech**: Listen to content with customizable speech rate, pitch, and voice selection
- **Text Highlighting**: Visual highlighting of text as it's being read aloud
- **Draggable Interface**: User-friendly toolbar and popups that can be positioned anywhere on the page
- **Customizable Settings**: Personalize your experience with various options
- **Auto-Popup**: Optional feature that automatically summarizes content on news and blog sites

## 📸 Screenshots

![AI Reading Assistant Toolbar](https://raw.githubusercontent.com/chirag127/AI-Reading-Assistant/main/screenshots/toolbar.png)
![Summary Popup](https://raw.githubusercontent.com/chirag127/AI-Reading-Assistant/main/screenshots/summary.png)
![Settings Popup](https://raw.githubusercontent.com/chirag127/AI-Reading-Assistant/main/screenshots/settings.png)

## 🙌 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please make sure to update tests as appropriate and follow the code style of the project.

## 🪪 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

Created by [Chirag Singhal](https://github.com/chirag127)
