import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Badge, Modal, EmptyState, StarRating } from '../components/ui';
import { BOOKING_STATUS, PRODUCT_STATUS } from '../store/data';
import ProductCatalog from './ProductCatalog';
import { Shirt, Plus, ArrowRight, ArrowLeft, ClipboardList, Clock, Star, CheckCircle } from 'lucide-react';

function BookingModal({ onClose }) {
  const { state, dispatch } = useApp();
  const { currentUser, products, users } = state;
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [step, setStep] = useState(1);

  const available = products.filter(p => p.status === PRODUCT_STATUS.AVAILABLE);
  const manager = users.find(u => u.role === 'manager');

  const toggleProduct = id => setSelectedProducts(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  const calcTotal = () => {
    if (!startDate || !endDate || selectedProducts.length === 0) return 0;
    const days = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000));
    return selectedProducts.reduce((sum, pid) => {
      const p = products.find(p => p.id === pid);
      return sum + (p?.price || 0) * days;
    }, 0);
  };

  const handleBook = () => {
    if (!startDate || !endDate || selectedProducts.length === 0) return;
    dispatch({
      type: 'CREATE_BOOKING',
      payload: {
        clientId: currentUser.id,
        managerId: manager?.id || 'u2',
        bookingDate: new Date().toISOString().slice(0, 10),
        startDate, endDate, returnDate: null,
        products: selectedProducts,
        status: BOOKING_STATUS.NEW,
        totalPrice: calcTotal(),
      },
    });
    onClose();
  };

  return (
    <Modal title="New Booking" onClose={onClose} footer={
      <div style={{ display: 'flex', gap: 8, width: '100%', justifyContent: 'flex-end' }}>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        {step === 1
          ? <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }} disabled={selectedProducts.length === 0} onClick={() => setStep(2)}>Next <ArrowRight size={14} /></button>
          : <><button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => setStep(1)}><ArrowLeft size={14} /> Back</button>
              <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }} disabled={!startDate || !endDate} onClick={handleBook}><CheckCircle size={14} /> Confirm Booking</button></>
        }
      </div>
    }>
      {step === 1 ? (
        <>
          <p style={{ color: 'var(--text-muted)', marginBottom: 14, fontSize: 13 }}>Select items to rent:</p>
          <div style={{ maxHeight: 340, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {available.map(p => (
              <div key={p.id} onClick={() => toggleProduct(p.id)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                borderRadius: 8, cursor: 'pointer',
                border: `1px solid ${selectedProducts.includes(p.id) ? 'var(--accent)' : 'var(--border)'}`,
                background: selectedProducts.includes(p.id) ? 'var(--accent-glow)' : '#f9fafb',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, background: selectedProducts.includes(p.id) ? 'var(--accent)' : '#e5e7eb', borderRadius: 8 }}>
                  <Shirt size={18} color={selectedProducts.includes(p.id) ? '#fff' : '#9ca3af'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: selectedProducts.includes(p.id) ? 'var(--accent)' : 'inherit' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.category}</div>
                </div>
                <div style={{ color: 'var(--gold)', fontWeight: 700 }}>${p.price}/day</div>
                {selectedProducts.includes(p.id) && <span style={{ color: 'var(--accent)', fontWeight: 700 }}>✓</span>}
              </div>
            ))}
            {available.length === 0 && <EmptyState icon={Shirt} title="No items available" subtitle="All items are currently rented" />}
          </div>
        </>
      ) : (
        <>
          <div className="form-row">
            <div className="form-group"><label>Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} />
            </div>
            <div className="form-group"><label>End Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} />
            </div>
          </div>
          <div className="card" style={{ background: '#f9fafb' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>SELECTED ITEMS</div>
            {selectedProducts.map(pid => {
              const p = products.find(x => x.id === pid);
              return <div key={pid} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                <span>{p?.name}</span><span style={{ color: 'var(--gold)', fontWeight: 600 }}>${p?.price}/day</span>
              </div>;
            })}
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16 }}>
              <span>Total</span><span style={{ color: 'var(--gold)' }}>${calcTotal()}</span>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}

export default function ClientDashboard({ page }) {
  const { state } = useApp();
  const { currentUser, bookings, products, reviews } = state;
  const [showBook, setShowBook] = useState(false);

  const myBookings = bookings.filter(b => b.clientId === currentUser.id);
  const myReviews = reviews.filter(r => r.clientId === currentUser.id);
  const getProductName = id => products.find(p => p.id === id)?.name || id;

  return (
    <div className="animate-in">
      {page === 'catalog' && <ProductCatalog allowBook onBook={() => setShowBook(true)} />}

      {page === 'bookings' && (
        <div>
          <div className="page-header">
            <div><h1 className="page-title">My Bookings</h1><p className="page-subtitle">{myBookings.length} total</p></div>
            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => setShowBook(true)}><Plus size={16} /> New Booking</button>
          </div>
          {myBookings.length === 0
            ? <EmptyState icon={ClipboardList} title="No bookings yet" subtitle="Browse the catalog and make your first booking!" />
            : <div className="card"><div className="table-wrap"><table>
                <thead><tr><th>ID</th><th>Items</th><th>Dates</th><th>Total</th><th>Status</th></tr></thead>
                <tbody>
                  {myBookings.map(b => (
                    <tr key={b.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>{b.id}</td>
                      <td>{b.products.map(getProductName).join(', ')}</td>
                      <td style={{ fontSize: 12 }}>{b.startDate} → {b.endDate}</td>
                      <td style={{ color: 'var(--gold)', fontWeight: 700 }}>${b.totalPrice}</td>
                      <td><Badge value={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table></div></div>
          }
        </div>
      )}

      {page === 'history' && (
        <div>
          <div className="page-header"><h1 className="page-title">Order History</h1></div>
          {myBookings.filter(b => [BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED].includes(b.status)).length === 0
            ? <EmptyState icon={Clock} title="No history yet" subtitle="Completed bookings will appear here" />
            : <div className="card"><div className="table-wrap"><table>
                <thead><tr><th>ID</th><th>Items</th><th>Period</th><th>Total</th><th>Status</th></tr></thead>
                <tbody>
                  {myBookings.filter(b => [BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED].includes(b.status)).map(b => (
                    <tr key={b.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{b.id}</td>
                      <td>{b.products.map(getProductName).join(', ')}</td>
                      <td style={{ fontSize: 12 }}>{b.startDate} → {b.endDate}</td>
                      <td style={{ color: 'var(--gold)', fontWeight: 700 }}>${b.totalPrice}</td>
                      <td><Badge value={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table></div></div>
          }
        </div>
      )}

      {page === 'reviews' && (
        <div>
          <div className="page-header"><h1 className="page-title">My Reviews</h1></div>
          {myReviews.length === 0
            ? <EmptyState icon={Star} title="No reviews yet" subtitle="Open a product in the catalog to leave a review" />
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {myReviews.map(r => (
                  <div className="card" key={r.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <strong>{getProductName(r.productId)}</strong>
                      <StarRating rating={r.rating} />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{r.comment}</p>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>{r.date}</div>
                  </div>
                ))}
              </div>
          }
        </div>
      )}

      {showBook && <BookingModal onClose={() => setShowBook(false)} />}
    </div>
  );
}
