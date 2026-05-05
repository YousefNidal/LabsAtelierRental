// ── Seed data matching the class diagram ──────────────────────────────────────

export const ROLES = {
  GUEST: 'guest',
  CLIENT: 'client',
  MANAGER: 'manager',
  ADMINISTRATOR: 'administrator',
  STOREKEEPER: 'storekeeper',
};

export const BOOKING_STATUS = {
  NEW: 'New Booking',
  CONFIRMED: 'Booking Confirmed',
  ACTIVE: 'Rental Active',
  RETURN_INSPECTION: 'Return Inspection',
  PENALTY_PENDING: 'Penalty Pending',
  COMPLETED: 'Booking Completed',
  CANCELLED: 'Booking Cancelled',
  DELETED: 'Booking Deleted',
};

export const PRODUCT_STATUS = {
  AVAILABLE: 'available',
  RENTED: 'rented',
  REPAIR: 'repair',
  WRITE_OFF: 'write-off',
};

export const PRODUCT_CONDITION = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  FAIR: 'fair',
  DAMAGED: 'damaged',
};

// ── Users ─────────────────────────────────────────────────────────────────────
export const initialUsers = [
  { id: 'u1', email: 'admin@atelier.com',      name: 'Alice Admin',      password: 'admin123',   role: ROLES.ADMINISTRATOR, phone: '+1-555-0001' },
  { id: 'u2', email: 'manager@atelier.com',    name: 'Mike Manager',     password: 'manager123', role: ROLES.MANAGER,       phone: '+1-555-0002' },
  { id: 'u3', email: 'store@atelier.com',      name: 'Sam Storekeeper',  password: 'store123',   role: ROLES.STOREKEEPER,   phone: '+1-555-0003' },
  { id: 'u4', email: 'client@atelier.com',     name: 'Clara Client',     password: 'client123',  role: ROLES.CLIENT,        phone: '+1-555-0004', address: '123 Main St' },
  { id: 'u5', email: 'bob@client.com',         name: 'Bob Builder',      password: 'bob123',     role: ROLES.CLIENT,        phone: '+1-555-0005', address: '456 Oak Ave' },
  { id: 'u6', email: 'manager2@atelier.com',   name: 'Laura Manager',    password: 'manager456', role: ROLES.MANAGER,       phone: '+1-555-0006' },
  { id: 'u7', email: 'diana@client.com',       name: 'Diana Prince',     password: 'diana123',   role: ROLES.CLIENT,        phone: '+1-555-0007', address: '789 Elm Rd' },
  { id: 'u8', email: 'ethan@client.com',       name: 'Ethan Hunt',       password: 'ethan123',   role: ROLES.CLIENT,        phone: '+1-555-0008', address: '101 Pine Ave' },
  { id: 'u9', email: 'fiona@client.com',       name: 'Fiona Green',      password: 'fiona123',   role: ROLES.CLIENT,        phone: '+1-555-0009', address: '22 Birch Lane' },
  { id: 'u10', email: 'george@client.com',     name: 'George Stone',     password: 'george123',  role: ROLES.CLIENT,        phone: '+1-555-0010', address: '8 Cedar Blvd' },
];

// ── Products ──────────────────────────────────────────────────────────────────
export const initialProducts = [
  { id: 'p1',  name: 'Evening Gown – Crimson',      category: 'Evening Wear', description: 'Elegant floor-length crimson gown with pearl beading and a sweetheart neckline.', price: 120, status: PRODUCT_STATUS.AVAILABLE, condition: PRODUCT_CONDITION.EXCELLENT, storekeeperid: 'u3', reviews: [] },
  { id: 'p2',  name: 'Tuxedo – Classic Black',       category: 'Formal',       description: 'Sharp black tuxedo with satin lapels, perfect for galas and weddings.', price: 90,  status: PRODUCT_STATUS.AVAILABLE, condition: PRODUCT_CONDITION.GOOD,      storekeeperid: 'u3', reviews: [] },
  { id: 'p3',  name: 'Bridesmaid Dress – Sage',      category: 'Wedding',      description: 'Chiffon sage-green midi bridesmaid dress with ruched bodice.', price: 75,  status: PRODUCT_STATUS.RENTED,    condition: PRODUCT_CONDITION.GOOD,      storekeeperid: 'u3', reviews: [] },
  { id: 'p4',  name: 'Cocktail Dress – Gold',        category: 'Cocktail',     description: 'Fully sequined gold cocktail dress, knee-length with a flare skirt.', price: 95,  status: PRODUCT_STATUS.RENTED,    condition: PRODUCT_CONDITION.EXCELLENT, storekeeperid: 'u3', reviews: [] },
  { id: 'p5',  name: 'Vintage Suit – Navy',          category: 'Vintage',      description: 'Classic 1960s-style navy suit, slim-cut with patch pockets.', price: 80,  status: PRODUCT_STATUS.REPAIR,    condition: PRODUCT_CONDITION.FAIR,      storekeeperid: 'u3', reviews: [] },
  { id: 'p6',  name: 'Ball Gown – Ivory',            category: 'Evening Wear', description: 'Voluminous ivory ball gown with lace overlay and cathedral train.', price: 150, status: PRODUCT_STATUS.AVAILABLE, condition: PRODUCT_CONDITION.EXCELLENT, storekeeperid: 'u3', reviews: [] },
  { id: 'p7',  name: 'Prom Dress – Royal Blue',      category: 'Prom',         description: 'Satin royal blue prom dress with open back and thigh-high slit.', price: 85,  status: PRODUCT_STATUS.AVAILABLE, condition: PRODUCT_CONDITION.GOOD,      storekeeperid: 'u3', reviews: [] },
  { id: 'p8',  name: 'Linen Suit – Beige',           category: 'Casual',       description: 'Lightweight linen suit perfect for summer outdoor events.', price: 60,  status: PRODUCT_STATUS.AVAILABLE, condition: PRODUCT_CONDITION.GOOD,      storekeeperid: 'u3', reviews: [] },
  { id: 'p9',  name: 'Velvet Blazer – Burgundy',     category: 'Formal',       description: 'Rich burgundy velvet blazer with gold button fastenings.', price: 70,  status: PRODUCT_STATUS.AVAILABLE, condition: PRODUCT_CONDITION.EXCELLENT, storekeeperid: 'u3', reviews: [] },
  { id: 'p10', name: 'Floral Sundress – Pastel',     category: 'Casual',       description: 'Breezy pastel floral sundress with adjustable spaghetti straps.', price: 45,  status: PRODUCT_STATUS.AVAILABLE, condition: PRODUCT_CONDITION.GOOD,      storekeeperid: 'u3', reviews: [] },
  { id: 'p11', name: 'Mermaid Gown – Emerald',       category: 'Evening Wear', description: 'Figure-hugging emerald mermaid gown with off-shoulder sleeves.', price: 135, status: PRODUCT_STATUS.AVAILABLE, condition: PRODUCT_CONDITION.EXCELLENT, storekeeperid: 'u3', reviews: [] },
  { id: 'p12', name: 'Wedding Suit – Dove Grey',     category: 'Wedding',      description: 'Tailored dove-grey three-piece wedding suit with ivory waistcoat.', price: 110, status: PRODUCT_STATUS.AVAILABLE, condition: PRODUCT_CONDITION.EXCELLENT, storekeeperid: 'u3', reviews: [] },
  { id: 'p13', name: 'Asymmetric Dress – Coral',     category: 'Cocktail',     description: 'Modern coral asymmetric hemline cocktail dress with halter neck.', price: 88,  status: PRODUCT_STATUS.AVAILABLE, condition: PRODUCT_CONDITION.GOOD,      storekeeperid: 'u3', reviews: [] },
  { id: 'p14', name: 'Retro Prom Set – Mint',        category: 'Prom',         description: '1950s-inspired mint green prom set with A-line skirt and crop top.', price: 78,  status: PRODUCT_STATUS.RENTED,    condition: PRODUCT_CONDITION.GOOD,      storekeeperid: 'u3', reviews: [] },
  { id: 'p15', name: 'Heritage Tweed Jacket',        category: 'Vintage',      description: 'Scottish heritage brown tweed jacket with leather elbow patches.', price: 65,  status: PRODUCT_STATUS.AVAILABLE, condition: PRODUCT_CONDITION.FAIR,      storekeeperid: 'u3', reviews: [] },
  { id: 'p16', name: 'Silk Jumpsuit – Black',        category: 'Evening Wear', description: 'Chic black wide-leg silk jumpsuit with a deep V-neckline.', price: 105, status: PRODUCT_STATUS.AVAILABLE, condition: PRODUCT_CONDITION.EXCELLENT, storekeeperid: 'u3', reviews: [] },
  { id: 'p17', name: 'Morning Coat – Charcoal',      category: 'Formal',       description: 'Traditional charcoal morning coat with striped trousers for formal events.', price: 100, status: PRODUCT_STATUS.WRITE_OFF, condition: PRODUCT_CONDITION.DAMAGED,   storekeeperid: 'u3', reviews: [] },
  { id: 'p18', name: 'Bohemian Maxi – Terracotta',   category: 'Casual',       description: 'Tiered terracotta bohemian maxi dress with embroidered hem.', price: 55,  status: PRODUCT_STATUS.AVAILABLE, condition: PRODUCT_CONDITION.GOOD,      storekeeperid: 'u3', reviews: [] },
];

// ── Bookings ──────────────────────────────────────────────────────────────────
export const initialBookings = [
  {
    id: 'b1', clientId: 'u4', managerId: 'u2', agreementId: 'ra1',
    bookingDate: '2026-03-10', startDate: '2026-03-15', endDate: '2026-03-20', returnDate: '2026-03-20',
    products: ['p3'], status: BOOKING_STATUS.COMPLETED, totalPrice: 375, penalty: null,
  },
  {
    id: 'b2', clientId: 'u5', managerId: 'u2', agreementId: 'ra2',
    bookingDate: '2026-04-18', startDate: '2026-04-25', endDate: '2026-04-28', returnDate: null,
    products: ['p4'], status: BOOKING_STATUS.ACTIVE, totalPrice: 285, penalty: null,
  },
  {
    id: 'b3', clientId: 'u7', managerId: 'u6', agreementId: 'ra3',
    bookingDate: '2026-04-20', startDate: '2026-04-30', endDate: '2026-05-03', returnDate: null,
    products: ['p14'], status: BOOKING_STATUS.ACTIVE, totalPrice: 234, penalty: null,
  },
  {
    id: 'b4', clientId: 'u8', managerId: 'u2', agreementId: 'ra4',
    bookingDate: '2026-04-22', startDate: '2026-05-05', endDate: '2026-05-08', returnDate: null,
    products: ['p1', 'p2'], status: BOOKING_STATUS.CONFIRMED, totalPrice: 630, penalty: null,
  },
  {
    id: 'b5', clientId: 'u9', managerId: 'u6', agreementId: 'ra5',
    bookingDate: '2026-04-28', startDate: '2026-05-10', endDate: '2026-05-12', returnDate: null,
    products: ['p6'], status: BOOKING_STATUS.NEW, totalPrice: 300, penalty: null,
  },
  {
    id: 'b6', clientId: 'u10', managerId: 'u2', agreementId: 'ra6',
    bookingDate: '2026-03-01', startDate: '2026-03-05', endDate: '2026-03-07', returnDate: '2026-03-07',
    products: ['p9'], status: BOOKING_STATUS.CANCELLED, totalPrice: 140, penalty: null,
  },
  {
    id: 'b7', clientId: 'u4', managerId: 'u6', agreementId: 'ra7',
    bookingDate: '2026-04-01', startDate: '2026-04-05', endDate: '2026-04-08', returnDate: '2026-04-09',
    products: ['p7'], status: BOOKING_STATUS.RETURN_INSPECTION, totalPrice: 255, penalty: null,
  },
  {
    id: 'b8', clientId: 'u5', managerId: 'u2', agreementId: 'ra8',
    bookingDate: '2026-02-10', startDate: '2026-02-14', endDate: '2026-02-16', returnDate: '2026-02-17',
    products: ['p2'], status: BOOKING_STATUS.PENALTY_PENDING, totalPrice: 180, penalty: null,
  },
];

// ── Rental Agreements ─────────────────────────────────────────────────────────
export const initialAgreements = [
  { id: 'ra1', bookingId: 'b1', managerId: 'u2', managerName: 'Mike Manager',  createdAt: '2026-03-10', closed: true },
  { id: 'ra2', bookingId: 'b2', managerId: 'u2', managerName: 'Mike Manager',  createdAt: '2026-04-18', closed: false },
  { id: 'ra3', bookingId: 'b3', managerId: 'u6', managerName: 'Laura Manager', createdAt: '2026-04-20', closed: false },
  { id: 'ra4', bookingId: 'b4', managerId: 'u2', managerName: 'Mike Manager',  createdAt: '2026-04-22', closed: false },
  { id: 'ra5', bookingId: 'b5', managerId: 'u6', managerName: 'Laura Manager', createdAt: '2026-04-28', closed: false },
  { id: 'ra6', bookingId: 'b6', managerId: 'u2', managerName: 'Mike Manager',  createdAt: '2026-03-01', closed: true },
  { id: 'ra7', bookingId: 'b7', managerId: 'u6', managerName: 'Laura Manager', createdAt: '2026-04-01', closed: false },
  { id: 'ra8', bookingId: 'b8', managerId: 'u2', managerName: 'Mike Manager',  createdAt: '2026-02-10', closed: false },
];

// ── Payments ──────────────────────────────────────────────────────────────────
export const initialPayments = [
  { id: 'pay1', agreementId: 'ra1', amount: 375, date: '2026-03-10', method: 'Credit Card' },
  { id: 'pay2', agreementId: 'ra2', amount: 285, date: '2026-04-18', method: 'Cash' },
  { id: 'pay3', agreementId: 'ra3', amount: 234, date: '2026-04-20', method: 'Bank Transfer' },
  { id: 'pay4', agreementId: 'ra4', amount: 630, date: '2026-04-22', method: 'Credit Card' },
  { id: 'pay5', agreementId: 'ra7', amount: 255, date: '2026-04-01', method: 'Cash' },
];

// ── Reviews ───────────────────────────────────────────────────────────────────
export const initialReviews = [
  { id: 'rev1',  clientId: 'u4',  productId: 'p3',  comment: 'Absolutely stunning dress! Fit perfectly and turned heads at the wedding.', date: '2026-03-21', rating: 5 },
  { id: 'rev2',  clientId: 'u5',  productId: 'p2',  comment: 'Great tuxedo, very well kept. Would rent again for formal occasions.', date: '2026-03-15', rating: 4 },
  { id: 'rev3',  clientId: 'u7',  productId: 'p6',  comment: 'The ivory ball gown was breathtaking. Very high quality fabric.', date: '2026-04-10', rating: 5 },
  { id: 'rev4',  clientId: 'u8',  productId: 'p1',  comment: 'Crimson gown was beautiful but slightly long for my height. Still loved it!', date: '2026-04-12', rating: 4 },
  { id: 'rev5',  clientId: 'u9',  productId: 'p7',  comment: 'Royal blue prom dress was exactly as described. My daughter loved it!', date: '2026-03-30', rating: 5 },
  { id: 'rev6',  clientId: 'u10', productId: 'p9',  comment: 'Burgundy velvet blazer was very stylish. Excellent condition.', date: '2026-02-20', rating: 4 },
  { id: 'rev7',  clientId: 'u4',  productId: 'p7',  comment: 'Beautiful dress, very comfortable for a long evening event.', date: '2026-04-10', rating: 5 },
  { id: 'rev8',  clientId: 'u5',  productId: 'p4',  comment: 'Gold cocktail dress sparkled perfectly. Very glamorous!', date: '2026-04-29', rating: 5 },
  { id: 'rev9',  clientId: 'u9',  productId: 'p11', comment: 'Emerald mermaid gown fit like a dream. Great quality.', date: '2026-04-15', rating: 5 },
  { id: 'rev10', clientId: 'u10', productId: 'p8',  comment: 'Linen suit was comfortable and looked sharp at the garden party.', date: '2026-03-08', rating: 4 },
];

// ── Penalties ─────────────────────────────────────────────────────────────────
export const initialPenalties = [
  { id: 'pen1', bookingId: 'b8', amount: 150, reason: 'Small tear found on jacket sleeve lining.' },
];
