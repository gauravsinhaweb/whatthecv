# Contributing to WhatTheCV

Thank you for considering contributing to WhatTheCV! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

Our community is dedicated to providing a harassment-free experience for everyone. We do not tolerate harassment of community members in any form. By participating in this project, you agree to abide by our code of conduct.

## How Can I Contribute?

### Reporting Bugs

Before submitting a bug report:

- Check the [issue tracker](https://github.com/gauravsinhaweb/whatthecv/issues) to see if the bug has already been reported.
- Ensure you're using the latest version of the code.
- Determine which repository the bug should be reported in (frontend or backend).

When submitting a bug report, please include:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs. actual behavior
- Screenshots if applicable
- Your environment details (OS, browser, version, etc.)
- If possible, a minimal reproduction of the issue

### Suggesting Features

Feature suggestions are tracked as GitHub issues. When submitting a feature suggestion:

- Use a clear, descriptive title
- Provide a detailed explanation of the feature and its benefits
- If possible, include examples or mockups
- Describe how this feature would benefit the project's users

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Commit your changes with clear, descriptive messages
5. Push to your branch (`git push origin feature/your-feature-name`)
6. Submit a pull request

### Pull Request Guidelines

- Create a separate branch for each PR
- Update the README.md with details of significant changes if applicable
- Update examples or docs if relevant
- The PR should work on the main supported browsers and Node.js versions
- Follow the coding style and conventions of the project
- Write meaningful commit messages using the [conventional commits](https://www.conventionalcommits.org/) format
- Link the PR to any issues it resolves using GitHub keywords (Fixes #123, Closes #456, etc.)

## Development Setup

### Prerequisites

- Node.js (v16 or later)
- npm or pnpm (pnpm recommended)

### Installation

1. Clone your fork of the repository

   ```bash
   git clone https://github.com/YOUR_USERNAME/whatthecv.git
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
- Use interfaces for object shapes and types for aliases

### React Components

- Use functional components with hooks
- Keep components small and focused on a single responsibility
- Use named exports for components
- Follow the established component patterns in the codebase

### Styling

- Use Tailwind CSS for styling
- Follow the project's existing design patterns
- Keep styling consistent throughout the application
- Use CSS variables for theme colors and values

### Testing

- Write tests for new functionality
- Make sure existing tests pass before submitting PR
- Follow the established testing patterns in the codebase
- Aim for meaningful test coverage, not just percentage

## Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests liberally after the first line
- Consider starting the commit message with an applicable type:
  - feat: (new feature)
  - fix: (bug fix)
  - docs: (documentation changes)
  - style: (formatting, missing semi-colons, etc; no code change)
  - refactor: (refactoring production code)
  - test: (adding tests, refactoring tests; no production code change)
  - chore: (updating build tasks, package manager configs, etc; no production code change)

## Review Process

- All code changes require a review from a team member
- Address review feedback in a timely manner
- Be open to suggestions and feedback
- Be respectful and considerate in code review discussions

## License

By contributing to WhatTheCV, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

## Questions?

If you have any questions or need help, feel free to reach out to the project maintainers or open an issue for discussion.
