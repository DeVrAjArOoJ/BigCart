import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from './api.js';
const StoreContext = createContext(null);
export function StoreProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('shopsphere_user')); } catch { return null; } });
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem('shopsphere_cart')) || []; } catch { return []; } });
  const [toast, setToast] = useState('');
  useEffect(() => { localStorage.setItem('shopsphere_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2600); return () => clearTimeout(t); }, [toast]);
  const login = async (path, body) => {
    const data = await api(path, { method: 'POST', body: JSON.stringify(body) });
    localStorage.setItem('shopsphere_token', data.token); localStorage.setItem('shopsphere_user', JSON.stringify(data.user)); setUser(data.user);
    return data.user;
  };
  const logout = () => { localStorage.removeItem('shopsphere_token'); localStorage.removeItem('shopsphere_user'); setUser(null); setToast('You have signed out.'); };
  const addToCart = product => { setCart(old => { const found = old.find(i => i._id === product._id); return found ? old.map(i => i._id === product._id ? { ...i, quantity: Math.min(i.quantity + 1, product.stock) } : i) : [...old, { ...product, quantity: 1 }]; }); setToast('Added to your bag.'); };
  const updateQty = (id, quantity) => setCart(old => quantity < 1 ? old.filter(i => i._id !== id) : old.map(i => i._id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i));
  const value = useMemo(() => ({ user, setUser, cart, setCart, toast, setToast, login, logout, addToCart, updateQty, cartCount: cart.reduce((n, i) => n + i.quantity, 0) }), [user, cart, toast]);
  return <StoreContext.Provider value={value}>{children}{toast && <div className="toast">{toast}</div>}</StoreContext.Provider>;
}
export const useStore = () => useContext(StoreContext);
