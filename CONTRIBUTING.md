# Contributing to Prasthanam

Thank you for your interest in contributing! We welcome contributions from the community. Please read this guide to understand how to contribute effectively.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions. We are committed to providing a welcoming and inspiring community.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/prasthanam.git
   cd prasthanam
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original/prasthanam.git
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (optional)
- MongoDB Atlas account

### Installation

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Coding Standards

### TypeScript
- Use strict mode (`strict: true` in tsconfig.json)
- Use explicit return types for all functions
- Avoid `any` type unless absolutely necessary
- Use interfaces over types when possible

### Naming Conventions
- **Files**: kebab-case for components/pages, camelCase for utilities
- **Variables**: camelCase for variables and functions
- **Classes**: PascalCase
- **Constants**: UPPER_SNAKE_CASE
- **React Components**: PascalCase in both file name and component name

### Code Style
```typescript
// Good
export const getUserById = async (id: string): Promise<User> => {
  const user = await User.findById(id);
  return user;
};

// Bad
export const getUser = async (id) => {
  let u = await User.findById(id);
  return u;
};
```

### Comments
- Use JSDoc for functions:
```typescript
/**
 * Fetches a user by ID
 * @param id - The user ID
 * @returns The user object or null if not found
 */
export const getUserById = async (id: string): Promise<User | null> => {
  return User.findById(id);
};
```

- Avoid obvious comments:
```typescript
// Good
// Retry failed payment verification up to 3 times
const verified = await retry(() => verifyPayment(paymentId), 3);

// Bad
// Check if user exists
const user = await User.findById(id);
```

## Commit Guidelines

- Use clear, descriptive commit messages
- Follow the format: `[Type] Description`
- Types: feat, fix, docs, style, refactor, test, chore

Examples:
```
[feat] Add email notifications for bookings
[fix] Resolve payment verification timeout issue
[docs] Update API documentation
[test] Add integration tests for auth endpoints
[refactor] Simplify event filtering logic
```

## Pull Request Process

1. **Update from upstream**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Open a Pull Request** on GitHub with:
   - Clear title and description
   - Reference to any related issues
   - Screenshots for UI changes
   - Testing instructions

4. **PR Checklist**:
   - [ ] Code follows style guidelines
   - [ ] Tests added/updated
   - [ ] Documentation updated
   - [ ] No console errors/warnings
   - [ ] Tested locally

## Testing

### Backend Tests
```bash
cd backend
npm test                    # Run tests
npm run test:watch        # Watch mode
npm run typecheck         # Type checking
npm run lint              # Linting
```

### Frontend Tests
```bash
cd frontend
npm test                    # Run tests
npm run typecheck         # Type checking
npm run lint              # Linting
```

### E2E Tests
```bash
cd frontend
npm run cypress:open      # Interactive mode
npm run cypress:run       # Headless mode
```

## Documentation

- Update README.md for user-facing changes
- Update API_DOCUMENTATION.md for API changes
- Add JSDoc comments for public functions
- Update ARCHITECTURE.md for structural changes

## Before Submitting

1. **Run tests**: `npm test`
2. **Check types**: `npm run typecheck`
3. **Lint code**: `npm run lint`
4. **Test locally**: Start dev servers and test your changes
5. **Review your changes**: Make sure they follow guidelines

## Common Issues

### Dependencies not installing?
```bash
npm cache clean --force
npm install
```

### Type errors?
```bash
npm run typecheck
# Fix any reported errors
```

### Port already in use?
```bash
# Kill process on port 3000 or 4000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Feature Requests & Bug Reports

### Bug Report
Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots/logs if applicable

### Feature Request
Include:
- Detailed description
- Use cases/motivation
- Possible implementation approach
- Mockups/examples if applicable

## Project Structure Overview

```
prasthanam/
├── backend/           # Node.js + Express
├── frontend/          # React + Vite
├── .github/workflows/ # CI/CD
├── docker-compose.yml # Local development
└── docs/              # Documentation
```

## Review Process

1. Automated checks (tests, linting, build)
2. Code review by maintainers
3. Address feedback
4. Final approval and merge

## Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general help
- **Email**: contributors@prasthanam.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Prasthanam! 🙏**
