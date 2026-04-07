# Yelling Mommy - Development Guidelines

## Coding Skills (TDD is ALWAYS part of every coding task)

Every code change — new features, bug fixes, refactors, or enhancements — MUST follow the Red-Green-Refactor TDD cycle. TDD is not a separate step; it IS how we code.

### How to Write Code (Red-Green-Refactor)

**Step 1: RED — Write a failing test first.**
- Before touching any production code, write a test for the desired behavior.
- Run `npm test` and confirm it **fails**. If it passes, the test isn't testing anything new.
- Keep tests small, focused, and testing exactly one behavior.
- Use descriptive names that read like specs: `test_player_score_increases_when_yelling_louder`.

**Step 2: GREEN — Write the minimum code to pass.**
- Write the **simplest** code that makes the failing test pass. Nothing more.
- Run `npm test` and confirm **all** tests pass.
- If any test fails, fix the production code — not the test (unless the test is wrong).

**Step 3: REFACTOR — Clean up while green.**
- Improve structure without changing behavior: remove duplication, clarify names, simplify logic.
- Run `npm test` after every change to ensure nothing breaks.
- Apply clean code principles (see below) during this step.

**Step 4: COMMIT — Lock in the progress.**
- Commit at each green step with a clear message describing **why**.
- Every commit must leave the codebase working with all tests passing.

**Repeat.** Keep cycles short — ideally under 5 minutes each.

### Mandatory Rules
- **Never write production code without a failing test.**
- **Never skip the refactor step.**
- **Test behavior, not implementation** — tests must survive refactoring.
- **No code ships without tests.** Period.

### Clean Code Principles (Applied During Refactor Step)
- **Meaningful names**: Variables, functions, and classes reveal intent. No abbreviations.
- **Small functions**: One thing, done well. Under 20 lines.
- **Single Responsibility**: Each module/class/function has one reason to change.
- **DRY**: Extract common patterns only when duplication is real (rule of three).
- **YAGNI**: Don't build it until it's needed.
- **KISS**: Simple and readable beats clever.

### Code Organization
- Group related functionality in modules.
- One primary class or concern per file.
- Separate concerns: game logic, UI/rendering, input handling, audio, state.
- Consistent project structure across the codebase.

### Error Handling
- Handle errors at system boundaries (user input, file I/O, network).
- Fail fast with descriptive messages.
- Don't swallow exceptions. Validate external input; trust internal code.

### Testing Best Practices
- **Arrange-Act-Assert** pattern for structure.
- One logical assertion per test.
- Tests are independent — no shared mutable state.
- Tests are fast — mock external dependencies (network, filesystem, audio).
- Descriptive test names serve as documentation.
- High coverage of business logic; don't test framework/library code.

### Refactoring Techniques
- **Extract Method**: Pull code into a named function.
- **Rename**: Improve clarity of names.
- **Inline**: Remove trivial indirection.
- **Extract Class/Module**: Split large classes into focused units.
- **Replace Magic Numbers**: Use named constants.
- **Simplify Conditionals**: Guard clauses, polymorphism, or lookup tables.

### Git & Commit Practices
- Commit after each green TDD step.
- Clear, concise commit messages describing **why**.
- Small, focused commits — one change each.
- Every commit leaves the codebase working with passing tests.

## Project Structure

```
Yelling_Mommy/
├── CLAUDE.md              # Development guidelines
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
