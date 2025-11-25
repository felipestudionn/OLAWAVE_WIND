import { useState, useEffect, useCallback } from 'react';

export interface CommercialAction {
  id: string;
  collection_plan_id: string;
  name: string;
  action_type: 'SALE' | 'COLLAB' | 'CAMPAIGN' | 'SEEDING' | 'EVENT' | 'OTHER';
  start_date: string;
  end_date?: string;
  category?: string;
  partner_name?: string;
  partner_logo_url?: string;
  description?: string;
  expected_traffic_boost?: number;
  expected_sales_boost?: number;
  channels: string[];
  position: number;
  created_at?: string;
  updated_at?: string;
}

export const useCommercialActions = (collectionPlanId: string) => {
  const [actions, setActions] = useState<CommercialAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActions = useCallback(async () => {
    if (!collectionPlanId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/commercial-actions?planId=${collectionPlanId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch commercial actions');
      }
      
      const data = await response.json();
      setActions(data as CommercialAction[]);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching commercial actions:', err);
    } finally {
      setLoading(false);
    }
  }, [collectionPlanId]);

  const addAction = async (action: Omit<CommercialAction, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/commercial-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add commercial action');
      }

      const data = await response.json();
      setActions(prev => [...prev, data as CommercialAction].sort((a, b) => 
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
      ));
      return data as CommercialAction;
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding commercial action:', err);
      return null;
    }
  };

  const updateAction = async (id: string, updates: Partial<CommercialAction>) => {
    try {
      const response = await fetch(`/api/commercial-actions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update commercial action');
      }

      const data = await response.json();
      setActions(prev => prev.map(action => action.id === id ? data as CommercialAction : action));
      return data as CommercialAction;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating commercial action:', err);
      return null;
    }
  };

  const deleteAction = async (id: string) => {
    try {
      const response = await fetch(`/api/commercial-actions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete commercial action');
      }

      setActions(prev => prev.filter(action => action.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting commercial action:', err);
      return false;
    }
  };

  useEffect(() => {
    if (collectionPlanId) {
      fetchActions();
    }
  }, [collectionPlanId, fetchActions]);

  return {
    actions,
    loading,
    error,
    addAction,
    updateAction,
    deleteAction,
    refetch: fetchActions
  };
};
