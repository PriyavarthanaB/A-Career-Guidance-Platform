import { useState, useEffect } from 'react';
import API from '../api/axios';

/**
 * useUserStats — Fetches live user statistics from /api/user/stats.
 * Stats are per-user because the API reads from MongoDB using the JWT.
 * Falls back gracefully to zeros on error so pages still render.
 */
export default function useUserStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get('/api/user/stats');
        if (!cancelled && res.data?.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('useUserStats: failed to fetch stats', err);
          setError(err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStats();
    return () => { cancelled = true; };
  }, []);

  return { stats, loading, error };
}
