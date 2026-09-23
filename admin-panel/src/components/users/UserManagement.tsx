import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { SearchBar } from '../common/SearchBar';
import { adminApi } from '../../services/api';
import type { UserRecord } from '../../../../shared/types';
import { formatDate } from '../../../../shared/utils';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [creditsToAdd, setCreditsToAdd] = useState(100);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    const res = await adminApi.fetchUsers();
    if (res.success && res.users) {
      setUsers(res.users);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddCredits = async () => {
    if (!selectedUser) return;
    const res = await adminApi.addCredits(selectedUser.email, creditsToAdd);
    if (res.success) {
      setActionMsg(`Successfully added ${creditsToAdd} credits to ${selectedUser.email}`);
      setCreditModalOpen(false);
      loadUsers();
      setTimeout(() => setActionMsg(null), 4000);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.plan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">User & Credit Management</h1>
          <p className="page-description">Manage registered users, inspect usage, and grant credits.</p>
        </div>
        <button onClick={loadUsers} className="btn-secondary flex-center gap-2" disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {actionMsg && <div className="toast-success">{actionMsg}</div>}

      <div className="table-controls">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search users by email or plan..." />
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>User Email</th>
              <th>Plan</th>
              <th>Credits</th>
              <th>Minutes Used</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-muted">
                  No users found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="font-medium">{user.email}</td>
                  <td>
                    <span className={`badge badge-plan-${user.plan.toLowerCase()}`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="font-semibold">{user.credits}</td>
                  <td>{user.minutes_used} m</td>
                  <td>
                    <span className={`badge badge-status-${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>
                    <button
                      className="btn-xs btn-primary flex-center gap-1"
                      onClick={() => {
                        setSelectedUser(user);
                        setCreditModalOpen(true);
                      }}
                    >
                      <Plus size={14} /> Add Credits
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {creditModalOpen && selectedUser && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Add Credits</h3>
            <p className="text-sm text-muted">Granting credits to: <strong>{selectedUser.email}</strong></p>
            <div className="form-group mt-4">
              <label>Credits Amount</label>
              <input
                type="number"
                value={creditsToAdd}
                onChange={(e) => setCreditsToAdd(Number(e.target.value))}
                min={1}
              />
            </div>
            <div className="modal-actions mt-6">
              <button className="btn-secondary" onClick={() => setCreditModalOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddCredits}>Grant Credits</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
