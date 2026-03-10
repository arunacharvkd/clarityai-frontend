import { useState, useCallback, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { requirementApi } from '../services/api';
import {
  IRequirement,
  IWizardAnswers,
  IGeneratedRequirement,
  TemplateType,
  RequirementStatus,
} from '../types';

// ─── useGenerate hook ─────────────────────────────────────────────────────────

export function useGenerate() {
  const [loading, setLoading] = useState(false);
  const [genStep, setGenStep] = useState(0);

  const generate = useCallback(
    async (
      wizardAnswers: IWizardAnswers,
      templateType: TemplateType
    ): Promise<IRequirement | null> => {
      setLoading(true);
      setGenStep(0);

      // Animate steps while API runs
      const animateSteps = async () => {
        for (let i = 0; i < 5; i++) {
          await new Promise((r) => setTimeout(r, 700));
          setGenStep(i + 1);
        }
      };

      try {
        const [response] = await Promise.all([
          requirementApi.generate({ wizardAnswers, templateType }),
          animateSteps(),
        ]);
        return response.data;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Generation failed';
        toast.error(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { generate, loading, genStep };
}

// ─── useRequirement hook ──────────────────────────────────────────────────────

export function useRequirement(id: string | null) {
  const [requirement, setRequirement] = useState<IRequirement | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await requirementApi.getById(id);
      setRequirement(res.data);
    } catch {
      toast.error('Failed to load requirement');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const update = useCallback(
    async (payload: {
      generatedRequirement?: IGeneratedRequirement;
      status?: RequirementStatus;
      tags?: string[];
      versionNote?: string;
    }) => {
      if (!id) return;
      try {
        const res = await requirementApi.update(id, payload);
        setRequirement(res.data);
        toast.success('Saved successfully');
      } catch {
        toast.error('Failed to save');
      }
    },
    [id]
  );

  const addComment = useCallback(
    async (text: string) => {
      if (!id) return;
      try {
        await requirementApi.addComment(id, {
          authorName: 'You',
          authorInitials: 'YO',
          authorColor: '#a78bfa',
          text,
        });
        await fetch(); // refresh to get updated comments
        toast.success('Comment added');
      } catch {
        toast.error('Failed to add comment');
      }
    },
    [id, fetch]
  );

  const deleteComment = useCallback(
    async (commentId: string) => {
      if (!id) return;
      try {
        await requirementApi.deleteComment(id, commentId);
        await fetch();
        toast.success('Comment deleted');
      } catch {
        toast.error('Failed to delete comment');
      }
    },
    [id, fetch]
  );

  return { requirement, loading, update, addComment, deleteComment, refetch: fetch };
}

// ─── useRequirementsList hook ─────────────────────────────────────────────────

export function useRequirementsList() {
  const [items, setItems] = useState<IRequirement[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchAll = useCallback(async (params?: {
    page?: number;
    limit?: number;
    status?: RequirementStatus;
    template?: TemplateType;
    search?: string;
  }) => {
    setLoading(true);
    try {
      const res = await requirementApi.getAll(params);
      setItems(res.data);
      setTotal(res.pagination.total);
    } catch {
      toast.error('Failed to load requirements');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const remove = useCallback(async (id: string) => {
    try {
      await requirementApi.delete(id);
      setItems(prev => prev.filter(i => i._id !== id));
      setTotal(t => t - 1);
      toast.success('Requirement deleted');
    } catch {
      toast.error('Failed to delete');
    }
  }, []);

  return { items, loading, total, fetchAll, remove };
}

// ─── useAIHint hook ───────────────────────────────────────────────────────────

export function useAIHint() {
  const [hints, setHints] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const timerRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const requestHint = useCallback(
    (stepId: number, fieldLabel: string, value: string) => {
      if (value.length < 15) return;
      if (hints[stepId]) return;

      clearTimeout(timerRef.current[stepId]);
      timerRef.current[stepId] = setTimeout(async () => {
        setLoading(prev => ({ ...prev, [stepId]: true }));
        try {
          const result = await requirementApi.getHint(fieldLabel, value);
          setHints(prev => ({ ...prev, [stepId]: result.hint }));
        } catch {
          // silently ignore hint failures
        } finally {
          setLoading(prev => ({ ...prev, [stepId]: false }));
        }
      }, 1800);
    },
    [hints]
  );

  const clearHint = useCallback((stepId: number) => {
    clearTimeout(timerRef.current[stepId]);
    setHints(prev => { const n = { ...prev }; delete n[stepId]; return n; });
  }, []);

  return { hints, loading, requestHint, clearHint };
}
