import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Badge, Modal, EmptyState } from '../components/ui';
import { CheckCircle, XCircle, AlertTriangle, PlayCircle, RotateCcw, Search, ClipboardList } from 'lucide-react';
import { BOOKING_STATUS } from '../store/data';

function InspectionModal({ booking, onClose }) {
  const { dispatch } = useApp();
  const [damaged, setDamaged] = useState(false);
  const [reason, setReason] = useState('');
  const [penaltyAmount, setPenaltyAmount] = useState(0);
  const submit = () => {
    dispatch({ type:'COMPLETE_INSPECTION', id:booking.id, damaged, reason, penaltyAmount:Number(penaltyAmount) });
    onClose();
  };
  return (
    <Modal title="Return Inspection" onClose={onClose} footer={
      <><button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={submit}>Submit Inspection</button></>
    }>
      <p style={{ color:'var(--text-muted)', marginBottom:16, fontSize:13 }}>Booking: <strong>{booking.id}</strong></p>
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <button className={`btn ${!damaged?'btn-success':'btn-secondary'}`} style={{ display:'flex', alignItems:'center', gap:6 }} onClick={() => setDamaged(false)}>
          <CheckCircle size={16} /> All Good
        </button>
        <button className={`btn ${damaged?'btn-danger':'btn-secondary'}`} style={{ display:'flex', alignItems:'center', gap:6 }} onClick={() => setDamaged(true)}>
          <AlertTriangle size={16} /> Damaged / Missing
        </button>
      </div>
      {damaged && (
        <>
          <div className="form-group"><label>Damage Description</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Describe the damage..." />
          </div>
          <div className="form-group"><label>Penalty Amount ($)</label>
            <input type="number" min="0" value={penaltyAmount} onChange={e => setPenaltyAmount(e.target.value)} />
          </div>
        </>
      )}
    </Modal>
  );
}

function PenaltyModal({ booking, onClose }) {
  const { state, dispatch } = useApp();
  const [method, setMethod] = useState('Credit Card');
  const penalty = state.penalties.find(p => p.bookingId === booking.id);
  const agreement = state.agreements.find(a => a.bookingId === booking.id);
  const pay = () => {
    dispatch({ type:'PAY_PENALTY', bookingId:booking.id, agreementId:agreement?.id, amount:penalty?.amount||0, method });
    onClose();
  };
  return (
    <Modal title="Accept Penalty Payment" onClose={onClose} footer={
      <><button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={pay}>Accept Payment</button></>
    }>
      <div style={{ background:'#fff5f5', border:'1px solid #fed7d7', borderRadius:10, padding:16, marginBottom:16 }}>
        <div style={{ fontSize:13, color:'var(--text-muted)', marginBottom:4 }}>Penalty Amount</div>
        <div style={{ fontSize:32, fontWeight:800, color:'var(--danger)' }}>${penalty?.amount||0}</div>
        <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>{penalty?.reason}</div>
      </div>
      <div className="form-group"><label>Payment Method</label>
        <select value={method} onChange={e => setMethod(e.target.value)}>
          <option>Credit Card</option><option>Cash</option><option>Bank Transfer</option>
        </select>
      </div>
    </Modal>
  );
}

export default function ManagerDashboard({ page }) {
  const { state, dispatch } = useApp();
  const { bookings, users, products, agreements } = state;
  const [inspecting, setInspecting] = useState(null);
  const [penalizing, setPenalizing] = useState(null);
  const getUser = id => users.find(u => u.id === id);
  const getProductNames = ids => ids.map(id => products.find(p=>p.id===id)?.name||id).join(', ');
  const clients = users.filter(u => u.role === 'client');

  return (
    <div className="animate-in">

      {page === 'bookings' && (
        <div>
          <div className="page-header">
            <div><h1 className="page-title">Bookings Management</h1><p className="page-subtitle">{bookings.length} total bookings</p></div>
          </div>
          {bookings.length === 0
            ? <EmptyState icon={ClipboardList} title="No bookings" subtitle="" />
            : <div className="card"><div className="table-wrap"><table>
                <thead><tr><th>ID</th><th>Client</th><th>Items</th><th>Dates</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td style={{ fontFamily:'monospace', fontSize:12, color:'var(--text-muted)' }}>{b.id}</td>
                      <td style={{ fontWeight:600 }}>{getUser(b.clientId)?.name||b.clientId}</td>
                      <td style={{ fontSize:12 }}>{getProductNames(b.products)}</td>
                      <td style={{ fontSize:12 }}>{b.startDate} → {b.endDate}</td>
                      <td style={{ color:'var(--gold)', fontWeight:700 }}>${b.totalPrice}</td>
                      <td><Badge value={b.status} /></td>
                      <td>
                        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                          {b.status===BOOKING_STATUS.NEW && <>
                            <button className="btn btn-success btn-sm" style={{ display:'flex',alignItems:'center',gap:4 }} onClick={()=>dispatch({type:'CONFIRM_BOOKING',id:b.id})}><CheckCircle size={13}/>Confirm</button>
                            <button className="btn btn-danger btn-sm"  style={{ display:'flex',alignItems:'center',gap:4 }} onClick={()=>dispatch({type:'CANCEL_BOOKING',id:b.id})}><XCircle size={13}/>Cancel</button>
                          </>}
                          {b.status===BOOKING_STATUS.CONFIRMED && <>
                            <button className="btn btn-primary btn-sm" style={{ display:'flex',alignItems:'center',gap:4 }} onClick={()=>dispatch({type:'ACTIVATE_BOOKING',id:b.id})}><PlayCircle size={13}/>Activate</button>
                            <button className="btn btn-danger btn-sm"  style={{ display:'flex',alignItems:'center',gap:4 }} onClick={()=>dispatch({type:'CANCEL_BOOKING',id:b.id})}><XCircle size={13}/>Cancel</button>
                          </>}
                          {b.status===BOOKING_STATUS.ACTIVE &&
                            <button className="btn btn-warning btn-sm" style={{ display:'flex',alignItems:'center',gap:4 }} onClick={()=>dispatch({type:'RETURN_BOOKING',id:b.id})}><RotateCcw size={13}/>Return</button>}
                          {b.status===BOOKING_STATUS.RETURN_INSPECTION &&
                            <button className="btn btn-primary btn-sm" style={{ display:'flex',alignItems:'center',gap:4 }} onClick={()=>setInspecting(b)}><Search size={13}/>Inspect</button>}
                          {b.status===BOOKING_STATUS.PENALTY_PENDING &&
                            <button className="btn btn-danger btn-sm" style={{ display:'flex',alignItems:'center',gap:4 }} onClick={()=>setPenalizing(b)}><AlertTriangle size={13}/>Penalty</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table></div></div>
          }
        </div>
      )}

      {page === 'agreements' && (
        <div>
          <div className="page-header"><h1 className="page-title">Rental Agreements</h1><p className="page-subtitle">{agreements.length} agreements</p></div>
          <div className="card"><div className="table-wrap"><table>
            <thead><tr><th>Agreement ID</th><th>Booking ID</th><th>Manager</th><th>Created</th><th>Status</th></tr></thead>
            <tbody>
              {agreements.map(a => {
                const booking = bookings.find(b=>b.id===a.bookingId);
                return (
                  <tr key={a.id}>
                    <td style={{ fontFamily:'monospace',fontSize:12 }}>{a.id}</td>
                    <td style={{ fontFamily:'monospace',fontSize:12 }}>{a.bookingId}</td>
                    <td style={{ fontWeight:600 }}>{a.managerName}</td>
                    <td style={{ fontSize:12 }}>{a.createdAt}</td>
                    <td><Badge value={booking?.status||'unknown'} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table></div></div>
        </div>
      )}

      {page === 'clients' && (
        <div>
          <div className="page-header"><h1 className="page-title">Clients</h1><p className="page-subtitle">{clients.length} registered clients</p></div>
          <div className="card"><div className="table-wrap"><table>
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Bookings</th></tr></thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight:600 }}>{c.name}</td>
                  <td style={{ fontSize:13 }}>{c.email}</td>
                  <td style={{ fontSize:13 }}>{c.phone}</td>
                  <td style={{ fontSize:13 }}>{c.address||'—'}</td>
                  <td><span className="badge badge-blue">{bookings.filter(b=>b.clientId===c.id).length}</span></td>
                </tr>
              ))}
            </tbody>
          </table></div></div>
        </div>
      )}

      {page === 'products' && (
        <div>
          <div className="page-header"><h1 className="page-title">Products Overview</h1></div>
          <div className="card"><div className="table-wrap"><table>
            <thead><tr><th>Name</th><th>Category</th><th>Price/day</th><th>Condition</th><th>Status</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight:600 }}>{p.name}</td>
                  <td style={{ fontSize:13 }}>{p.category}</td>
                  <td style={{ color:'var(--gold)',fontWeight:700 }}>${p.price}</td>
                  <td><Badge value={p.condition} /></td>
                  <td><Badge value={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table></div></div>
        </div>
      )}

      {inspecting && <InspectionModal booking={inspecting} onClose={() => setInspecting(null)} />}
      {penalizing && <PenaltyModal booking={penalizing} onClose={() => setPenalizing(null)} />}
    </div>
  );
}
