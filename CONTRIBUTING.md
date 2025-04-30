# Contributing to WhatTheCV

Thank you for considering contributing to WhatTheCV! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

Before submitting a bug report:

- Check the issue tracker to see if the bug has already been reported.
- Ensure you're using the latest version of the code.
- Determine which repository the bug should be reported in.

When submitting a bug report, please include:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs. actual behavior
- Screenshots if applicable
- Your environment details (OS, browser, version, etc.)

### Suggesting Features

Feature suggestions are tracked as GitHub issues. When submitting a feature suggestion:

- Use a clear, descriptive title
- Provide a detailed explanation of the feature and its benefits
- If possible, include examples or mockups

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Commit your changes with clear, descriptive messages
5. Push to your branch (`git push origin feature/your-feature-name`)
6. Submit a pull request

### Pull Request Guidelines

- Update the README.md with details of significant changes if applicable
- Update examples or docs if relevant
- The PR should work on the main supported browsers and Node.js versions
- Follow the coding style and conventions of the project

## Development Setup

### Prerequisites

- Node.js (v16 or later)
- npm or pnpm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/gauravsinhaweb/whatthecv.git
   ```

2. Navigate to the project directory
   ```bash
   cd whatthecv
   ```

3. Install dependencies
   ```bash
   pnpm install
   ```

4. Start the development server
   ```bash
   pnpm dev
   ```

## Project Structure

```
whatthecv/
├── public/        # Static files
├── src/
│   ├── components/  # React components
│   ├── screens/     # Page components
│   ├── utils/       # Utility functions
│   └── ...          # Other source files
└── ...
```

## Coding Guidelines

### TypeScript

- Use TypeScript for all new code
- Add proper type definitions
- Avoid using `any` when possible

### React Components

- Use functional components with hooks
- Keep components small and focused on a single responsibility
- Use named exports for components

### Styling

- Use Tailwind CSS for styling
- Follow the project's existing design patterns
- Keep styling consistent throughout the application

### Testing

- Write tests for new functionality
- Make sure existing tests pass before submitting PR

## Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests liberally after the first line

## License

By contributing to WhatTheCV, you agree that your contributions will be licensed under the project's [MIT License](LICENSE). 