import { useState, useCallback } from 'react';
import { requirementApi } from '../services/api';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';
import type { WizardAnswers, TemplateType } from '../types';

export function useRequirements() {
  const [loading, setLoading] = useState(false);
  const { setCurrentRequirement, setView, setRequirements, setStats } = useStore();

  const generate = useCallback(async (answers: WizardAnswers, template: TemplateType) => {
    setLoading(true);
    setView('generating');
    try {
      const req = await requirementApi.generate(answers, template);
      setCurrentRequirement(req);
      setView('output');
      toast.success('Requirements generated successfully!');
      return req;
    } catch (err) {
      toast.error((err as Error).message || 'Generation failed');
      setView('wizard');
      return null;
    } finally {
      setLoading(false);
    }
  }, [setCurrentRequirement, setView]);

  const fetchList = useCallback(async (params?: Parameters<typeof requirementApi.list>[0]) => {
    setLoading(true);
    try {
      const result = await requirementApi.list(params);
      setRequirements(result.data);
      return result;
    } catch (err) {
      toast.error((err as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setRequirements]);

  const fetchOne = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const req = await requirementApi.getById(id);
      setCurrentRequirement(req);
      return req;
    } catch (err) {
      toast.error((err as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setCurrentRequirement]);

  const save = useCallback(async (id: string, updates: Parameters<typeof requirementApi.update>[1]) => {
    try {
      const updated = await requirementApi.update(id, updates);
      setCurrentRequirement(updated);
      toast.success('Saved!');
      return updated;
    } catch (err) {
      toast.error((err as Error).message);
      return null;
    }
  }, [setCurrentRequirement]);

  const fetchStats = useCallback(async () => {
    try {
      const s = await requirementApi.getStats();
      setStats(s);
      return s;
    } catch { return null; }
  }, [setStats]);

  return { loading, generate, fetchList, fetchOne, save, fetchStats };
}
