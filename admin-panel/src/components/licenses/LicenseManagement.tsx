import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { SearchBar } from '../common/SearchBar';
import { adminApi } from '../../services/api';
import type { LicenseRecord } from '../../../../shared/types';
import { formatDate } from '../../../../shared/utils';

export const LicenseManagement: React.FC = () => {
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [genModalOpen, setGenModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('pro');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadLicenses = async () => {
    setLoading(true);
    const res = await adminApi.fetchLicenses();
    if (res.success && res.licenses) {
      setLicenses(res.licenses);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLicenses();
  }, []);

  const handleGenerate = async () => {
    if (!email) return;
    const res = await adminApi.generateLicense(email, plan, 500);
    if (res.success && res.licenseKey) {
      setActionMsg(`Generated license: ${res.licenseKey} for ${email}`);
      setGenModalOpen(false);
      setEmail('');
      loadLicenses();
      setTimeout(() => setActionMsg(null), 6000);
    }
  };

  const filteredLicenses = licenses.filter((l) =>
    l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.license_key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">License Keys</h1>
          <p className="page-description">Generate and track issued software license keys.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setGenModalOpen(true)} className="btn-primary flex-center gap-2">
            <Plus size={16} />
            <span>Generate Key</span>
          </button>
          <button onClick={loadLicenses} className="btn-secondary flex-center gap-2" disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {actionMsg && <div className="toast-success">{actionMsg}</div>}

      <div className="table-controls">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by email or license key..." />
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>User Email</th>
              <th>License Key</th>
              <th>Plan</th>
              <th>Issued Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredLicenses.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-muted">
                  No license keys found.
                </td>
              </tr>
            ) : (
              filteredLicenses.map((l) => (
                <tr key={l.id}>
                  <td className="font-medium">{l.email}</td>
                  <td><code>{l.license_key}</code></td>
                  <td>
                    <span className={`badge badge-plan-${l.plan.toLowerCase()}`}>
                      {l.plan}
                    </span>
                  </td>
                  <td>{formatDate(l.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {genModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Generate License Key</h3>
            <div className="form-group mt-4">
              <label>User Email</label>
              <input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Plan Type</label>
              <select value={plan} onChange={(e) => setPlan(e.target.value)}>
                <option value="pro">Pro Plan</option>
                <option value="enterprise">Enterprise Plan</option>
              </select>
            </div>
            <div className="modal-actions mt-6">
              <button className="btn-secondary" onClick={() => setGenModalOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleGenerate}>Generate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
