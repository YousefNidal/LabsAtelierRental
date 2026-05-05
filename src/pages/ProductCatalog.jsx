import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Badge, StarRating, Modal, EmptyState } from '../components/ui';
import { Search, SlidersHorizontal, ShoppingCart, Shirt } from 'lucide-react';
import { PRODUCT_STATUS, ROLES } from '../store/data';

// Category icon map using simple SVG-like colored shapes via Lucide
const CAT_COLOR = {
  'Evening Wear': '#6355e0',
  'Formal':       '#374151',
  'Wedding':      '#db2777',
  'Cocktail':     '#d97706',
  'Vintage':      '#92400e',
  'Prom':         '#7c3aed',
  'Casual':       '#059669',
};

function ProductDetailModal({ product, onClose, reviews, currentUser, dispatch }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const productReviews = reviews.filter(r => r.productId === product.id);
  const color = CAT_COLOR[product.category] || '#6355e0';

  const submitReview = () => {
    if (!comment.trim()) return;
    dispatch({ type:'ADD_REVIEW', payload:{ clientId:currentUser.id, productId:product.id, comment, rating } });
    setComment(''); setRating(5);
  };

  return (
    <Modal title={product.name} onClose={onClose}>
      {/* Hero */}
      <div style={{ height:140, background:`linear-gradient(135deg, ${color}22, ${color}44)`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
        <Shirt size={72} color={color} strokeWidth={1} />
      </div>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
        <Badge value={product.status} /><Badge value={product.condition} />
        <span className="badge badge-gray">{product.category}</span>
      </div>
      <p style={{ color:'var(--text-secondary)', marginBottom:12, fontSize:14, lineHeight:1.6 }}>{product.description}</p>
      <div style={{ fontSize:28, fontWeight:800, color:'var(--gold)', marginBottom:16 }}>
        ${product.price}<span style={{ fontSize:13, color:'var(--text-muted)', fontWeight:400 }}>/day</span>
      </div>

      <div className="divider" />
      <h4 style={{ marginBottom:12 }}>Reviews ({productReviews.length})</h4>
      {productReviews.length === 0 && <p style={{ color:'var(--text-muted)', fontSize:13 }}>No reviews yet.</p>}
      {productReviews.map(r => (
        <div key={r.id} className="card card-sm" style={{ marginBottom:8 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <StarRating rating={r.rating} />
            <span style={{ fontSize:11, color:'var(--text-muted)' }}>{r.date}</span>
          </div>
          <p style={{ fontSize:13, marginTop:6, color:'var(--text-secondary)' }}>{r.comment}</p>
        </div>
      ))}
      {currentUser?.role === ROLES.CLIENT && (
        <>
          <div className="divider" />
          <h4 style={{ marginBottom:10 }}>Add Your Review</h4>
          <div style={{ display:'flex', gap:6, marginBottom:10 }}>
            {[1,2,3,4,5].map(s => (
              <button key={s} onClick={() => setRating(s)} style={{ background:'none', border:'none', cursor:'pointer', padding:2 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill={s<=rating?'#d97706':'none'} stroke={s<=rating?'#d97706':'#d1d5db'} strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </button>
            ))}
          </div>
          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Write your review..." style={{ marginBottom:10 }} />
          <button className="btn btn-primary btn-sm" onClick={submitReview}>Submit Review</button>
        </>
      )}
    </Modal>
  );
}

export default function ProductCatalog({ allowBook = false, onBook }) {
  const { state, dispatch } = useApp();
  const { products, reviews, currentUser } = state;
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const categories = ['all', ...new Set(products.map(p => p.category))];
  const filtered = products.filter(p => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const avgRating = pid => {
    const rs = reviews.filter(r => r.productId === pid);
    return rs.length ? (rs.reduce((s,r)=>s+r.rating,0)/rs.length) : null;
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div><h1 className="page-title">Product Catalog</h1><p className="page-subtitle">{filtered.length} items</p></div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <Search size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }} />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." style={{ paddingLeft:38 }} />
        </div>
        <div style={{ display:'flex', gap:4, alignItems:'center' }}>
          <SlidersHorizontal size={15} color="#9ca3af" />
          <div className="tabs" style={{ margin:0 }}>
            {categories.map(c => (
              <button key={c} className={`tab ${categoryFilter===c?'active':''}`} onClick={()=>setCategoryFilter(c)}>
                {c==='all'?'All':c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 && <EmptyState icon={Search} title="No products found" subtitle="Try adjusting your filters" />}

      <div className="product-grid">
        {filtered.map(p => {
          const color = CAT_COLOR[p.category] || '#6355e0';
          const avg = avgRating(p.id);
          return (
            <div key={p.id} className="product-card" onClick={() => setSelected(p)}>
              <div className="product-img" style={{ background:`linear-gradient(135deg,${color}15,${color}30)` }}>
                <Shirt size={72} color={color} strokeWidth={1} />
              </div>
              <div className="product-info">
                <div className="product-name">{p.name}</div>
                <div className="product-category">{p.category}</div>
                {avg !== null && (
                  <div style={{ marginBottom:6, display:'flex', alignItems:'center', gap:6 }}>
                    <StarRating rating={Math.round(avg)} />
                    <span style={{ fontSize:11, color:'var(--text-muted)' }}>({Number(avg).toFixed(1)})</span>
                  </div>
                )}
                <div style={{ display:'flex', gap:6, marginBottom:8 }}>
                  <Badge value={p.status} /><Badge value={p.condition} />
                </div>
                <div className="product-footer">
                  <div>
                    <div className="product-price">${p.price}</div>
                    <div className="product-price-sub">per day</div>
                  </div>
                  {allowBook && p.status===PRODUCT_STATUS.AVAILABLE && (
                    <button className="btn btn-primary btn-sm" style={{ display:'flex',alignItems:'center',gap:5 }}
                      onClick={e => { e.stopPropagation(); onBook?.(p); }}>
                      <ShoppingCart size={13} /> Book
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <ProductDetailModal
          product={selected} onClose={() => setSelected(null)}
          reviews={reviews} currentUser={currentUser} dispatch={dispatch}
        />
      )}
    </div>
  );
}
