// src/pages/admin-dashboard/components/MessagesManager.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from 'components/AppIcon';
import Breadcrumb from 'components/ui/Breadcrumb';
import EmptyState from 'components/ui/EmptyState';
import LoadError from 'components/ui/LoadError';
import { useToast } from 'context/ToastContext';
import {
  deleteMessage,
  listMessages,
  setMessageStatus,
} from 'services/messagesService';

const FILTERS = [
  { id: 'inbox', label: 'Inbox', match: (m) => m.status !== 'archived' },
  { id: 'new', label: 'New', match: (m) => (m.status || 'new') === 'new' },
  { id: 'archived', label: 'Archived', match: (m) => m.status === 'archived' },
];

const INQUIRY_LABELS = {
  project: 'Project inquiry',
  general: 'General question',
};

const formatWhen = (value) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const replyHref = (message) => {
  const subject = message.subject ? `Re: ${message.subject}` : 'Re: your message';
  return `mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(subject)}`;
};

const MessagesManager = () => {
  const { addToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('inbox');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await listMessages();
    if (result.success) {
      setMessages(result.data);
      setError(null);
    } else {
      setError(result.error || 'Messages could not be loaded.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(
    () => Object.fromEntries(FILTERS.map((f) => [f.id, messages.filter(f.match).length])),
    [messages]
  );

  const visible = useMemo(() => {
    const active = FILTERS.find((f) => f.id === filter) || FILTERS[0];
    const q = query.trim().toLowerCase();
    return messages.filter((m) => {
      if (!active.match(m)) return false;
      if (!q) return true;
      return [m.name, m.email, m.subject, m.message, m.company]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q));
    });
  }, [messages, filter, query]);

  const selected = messages.find((m) => m.id === selectedId) || null;

  const updateLocal = (id, patch) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const changeStatus = async (message, status, successText) => {
    const previous = message.status;
    updateLocal(message.id, { status });
    const result = await setMessageStatus(message.id, status);
    if (!result.success) {
      updateLocal(message.id, { status: previous });
      addToast(`Could not update the message: ${result.error}`, 'error');
      return;
    }
    if (successText) addToast(successText, 'success', 2500);
  };

  const openMessage = (message) => {
    setSelectedId(message.id);
    if ((message.status || 'new') === 'new') {
      changeStatus(message, 'read');
    }
  };

  const handleDelete = async (message) => {
    if (!window.confirm(`Delete the message from ${message.name}? This cannot be undone.`)) return;
    const result = await deleteMessage(message.id);
    if (!result.success) {
      addToast(`Could not delete the message: ${result.error}`, 'error');
      return;
    }
    setMessages((prev) => prev.filter((m) => m.id !== message.id));
    setSelectedId(null);
    addToast('Message deleted', 'success', 2500);
  };

  const copyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email);
      addToast('Email address copied', 'success', 2000);
    } catch {
      addToast('Copy failed. Select the address instead.', 'error', 3000);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={[{ href: '/admin-dashboard', label: 'Dashboard' }, { label: 'Messages' }]} />

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 dark:bg-surface">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary-800 dark:text-text-primary">Messages</h1>
              <p className="text-secondary-600 mt-1 dark:text-text-secondary">
                Everything sent through the contact form, newest first.
              </p>
            </div>
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary-200 text-primary-700 hover:border-accent hover:text-accent transition-colors dark:border-border dark:text-text-secondary dark:hover:text-accent-text"
            >
              <Icon name="RefreshCw" size={16} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
              <Icon
                name="Search"
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 dark:text-muted"
              />
              <input
                type="search"
                placeholder="Search by name, email, or text..."
                aria-label="Search messages"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:border-border"
              />
            </div>
            <div className="flex gap-2" role="tablist" aria-label="Message folders">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2 ${
                    filter === f.id
                      ? 'bg-accent text-white'
                      : 'bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-surface-elevated dark:text-text-secondary dark:hover:bg-surface'
                  }`}
                >
                  {f.label}
                  <span className={`text-xs ${filter === f.id ? 'text-white/85' : 'text-secondary-500 dark:text-muted'}`}>
                    {counts[f.id] || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <LoadError title="Messages could not be loaded" message={error} onRetry={load} />}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Icon name="Loader" size={32} className="animate-spin text-accent dark:text-accent-text" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-6">
            {/* List */}
            <div className={`lg:col-span-2 ${selected ? 'hidden lg:block' : ''}`}>
              <div className="bg-white rounded-xl shadow-sm dark:bg-surface overflow-hidden">
                {visible.length === 0 ? (
                  <EmptyState
                    icon="Inbox"
                    title={messages.length === 0 ? 'No messages yet' : 'Nothing here'}
                    description={
                      messages.length === 0
                        ? 'Messages sent from the contact page will show up here.'
                        : 'No messages match this folder or search.'
                    }
                  />
                ) : (
                  <ul className="divide-y divide-primary-100 dark:divide-border">
                    {visible.map((m) => {
                      const isNew = (m.status || 'new') === 'new';
                      const isActive = m.id === selectedId;
                      return (
                        <li key={m.id}>
                          <button
                            type="button"
                            onClick={() => openMessage(m)}
                            aria-current={isActive ? 'true' : undefined}
                            className={`w-full text-left px-5 py-4 transition-colors ${
                              isActive
                                ? 'bg-accent/10 dark:bg-accent-subtle'
                                : 'hover:bg-primary-50 dark:hover:bg-surface-elevated'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="flex items-center gap-2 min-w-0">
                                {isNew && <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" aria-label="New" />}
                                <span
                                  dir="auto"
                                  className={`truncate ${isNew ? 'font-bold text-primary-800 dark:text-text-primary' : 'font-medium text-primary-700 dark:text-text-secondary'}`}
                                >
                                  {m.name}
                                </span>
                              </span>
                              <span className="text-xs text-secondary-500 dark:text-muted flex-shrink-0">
                                {formatWhen(m.created_at)}
                              </span>
                            </div>
                            <p dir="auto" className="mt-1 text-sm font-medium text-primary-700 truncate dark:text-text-primary">
                              {m.subject}
                            </p>
                            <p dir="auto" className="mt-0.5 text-sm text-secondary-600 line-clamp-1 dark:text-text-secondary">
                              {m.message}
                            </p>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            {/* Detail */}
            <div className={`lg:col-span-3 ${selected ? '' : 'hidden lg:block'}`}>
              {selected ? (
                <article className="bg-white rounded-xl shadow-sm p-6 dark:bg-surface">
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    className="lg:hidden inline-flex items-center gap-2 text-sm text-secondary-600 mb-4 dark:text-text-secondary"
                  >
                    <Icon name="ArrowLeft" size={16} />
                    Back to messages
                  </button>

                  <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-primary-100 dark:border-border">
                    <div className="min-w-0">
                      <span className="inline-block text-xs font-semibold uppercase tracking-wide text-accent mb-2 dark:text-accent-text">
                        {INQUIRY_LABELS[selected.inquiry_type] || 'Message'}
                      </span>
                      <h2 dir="auto" className="text-2xl font-bold text-primary-800 dark:text-text-primary break-words">
                        {selected.subject}
                      </h2>
                      <p className="text-sm text-secondary-500 mt-1 dark:text-muted">{formatWhen(selected.created_at)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={replyHref(selected)}
                        className="btn-primary inline-flex items-center gap-2 text-sm px-4 py-2"
                      >
                        <Icon name="Reply" size={16} />
                        Reply
                      </a>
                      {selected.status === 'archived' ? (
                        <button
                          type="button"
                          onClick={() => changeStatus(selected, 'read', 'Moved back to the inbox')}
                          className="btn-secondary inline-flex items-center gap-2 text-sm px-4 py-2"
                        >
                          <Icon name="ArchiveRestore" size={16} />
                          Move to inbox
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => changeStatus(selected, 'archived', 'Message archived')}
                          className="btn-secondary inline-flex items-center gap-2 text-sm px-4 py-2"
                        >
                          <Icon name="Archive" size={16} />
                          Archive
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => changeStatus(selected, 'new', 'Marked as unread')}
                        className="p-2 rounded-lg text-secondary-600 hover:bg-primary-50 hover:text-accent dark:text-text-secondary dark:hover:bg-surface-elevated"
                        aria-label="Mark as unread"
                        title="Mark as unread"
                      >
                        <Icon name="Mail" size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(selected)}
                        className="p-2 rounded-lg text-error-600 hover:bg-error-50 dark:text-error dark:hover:bg-error/10"
                        aria-label="Delete message"
                        title="Delete message"
                      >
                        <Icon name="Trash2" size={18} />
                      </button>
                    </div>
                  </div>

                  <dl className="grid sm:grid-cols-2 gap-4 py-5 border-b border-primary-100 dark:border-border text-sm">
                    <div>
                      <dt className="text-secondary-500 dark:text-muted">From</dt>
                      <dd className="font-semibold text-primary-800 dark:text-text-primary"><bdi>{selected.name}</bdi></dd>
                    </div>
                    <div>
                      <dt className="text-secondary-500 dark:text-muted">Email</dt>
                      <dd className="flex items-center gap-2 min-w-0">
                        <a href={`mailto:${selected.email}`} className="font-semibold text-accent truncate dark:text-accent-text">
                          {selected.email}
                        </a>
                        <button
                          type="button"
                          onClick={() => copyEmail(selected.email)}
                          className="p-1 rounded text-secondary-500 hover:text-accent dark:text-muted dark:hover:text-accent-text"
                          aria-label="Copy email address"
                          title="Copy email address"
                        >
                          <Icon name="Copy" size={14} />
                        </button>
                      </dd>
                    </div>
                    {selected.company && (
                      <div>
                        <dt className="text-secondary-500 dark:text-muted">Company</dt>
                        <dd className="font-medium text-primary-800 dark:text-text-primary"><bdi>{selected.company}</bdi></dd>
                      </div>
                    )}
                    {selected.phone && (
                      <div>
                        <dt className="text-secondary-500 dark:text-muted">Phone</dt>
                        <dd className="font-medium text-primary-800 dark:text-text-primary">
                          <a href={`tel:${selected.phone.replace(/\s+/g, '')}`} dir="ltr">{selected.phone}</a>
                        </dd>
                      </div>
                    )}
                    {selected.budget && (
                      <div>
                        <dt className="text-secondary-500 dark:text-muted">Budget</dt>
                        <dd className="font-medium text-primary-800 dark:text-text-primary"><bdi>{selected.budget}</bdi></dd>
                      </div>
                    )}
                    {selected.timeline && (
                      <div>
                        <dt className="text-secondary-500 dark:text-muted">Timeline</dt>
                        <dd className="font-medium text-primary-800 dark:text-text-primary"><bdi>{selected.timeline}</bdi></dd>
                      </div>
                    )}
                  </dl>

                  <div dir="auto" className="pt-5 whitespace-pre-wrap leading-relaxed text-primary-800 dark:text-text-primary">
                    {selected.message}
                  </div>
                </article>
              ) : (
                <div className="bg-white rounded-xl shadow-sm dark:bg-surface h-full min-h-[16rem] flex items-center justify-center">
                  <div className="text-center px-6">
                    <Icon name="MailOpen" size={36} className="mx-auto text-secondary-400 dark:text-muted mb-3" />
                    <p className="text-secondary-600 dark:text-text-secondary">Pick a message to read it.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesManager;
