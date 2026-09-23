import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { SearchBar } from '../common/SearchBar';
import { adminApi } from '../../services/api';
import type { PaymentRecord } from '../../../../shared/types';
import { formatDate } from '../../../../shared/utils';

export const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadPayments = async () => {
    setLoading(true);
    const res = await adminApi.fetchPayments();
    if (res.success && res.payments) {
      setPayments(res.payments);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleApprove = async (id: string) => {
    const res = await adminApi.approvePayment(id, 500, true);
    if (res.success) {
      setActionMsg('Payment approved successfully.');
      loadPayments();
      setTimeout(() => setActionMsg(null), 4000);
    }
  };

  const handleReject = async (id: string) => {
    const res = await adminApi.rejectPayment(id, 'Invalid UTR');
    if (res.success) {
      setActionMsg('Payment rejected.');
      loadPayments();
      setTimeout(() => setActionMsg(null), 4000);
    }
  };

  const filteredPayments = payments.filter((p) =>
    p.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.utr_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payment Verification</h1>
          <p className="page-description">Review manual UTR/UPI payment submissions and issue license keys.</p>
        </div>
        <button onClick={loadPayments} className="btn-secondary flex-center gap-2" disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {actionMsg && <div className="toast-success">{actionMsg}</div>}

      <div className="table-controls">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search payments by email or UTR..." />
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>User Email</th>
              <th>UTR Number</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Submitted Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-muted">
                  No payment records found.
                </td>
              </tr>
            ) : (
              filteredPayments.map((p) => (
                <tr key={p.id}>
                  <td className="font-medium">{p.user_email}</td>
                  <td><code>{p.utr_number}</code></td>
                  <td>₹{p.amount}</td>
                  <td>
                    <span className={`badge badge-status-${p.status}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>{formatDate(p.created_at)}</td>
                  <td>
                    {p.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          className="btn-xs btn-success flex-center gap-1"
                          onClick={() => handleApprove(p.id)}
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button
                          className="btn-xs btn-danger flex-center gap-1"
                          onClick={() => handleReject(p.id)}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
