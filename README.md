#### Project Purpose: Demonstrates how to select users across paginated results and perform a bulk update in one operation.
* **Tech Stack**:

  * **Backend**: Python Flask + SQLAlchemy + SQLite + `flask-cors`
  * **Frontend**: React with TypeScript + Axios + React-Paginate

### Key Features Explained:

**Frontend (App.tsx)**:
1. **Simplified State Management**:
   - `selectionMode`: Tracks current selection state (`none`, `partial`, `all`)
   - `excludedIds`: Stores IDs excluded in "select all" mode
   - `includedIds`: Stores IDs included in "partial" mode

2. **Efficient Selection Logic**:
   - `getSelectedIds()` dynamically computes selected IDs
   - `isRowChecked()` determines checkbox state without storing all IDs
   - Header checkbox shows indeterminate state when partially selected

3. **Optimized API Calls**:
   - Bulk updates send only IDs to update
   - Individual updates reuse same API endpoint
   - Automatic data refresh after mutations

**Backend (app.py)**:
1. **Simplified Bulk Update**:
   - Single endpoint handles all update types
   - Uses SQLAlchemy's efficient `update()` method
   - `synchronize_session=False` enables direct SQL execution

2. **Atomic Operations**:
   - Database commits only after successful updates
   - Automatic rollback on errors
   - Proper error handling and status codes

3. **Pagination Support**:
   - `skip` and `limit` parameters for efficient data fetching
   - Returns total count for pagination controls

### How It Works:
1. **Selection Workflow**:
   - Click "Select All" to select every user
   - Uncheck specific users to exclude them
   - Or manually select users across pages
   - Selection state persists during pagination

2. **Bulk Actions**:
   - Choose activate/deactivate
   - Click action button
   - System updates all selected users
   - UI automatically refreshes

3. **Individual Actions**:
   - Click status button to toggle single user
   - Immediate visual feedback






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