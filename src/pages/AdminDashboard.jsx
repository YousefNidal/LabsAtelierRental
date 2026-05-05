import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Badge, Modal, EmptyState } from '../components/ui';
import {
  DollarSign, ClipboardList, Shirt, Users, FileText, TrendingUp,
  Pencil, Trash2, Plus, CheckCircle, BarChart3, Package,
} from 'lucide-react';
import { ROLES, PRODUCT_STATUS, PRODUCT_CONDITION } from '../store/data';

function UserModal({ user, onClose }) {
  const { dispatch } = useApp();
  const isNew = !user;
  const [form, setForm] = useState(user || { name: '', email: '', password: '', phone: '', role: ROLES.CLIENT, address: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const save = () => {
    if (isNew) dispatch({ type: 'ADD_USER', payload: form });
    else dispatch({ type: 'UPDATE_USER', id: user.id, payload: form });
    onClose();
  };
  return (
    <Modal title={isNew ? 'Add User' : 'Edit User'} onClose={onClose} footer={
      <><button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={save}>{isNew ? 'Create' : 'Save'}</button></>
    }>
      <div className="form-row">
        <div className="form-group"><label>Name</label><input value={form.name} onChange={e => set('name', e.target.value)} /></div>
        <div className="form-group"><label>Role</label>
          <select value={form.role} onChange={e => set('role', e.target.value)}>
            {Object.values(ROLES).filter(r => r !== 'guest').map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>
      <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
      <div className="form-group"><label>Password</label><input type="password" value={form.password} onChange={e => set('password', e.target.value)} /></div>
      <div className="form-row">
        <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
        <div className="form-group"><label>Address</label><input value={form.address || ''} onChange={e => set('address', e.target.value)} /></div>
      </div>
    </Modal>
  );
}

function ProductModal({ product, onClose }) {
  const { dispatch } = useApp();
  const isNew = !product;
  const [form, setForm] = useState(product || { name: '', category: 'Evening Wear', description: '', price: 50, status: PRODUCT_STATUS.AVAILABLE, condition: PRODUCT_CONDITION.EXCELLENT });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const save = () => {
    if (isNew) dispatch({ type: 'ADD_PRODUCT', payload: { ...form, price: Number(form.price) } });
    else dispatch({ type: 'UPDATE_PRODUCT', id: product.id, payload: { ...form, price: Number(form.price) } });
    onClose();
  };
  return (
    <Modal title={isNew ? 'Add Product' : 'Edit Product'} onClose={onClose} footer={
      <><button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={save}>{isNew ? 'Create' : 'Save'}</button></>
    }>
      <div className="form-group"><label>Name</label><input value={form.name} onChange={e => set('name', e.target.value)} /></div>
      <div className="form-row">
        <div className="form-group"><label>Category</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}>
            {['Evening Wear','Formal','Wedding','Cocktail','Vintage','Prom','Casual'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group"><label>Price / day ($)</label>
          <input type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} />
        </div>
      </div>
      <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => set('description', e.target.value)} /></div>
      <div className="form-row">
        <div className="form-group"><label>Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}>
            {Object.values(PRODUCT_STATUS).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group"><label>Condition</label>
          <select value={form.condition} onChange={e => set('condition', e.target.value)}>
            {Object.values(PRODUCT_CONDITION).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
    </Modal>
  );
}

const STAT_CARDS = (bookings, products, users, payments) => [
  { icon: DollarSign,    label: 'Total Revenue',  value: `$${payments.reduce((s,p)=>s+p.amount,0).toLocaleString()}`, bg: 'rgba(217,119,6,.1)',  color: '#d97706' },
  { icon: ClipboardList, label: 'Total Bookings', value: bookings.length,                                              bg: 'rgba(5,150,105,.1)',  color: '#059669' },
  { icon: Shirt,         label: 'Products',        value: products.length,                                             bg: 'rgba(99,85,224,.1)', color: '#6355e0' },
  { icon: Users,         label: 'Users',           value: users.length,                                                bg: 'rgba(37,99,235,.1)', color: '#2563eb' },
  { icon: FileText,      label: 'Payments',        value: payments.length,                                             bg: 'rgba(217,119,6,.1)', color: '#d97706' },
  { icon: TrendingUp,    label: 'Active Rentals',  value: bookings.filter(b=>b.status==='Rental Active').length,       bg: 'rgba(5,150,105,.1)', color: '#059669' },
];

export default function AdminDashboard({ page }) {
  const { state, dispatch } = useApp();
  const { users, products, bookings, payments } = state;
  const [editUser, setEditUser] = useState(undefined);
  const [editProduct, setEditProduct] = useState(undefined);
  const [tariffs, setTariffs] = useState({ peak: 1.5, offPeak: 0.8, deposit: 20 });
  const [saved, setSaved] = useState(false);

  const byCat = products.reduce((acc, p) => { acc[p.category] = (acc[p.category] || 0) + 1; return acc; }, {});
  const stats = STAT_CARDS(bookings, products, users, payments);

  return (
    <div className="animate-in">

      {page === 'dashboard' && (
        <div>
          <div className="page-header">
            <div><h1 className="page-title">Dashboard Overview</h1><p className="page-subtitle">System summary at a glance</p></div>
          </div>
          <div className="stats-grid">
            {stats.map(({ icon: Icon, label, value, bg, color }) => (
              <div key={label} className="stat-card">
                <div className="stat-icon" style={{ background: bg }}><Icon size={22} color={color} /></div>
                <div><div className="stat-value">{value}</div><div className="stat-label">{label}</div></div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 4 }}>
            <div className="card">
              <h3 style={{ marginBottom: 16, fontSize: 15, display:'flex', alignItems:'center', gap:8 }}>
                <Package size={16} color="#6355e0" /> Products by Category
              </h3>
              {Object.entries(byCat).map(([cat, count]) => (
                <div key={cat} style={{ display:'flex', justifyContent:'space-between', marginBottom:10, alignItems:'center' }}>
                  <span style={{ fontSize:13 }}>{cat}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:80, height:6, background:'#f3f4f6', borderRadius:3 }}>
                      <div style={{ width:`${(count/products.length)*100}%`, height:'100%', background:'#6355e0', borderRadius:3 }} />
                    </div>
                    <span className="badge badge-purple">{count}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="card">
              <h3 style={{ marginBottom:16, fontSize:15, display:'flex', alignItems:'center', gap:8 }}>
                <BarChart3 size={16} color="#6355e0" /> Recent Bookings
              </h3>
              {bookings.slice(-5).reverse().map(b => (
                <div key={b.id} style={{ display:'flex', justifyContent:'space-between', marginBottom:10, alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600 }}>{b.id}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)' }}>{b.bookingDate}</div>
                  </div>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <span style={{ fontWeight:700, color:'var(--gold)' }}>${b.totalPrice}</span>
                    <Badge value={b.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {page === 'products' && (
        <div>
          <div className="page-header">
            <div><h1 className="page-title">Product Catalog</h1><p className="page-subtitle">{products.length} items</p></div>
            <button className="btn btn-primary" onClick={() => setEditProduct(null)}><Plus size={16} /> Add Product</button>
          </div>
          <div className="card"><div className="table-wrap"><table>
            <thead><tr><th>Name</th><th>Category</th><th>Price/day</th><th>Condition</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight:600 }}>{p.name}</td>
                  <td>{p.category}</td>
                  <td style={{ color:'var(--gold)', fontWeight:700 }}>${p.price}</td>
                  <td><Badge value={p.condition} /></td>
                  <td><Badge value={p.status} /></td>
                  <td><div style={{ display:'flex', gap:6 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditProduct(p)} style={{ display:'flex', alignItems:'center', gap:4 }}><Pencil size={13} /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => dispatch({ type:'DELETE_PRODUCT', id:p.id })} style={{ display:'flex', alignItems:'center', gap:4 }}><Trash2 size={13} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div></div>
        </div>
      )}

      {page === 'users' && (
        <div>
          <div className="page-header">
            <div><h1 className="page-title">User Management</h1><p className="page-subtitle">{users.length} accounts</p></div>
            <button className="btn btn-primary" onClick={() => setEditUser(null)}><Plus size={16} /> Add User</button>
          </div>
          <div className="card"><div className="table-wrap"><table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight:600 }}>{u.name}</td>
                  <td style={{ fontSize:13 }}>{u.email}</td>
                  <td><span className={`badge ${u.role==='administrator'?'badge-red':u.role==='manager'?'badge-purple':u.role==='storekeeper'?'badge-yellow':'badge-blue'}`}>{u.role}</span></td>
                  <td style={{ fontSize:13 }}>{u.phone}</td>
                  <td><div style={{ display:'flex', gap:6 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditUser(u)} style={{ display:'flex', alignItems:'center', gap:4 }}><Pencil size={13} /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => dispatch({ type:'DELETE_USER', id:u.id })} style={{ display:'flex', alignItems:'center', gap:4 }}><Trash2 size={13} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div></div>
        </div>
      )}

      {page === 'tariffs' && (
        <div>
          <div className="page-header"><h1 className="page-title">Tariffs & Prices</h1></div>
          <div className="card" style={{ maxWidth:480 }}>
            <h3 style={{ marginBottom:20 }}>Rental Pricing Rules</h3>
            <div className="form-group"><label>Peak Season Multiplier</label>
              <input type="number" step="0.1" value={tariffs.peak} onChange={e => { setTariffs(t=>({...t,peak:e.target.value})); setSaved(false); }} />
            </div>
            <div className="form-group"><label>Off-Peak Multiplier</label>
              <input type="number" step="0.1" value={tariffs.offPeak} onChange={e => { setTariffs(t=>({...t,offPeak:e.target.value})); setSaved(false); }} />
            </div>
            <div className="form-group"><label>Security Deposit (%)</label>
              <input type="number" min="0" value={tariffs.deposit} onChange={e => { setTariffs(t=>({...t,deposit:e.target.value})); setSaved(false); }} />
            </div>
            {saved && <div className="alert alert-success" style={{ display:'flex', alignItems:'center', gap:8 }}><CheckCircle size={15} /> Tariff settings saved.</div>}
            <button className="btn btn-primary" onClick={() => setSaved(true)}>Save Changes</button>
          </div>
        </div>
      )}

      {page === 'reports' && (
        <div>
          <div className="page-header"><h1 className="page-title">Reports & Analytics</h1></div>
          <div className="stats-grid" style={{ marginBottom:28 }}>
            {stats.map(({ icon: Icon, label, value, bg, color }) => (
              <div key={label} className="stat-card">
                <div className="stat-icon" style={{ background:bg }}><Icon size={22} color={color} /></div>
                <div><div className="stat-value">{value}</div><div className="stat-label">{label}</div></div>
              </div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            <div className="card">
              <h3 style={{ marginBottom:16, fontSize:15 }}>Products by Category</h3>
              {Object.entries(byCat).map(([cat,count]) => (
                <div key={cat} style={{ display:'flex', justifyContent:'space-between', marginBottom:10, alignItems:'center' }}>
                  <span style={{ fontSize:13 }}>{cat}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:80, height:6, background:'#f3f4f6', borderRadius:3 }}>
                      <div style={{ width:`${(count/products.length)*100}%`, height:'100%', background:'#6355e0', borderRadius:3 }} />
                    </div>
                    <span className="badge badge-purple">{count}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="card">
              <h3 style={{ marginBottom:16, fontSize:15 }}>Bookings by Status</h3>
              {Object.entries(bookings.reduce((acc,b)=>{ acc[b.status]=(acc[b.status]||0)+1; return acc; },{})).map(([status,count]) => (
                <div key={status} style={{ display:'flex', justifyContent:'space-between', marginBottom:10, alignItems:'center' }}>
                  <Badge value={status} /><span style={{ fontWeight:700 }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {editUser !== undefined && <UserModal user={editUser} onClose={() => setEditUser(undefined)} />}
      {editProduct !== undefined && <ProductModal product={editProduct} onClose={() => setEditProduct(undefined)} />}
    </div>
  );
}
