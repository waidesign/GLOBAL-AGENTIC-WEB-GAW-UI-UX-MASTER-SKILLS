---
name: "testing"
description: "Write and run tests that match this project's existing setup: test behavior not implementation, one reason to fail per test, no flaky timing. Use when adding tests, fixing failing tests, or when a change needs test coverage."
license: "MIT"
metadata:
  gaw-title: "Testing"
  gaw-category: "project"
  gaw-author: "GAW"
  gaw-version: "1.0.0"
---

# Testing

1. **Use what's there.** Find the test command in `ai-brain/context.md` → Commands and look at two existing tests. Same framework, folder, naming and helpers. Don't add a new test framework without asking.
2. **Test behavior, not implementation.** Call the public function, route or component the way a user or caller would, and assert on the result.
3. **Cover** the main case, one edge case (empty, zero, maximum, missing field), and one failure case (bad input, error from a dependency).
4. **One reason to fail.** Each test checks one behavior and its name says which ("returns 404 when the user doesn't exist").
5. **Deterministic.** No real network, clock or randomness: use the project's existing fakes or mocks, fixed dates and seeds. No sleeps; wait for a condition instead.
6. **Bug fixes** start with a test that fails before the fix.
7. **Run** the affected tests, then the full suite. A test that only passes on retry is a failure: fix it or report it.

## Don't
- Edit a test's expectation just to make it pass, unless the old behavior was wrong; say so when you do.
- Delete or skip failing tests without approval.
- Snapshot large outputs as the only check.
