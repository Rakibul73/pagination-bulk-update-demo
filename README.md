#### Project Purpose: Demonstrates how to select users across paginated results and perform a bulk update in one operation.
* **Tech Stack**:

  * **Backend**: Python Flask + SQLAlchemy + SQLite + `flask-cors`
  * **Frontend**: React with TypeScript + Axios + React-Paginate
* **Backend Features**:

  * `PUT /users/bulk-update` endpoint accepts either:

    * `{ all: false, ids: [ … ], payload: { … } }` to update specific IDs
    * `{ all: true, excludeIds: [ … ], payload: { … } }` to update every user except those excluded
* **Frontend Features**:

  * Maintains three pieces of selection state:

    1. `selectedIds` (set of individual IDs checked when not in “select all” mode)
    2. `isAllSelected` (boolean flag indicating “select every user in the DB”)
    3. `unselectedIds` (set of IDs manually unchecked when in “select all” mode)
  * Header checkbox (“Select All Users”) that toggles between:

    * Normal mode (only individual IDs in `selectedIds` are selected)
    * All-mode (every user is implicitly selected unless explicitly unselected)
  * Correctly computes each row’s checkbox state on every page by checking:

    * If `isAllSelected === true`, row is checked unless its ID is in `unselectedIds`
    * Otherwise, row is checked only if its ID is in `selectedIds`
  * Uses React-Paginate to navigate between pages without losing selection state
  * “Update X Users” button becomes enabled as soon as at least one user is selected (including “all except n” when in all-mode)
  * On bulk update, sends the appropriate payload to `/users/bulk-update`:

    * If not in all-mode → `{ all: false, ids: [ …selectedIds ], payload: { active: false } }`
    * If in all-mode → `{ all: true, excludeIds: [ …unselectedIds ], payload: { active: false } }`
* **Key UX Demonstrations**:

  * Select some users on page 1, navigate to page 2, select more, and then update all chosen IDs together
  * Click “Select All Users” to mark every row on every page as selected, then uncheck one to exclude only that user
  * Pagination never resets the selection state—checkboxes remain correct across pages
  * After bulk update, the table refreshes and all checkboxes clear, showing updated “active” statuses






## Installation

> for running backend

* install python.
* go to backend folder

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```




> for running frontend

* install node
* go to frontend folder

```bash
npm install
npm start
```