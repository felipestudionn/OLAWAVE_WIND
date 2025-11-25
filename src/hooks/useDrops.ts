import { useState, useEffect, useCallback } from 'react';

export interface Drop {
  id: string;
  collection_plan_id: string;
  drop_number: number;
  name: string;
  launch_date: string;
  end_date?: string;
  weeks_active: number;
  story_name?: string;
  story_description?: string;
  channels: string[];
  position: number;
  created_at?: string;
  updated_at?: string;
}

export const useDrops = (collectionPlanId: string) => {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrops = useCallback(async () => {
    if (!collectionPlanId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/drops?planId=${collectionPlanId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch drops');
      }
      
      const data = await response.json();
      setDrops(data as Drop[]);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching drops:', err);
    } finally {
      setLoading(false);
    }
  }, [collectionPlanId]);

  const addDrop = async (drop: Omit<Drop, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/drops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(drop),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add drop');
      }

      const data = await response.json();
      setDrops(prev => [...prev, data as Drop].sort((a, b) => a.position - b.position));
      return data as Drop;
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding drop:', err);
      return null;
    }
  };

  const updateDrop = async (id: string, updates: Partial<Drop>) => {
    try {
      const response = await fetch(`/api/drops/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update drop');
      }

      const data = await response.json();
      setDrops(prev => prev.map(drop => drop.id === id ? data as Drop : drop));
      return data as Drop;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating drop:', err);
      return null;
    }
  };

  const deleteDrop = async (id: string) => {
    try {
      const response = await fetch(`/api/drops/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete drop');
      }

      setDrops(prev => prev.filter(drop => drop.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting drop:', err);
      return false;
    }
  };

  const reorderDrops = async (reorderedDrops: Drop[]) => {
    // Optimistically update UI
    setDrops(reorderedDrops);
    
    // Update positions in database
    try {
      await Promise.all(
        reorderedDrops.map((drop, index) =>
          fetch(`/api/drops/${drop.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ position: index }),
          })
        )
      );
    } catch (err: any) {
      setError(err.message);
      console.error('Error reordering drops:', err);
      // Refetch to restore correct order
      fetchDrops();
    }
  };

  useEffect(() => {
    if (collectionPlanId) {
      fetchDrops();
    }
  }, [collectionPlanId, fetchDrops]);

  return {
    drops,
    loading,
    error,
    addDrop,
    updateDrop,
    deleteDrop,
    reorderDrops,
    refetch: fetchDrops
  };
};
