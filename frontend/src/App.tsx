// Import necessary React hooks and components
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './App.css';

// Define TypeScript interfaces for data structures
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

// Constants for API configuration
const BACKEND_BASE = 'http://localhost:5000'; // Base URL for backend API
const PAGE_LIMIT = 10; // Number of users per page

const App: React.FC = () => {
  // ─── STATE MANAGEMENT ─────────────────────────────────────────────────

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(0);

  // User data state
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  // Bulk action state
  const [bulkAction, setBulkAction] = useState<'activate' | 'inactivate'>('inactivate');

  // Selection state (simplified model)
  const [selectionMode, setSelectionMode] = useState<'none' | 'partial' | 'all'>('none');
  const [excludedIds, setExcludedIds] = useState<Set<number>>(new Set());
  const [includedIds, setIncludedIds] = useState<Set<number>>(new Set());

  // Ref for header checkbox (to set indeterminate state)
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  // ─── DATA FETCHING ────────────────────────────────────────────────────

  // Fetch users when current page changes
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const skip = currentPage * PAGE_LIMIT;
        const res = await axios.get<PaginatedResponse>(`${BACKEND_BASE}/users`, {
          params: { skip, limit: PAGE_LIMIT },
        });
        setUsers(res.data.items);
        setTotalUsers(res.data.total);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchPage();
  }, [currentPage]);

  // ─── SELECTION LOGIC ──────────────────────────────────────────────────

  // Toggle selection for a single row
  const toggleRow = (id: number) => {
    if (selectionMode === 'all') {
      // Toggle exclusion in "select all" mode
      const newExcluded = new Set(excludedIds);
      if (newExcluded.has(id)) {
        newExcluded.delete(id);
      } else {
        newExcluded.add(id);
      }
      setExcludedIds(newExcluded);
    } else {
      // Toggle inclusion in "partial select" mode
      const newIncluded = new Set(includedIds);
      if (newIncluded.has(id)) {
        newIncluded.delete(id);
      } else {
        newIncluded.add(id);
      }
      setIncludedIds(newIncluded);

      // Update selection mode based on selections
      setSelectionMode(newIncluded.size > 0 ? 'partial' : 'none');
    }
  };

  // Toggle "select all" mode
  const toggleSelectAll = () => {
    if (selectionMode === 'all') {
      // Clear all selections
      setSelectionMode('none');
      setExcludedIds(new Set());
      setIncludedIds(new Set());
    } else {
      // Select all users across all pages
      setSelectionMode('all');
      setIncludedIds(new Set());
    }
  };

  // Calculate which IDs are currently selected
  const getSelectedIds = (): number[] => {
    if (selectionMode === 'all') {
      // Return all IDs except explicitly excluded
      return users
        .filter(user => !excludedIds.has(user.id))
        .map(user => user.id);
    } else if (selectionMode === 'partial') {
      // Return explicitly included IDs
      return Array.from(includedIds);
    }
    return []; // No selection
  };

  // Determine if a row should be checked
  const isRowChecked = (id: number): boolean => {
    if (selectionMode === 'all') return !excludedIds.has(id);
    if (selectionMode === 'partial') return includedIds.has(id);
    return false;
  };

  // Update header checkbox state (checked/indeterminate)
  useEffect(() => {
    if (!headerCheckboxRef.current) return;

    const currentPageIds = users.map(user => user.id);

    if (selectionMode === 'all') {
      // In "all" mode: checked if no exclusions on current page
      const allChecked = currentPageIds.every(id => !excludedIds.has(id));
      const someUnchecked = currentPageIds.some(id => excludedIds.has(id));

      headerCheckboxRef.current.checked = allChecked;
      headerCheckboxRef.current.indeterminate = !allChecked && someUnchecked;
    } else if (selectionMode === 'partial') {
      // In "partial" mode: checked if all current page IDs selected
      const allChecked = currentPageIds.every(id => includedIds.has(id));
      const someChecked = currentPageIds.some(id => includedIds.has(id));

      headerCheckboxRef.current.checked = allChecked;
      headerCheckboxRef.current.indeterminate = someChecked && !allChecked;
    } else {
      // No selections
      headerCheckboxRef.current.checked = false;
      headerCheckboxRef.current.indeterminate = false;
    }
  }, [users, selectionMode, includedIds, excludedIds]);

  // ─── ACTION HANDLERS ──────────────────────────────────────────────────

  // Handle page navigation
  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  // Handle bulk update action
  const handleBulkUpdate = async () => {
    const selectedIds = getSelectedIds();
    if (selectedIds.length === 0) return;

    try {
      const activeValue = bulkAction === 'activate';

      await axios.put(`${BACKEND_BASE}/users/bulk-update`, {
        user_ids: selectedIds,
        payload: { active: activeValue }
      });

      // Refresh data and reset selections
      const skip = currentPage * PAGE_LIMIT;
      const res = await axios.get<PaginatedResponse>(`${BACKEND_BASE}/users`, {
        params: { skip, limit: PAGE_LIMIT },
      });
      setUsers(res.data.items);

      setSelectionMode('none');
      setExcludedIds(new Set());
      setIncludedIds(new Set());

      alert(`Updated ${selectedIds.length} users successfully!`);
    } catch (err) {
      console.error('Bulk update error:', err);
      alert('Bulk update failed');
    }
  };

  // Handle individual user status toggle
  const toggleUserStatus = async (id: number, currentStatus: boolean) => {
    try {
      await axios.put(`${BACKEND_BASE}/users/bulk-update`, {
        user_ids: [id],
        payload: { active: !currentStatus }
      });

      // Refresh current page
      const skip = currentPage * PAGE_LIMIT;
      const res = await axios.get<PaginatedResponse>(`${BACKEND_BASE}/users`, {
        params: { skip, limit: PAGE_LIMIT },
      });
      setUsers(res.data.items);
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  // ─── RENDER LOGIC ─────────────────────────────────────────────────────

  // Calculate selected count for display
  const selectedCount = getSelectedIds().length;

  return (
    <div className="container" style={{ padding: '1rem' }}>
      <h2>User Management</h2>

      {/* Selection Header */}
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

      {/* Users Table */}
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <input
                  type="checkbox"
                  checked={isRowChecked(user.id)}
                  onChange={() => toggleRow(user.id)}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button
                  onClick={() => toggleUserStatus(user.id, user.active)}
                  style={{
                    backgroundColor: user.active ? '#dc3545' : '#28a745',
                    color: 'white',
                  }}
                >
                  {user.active ? 'Deactivate' : 'Activate'}
                </button>
                <span style={{ marginLeft: '0.5rem' }}>
                  {user.active ? '✅' : '❌'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <ReactPaginate
        pageCount={Math.ceil(totalUsers / PAGE_LIMIT)}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        onPageChange={handlePageClick}
        containerClassName="pagination"
        activeClassName="active"
        forcePage={currentPage}
      />

      {/* Bulk Actions */}
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <select
          value={bulkAction}
          onChange={e => setBulkAction(e.target.value as 'activate' | 'inactivate')}
        >
          <option value="activate">Activate</option>
          <option value="inactivate">Inactivate</option>
        </select>
        <button
          onClick={handleBulkUpdate}
          disabled={selectedCount === 0}
          style={{
            backgroundColor: selectedCount > 0 ? '#007bff' : '#ccc',
            color: 'white',
          }}
        >
          {bulkAction === 'activate' ? 'Activate' : 'Deactivate'}
          {selectedCount} User{selectedCount !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
};

export default App;