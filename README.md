<div align="center">
  <img src="public/assets/banner.svg" alt="WhatTheCV" width="800"/>

  <p>AI-powered resume builder and ATS optimization platform</p>

  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" />
  </a>
  <a href="CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
  </a>
  <a href="https://github.com/gauravsinhaweb/whatthecv/issues">
    <img src="https://img.shields.io/github/issues/gauravsinhaweb/whatthecv" alt="GitHub Issues" />
  </a>
  <a href="https://github.com/gauravsinhaweb/whatthecv/stargazers">
    <img src="https://img.shields.io/github/stars/gauravsinhaweb/whatthecv" alt="GitHub Stars" />
  </a>
  <a href="https://buymeacoffee.com/gauravsinha">
    <img src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-yellow.svg" alt="Buy Me A Coffee" />
  </a>
</div>

## Overview

WhatTheCV helps job seekers create professionally designed resumes that are optimized to pass through Applicant Tracking Systems, while also providing tools for recruiters to find ideal candidates. Our AI-powered platform offers intelligent feedback, job-specific tailoring, and professional templates.

## Features

### For Job Seekers

- **ATS Optimization** - Get your resume scored against Applicant Tracking Systems and receive detailed improvement suggestions
- **Professional Templates** - Choose from multiple ATS-friendly templates designed for tech professionals
- **AI-Powered Analysis** - Receive intelligent feedback on your resume content and structure
- **Job-Specific Tailoring** - Customize your resume for specific job descriptions to increase your match score
- **Privacy Control** - Choose whether your resume is visible to recruiters or keep it private while you work on it

### For Recruiters

- **Candidate Search** - Find matching candidates based on job requirements
- **Job Posting** - Post job listings that candidates can target their resumes toward
- **Skills Filtering** - Filter candidates by specific skills and qualifications
- **Direct Contact** - Connect with promising candidates through the platform

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or pnpm (pnpm recommended)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/gauravsinhaweb/whatthecv.git
   ```

2. Navigate to the project directory:

   ```
   cd whatthecv
   ```

3. Install dependencies:

   ```
   pnpm install
   ```

   or

   ```
   npm install
   ```

4. Start the development server:

   ```
   pnpm dev
   ```

   or

   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Technology Stack

- **Frontend**: Preact, TypeScript, Tailwind CSS
- **Backend**: Python FastAPI
- **Deployments**: Docker
- **UI Components**: Custom components with Tailwind styling
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Animations**: CSS Transitions and Transforms

## Project Structure

```
whatthecv/
├── public/           # Static files
├── src/
│   ├── components/   # React components
│   │   ├── ui/       # Reusable UI components
│   │   ├── Dashboard.tsx   # Main dashboard component
│   │   └── ...       # Other components
│   ├── pages/        # Page components
│   ├── styles/       # Global styles
│   ├── utils/        # Utility functions
│   ├── types/        # TypeScript type definitions
│   └── ...           # Other source files
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

## How It Works

1. **Upload Your Resume** - Upload your existing resume or start from scratch with our templates
2. **AI Analysis** - Our AI analyzes your resume for ATS compatibility and suggests improvements
3. **Optimize & Export** - Implement the suggestions, choose your privacy settings, and export your optimized resume

## Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Quick Start for Contributors

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/whatthecv.git`
3. Create your feature branch: `git checkout -b feature/amazing-feature`
4. Make your changes
5. Commit your changes: `git commit -m 'Add some amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Areas We Need Help With

- UI/UX improvements
- ATS scoring algorithm refinement
- Template designs
- Accessibility enhancements
- Test coverage
- Documentation

## Support the Project

If you find WhatTheCV useful, consider:

- ⭐ Star the repository on GitHub
- 🐛 Report bugs or suggest features through [GitHub Issues](https://github.com/gauravsinhaweb/whatthecv/issues)
- 💻 Submit pull requests to improve the codebase
- ☕ Support the development by [buying me a coffee](https://buymeacoffee.com/gauravsinha)

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/gauravsinha)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- **Project Maintainer**: [Gaurav Sinha](https://x.com/defigoro)
- **Frontend**: [https://github.com/gauravsinhaweb/whatthecv](https://github.com/gauravsinhaweb/whatthecv)
- **Backend**: [https://github.com/gauravsinhaweb/whatthecv-backend](https://github.com/gauravsinhaweb/whatthecv-backend)
- **Issues**: [https://github.com/gauravsinhaweb/whatthecv/issues](https://github.com/gauravsinhaweb/whatthecv/issues)

## Acknowledgements

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- All our [contributors](https://github.com/gauravsinhaweb/whatthecv/graphs/contributors)
