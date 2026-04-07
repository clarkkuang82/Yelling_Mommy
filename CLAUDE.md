# Yelling Mommy - Development Guidelines

## Red-Green-Refactor TDD Workflow

All code changes MUST follow the Red-Green-Refactor TDD cycle:

### 1. RED — Write a Failing Test First
- Before writing any production code, write a test that describes the desired behavior.
- Run the test and confirm it **fails** (red). If it passes, the test is not testing anything new.
- The test should be small, focused, and test exactly one behavior.
- Use descriptive test names that read like specifications: `test_player_score_increases_when_yelling_louder`.

### 2. GREEN — Write the Minimum Code to Pass
- Write the **simplest** production code that makes the failing test pass.
- Do NOT add extra logic, optimizations, or features beyond what the test requires.
- Run all tests and confirm they **all pass** (green).
- If any test fails, fix the production code — do not modify the test (unless the test itself is wrong).

### 3. REFACTOR — Clean Up While Green
- With all tests passing, improve the code structure without changing behavior.
- Look for duplication, unclear naming, overly complex logic, or poor organization.
- Run all tests after every refactoring step to ensure nothing breaks.
- Commit after each successful refactor.

### TDD Rules
- **Never write production code without a failing test.**
- **Never skip the refactor step** — technical debt compounds quickly.
- **Keep the red-green-refactor cycle short** — ideally under 5 minutes per cycle.
- **Commit at each green step** — small, frequent commits with passing tests.
- **Test behavior, not implementation** — tests should survive refactoring.

## Common Coding Skills

### Clean Code Principles
- **Meaningful names**: Variables, functions, and classes should reveal intent. Avoid abbreviations.
- **Small functions**: Each function should do one thing and do it well. Aim for under 20 lines.
- **Single Responsibility**: Each module/class/function has one reason to change.
- **DRY (Don't Repeat Yourself)**: Extract common patterns only when duplication is real (rule of three).
- **YAGNI (You Aren't Gonna Need It)**: Don't build features until they're actually needed.
- **KISS (Keep It Simple, Stupid)**: Prefer simple, readable solutions over clever ones.

### Code Organization
- Group related functionality together in modules.
- Keep files focused — one primary class or concern per file.
- Use consistent project structure across the codebase.
- Separate concerns: game logic, UI/rendering, input handling, audio, and data/state.

### Error Handling
- Handle errors at system boundaries (user input, file I/O, network).
- Fail fast and fail clearly with descriptive messages.
- Don't swallow exceptions silently.
- Validate external input; trust internal code.

### Git & Commit Practices
- Commit after each green TDD step.
- Write clear, concise commit messages describing **why**, not just **what**.
- Keep commits small and focused on a single change.
- All commits should leave the codebase in a working state with passing tests.

### Testing Best Practices
- **Arrange-Act-Assert** pattern for test structure.
- One logical assertion per test.
- Tests should be independent — no shared mutable state between tests.
- Tests should be fast — mock external dependencies (network, filesystem, audio).
- Use descriptive test names that serve as documentation.
- Aim for high coverage of business logic; don't test framework/library code.

### Refactoring Techniques
- **Extract Method**: Pull out a block of code into a named function.
- **Rename**: Improve clarity of variable, function, or class names.
- **Inline**: Remove unnecessary indirection when a function is trivial.
- **Extract Class/Module**: Split large classes into focused, cohesive units.
- **Replace Magic Numbers**: Use named constants for meaningful values.
- **Simplify Conditionals**: Use guard clauses, polymorphism, or lookup tables.

## Project Structure

```
Yelling_Mommy/
├── CLAUDE.md              # This file — development guidelines
├── README.md              # Project overview
├── package.json           # Dependencies and scripts
├── jest.config.js         # Test configuration
├── src/                   # Production source code
│   ├── game/              # Core game logic
│   ├── audio/             # Audio input/processing
│   ├── ui/                # User interface components
│   └── utils/             # Shared utilities
└── tests/                 # Test files (mirrors src/ structure)
    ├── game/
    ├── audio/
    ├── ui/
    └── utils/
```

## Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode (recommended during TDD)
npm run test:coverage # Run tests with coverage report
```
