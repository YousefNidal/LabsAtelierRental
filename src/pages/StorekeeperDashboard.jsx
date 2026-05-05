import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Badge, Modal, EmptyState } from '../components/ui';
import { Package, Wrench, Ban, RotateCcw, Plus, Shirt, CheckCircle } from 'lucide-react';
import { PRODUCT_STATUS, PRODUCT_CONDITION } from '../store/data';

function ReceiveProductModal({ onClose }) {
  const { dispatch, state } = useApp();
  const [form, setForm] = useState({ name:'', category:'Evening Wear', description:'', price:50, condition:PRODUCT_CONDITION.EXCELLENT });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const save = () => {
    dispatch({ type:'ADD_PRODUCT', payload:{ ...form, price:Number(form.price), status:PRODUCT_STATUS.AVAILABLE, storekeeperid:state.currentUser.id } });
    onClose();
  };
  return (
    <Modal title="Record Product Receipt" onClose={onClose} footer={
      <><button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={save}>Record</button></>
    }>
      <div className="form-group"><label>Product Name</label><input value={form.name} onChange={e=>set('name',e.target.value)} /></div>
      <div className="form-row">
        <div className="form-group"><label>Category</label>
          <select value={form.category} onChange={e=>set('category',e.target.value)}>
            {['Evening Wear','Formal','Wedding','Cocktail','Vintage','Prom','Casual'].map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group"><label>Price/day ($)</label>
          <input type="number" min="0" value={form.price} onChange={e=>set('price',e.target.value)} />
        </div>
      </div>
      <div className="form-group"><label>Description</label>
        <textarea value={form.description} onChange={e=>set('description',e.target.value)} />
      </div>
      <div className="form-group"><label>Initial Condition</label>
        <select value={form.condition} onChange={e=>set('condition',e.target.value)}>
          {Object.values(PRODUCT_CONDITION).map(c=><option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    </Modal>
  );
}

function UpdateConditionModal({ product, onClose }) {
  const { dispatch } = useApp();
  const [condition, setCondition] = useState(product.condition);
  const [status, setStatus] = useState(product.status);
  const save = () => {
    dispatch({ type:'UPDATE_PRODUCT_CONDITION', id:product.id, condition });
    dispatch({ type:'UPDATE_PRODUCT_STATUS',    id:product.id, status });
    onClose();
  };
  return (
    <Modal title={`Update: ${product.name}`} onClose={onClose} footer={
      <><button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={save}>Save</button></>
    }>
      <div className="form-group"><label>Condition</label>
        <select value={condition} onChange={e=>setCondition(e.target.value)}>
          {Object.values(PRODUCT_CONDITION).map(c=><option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="form-group"><label>Status</label>
        <select value={status} onChange={e=>setStatus(e.target.value)}>
          {Object.values(PRODUCT_STATUS).map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </Modal>
  );
}

export default function StorekeeperDashboard({ page }) {
  const { state, dispatch } = useApp();
  const { products, bookings, users } = state;
  const [showReceive, setShowReceive] = useState(false);
  const [editProduct,  setEditProduct]  = useState(null);

  const getClient    = id => users.find(u=>u.id===id);
  const returnBookings = bookings.filter(b=>b.status==='Return Inspection');
  const activeRentals  = bookings.filter(b=>b.status==='Rental Active');
  const getNames     = ids => ids.map(id=>products.find(p=>p.id===id)?.name||id).join(', ');

  const markRepair   = id => dispatch({ type:'UPDATE_PRODUCT_STATUS', id, status:PRODUCT_STATUS.REPAIR });
  const markWriteOff = id => dispatch({ type:'UPDATE_PRODUCT_STATUS', id, status:PRODUCT_STATUS.WRITE_OFF });

  const SUMMARY = [
    { Icon:CheckCircle, label:'Available', count:products.filter(p=>p.status==='available').length,  color:'#059669', bg:'rgba(5,150,105,.1)'  },
    { Icon:Shirt,       label:'Rented',    count:products.filter(p=>p.status==='rented').length,     color:'#6355e0', bg:'rgba(99,85,224,.1)'  },
    { Icon:Wrench,      label:'In Repair', count:products.filter(p=>p.status==='repair').length,     color:'#d97706', bg:'rgba(217,119,6,.1)'  },
    { Icon:Ban,         label:'Write-off', count:products.filter(p=>p.status==='write-off').length,  color:'#dc2626', bg:'rgba(220,38,38,.1)'  },
  ];

  return (
    <div className="animate-in">

      {/* ── Inventory ── */}
      {page === 'inventory' && (
        <div>
          <div className="page-header">
            <div><h1 className="page-title">Inventory</h1><p className="page-subtitle">{products.length} items total</p></div>
            <button className="btn btn-primary" style={{ display:'flex',alignItems:'center',gap:6 }} onClick={() => setShowReceive(true)}>
              <Plus size={16} /> Receive Product
            </button>
          </div>

          {/* Summary stat cards */}
          <div className="stats-grid" style={{ marginBottom:24 }}>
            {SUMMARY.map(({ Icon, label, count, color, bg }) => (
              <div key={label} className="stat-card">
                <div className="stat-icon" style={{ background:bg }}><Icon size={22} color={color} /></div>
                <div><div className="stat-value">{count}</div><div className="stat-label">{label}</div></div>
              </div>
            ))}
          </div>

          <div className="card"><div className="table-wrap"><table>
            <thead><tr><th>Name</th><th>Category</th><th>Price/day</th><th>Condition</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight:600 }}>{p.name}</td>
                  <td style={{ fontSize:13 }}>{p.category}</td>
                  <td style={{ color:'var(--gold)', fontWeight:700 }}>${p.price}</td>
                  <td><Badge value={p.condition} /></td>
                  <td><Badge value={p.status} /></td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn btn-secondary btn-sm" style={{ display:'flex',alignItems:'center',gap:4 }} onClick={() => setEditProduct(p)}>
                        <CheckCircle size={13} /> Check
                      </button>
                      {p.status !== PRODUCT_STATUS.REPAIR && (
                        <button className="btn btn-warning btn-sm" style={{ display:'flex',alignItems:'center',gap:4 }} onClick={() => markRepair(p.id)}>
                          <Wrench size={13} /> Repair
                        </button>
                      )}
                      {p.status !== PRODUCT_STATUS.WRITE_OFF && (
                        <button className="btn btn-danger btn-sm" style={{ display:'flex',alignItems:'center',gap:4 }} onClick={() => markWriteOff(p.id)}>
                          <Ban size={13} /> Write-off
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div></div>
        </div>
      )}

      {/* ── Returns ── */}
      {page === 'returns' && (
        <div>
          <div className="page-header">
            <h1 className="page-title">Pending Returns</h1>
            <p className="page-subtitle" style={{ marginTop:2 }}>{returnBookings.length} awaiting inspection</p>
          </div>

          {returnBookings.length === 0
            ? <EmptyState icon={RotateCcw} title="No pending returns" subtitle="All returned items have been processed" />
            : <div className="card"><div className="table-wrap"><table>
                <thead><tr><th>Booking ID</th><th>Client</th><th>Items</th><th>Return Date</th><th>Status</th></tr></thead>
                <tbody>
                  {returnBookings.map(b => (
                    <tr key={b.id}>
                      <td style={{ fontFamily:'monospace', fontSize:12 }}>{b.id}</td>
                      <td style={{ fontWeight:600 }}>{getClient(b.clientId)?.name}</td>
                      <td style={{ fontSize:13 }}>{getNames(b.products)}</td>
                      <td style={{ fontSize:13 }}>{b.returnDate||'—'}</td>
                      <td><Badge value={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table></div></div>
          }

          {activeRentals.length > 0 && (
            <div style={{ marginTop:28 }}>
              <h3 style={{ marginBottom:14, fontSize:16, color:'var(--text-secondary)', display:'flex', alignItems:'center', gap:8 }}>
                <Shirt size={16} /> Active Rentals
              </h3>
              <div className="card"><div className="table-wrap"><table>
                <thead><tr><th>Booking ID</th><th>Client</th><th>Items</th><th>End Date</th></tr></thead>
                <tbody>
                  {activeRentals.map(b => (
                    <tr key={b.id}>
                      <td style={{ fontFamily:'monospace', fontSize:12 }}>{b.id}</td>
                      <td>{getClient(b.clientId)?.name}</td>
                      <td style={{ fontSize:13 }}>{getNames(b.products)}</td>
                      <td style={{ fontSize:13 }}>{b.endDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table></div></div>
            </div>
          )}
        </div>
      )}

      {/* ── Products ── */}
      {page === 'products' && (
        <div>
          <div className="page-header">
            <div><h1 className="page-title">Products Management</h1></div>
            <button className="btn btn-primary" style={{ display:'flex',alignItems:'center',gap:6 }} onClick={() => setShowReceive(true)}>
              <Plus size={16} /> Receive Product
            </button>
          </div>
          <div className="card"><div className="table-wrap"><table>
            <thead><tr><th>Name</th><th>Category</th><th>Condition</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight:600 }}>{p.name}</td>
                  <td>{p.category}</td>
                  <td><Badge value={p.condition} /></td>
                  <td><Badge value={p.status} /></td>
                  <td>
                    <button className="btn btn-secondary btn-sm" style={{ display:'flex',alignItems:'center',gap:4 }} onClick={() => setEditProduct(p)}>
                      <Package size={13} /> Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div></div>
        </div>
      )}

      {showReceive && <ReceiveProductModal onClose={() => setShowReceive(false)} />}
      {editProduct  && <UpdateConditionModal product={editProduct} onClose={() => setEditProduct(null)} />}
    </div>
  );
}
