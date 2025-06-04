// src/App.tsx

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './App.css'; // Optional: for basic styling


// ─────────────────────────────────────────────────────────────────────────────
// 1) Define TypeScript interfaces for our data
// ─────────────────────────────────────────────────────────────────────────────
interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

interface PaginatedResponse {
  items: User[];
  total: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2) Constants
// ─────────────────────────────────────────────────────────────────────────────
const BACKEND_BASE = 'http://localhost:5000'; 
const PAGE_LIMIT = 10; // number of users per page

// ─────────────────────────────────────────────────────────────────────────────
// 3) App Component
// ─────────────────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  // ────────────────────────────────────────────────────────────────────────────
  // 3.1) Component State
  // ────────────────────────────────────────────────────────────────────────────
  // current page index (0-based for react-paginate)
  const [currentPage, setCurrentPage] = useState<number>(0);

  // current page's users
  const [users, setUsers] = useState<User[]>([]);

  // total number of users in the entire database (for pagination)
  const [totalUsers, setTotalUsers] = useState<number>(0);

  // If user has not clicked “Select All across every page,” we store exact IDs here:
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // When this flag is true, we interpret “every user in the DB is selected”
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);

  // Only used when isAllSelected === true:
  // Holds the IDs the user explicitly “deselected” after clicking “Select All.”
  const [unselectedIds, setUnselectedIds] = useState<Set<number>>(new Set());

  // A ref to track whether the header checkbox should be rendered as indeterminate
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  // ────────────────────────────────────────────────────────────────────────────
  // 3.2) Fetch one page of data whenever currentPage changes
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const skip = currentPage * PAGE_LIMIT;
        // Assuming your Flask backend responds with JSON: { items: User[], total: number }
        const res = await axios.get<PaginatedResponse>(`${BACKEND_BASE}/users`, {
          params: { skip, limit: PAGE_LIMIT },
        });
        console.log('Fetched users:', res.data.items);
        setUsers(res.data.items);
        setTotalUsers(res.data.total);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchPage();
  }, [currentPage]);

  // ────────────────────────────────────────────────────────────────────────────
  // 3.3) Helper: Determine if a given row’s checkbox is checked
  // ────────────────────────────────────────────────────────────────────────────
  const isRowChecked = (id: number): boolean => {
    if (isAllSelected) {
      // “All” mode: a row is checked unless it’s explicitly in unselectedIds
      return !unselectedIds.has(id);
    } else {
      // “Normal” mode: only checked if in selectedIds
      return selectedIds.has(id);
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // 3.4) When user toggles a single row checkbox
  // ────────────────────────────────────────────────────────────────────────────
  const toggleRow = (id: number) => {
    if (isAllSelected) {
      // In “all selected” mode, toggling removes/adds from unselectedIds
      const newUnselected = new Set(unselectedIds);
      if (newUnselected.has(id)) {
        newUnselected.delete(id);
      } else {
        newUnselected.add(id);
      }
      setUnselectedIds(newUnselected);
    } else {
      // Normal mode: toggle in selectedIds
      const newSelected = new Set(selectedIds);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      setSelectedIds(newSelected);

      // If the user individually toggles when isAllSelected=true, we want to turn off “all.”
      // But here we’re not in isAllSelected, so no change needed to that flag.
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // 3.5) When user clicks the header “Select All” checkbox
  // ────────────────────────────────────────────────────────────────────────────
  const toggleSelectAll = () => {
    if (isAllSelected) {
      // Unset “Select All” mode entirely
      setIsAllSelected(false);
      setUnselectedIds(new Set());
      setSelectedIds(new Set());
    } else {
      // Enter “Select All” mode: clear any individual selections
      setIsAllSelected(true);
      setUnselectedIds(new Set());
      setSelectedIds(new Set());
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // 3.6) Compute header checkbox state (checked / indeterminate)
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!headerCheckboxRef.current) return;

    const currentPageIds = users.map((u) => u.id);

    if (isAllSelected) {
      // If “all” mode is ON:
      //  checked if none of the current page IDs are in unselectedIds
      const allOnThisPageSelected = currentPageIds.every((id) => !unselectedIds.has(id));
      const someUnselected = currentPageIds.some((id) => unselectedIds.has(id));
      const someStillSelected = currentPageIds.some((id) => !unselectedIds.has(id));

      headerCheckboxRef.current.checked = allOnThisPageSelected;
      headerCheckboxRef.current.indeterminate = someUnselected && someStillSelected;
    } else {
      // Normal mode:
      const allOnThisPageSelected = currentPageIds.every((id) => selectedIds.has(id));
      const someSelected = currentPageIds.some((id) => selectedIds.has(id));
      const someUnselected = currentPageIds.some((id) => !selectedIds.has(id));

      headerCheckboxRef.current.checked = allOnThisPageSelected;
      headerCheckboxRef.current.indeterminate = someSelected && someUnselected;
    }
  }, [users, isAllSelected, selectedIds, unselectedIds]);

  // ────────────────────────────────────────────────────────────────────────────
  // 3.7) When user clicks the pagination controls
  // ────────────────────────────────────────────────────────────────────────────
  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
    // Note: We do NOT clear any of our selection state when changing pages.
    //       That way, selectedIds / unselectedIds persist across page changes.
  };

  // ────────────────────────────────────────────────────────────────────────────
  // 3.8) Bulk Update Action State and Handler
  // ────────────────────────────────────────────────────────────────────────────
  const [bulkAction, setBulkAction] = useState<'activate' | 'inactivate'>('inactivate');

  const handleBulkUpdate = async () => {
    try {
      const activeValue = bulkAction === 'activate';
      if (isAllSelected) {
        const payload = {
          all: true,
          excludeIds: Array.from(unselectedIds),
          payload: { active: activeValue },
        };
        await axios.put(`${BACKEND_BASE}/users/bulk-update`, payload);
      } else {
        const payload = {
          all: false,
          ids: Array.from(selectedIds),
          payload: { active: activeValue },
        };
        await axios.put(`${BACKEND_BASE}/users/bulk-update`, payload);
      }

      alert('Bulk update successful');
      setIsAllSelected(false);
      setSelectedIds(new Set());
      setUnselectedIds(new Set());
      const skip = currentPage * PAGE_LIMIT;
      const res = await axios.get<PaginatedResponse>(`${BACKEND_BASE}/users`, {
        params: { skip, limit: PAGE_LIMIT },
      });
      setUsers(res.data.items);
      setTotalUsers(res.data.total);
    } catch (err) {
      console.error('Bulk update error:', err);
      alert('Bulk update failed');
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // 3.9) Check if a user is “selected” for the final count display
  // ────────────────────────────────────────────────────────────────────────────
  const totalSelectedCount = () => {
    if (isAllSelected) {
      // Total = totalUsers in DB minus how many are explicitly unselected
      return totalUsers - unselectedIds.size;
    } else {
      return selectedIds.size;
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // 4) Render JSX
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="container" style={{ padding: '1rem' }}>
      <h2>User List & Bulk Update Demo</h2>

      {/* ───────────────────────────────────────────────────────────────────────── 
            4.1) “Select All” checkbox (select across every page)
      ───────────────────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '0.5rem' }}>
        <label>
          <input
            type="checkbox"
            ref={headerCheckboxRef}
            onChange={toggleSelectAll}
          />
          {' '}Select All Users (across all pages)
        </label>
      </div>

      {/* ───────────────────────────────────────────────────────────────────────── 
            4.2) Table of current page’s users
      ───────────────────────────────────────────────────────────────────────── */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '1rem',
        }}
      >
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Select</th>
            <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Email</th>
            <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ border: '1px solid #ddd', padding: '0.5rem', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={isRowChecked(user.id)}
                  onChange={() => toggleRow(user.id)}
                />
              </td>
              <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{user.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{user.email}</td>
              <td style={{ border: '1px solid #ddd', padding: '0.5rem', textAlign: 'center' }}>
                <button
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: user.active ? '#dc3545' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                  onClick={async () => {
                    try {
                      await axios.put(`${BACKEND_BASE}/users/bulk-update`, {
                        all: false,
                        ids: [user.id],
                        payload: { active: !user.active },
                      });
                      // Refresh users after update
                      const skip = currentPage * PAGE_LIMIT;
                      const res = await axios.get<PaginatedResponse>(`${BACKEND_BASE}/users`, {
                        params: { skip, limit: PAGE_LIMIT },
                      });
                      setUsers(res.data.items);
                      setTotalUsers(res.data.total);
                    } catch (err) {
                      alert('Failed to update user status');
                    }
                  }}
                  title={user.active ? 'Inactivate' : 'Activate'}
                >
                  {user.active ? 'Inactivate' : 'Activate'}
                </button>
                <span style={{ marginLeft: '0.5rem' }}>{user.active ? '✅' : '❌'}</span>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ───────────────────────────────────────────────────────────────────────── 
            4.3) Pagination Controls
      ───────────────────────────────────────────────────────────────────────── */}
      <ReactPaginate
        pageCount={Math.ceil(totalUsers / PAGE_LIMIT)}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        onPageChange={handlePageClick}
        containerClassName="pagination"
        activeClassName="active"
        forcePage={currentPage}
      />

      {/* ───────────────────────────────────────────────────────────────────────── 
            4.4) Bulk Update Button & Count Display
      ───────────────────────────────────────────────────────────────────────── */}
      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <select
          value={bulkAction}
          onChange={e => setBulkAction(e.target.value as 'activate' | 'inactivate')}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="activate">Activate</option>
          <option value="inactivate">Inactivate</option>
        </select>
        <button
          onClick={handleBulkUpdate}
          disabled={totalSelectedCount() === 0}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: totalSelectedCount() > 0 ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: totalSelectedCount() > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          {bulkAction === 'activate' ? 'Activate' : 'Inactivate'} {totalSelectedCount()} User{totalSelectedCount() === 1 ? '' : 's'}
        </button>
      </div>
    </div>
  );
};

export default App;
