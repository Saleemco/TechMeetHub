// public/js/data.js
const API_BASE = '/api';

// Use consistent token key
const TOKEN_KEY = 'techmeethub_token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

function authHeaders() {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  return headers;
}

async function apiGet(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`, { 
    headers: { 'Authorization': 'Bearer ' + getToken() } 
  });
  if (res.status === 401) { setToken(''); throw new Error('SESSION_EXPIRED'); }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function apiPost(endpoint, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (res.status === 401) { setToken(''); throw new Error('SESSION_EXPIRED'); }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function apiPut(endpoint, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (res.status === 401) { setToken(''); throw new Error('SESSION_EXPIRED'); }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function apiDelete(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`, { 
    method: 'DELETE', 
    headers: { 'Authorization': 'Bearer ' + getToken() } 
  });
  if (res.status === 401) { setToken(''); throw new Error('SESSION_EXPIRED'); }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const categories = [
  { id: 'hackathon', label: 'Hackathons', icon: 'zap', color: 'category-hackathon' },
  { id: 'meetup', label: 'Meetups', icon: 'users', color: 'category-meetup' },
  { id: 'workshop', label: 'Workshops', icon: 'wrench', color: 'category-workshop' },
  { id: 'conference', label: 'Conferences', icon: 'mic', color: 'category-conference' },
  { id: 'webinar', label: 'Webinars', icon: 'video', color: 'category-webinar' },
  { id: 'social', label: 'Social', icon: 'heart', color: 'category-social' },
];

export const Auth = {
  async login(email, password) {
    console.log('Auth.login called with:', email);
    try {
      const data = await apiPost('/auth/login', { email, password });
      console.log('Login response:', data);
      if (data.token) {
        setToken(data.token);
        console.log('Token stored:', getToken());
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(name, email, password, role) {
    console.log('Auth.register called with:', { name, email, role });
    try {
      const data = await apiPost('/auth/register', { name, email, password, role });
      console.log('Register response:', data);
      if (data.token) {
        setToken(data.token);
        console.log('Token stored:', getToken());
      }
      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  async logout() {
    try { 
      await apiPost('/auth/logout', {}); 
    } catch (e) {
      console.log('Logout error (ignored):', e);
    }
    setToken('');
    console.log('Logged out, token removed');
  },

  async me() {
    const token = getToken();
    console.log('Auth.me called, token exists:', !!token);
    if (!token) return null;
    try {
      const data = await apiGet('/auth/me');
      console.log('Auth.me response:', data);
      return data.user;
    } catch (error) {
      console.log('Auth.me error:', error.message);
      setToken('');
      return null;
    }
  },

  isLoggedIn() {
    const token = !!getToken();
    console.log('isLoggedIn:', token);
    return token;
  },

  getToken() {
    return getToken();
  },
};

export const Data = {
  async getEvents() {
    const data = await apiGet('/events');
    return data.events || [];
  },

  async getEvent(id) {
    const data = await apiGet(`/events/${id}`);
    return data.event || null;
  },

  async createEvent(event) {
    const data = await apiPost('/events', event);
    return data.event;
  },

  async updateEvent(id, updates) {
    const data = await apiPut(`/events/${id}`, updates);
    return data.event;
  },

  async deleteEvent(id) {
    await apiDelete(`/events/${id}`);
  },

  async rsvpEvent(eventId) {
    return await apiPost(`/events/${eventId}/rsvp`);
  },

  async isAttending(eventId) {
    const data = await apiGet(`/events/${eventId}/rsvp`);
    return data.attending;
  },

  async getUser() {
    const data = await apiGet('/user');
    return data.user;
  },

  async updateUser(updates) {
    const data = await apiPut('/user', updates);
    return data.user;
  },

  async getAttendingEvents() {
    const data = await apiGet('/user/events/attending');
    return data.events || [];
  },

  async getHostingEvents() {
    const data = await apiGet('/user/events/hosting');
    return data.events || [];
  },

  async getEventsByCategory(category) {
    if (!category || category === 'all') return this.getEvents();
    const data = await apiGet(`/events?category=${encodeURIComponent(category)}`);
    return data.events || [];
  },

  async searchEvents(query) {
    const data = await apiGet(`/events?q=${encodeURIComponent(query)}`);
    return data.events || [];
  },

  async getFeaturedEvents() {
    const events = await this.getEvents();
    return events.slice(0, 3);
  },

  async getUpcomingEvents() {
    const events = await this.getEvents();
    const now = new Date().toISOString().split('T')[0];
    return events.filter(e => e.date >= now).sort((a, b) => a.date.localeCompare(b.date));
  },

  async getStats() {
    return await apiGet('/stats');
  },

  async getCategories() {
    const data = await apiGet('/categories');
    return data.categories || categories;
  },

  async resetData() {
    await apiPost('/reset', {});
  },

  // Admin APIs
  async getAdminUsers() {
    const data = await apiGet('/admin/users');
    return data.users || [];
  },

  async getAdminEvents() {
    const data = await apiGet('/admin/events');
    return data.events || [];
  },

  async getAdminStats() {
    return await apiGet('/admin/stats');
  },

  async deleteUser(id) {
    await apiDelete(`/admin/users/${id}`);
  },

  async deleteEventAdmin(id) {
    await apiDelete(`/admin/events/${id}`);
  },
};

export default { Data, Auth, categories };