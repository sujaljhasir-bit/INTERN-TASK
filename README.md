# Scholarship CRM Demo
A small frontend demo of a Scholarship Management CRM for K12 Hunar. It is built with plain HTML, CSS and JavaScript. There is no backend, no login and no build step.

## Run the project

Option 1: open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari).

Option 2: serve the folder locally:

python3 -m http.server 8000

Then open http://localhost:8000.

## Features

- Four summary cards: Total Scholarships, Published, Draft, Expired. They follow the selected state.
- State filter (Bihar, Haryana, Jharkhand) through tabs or the state list beside the cards, plus a status filter.
- Table of scholarships. On mobile the table becomes a card list.
- Change a scholarship's status directly from the Status dropdown in each row.
- Add Scholarship and Edit Scholarship form with all nine requested fields.
- Basic validation: name, state, provider, class are required; the application link must be a valid http(s) URL.
- Preview button on each row and inside the form. It shows how the scholarship could look to students.

## Project structure

index.html        page markup, form and dialogs
css/styles.css    layout, theme and mobile styles
images/           photos used in the header banner and the student preview
js/data.js        the nine sample records
js/utils.js       helpers: formatting, validation, counts
js/app.js         state, rendering and event handling
```

## How it works

- State: one `state` object in `js/app.js` holds the scholarship list, the active filters and the id being edited.
- State filter: changing the dropdown updates `state.stateFilter`, then `render()` rebuilds the summary cards and table rows from the filtered list.
- Status change: the dropdown in a row updates that record's `status` and calls `render()`, so the cards and table stay in sync.
- Form: one dialog serves both Add and Edit. `openForm(item)` fills it for editing, or leaves it empty for adding. `validateScholarship()` returns errors, and the record is saved only when there are none.
- Preview: `previewMarkup()` builds the student-facing card from a record. From the form, it previews the values currently typed, without saving.

## Notes

- Data lives in memory. Refreshing the page resets it to the nine sample records.
- The sample records do not include provider, eligibility, benefit or link, so those show "Not specified" until edited.
- A missing deadline is shown as "Not stated".

## AI tools and references

See `AI_NOTE.md`.
