# Summary

This is a Next.js project that allows users to upload CSV files, perform computations on the data, and display the results in a table format. It also maintains a history of the computations and allows users to show or hide previous tables.

## Directory Structure

- pages
  - _app.js
  - index.js
  - api
    - hello.js
  - _document.js
- src
  - components
    - CSVTable.js
    - CSVTable.module.css
    - CSVUploader.js
  - styles
    - globals.css
    - Home.module.css

## Notes

- The project uses CSS Modules for styling, which requires that all selectors be locally scoped. This means that each selector must contain at least one local class or id.

- The `CSVTable` component is responsible for displaying the table, handling the history of computations, and managing the visibility of previous tables.

- The `CSVUploader` component is responsible for handling the file upload and parsing process.

ChatGPT Wrote Following: The problem I encountered during our conversation was that I repeatedly provided incorrect or non-compliant CSS Module code. Specifically, I failed to consistently apply the correct syntax for CSS Modules, which involves using local-scoped class names for all the styles.

For future sessions, it's crucial to ensure that all the styles in a CSS Module file have locally-scoped class names, and the CSS selectors are not directly targeting HTML elements, but rather using class names that are specific to the components they style.