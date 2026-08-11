# 🦀 Rust Tutorial — Interactive Quiz

**Live site: <https://derek-hsieh-tw.github.io/rust-quiz/>**

Learn Rust from the ground up through multiple-choice questions, presented in a VS Code-style interface. Every question comes with a detailed explanation (why the answer is right *and* why the others are wrong) plus a **C# comparison** for developers coming from the .NET world.

## Course structure

| Category | Lessons | Scope |
|---|---|---|
| **Basic** | lesson1-1 ~ 1-15 | Toolchain, variables, control flow, **ownership & borrowing**, structs, enums & `match`, collections, error handling, generics, traits, lifetimes, modules, testing |
| **Advanced** | lesson2-1 ~ 2-12 | Closures, iterators, smart pointers, advanced lifetimes, trait objects, concurrency, async/await, macros, Cargo ecosystem |
| **Supplement (the deep 30%)** | lesson2-13 ~ 2-20 | Unsafe Rust, UTF-8 internals, memory layout, Drop/RAII, `Future` internals, proc macros, FFI, compiler deep dive |

The curriculum goes **top-down**: build the big picture first (how a program runs, the ownership mental model), then drill into details. Finishing Basic + Advanced covers roughly 70% of everyday Rust; the Supplement lessons answer "why is Rust designed this way" and are optional.

## Features

- **VS Code-style UI** — explorer sidebar, tabs, status bar, dark theme
- **Code-centric questions** — options are code snippets; "does not compile" is a first-class answer choice, training you to think like the borrow checker
- **Instant feedback** — per-question explanations and C# comparisons revealed after answering
- **Shuffled options** — deterministic per-question shuffle, so the correct answer's position varies but your saved progress stays valid
- **Progress tracking** — answers and lesson completion stored in `localStorage`; clear a lesson's answers anytime to retake it
- **Responsive** — works on desktop, tablet, and phone (drawer sidebar)

## Run locally

No build step, no dependencies — just open `docs/index.html` in a browser.

Optionally serve it over HTTP:

```powershell
py -m http.server 8080 --directory docs
```

## Project layout

```
docs/                  # the whole site (deployed to GitHub Pages)
├── index.html
├── css/               # VS Code theme + app styles
├── js/                # app, sidebar, quiz, progress logic
├── vendor/            # highlight.js (local, offline-friendly)
└── data/
    ├── index.js       # course index (categories → lessons)
    ├── basic/         # lesson1-*.js question data
    ├── advanced/      # lesson2-1 ~ 2-12
    └── supplement/    # lesson2-13 ~ 2-20
scripts/
└── validate-data.js   # question-data validation (run: node scripts/validate-data.js)
.github/workflows/
└── deploy.yml         # CI/CD: validate → deploy to GitHub Pages
```

## CI/CD

Every push to `master` runs the pipeline: **syntax check + question-data validation → deploy to GitHub Pages**. Broken lesson data (wrong option count, missing explanation, …) fails the build and never reaches the live site.

## Adding a lesson

1. Create `docs/data/<category>/<lesson-id>.js` registering `window.RUST_LESSONS["<lesson-id>"]` (correct answer always goes **first**; options are shuffled at render time).
2. Flip the lesson to `available: true` in `docs/data/index.js`.
3. `node scripts/validate-data.js`, then push.
