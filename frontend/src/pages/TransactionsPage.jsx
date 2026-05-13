import { useEffect, useState } from 'react';
import {
  LuArrowDownRight,
  LuArrowUpRight,
  LuPencilLine,
  LuPlus,
  LuTrash2,
  LuWalletCards,
  LuX,
} from 'react-icons/lu';
import Layout from '../components/Layout';
import transactionService from '../services/transactionService';
import categoryService from '../services/categoryService';
import { formatSignedCurrency } from '../utils/formatters';

function TypeBadge({ type }) {
  const income = type === 'INCOME';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${income ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
      {income ? <LuArrowUpRight className="h-3.5 w-3.5" /> : <LuArrowDownRight className="h-3.5 w-3.5" />}
      {income ? 'Income' : 'Expense'}
    </span>
  );
}

const emptyForm = {
  categoryId: '',
  amount: '',
  type: 'EXPENSE',
  description: '',
  transactionDate: new Date().toISOString().split('T')[0],
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let data;
      if (filter === 'income') data = await transactionService.getIncome();
      else if (filter === 'expense') data = await transactionService.getExpense();
      else data = await transactionService.getAll();
      setTransactions(data);
    } catch (err) {
      setError('Failed to load transactions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const data = {
        categoryId: parseInt(formData.categoryId, 10),
        amount: parseFloat(formData.amount),
        type: formData.type,
        description: formData.description,
        transactionDate: formData.transactionDate,
      };

      if (editingId) await transactionService.update(editingId, data);
      else await transactionService.create(data);

      setShowModal(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchTransactions();
    } catch (err) {
      setError('Failed to save transaction.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await transactionService.delete(id);
      setDeleteConfirm(null);
      fetchTransactions();
    } catch (err) {
      setError('Failed to delete transaction.');
      console.error(err);
    }
  };

  const openModal = (transaction = null) => {
    if (transaction) {
      setEditingId(transaction.id);
      setFormData({
        categoryId: transaction.categoryId,
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description,
        transactionDate: transaction.transactionDate,
      });
    } else {
      setEditingId(null);
      setFormData(emptyForm);
    }
    setShowModal(true);
  };

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'income', label: 'Income' },
    { key: 'expense', label: 'Expenses' },
  ];

  return (
    <Layout>
      <div className="space-y-6 fade-in">
        <section className="surface-panel rounded-[32px] p-6 md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--auca-blue)]">
                Transaction Ledger
              </p>
              <h2 className="mt-3 display-serif text-5xl leading-none text-[var(--auca-navy)] md:text-6xl">
                Every entry in one place.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--auca-muted)] md:text-base">
                Record money coming in and going out with a cleaner ledger built for student finance accountability.
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,var(--auca-navy),var(--auca-blue))] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_34px_rgba(33,58,107,0.24)]"
            >
              <LuPlus className="h-4 w-4" />
              Add Transaction
            </button>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`rounded-full px-4 py-2 text-sm font-bold ${
                filter === tab.key
                  ? 'bg-[var(--auca-navy)] text-white'
                  : 'border border-[var(--auca-line)] bg-white text-[var(--auca-muted)] hover:bg-[var(--auca-paper)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <section className="surface-card overflow-hidden rounded-[30px]">
          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-14 animate-pulse rounded-2xl bg-[rgba(33,58,107,0.06)]" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[24px] bg-[rgba(241,182,28,0.16)] text-[var(--auca-navy)]">
                <LuWalletCards className="h-8 w-8" />
              </div>
              <h3 className="display-serif text-4xl text-[var(--auca-navy)]">No transactions yet</h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-[var(--auca-muted)]">
                Add your first income or expense entry to start building a complete record.
              </p>
              <button
                onClick={() => openModal()}
                className="mt-6 rounded-2xl bg-[var(--auca-navy)] px-5 py-3 text-sm font-bold text-white"
              >
                Add First Transaction
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-sm">
                <thead className="table-header">
                  <tr className="border-b border-[var(--auca-line)]">
                    <th className="px-6 py-4 text-left text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[var(--auca-muted)]">Date</th>
                    <th className="px-6 py-4 text-left text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[var(--auca-muted)]">Category</th>
                    <th className="px-6 py-4 text-left text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[var(--auca-muted)]">Description</th>
                    <th className="px-6 py-4 text-left text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[var(--auca-muted)]">Type</th>
                    <th className="px-6 py-4 text-right text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[var(--auca-muted)]">Amount</th>
                    <th className="px-6 py-4 text-right text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[var(--auca-muted)]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(33,58,107,0.06)]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="bg-white hover:bg-[rgba(241,182,28,0.08)]">
                      <td className="px-6 py-4 font-semibold text-[var(--auca-ink)]">{tx.transactionDate}</td>
                      <td className="px-6 py-4 font-bold text-[var(--auca-navy)]">{tx.categoryName}</td>
                      <td className="px-6 py-4 text-[var(--auca-muted)]">{tx.description || 'No description'}</td>
                      <td className="px-6 py-4"><TypeBadge type={tx.type} /></td>
                      <td className={`px-6 py-4 text-right text-base font-extrabold ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {formatSignedCurrency(tx.type === 'INCOME' ? tx.amount : -tx.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openModal(tx)}
                            className="inline-flex items-center gap-1 rounded-xl border border-[var(--auca-line)] bg-white px-3 py-2 text-xs font-bold text-[var(--auca-navy)] hover:bg-[var(--auca-paper)]"
                          >
                            <LuPencilLine className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(tx.id)}
                            className="inline-flex items-center gap-1 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
                          >
                            <LuTrash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {showModal && (
        <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-[30px] bg-white p-6 shadow-[0_32px_70px_rgba(22,40,74,0.18)] fade-in">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--auca-blue)]">
                  {editingId ? 'Edit entry' : 'New entry'}
                </p>
                <h3 className="mt-2 display-serif text-4xl leading-none text-[var(--auca-navy)]">
                  {editingId ? 'Update transaction' : 'Add transaction'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-2xl bg-[var(--auca-paper)] p-3 text-[var(--auca-muted)] hover:text-[var(--auca-navy)]"
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[var(--auca-muted)]">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2 rounded-[24px] bg-[var(--auca-paper)] p-2">
                  {['EXPENSE', 'INCOME'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, type, categoryId: '' })}
                      className={`rounded-2xl px-4 py-3 text-sm font-bold ${
                        formData.type === type
                          ? type === 'INCOME'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                          : 'text-[var(--auca-muted)]'
                      }`}
                    >
                      {type === 'INCOME' ? 'Income' : 'Expense'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[var(--auca-muted)]">Category</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="soft-ring w-full rounded-2xl border border-[var(--auca-line)] bg-[var(--auca-paper)] px-4 py-3.5 text-sm"
                    required
                  >
                    <option value="">Select category</option>
                    {categories
                      .filter((cat) => cat.type === formData.type)
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[var(--auca-muted)]">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    step="0.01"
                    min="0.01"
                    className="soft-ring w-full rounded-2xl border border-[var(--auca-line)] bg-[var(--auca-paper)] px-4 py-3.5 text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[var(--auca-muted)]">Date</label>
                  <input
                    type="date"
                    name="transactionDate"
                    value={formData.transactionDate}
                    onChange={handleChange}
                    className="soft-ring w-full rounded-2xl border border-[var(--auca-line)] bg-[var(--auca-paper)] px-4 py-3.5 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[var(--auca-muted)]">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="soft-ring w-full rounded-2xl border border-[var(--auca-line)] bg-[var(--auca-paper)] px-4 py-3.5 text-sm"
                    placeholder="Optional note"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-2xl border border-[var(--auca-line)] px-4 py-3 text-sm font-bold text-[var(--auca-muted)] hover:bg-[var(--auca-paper)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-2xl bg-[linear-gradient(135deg,var(--auca-navy),var(--auca-blue))] px-4 py-3 text-sm font-bold text-white disabled:opacity-70"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Transaction' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[30px] bg-white p-6 text-center shadow-[0_32px_70px_rgba(22,40,74,0.18)] fade-in">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[24px] bg-rose-50 text-rose-600">
              <LuTrash2 className="h-7 w-7" />
            </div>
            <h3 className="display-serif text-4xl leading-none text-[var(--auca-navy)]">Delete transaction?</h3>
            <p className="mt-4 text-sm leading-7 text-[var(--auca-muted)]">
              This entry will be removed permanently from your records.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-2xl border border-[var(--auca-line)] px-4 py-3 text-sm font-bold text-[var(--auca-muted)]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-bold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
