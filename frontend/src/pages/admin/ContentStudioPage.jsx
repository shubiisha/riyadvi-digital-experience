import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Save,
  Trash2,
  RefreshCw,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  FileJson,
  ExternalLink,
} from 'lucide-react';
import {
  CONTENT_COLLECTIONS,
  getAdminContent,
  createAdminContent,
  updateAdminContent,
  deleteAdminContent,
} from '../../lib/api';
import { cn } from '../../lib/utils';

/**
 * Content Studio
 * ---------------------------------------------------------------------------
 * The write side of the dynamic content architecture. Documents created here
 * are the same documents the public pages read from the API — editing a record
 * changes the live site immediately, with no rebuild.
 *
 * The editor is a JSON document view rather than a hand-rolled form per schema:
 * the four collections have different shapes, and showing the actual stored
 * document makes the datastore round trip explicit instead of hiding it.
 */

const TEMPLATES = {
  services: {
    slug: 'new-service',
    title: 'New Service',
    summary: 'One line that explains the outcome for the client.',
    description: 'Longer description rendered on the service detail page.',
    icon: 'Sparkles',
    features: ['First capability', 'Second capability'],
  },
  projects: {
    slug: 'new-case-study',
    title: 'New Case Study',
    client: 'Client Name',
    industry: 'Technology',
    summary: 'The problem solved and the measurable outcome.',
    results: [{ metric: 'Conversion', value: '+38%' }],
  },
  blogs: {
    slug: 'new-article',
    title: 'New Article',
    excerpt: 'Short summary shown on the blog index.',
    content: 'Full article body.',
    category: 'Engineering',
    readTime: '5 min read',
  },
  jobs: {
    slug: 'new-role',
    title: 'New Role',
    department: 'Engineering',
    location: 'Hybrid',
    type: 'Full-time',
    description: 'Role overview.',
    responsibilities: ['First responsibility'],
  },
};

const Feedback = ({ feedback }) => {
  if (!feedback) return null;
  const ok = feedback.status === 'ok';
  return (
    <div
      className={cn(
        'mt-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs',
        ok
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
          : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
      )}
    >
      {ok ? (
        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      ) : (
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      )}
      <span className="leading-relaxed">{feedback.message}</span>
    </div>
  );
};

export const ContentStudioPage = () => {
  const [collection, setCollection] = useState(CONTENT_COLLECTIONS[0].key);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(
    async (key = collection) => {
      setLoading(true);
      const result = await getAdminContent(key);
      setItems(result.items);
      setLoading(false);
      if (result.status !== 'ok') {
        setFeedback({
          status: result.status,
          message:
            result.status === 'unauthorized'
              ? 'Session expired — unlock the dashboard again to continue.'
              : `Could not read '${key}': ${result.message || 'the datastore did not respond.'}`,
        });
      } else {
        setFeedback({ status: 'ok', message: `Loaded ${result.items.length} document(s) from '${key}'.` });
      }
      return result;
    },
    [collection]
  );

  useEffect(() => {
    load(collection);
    setEditingId(null);
    setDraft('');
  }, [collection, load]);

  const activeCount = items.length;

  const startCreate = () => {
    setEditingId('new');
    setDraft(JSON.stringify(TEMPLATES[collection] || { slug: 'new-document', title: 'New Document' }, null, 2));
    setFeedback({ status: 'ok', message: 'Template loaded. Adjust the JSON and save to persist it.' });
  };

  const startEdit = (document) => {
    setEditingId(document._id || document.id);
    setDraft(JSON.stringify(document, null, 2));
    setFeedback(null);
  };

  const parseDraft = () => {
    try {
      const parsed = JSON.parse(draft);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('The document must be a JSON object.');
      }
      return { parsed, error: null };
    } catch (err) {
      return { parsed: null, error: err.message };
    }
  };

  const handleSave = async () => {
    const { parsed, error } = parseDraft();
    if (error) {
      setFeedback({ status: 'error', message: `Invalid JSON: ${error}` });
      return;
    }

    setBusy(true);
    const isNew = editingId === 'new';
    // _id is server-managed and cannot be sent back through an update.
    const { _id, __v, createdAt, updatedAt, ...payload } = parsed;

    const result = isNew
      ? await createAdminContent(collection, payload)
      : await updateAdminContent(collection, editingId, payload);

    setBusy(false);

    if (result.status === 'ok') {
      setFeedback({
        status: 'ok',
        message: isNew
          ? `Created '${payload.title || payload.slug}'. The public pages now serve this document.`
          : `Saved changes to '${payload.title || payload.slug}'. The public pages reflect them immediately.`,
      });
      if (isNew) setEditingId(null);
      await load();
    } else {
      setFeedback({
        status: result.status,
        message:
          result.status === 'unauthorized'
            ? 'Session expired — unlock the dashboard again to continue.'
            : result.message || 'The server rejected the write.',
      });
    }
  };

  const handleDelete = async (document) => {
    const id = document._id || document.id;
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Permanently delete "${document.title || document.slug}"?`)) return;

    setBusy(true);
    const result = await deleteAdminContent(collection, id);
    setBusy(false);

    if (result.status === 'ok') {
      setFeedback({ status: 'ok', message: `Deleted '${document.title || document.slug}'.` });
      if (editingId === id) {
        setEditingId(null);
        setDraft('');
      }
      await load();
    } else {
      setFeedback({ status: result.status, message: result.message || 'The delete was rejected.' });
    }
  };

  const publicPath = useMemo(() => {
    const map = { services: '/services', projects: '/portfolio', blogs: '/blog', jobs: '/careers' };
    return map[collection] || '/';
  }, [collection]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Content Studio</h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-400">
            These documents are served by the public API, not bundled into the frontend. Create,
            edit or delete a record and the corresponding page reflects it on next load.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => load()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-gold-500/40 hover:text-gold-300"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
            Reload
          </button>
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gold-500 px-3 py-2 text-xs font-bold text-black transition-colors hover:bg-gold-400"
          >
            <Plus className="h-3.5 w-3.5" />
            New document
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {CONTENT_COLLECTIONS.map((entry) => (
          <button
            key={entry.key}
            type="button"
            onClick={() => setCollection(entry.key)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all',
              collection === entry.key
                ? 'border-gold-400 bg-gold-500/15 text-gold-300'
                : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
            )}
          >
            {entry.label}
            {collection === entry.key && <span className="ml-2 font-mono text-[10px]">{activeCount}</span>}
          </button>
        ))}
      </div>

      <Feedback feedback={feedback} />

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Document list */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-obsidian-900/60 lg:col-span-2">
          <div className="border-b border-slate-800 px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              {collection} · {activeCount} document(s)
            </p>
          </div>
          <div className="max-h-[520px] overflow-y-auto">
            {loading && (
              <p className="flex items-center justify-center gap-2 py-10 text-xs text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" /> reading datastore…
              </p>
            )}
            {!loading && !items.length && (
              <p className="px-4 py-10 text-center text-xs text-slate-500">
                No documents in this collection yet. Use “New document” to create the first one.
              </p>
            )}
            {!loading &&
              items.map((document) => {
                const id = document._id || document.id;
                return (
                  <div
                    key={id}
                    className={cn(
                      'border-b border-slate-800/60 px-4 py-3 transition-colors',
                      editingId === id ? 'bg-gold-500/10' : 'hover:bg-white/[0.03]'
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <button type="button" onClick={() => startEdit(document)} className="min-w-0 text-left">
                        <p className="truncate text-sm font-semibold text-white">
                          {document.title || '(untitled)'}
                        </p>
                        <p className="truncate font-mono text-[10px] text-gold-500/80">
                          /{document.slug || '—'}
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(document)}
                        disabled={busy}
                        className="shrink-0 rounded-md p-1.5 text-slate-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-40"
                        title="Delete document"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-1 truncate font-mono text-[9px] text-slate-600">{id}</p>
                  </div>
                );
              })}
          </div>
          <a
            href={publicPath}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 border-t border-slate-800 px-4 py-2.5 text-[11px] font-semibold text-slate-400 transition-colors hover:text-gold-300"
          >
            <ExternalLink className="h-3 w-3" />
            Open the public page
          </a>
        </div>

        {/* Editor */}
        <div className="rounded-2xl border border-slate-800 bg-obsidian-900/60 lg:col-span-3">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
            <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
              <FileJson className="h-3 w-3" />
              {editingId === 'new' ? 'new document' : editingId ? `editing ${editingId.slice(-8)}` : 'document editor'}
            </p>
            <button
              type="button"
              onClick={handleSave}
              disabled={busy || !editingId}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-500/25 disabled:opacity-40"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {editingId === 'new' ? 'Create' : 'Save'}
            </button>
          </div>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            spellCheck={false}
            placeholder={editingId ? '' : 'Select a document on the left, or create a new one.'}
            className="h-[520px] w-full resize-none bg-black/60 p-4 font-mono text-[11.5px] leading-relaxed text-slate-200 outline-none placeholder:text-slate-600"
          />
        </div>
      </div>
    </div>
  );
};

export default ContentStudioPage;
