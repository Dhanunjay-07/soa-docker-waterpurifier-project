import { useCallback, useEffect, useMemo, useState } from 'react'
import { Check, ChevronDown, Droplets, LoaderCircle, Pencil, Plus, Search, Trash2, X } from 'lucide-react'

const API_BASE_URL = 'http://localhost:2025'
const blankForm = { brand: '', modelName: '', price: '', installed: '' }

function App() {
  const [page, setPage] = useState('dashboard')
  const [purifiers, setPurifiers] = useState([])
  const [form, setForm] = useState(blankForm)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [errors, setErrors] = useState({})

  const loadPurifiers = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/waterpurifier/displayall`)
      if (!response.ok) throw new Error('Unable to load purifier records.')
      setPurifiers(await response.json())
      setMessage({ type: '', text: '' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadPurifiers() }, [loadPurifiers])

  const installed = purifiers.filter((item) => item.installed).length
  const pending = purifiers.length - installed
  const filtered = useMemo(() => purifiers.filter((item) => {
    const query = search.toLowerCase().trim()
    const matchesText = !query || String(item.id).includes(query) || item.brand.toLowerCase().includes(query) || item.modelName.toLowerCase().includes(query)
    const matchesFilter = filter === 'all' || (filter === 'installed' && item.installed) || (filter === 'pending' && !item.installed)
    return matchesText && matchesFilter
  }), [purifiers, search, filter])

  function navigate(nextPage) {
    setPage(nextPage)
    setMessage({ type: '', text: '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function updateForm(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  function validate() {
    const nextErrors = {}
    if (!form.brand.trim()) nextErrors.brand = 'Brand is required.'
    if (!form.modelName.trim()) nextErrors.modelName = 'Model name is required.'
    if (!form.price || Number(form.price) <= 0) nextErrors.price = 'Enter a positive price.'
    if (!['true', 'false'].includes(form.installed)) nextErrors.installed = 'Select a status.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function submit(event) {
    event.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const payload = { brand: form.brand.trim(), modelName: form.modelName.trim(), price: Number(form.price), installed: form.installed === 'true' }
      const response = await fetch(editingId ? `${API_BASE_URL}/waterpurifier/updatebyid/${editingId}` : `${API_BASE_URL}/waterpurifier/add`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error('Unable to save this purifier.')
      setForm(blankForm)
      setEditingId(null)
      setMessage({ type: 'success', text: editingId ? 'Purifier updated successfully.' : 'Purifier added successfully.' })
      await loadPurifiers()
      navigate('inventory')
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
  }

  function edit(item) {
    setForm({ brand: item.brand, modelName: item.modelName, price: String(item.price), installed: String(Boolean(item.installed)) })
    setEditingId(item.id)
    navigate('add')
  }

  async function remove(item) {
    if (!window.confirm(`Delete ${item.brand} ${item.modelName}?`)) return
    try {
      const response = await fetch(`${API_BASE_URL}/waterpurifier/deletebyid/${item.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Unable to delete this purifier.')
      setMessage({ type: 'success', text: 'Purifier deleted successfully.' })
      await loadPurifiers()
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    }
  }

  function cancelEdit() {
    setForm(blankForm)
    setEditingId(null)
    setErrors({})
    navigate('dashboard')
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="content-width nav-inner">
          <button className="logo" onClick={() => navigate('dashboard')}><span className="logo-mark"><Droplets size={17} /></span> clear<span>water</span></button>
          <nav>
            <button className={page === 'dashboard' ? 'active' : ''} onClick={() => navigate('dashboard')}>Dashboard</button>
            <button className={page === 'add' ? 'active' : ''} onClick={() => navigate('add')}>Add purifier</button>
            <button className={page === 'inventory' ? 'active' : ''} onClick={() => navigate('inventory')}>View purifiers</button>
          </nav>
        </div>
      </header>

      <main className="content-width main-content">
        {message.text && <div className={`notice ${message.type}`}><span>{message.type === 'success' ? <Check size={16} /> : <X size={16} />}</span>{message.text}<button onClick={() => setMessage({ type: '', text: '' })}><X size={14} /></button></div>}
        {page === 'dashboard' && <Dashboard count={purifiers.length} installed={installed} pending={pending} onAdd={() => navigate('add')} />}
        {page === 'add' && <AddPage form={form} errors={errors} saving={saving} editing={editingId} onChange={updateForm} onSubmit={submit} onCancel={cancelEdit} />}
        {page === 'inventory' && <Inventory items={filtered} total={purifiers.length} loading={loading} search={search} filter={filter} onSearch={setSearch} onFilter={setFilter} onEdit={edit} onDelete={remove} onRefresh={loadPurifiers} />}
      </main>
      <footer><div className="content-width">clearwater <span>• Clean records for cleaner water.</span></div></footer>
    </div>
  )
}

function Dashboard({ count, installed, pending, onAdd }) {
  return <section className="dashboard">
    <div className="page-heading"><div><span className="overline">PURIFIER OVERVIEW</span><h1>Your purifier collection</h1><p>A clear view of every purifier and its current installation status.</p></div><button className="primary-button" onClick={onAdd}><Plus size={15} /> Add a purifier</button></div>
    <div className="summary-cards">
      <SummaryCard label="Total purifiers" value={count} icon={<Droplets size={16} />} />
      <SummaryCard label="Installed" value={installed} icon={<Check size={16} />} />
      <SummaryCard label="Pending installation" value={pending} icon={<LoaderCircle size={16} />} amber />
    </div>
  </section>
}

function SummaryCard({ label, value, icon, amber }) {
  return <div className="summary-card"><div><span>{label}</span><strong>{value}</strong></div><div className={`summary-icon ${amber ? 'amber' : ''}`}>{icon}</div></div>
}

function AddPage({ form, errors, saving, editing, onChange, onSubmit, onCancel }) {
  return <section className="form-page"><span className="overline">ADD TO YOUR COLLECTION</span><h1>{editing ? 'Edit purifier' : 'Add a purifier'}</h1><p className="subtitle">Enter the purifier details below. The purifier ID is assigned automatically by the database.</p><form className="record-form" onSubmit={onSubmit} noValidate>
    <Field label="Brand" name="brand" value={form.brand} placeholder="e.g. Aquaguard" error={errors.brand} onChange={onChange} />
    <Field label="Model name" name="modelName" value={form.modelName} placeholder="e.g. Aura RO+" error={errors.modelName} onChange={onChange} />
    <div className="two-fields"><Field label="Price (₹)" name="price" type="number" value={form.price} placeholder="0.00" error={errors.price} onChange={onChange} /><div className="field"><label htmlFor="installed">Installation status</label><div className="select-control"><select id="installed" name="installed" value={form.installed} onChange={onChange}><option value="">Select status</option><option value="true">Installed</option><option value="false">Pending</option></select><ChevronDown size={15} /></div>{errors.installed && <small>{errors.installed}</small>}</div></div>
    <div className="form-buttons"><button type="submit" className="primary-button" disabled={saving}>{saving ? <><LoaderCircle size={15} className="spin" /> Saving...</> : <>{editing ? 'Save changes' : 'Add purifier'}</>}</button>{editing && <button type="button" className="secondary-button" onClick={onCancel}>Cancel</button>}</div>
  </form></section>
}

function Field({ label, name, value, placeholder, type = 'text', error, onChange }) {
  return <div className="field"><label htmlFor={name}>{label}</label><input id={name} name={name} type={type} min={type === 'number' ? '0' : undefined} value={value} placeholder={placeholder} onChange={onChange} className={error ? 'invalid' : ''} />{error && <small>{error}</small>}</div>
}

function Inventory({ items, total, loading, search, filter, onSearch, onFilter, onEdit, onDelete, onRefresh }) {
  return <section className="inventory-page"><div className="page-heading"><div><span className="overline">YOUR COLLECTION</span><h1>View purifiers <b>{total}</b></h1><p>Manage your purifier records and installation status.</p></div><button className="secondary-button" onClick={onRefresh}>Refresh</button></div><div className="inventory-box"><div className="inventory-tools"><div className="search"><Search size={15} /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search by ID, brand or model..." /></div><div className="filter"><select value={filter} onChange={(event) => onFilter(event.target.value)}><option value="all">All purifiers</option><option value="installed">Installed</option><option value="pending">Pending</option></select><ChevronDown size={14} /></div></div>{loading ? <div className="empty"><LoaderCircle className="spin" /><p>Loading purifiers...</p></div> : items.length === 0 ? <div className="empty"><Droplets size={25} /><strong>{total ? 'No matching purifiers' : 'No purifiers yet'}</strong><p>{total ? 'Try another search or filter.' : 'Add a purifier to see it here.'}</p></div> : <div className="table-scroll"><table><thead><tr><th>ID</th><th>BRAND</th><th>MODEL NAME</th><th>PRICE</th><th>STATUS</th><th></th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td className="record-id">#{item.id}</td><td>{item.brand}</td><td>{item.modelName}</td><td>₹{Number(item.price).toLocaleString('en-IN')}</td><td><span className={`pill ${item.installed ? 'done' : 'waiting'}`}>{item.installed ? 'Installed' : 'Pending'}</span></td><td className="actions"><button onClick={() => onEdit(item)} title="Edit"><Pencil size={15} /></button><button onClick={() => onDelete(item)} title="Delete"><Trash2 size={15} /></button></td></tr>)}</tbody></table></div>}</div></section>
}

export default App
