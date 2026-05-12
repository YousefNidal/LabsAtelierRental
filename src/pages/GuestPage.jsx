import { useState } from 'react';
import { Badge, StarRating } from '../components/ui';
import { useApp } from '../store/AppContext';
import { Search, Shirt, Package, ShieldCheck, Zap, CreditCard } from 'lucide-react';

const CAT_COLOR = {
  'Evening Wear': '#6355e0',
  'Formal':       '#374151',
  'Wedding':      '#db2777',
  'Cocktail':     '#d97706',
  'Vintage':      '#92400e',
  'Prom':         '#7c3aed',
  'Casual':       '#059669',
};

export default function GuestPage({ onLogin }) {
  const { state } = useApp();
  const { products, reviews } = state;
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const categories = ['all', ...new Set(products.map(p => p.category))];
  const filtered = products.filter(p => {
    if (p.status !== 'available') return false;
    if (category !== 'all' && p.category !== category) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const avgRating = pid => {
    const rs = reviews.filter(r => r.productId === pid);
    if (!rs.length) return null;
    return (rs.reduce((s, r) => s + r.rating, 0) / rs.length).toFixed(1);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent) 0%, #4f46e5 100%)',
        padding: '64px 40px', textAlign: 'center', color: '#fff',
      }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
          <Shirt size={64} color="#fff" strokeWidth={1.5} />
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 10 }}>Atelier Rental</h1>
        <p style={{ fontSize: 17, opacity: .85, maxWidth: 480, margin: '0 auto 28px' }}>
          Premium costume &amp; dress rental for every occasion. Browse our curated collection.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <a href="#catalog" style={{ background: '#fff', color: 'var(--accent)', padding: '12px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>
            Browse Catalog
          </a>
          <button onClick={onLogin} style={{ background: 'rgba(255,255,255,.2)', color: '#fff', padding: '12px 28px', borderRadius: 8, fontWeight: 700, border: '2px solid rgba(255,255,255,.4)', cursor: 'pointer', fontSize: 15 }}>
            Sign In
          </button>
        </div>
      </div>

      {/* Features strip */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 40, padding: '28px 40px', background: '#fff', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
        {[
          [Package, 'Wide Selection', '100+ unique pieces'],
          [ShieldCheck, 'Premium Quality', 'Inspected every rental'],
          [Zap, 'Fast Booking', 'Online in minutes'],
          [CreditCard, 'Secure Payment', 'Multiple methods']
        ].map(([Icon, title, sub]) => (
          <div key={title} style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center' }}>
              <Icon size={28} color="var(--accent)" strokeWidth={1.5} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Catalog */}
      <div id="catalog" style={{ padding: '40px' }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6, color: 'var(--text-primary)' }}>Available Items</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
          <button onClick={onLogin} style={{ background:'none', border:'none', color:'var(--accent)', fontWeight:600, cursor:'pointer', fontSize:'inherit', textDecoration:'underline', padding:0 }}>
            Sign in
          </button> to book any item
        </p>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ paddingLeft: 38, width: '100%', height: 40, borderRadius: 8, border: '1px solid var(--border)', background: '#fff' }} />
          </div>
          <div className="tabs" style={{ margin: 0 }}>
            {categories.map(c => (
              <button key={c} className={`tab ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
                {c === 'all' ? 'All' : c}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {filtered.map(p => {
            const avg = avgRating(p.id);
            const color = CAT_COLOR[p.category] || '#6355e0';
            return (
              <div key={p.id} className="product-card">
                <div className="product-img" style={{ background: `linear-gradient(135deg,${color}15,${color}30)` }}>
                  <Shirt size={72} color={color} strokeWidth={1} />
                </div>
                <div className="product-info">
                  <div className="product-name">{p.name}</div>
                  <div className="product-category">{p.category}</div>
                  {avg && (
                    <div style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <StarRating rating={Math.round(avg)} />
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({avg})</span>
                    </div>
                  )}
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>{p.description}</p>
                  <div className="product-footer">
                    <div><div className="product-price">${p.price}</div><div className="product-price-sub">per day</div></div>
                    <Badge value={p.status} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
              <Search size={48} color="#d1d5db" />
            </div>
            <h3>No items found</h3>
            <p>Try different filters</p>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div style={{ background: 'var(--accent)', color: '#fff', padding: '40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Ready to rent?</h2>
        <button onClick={onLogin} style={{ background: '#fff', color: 'var(--accent)', border:'none', padding:'12px 32px', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:15 }}>
          Sign In / Register
        </button>
      </div>
    </div>
  );
}
