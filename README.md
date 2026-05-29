# Open Toolbox Course Link

A simple web application to open JetBrains Academy courses directly in JetBrains IDEs via Toolbox.

Built with plain JavaScript and CSS, styled to match JetBrains rescui design system.

## Features

- Input marketplace ID (defaults to 16630)
- Select programming language from a dropdown (defaults to Python)
- Automatically resolves supported IDEs based on the language
- Generates and opens `jetbrains://educational` protocol link
- Opens course directly in JetBrains Toolbox
- Shows help message with Toolbox download link if needed

## Supported Languages

- Python
- Kotlin
- JavaScript
- Java
- Go
- Scala
- Objective-C
- Rust
- C++
- Other (defaults to IntelliJ IDEA)

## How to Use

1. Open `index.html` in your browser
2. Enter the marketplace ID (numeric value, default: 16630)
3. Select the programming language (default: Python)
4. Click "Open in IDE"
5. The course will open in JetBrains Toolbox
6. A popup will ask if the course opened successfully
7. If you click "No", you'll see a link to download JetBrains Toolbox

## Files

- `index.html` - Main HTML structure
- `script.js` - JavaScript logic for link generation
- `style.css` - Styling (rescui design system)
- `favicon.ico` - JetBrains Academy favicon

## Local Development

Simply open `index.html` in any modern web browser. No build process or dependencies required.
