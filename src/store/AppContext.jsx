import { createContext, useContext, useReducer } from 'react';
import {
  initialUsers, initialProducts, initialBookings,
  initialAgreements, initialPayments, initialReviews, initialPenalties,
  BOOKING_STATUS, PRODUCT_STATUS,
} from './data';

const AppContext = createContext(null);

const initialState = {
  currentUser: null,
  users: initialUsers,
  products: initialProducts,
  bookings: initialBookings,
  agreements: initialAgreements,
  payments: initialPayments,
  reviews: initialReviews,
  penalties: initialPenalties,
};

function reducer(state, action) {
  switch (action.type) {
    // ── Auth ──────────────────────────────────────────────────────────────
    case 'LOGIN': {
      const user = state.users.find(
        u => u.email === action.email && u.password === action.password
      );
      if (!user) throw new Error('Invalid credentials');
      return { ...state, currentUser: user };
    }
    case 'LOGOUT':
      return { ...state, currentUser: null };
    case 'REGISTER': {
      const exists = state.users.find(u => u.email === action.payload.email);
      if (exists) throw new Error('Email already registered');
      const newUser = { id: `u${Date.now()}`, ...action.payload };
      return { ...state, users: [...state.users, newUser] };
    }

    // ── Users (Admin) ─────────────────────────────────────────────────────
    case 'ADD_USER': {
      const newUser = { id: `u${Date.now()}`, ...action.payload };
      return { ...state, users: [...state.users, newUser] };
    }
    case 'UPDATE_USER': {
      return {
        ...state,
        users: state.users.map(u => u.id === action.id ? { ...u, ...action.payload } : u),
      };
    }
    case 'DELETE_USER': {
      return { ...state, users: state.users.filter(u => u.id !== action.id) };
    }

    // ── Products ──────────────────────────────────────────────────────────
    case 'ADD_PRODUCT': {
      const newProd = { id: `p${Date.now()}`, reviews: [], ...action.payload };
      return { ...state, products: [...state.products, newProd] };
    }
    case 'UPDATE_PRODUCT': {
      return {
        ...state,
        products: state.products.map(p => p.id === action.id ? { ...p, ...action.payload } : p),
      };
    }
    case 'DELETE_PRODUCT': {
      return { ...state, products: state.products.filter(p => p.id !== action.id) };
    }
    case 'UPDATE_PRODUCT_STATUS': {
      return {
        ...state,
        products: state.products.map(p => p.id === action.id ? { ...p, status: action.status } : p),
      };
    }
    case 'UPDATE_PRODUCT_CONDITION': {
      return {
        ...state,
        products: state.products.map(p => p.id === action.id ? { ...p, condition: action.condition } : p),
      };
    }

    // ── Bookings ──────────────────────────────────────────────────────────
    case 'CREATE_BOOKING': {
      const newBooking = { id: `b${Date.now()}`, penalty: null, ...action.payload };
      // Create agreement
      const newAgreement = {
        id: `ra${Date.now()}`,
        bookingId: newBooking.id,
        managerId: action.payload.managerId,
        managerName: state.users.find(u => u.id === action.payload.managerId)?.name || '',
        createdAt: new Date().toISOString().slice(0, 10),
        closed: false,
      };
      // Mark products as rented
      const products = state.products.map(p =>
        action.payload.products.includes(p.id) ? { ...p, status: PRODUCT_STATUS.RENTED } : p
      );
      return {
        ...state,
        bookings: [...state.bookings, newBooking],
        agreements: [...state.agreements, newAgreement],
        products,
      };
    }
    case 'UPDATE_BOOKING_STATUS': {
      const bookings = state.bookings.map(b =>
        b.id === action.id ? { ...b, status: action.status, ...action.extra } : b
      );
      let products = state.products;
      if (action.status === BOOKING_STATUS.CANCELLED) {
        const booking = state.bookings.find(b => b.id === action.id);
        if (booking) {
          products = state.products.map(p =>
            booking.products.includes(p.id) ? { ...p, status: PRODUCT_STATUS.AVAILABLE } : p
          );
        }
      }
      return { ...state, bookings, products };
    }
    case 'CONFIRM_BOOKING': {
      return {
        ...state,
        bookings: state.bookings.map(b =>
          b.id === action.id ? { ...b, status: BOOKING_STATUS.CONFIRMED } : b
        ),
      };
    }
    case 'CANCEL_BOOKING': {
      const booking = state.bookings.find(b => b.id === action.id);
      const products = booking
        ? state.products.map(p =>
            booking.products.includes(p.id) ? { ...p, status: PRODUCT_STATUS.AVAILABLE } : p
          )
        : state.products;
      return {
        ...state,
        bookings: state.bookings.map(b =>
          b.id === action.id ? { ...b, status: BOOKING_STATUS.CANCELLED } : b
        ),
        products,
      };
    }
    case 'ACTIVATE_BOOKING': {
      return {
        ...state,
        bookings: state.bookings.map(b =>
          b.id === action.id ? { ...b, status: BOOKING_STATUS.ACTIVE, startDate: new Date().toISOString().slice(0, 10) } : b
        ),
      };
    }
    case 'RETURN_BOOKING': {
      return {
        ...state,
        bookings: state.bookings.map(b =>
          b.id === action.id ? { ...b, status: BOOKING_STATUS.RETURN_INSPECTION, returnDate: new Date().toISOString().slice(0, 10) } : b
        ),
      };
    }
    case 'COMPLETE_INSPECTION': {
      // damaged → penalty pending, else completed
      const nextStatus = action.damaged ? BOOKING_STATUS.PENALTY_PENDING : BOOKING_STATUS.COMPLETED;
      const booking = state.bookings.find(b => b.id === action.id);
      const products = booking
        ? state.products.map(p =>
            booking.products.includes(p.id)
              ? { ...p, status: action.damaged ? PRODUCT_STATUS.REPAIR : PRODUCT_STATUS.AVAILABLE }
              : p
          )
        : state.products;
      const penalties = action.damaged
        ? [...state.penalties, { id: `pen${Date.now()}`, bookingId: action.id, amount: action.penaltyAmount, reason: action.reason }]
        : state.penalties;
      return {
        ...state,
        bookings: state.bookings.map(b => b.id === action.id ? { ...b, status: nextStatus } : b),
        products,
        penalties,
      };
    }
    case 'PAY_PENALTY': {
      return {
        ...state,
        bookings: state.bookings.map(b =>
          b.id === action.bookingId ? { ...b, status: BOOKING_STATUS.COMPLETED } : b
        ),
        payments: [...state.payments, { id: `pay${Date.now()}`, agreementId: action.agreementId, amount: action.amount, date: new Date().toISOString().slice(0, 10), method: action.method }],
      };
    }

    // ── Payments ──────────────────────────────────────────────────────────
    case 'ACCEPT_PAYMENT': {
      const payment = { id: `pay${Date.now()}`, ...action.payload };
      return { ...state, payments: [...state.payments, payment] };
    }

    // ── Reviews ───────────────────────────────────────────────────────────
    case 'ADD_REVIEW': {
      const rev = { id: `rev${Date.now()}`, ...action.payload, date: new Date().toISOString().slice(0, 10) };
      return { ...state, reviews: [...state.reviews, rev] };
    }
    case 'DELETE_REVIEW': {
      return { ...state, reviews: state.reviews.filter(r => r.id !== action.id) };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = (email, password) => {
    dispatch({ type: 'LOGIN', email, password });
  };
  const logout = () => dispatch({ type: 'LOGOUT' });

  return (
    <AppContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
