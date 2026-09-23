import React, { useEffect, useState } from 'react';
import { Users, Clock, Coins, CreditCard, RefreshCw } from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { adminApi } from '../../services/api';
import type { AdminOverviewStats } from '../../../../shared/types';
import { formatMinutes } from '../../../../shared/utils';

export const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<AdminOverviewStats>({
    totalUsers: 0,
    totalMinutesUsed: 0,
    totalCreditsGranted: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadOverview = async () => {
    setLoading(true);
    const res = await adminApi.fetchOverview();
    if (res.success && res.stats) {
      setStats(res.stats);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOverview();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-description">Real-time overview of system metrics and user activity.</p>
        </div>
        <button onClick={loadOverview} className="btn-secondary flex-center gap-2" disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid-stats">
        <StatCard
          title="Total Registered Users"
          value={stats.totalUsers}
          icon={Users}
          color="#3b82f6"
        />
        <StatCard
          title="Total Minutes Used"
          value={formatMinutes(stats.totalMinutesUsed)}
          icon={Clock}
          color="#8b5cf6"
          subtitle={`${stats.totalMinutesUsed.toLocaleString()} mins total`}
        />
        <StatCard
          title="Total Credits Granted"
          value={stats.totalCreditsGranted.toLocaleString()}
          icon={Coins}
          color="#10b981"
        />
        <StatCard
          title="Pending Payments"
          value={stats.pendingPayments}
          icon={CreditCard}
          color="#f59e0b"
          subtitle={stats.pendingPayments > 0 ? 'Action required' : 'All clear'}
        />
      </div>
    </div>
  );
};
