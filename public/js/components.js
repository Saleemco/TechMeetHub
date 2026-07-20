// Shared UI Components for TechMeetHub - REDESIGNED

import { Auth, categories } from './data.js';

// SVG Icons
const icons = {
  zap: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
  users: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
  wrench: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>',
  mic: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>',
  video: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>',
  heart: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
  calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
  mapPin: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
  clock: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
  user: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
  search: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
  plus: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
  arrowRight: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
  arrowLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
  x: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
  check: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
  star: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
  menu: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',
  dashboard: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
  home: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
  settings: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
  logout: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>',
  tag: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>',
  hash: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>',
  mail: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
  edit: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
  trash: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
  filter: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>',
  trend: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
  award: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>',
  link: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>',
  share: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>',
  globe: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
  briefcase: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
  shield: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
  sun: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
  moon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
  chevronRight: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>',
};

export function getIcon(name, size = 16) {
  const svg = icons[name] || icons.info;
  return svg.replace(/width="16" height="16"/g, `width="${size}" height="${size}"`);
}

// ===== DATE AND TIME FORMATTING =====
export function formatDate(dateStr) {
  if (!dateStr) return 'Date TBD';
  try {
    let date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      date = new Date(dateStr + 'T00:00:00');
    }
    if (isNaN(date.getTime())) {
      return 'Date TBD';
    }
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  } catch (e) {
    return 'Date TBD';
  }
}

export function formatFullDate(dateStr) {
  if (!dateStr) return 'Date TBD';
  try {
    let date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      date = new Date(dateStr + 'T00:00:00');
    }
    if (isNaN(date.getTime())) {
      return 'Date TBD';
    }
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  } catch (e) {
    return 'Date TBD';
  }
}

export function formatTime(timeStr) {
  if (!timeStr) return 'TBD';
  try {
    if (timeStr.includes(':')) {
      const parts = timeStr.split(':');
      const hours = parseInt(parts[0], 10);
      const minutes = parts[1] || '00';
      if (isNaN(hours)) return timeStr;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const h12 = hours % 12 || 12;
      return `${h12}:${minutes} ${ampm}`;
    }
    return timeStr;
  } catch (e) {
    return timeStr || 'TBD';
  }
}

export function getCategoryLabel(catId) {
  const cat = categories.find(c => c.id === catId);
  return cat ? cat.label : catId;
}

export function getCategoryIcon(catId, size = 16) {
  const cat = categories.find(c => c.id === catId);
  return cat ? getIcon(cat.icon, size) : getIcon('zap', size);
}

// ========== HEADER WITH SIDEBAR ==========
export function Header(user = null) {
  const isLoggedIn = !!user;
  const role = user?.role || '';
  const isAdmin = role === 'admin';
  const isOrganizer = role === 'organizer';
  const isParticipant = role === 'participant';

  // Sidebar navigation items based on role
  let navItems = [];
  
  if (isAdmin) {
    navItems = [
      { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
      { href: '/events', label: 'Events', icon: 'calendar' },
      { href: '/profile', label: 'Profile', icon: 'user' },
    ];
  } else if (isOrganizer) {
    navItems = [
      { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
      { href: '/events', label: 'My Events', icon: 'calendar' },
      { href: '/create', label: 'Create Event', icon: 'plus' },
      { href: '/profile', label: 'Profile', icon: 'user' },
    ];
  } else if (isParticipant) {
    navItems = [
      { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
      { href: '/events', label: 'Browse Events', icon: 'calendar' },
      { href: '/profile', label: 'Profile', icon: 'user' },
    ];
  } else {
    navItems = [
      { href: '/', label: 'Home', icon: 'home' },
      { href: '/events', label: 'Events', icon: 'calendar' },
    ];
  }

  const userAvatar = user?.avatar || '?';
  const userName = user?.name || 'Guest';
  const userInitials = user?.avatar || '?';
  const userRoleLabel = role.charAt(0).toUpperCase() + role.slice(1) || 'Guest';

  return `
    <!-- Top Navigation Bar -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f] border-b border-white/5 h-16">
      <div class="flex items-center justify-between h-full px-4 lg:px-6">
        <div class="flex items-center gap-3">
          <button onclick="window.toggleSidebar()" class="lg:hidden text-gray-400 hover:text-white transition-colors">
            ${getIcon('menu', 22)}
          </button>
          <a href="/" data-navigate class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span class="text-white font-bold text-sm">TM</span>
            </div>
            <span class="text-lg font-bold text-white hidden sm:block">TechMeetHub</span>
          </a>
        </div>
        <div class="flex items-center gap-3">
          ${isLoggedIn ? `
            <div class="flex items-center gap-3">
              <button onclick="window.toggleTheme()" class="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                ${getIcon('sun', 18)}
              </button>
              <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                <div class="w-7 h-7 rounded-full ${user?.initialsColor || 'bg-gradient-to-br from-purple-500 to-pink-500'} avatar-initials text-xs">${userInitials}</div>
                <span class="text-sm text-gray-300 hidden sm:inline">${userName}</span>
              </div>
              <button onclick="window.logout()" class="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Logout">
                ${getIcon('logout', 18)}
              </button>
            </div>
          ` : `
            <div class="flex items-center gap-2">
              <button onclick="window.toggleTheme()" class="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                ${getIcon('sun', 18)}
              </button>
              <a href="/login" data-navigate class="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors">Sign In</a>
              <a href="/register" data-navigate class="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity">Get Started</a>
            </div>
          `}
        </div>
      </div>
    </nav>

    <!-- Sidebar -->
    <aside id="sidebar" class="fixed top-16 left-0 bottom-0 z-40 w-64 bg-[#0a0a0f] border-r border-white/5 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 overflow-y-auto">
      <div class="p-4">
        ${isLoggedIn ? `
          <div class="mb-6 p-3 rounded-xl bg-white/5 border border-white/5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full ${user?.initialsColor || 'bg-gradient-to-br from-purple-500 to-pink-500'} avatar-initials text-sm">${userInitials}</div>
              <div>
                <div class="text-sm font-medium text-white">${userName}</div>
                <div class="text-xs text-gray-400">${userRoleLabel}</div>
              </div>
            </div>
          </div>
        ` : ''}
        <div class="space-y-1">
          ${navItems.map(item => `
            <a href="${item.href}" data-navigate class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors" data-route="${item.href}">
              ${getIcon(item.icon, 18)}
              <span class="text-sm font-medium">${item.label}</span>
            </a>
          `).join('')}
          ${isLoggedIn ? `
            <button onclick="window.logout()" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors mt-4">
              ${getIcon('logout', 18)}
              <span class="text-sm font-medium">Logout</span>
            </button>
          ` : ''}
        </div>
      </div>
    </aside>

    <!-- Sidebar Overlay (mobile) -->
    <div id="sidebar-overlay" class="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm hidden lg:hidden" onclick="window.closeSidebar()"></div>

    <style>
      .sidebar-link.active {
        color: #a78bfa;
        background: rgba(167, 139, 250, 0.08);
        border: 1px solid rgba(167, 139, 250, 0.15);
      }
      .sidebar-link.active svg {
        color: #a78bfa;
      }
      .sidebar-link {
        border: 1px solid transparent;
      }
    </style>
  `;
}

// ===== SIDEBAR TOGGLE FUNCTIONS =====
window.toggleSidebar = function() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) {
    sidebar.classList.toggle('-translate-x-full');
    if (overlay) {
      overlay.classList.toggle('hidden');
    }
  }
};

window.closeSidebar = function() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
    sidebar.classList.add('-translate-x-full');
    if (overlay) {
      overlay.classList.add('hidden');
    }
  }
};

// ========== FOOTER ==========
export function Footer() {
  return `
    <footer class="bg-[#0a0a0f] border-t border-white/5 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span class="text-white font-bold text-[10px]">TM</span>
            </div>
            <span class="text-sm text-gray-400">TechMeetHub</span>
          </div>
          <p class="text-xs text-gray-500">Built for the tech community.</p>
          <div class="flex items-center gap-4">
            <span class="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer text-sm">About</span>
            <span class="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer text-sm">Guidelines</span>
            <span class="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer text-sm">Support</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// ========== TOAST ==========
export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const colors = {
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
    info: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
  };

  toast.className = `px-4 py-3 rounded-lg border glass toast ${colors[type] || colors.success} max-w-md`;
  toast.innerHTML = `
    <div class="flex items-center gap-2">
      ${type === 'success' ? getIcon('check', 16) : type === 'error' ? getIcon('alert', 16) : getIcon('info', 16)}
      <span class="text-sm font-medium">${message}</span>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ========== STAT CARD ==========
export function StatCard({ icon, value, label, color = 'purple', change }) {
  const colorMap = {
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  const colorClass = colorMap[color] || colorMap.purple;

  return `
    <div class="stat-card glass rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all hover:shadow-lg">
      <div class="flex items-center justify-between mb-3">
        <div class="w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center border">
          ${getIcon(icon, 18)}
        </div>
        ${change ? `<span class="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">${change}</span>` : ''}
      </div>
      <div class="text-2xl font-bold text-white">${value}</div>
      <div class="text-sm text-gray-400 mt-0.5">${label}</div>
    </div>
  `;
}

// ========== SECTION TITLE ==========
export function SectionTitle({ title, subtitle, action }) {
  return `
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-semibold text-white">${title}</h2>
        ${subtitle ? `<p class="text-sm text-gray-400 mt-0.5">${subtitle}</p>` : ''}
      </div>
      ${action ? `<a href="${action.href}" data-navigate class="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">${action.label} ${getIcon('arrowRight', 14)}</a>` : ''}
    </div>
  `;
}

// ========== EMPTY STATE ==========
export function EmptyState({ icon, title, message, action }) {
  return `
    <div class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
        ${getIcon(icon, 28)}
      </div>
      <h3 class="text-lg font-medium text-white mb-2">${title}</h3>
      <p class="text-gray-400 text-sm max-w-sm mb-6">${message}</p>
      ${action ? `<a href="${action.href}" data-navigate class="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity">${action.label}</a>` : ''}
    </div>
  `;
}

// ========== INPUT ==========
export function Input({ label, name, type = 'text', placeholder, value = '', required = false, rows, maxLength, min, max }) {
  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors";

  if (type === 'textarea') {
    return `
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-300 mb-1.5">${label}${required ? ' <span class="text-red-400">*</span>' : ''}</label>
        <textarea name="${name}" placeholder="${placeholder || ''}" ${required ? 'required' : ''} rows="${rows || 4}" maxlength="${maxLength || ''}" class="${inputClass} resize-none">${value}</textarea>
      </div>
    `;
  }

  return `
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-300 mb-1.5">${label}${required ? ' <span class="text-red-400">*</span>' : ''}</label>
      <input type="${type}" name="${name}" placeholder="${placeholder || ''}" value="${value}" ${required ? 'required' : ''} ${min ? `min="${min}"` : ''} ${max ? `max="${max}"` : ''} class="${inputClass}" />
    </div>
  `;
}

// ========== BUTTON ==========
export function Button({ label, type = 'button', variant = 'primary', icon, fullWidth = false, onclick, disabled = false }) {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90',
    secondary: 'bg-white/5 text-white hover:bg-white/10 border border-white/10',
    danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30',
    outline: 'bg-transparent border border-white/10 text-gray-300 hover:bg-white/5',
  };

  return `
    <button type="${type}" ${onclick ? `onclick="${onclick}"` : ''} ${disabled ? 'disabled' : ''} class="px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${variants[variant] || variants.primary} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} flex items-center justify-center gap-2">
      ${icon ? `${icon}` : ''} ${label}
    </button>
  `;
}

// ========== EVENT CARD ==========
export async function EventCard(event, index = 0, user = null) {
  const userId = user?.id || '';
  const userRole = user?.role || '';
  
  const organizer = event.organizer || {
    id: event.organizer_id || '',
    name: event.organizer_name || 'Unknown Organizer',
    avatar: event.organizer_avatar || '?',
    initialsColor: event.organizer_initials_color || 'bg-gradient-to-br from-purple-500 to-pink-500'
  };
  
  const isAttending = userId ? (event.attendees?.includes(userId) || false) : false;
  const spotsLeft = (event.capacity || 0) - (event.attendees?.length || 0);
  const isFull = spotsLeft <= 0;
  const date = formatDate(event.date);
  const time = formatTime(event.time);

  let actionButton = '';
  if (!user) {
    actionButton = '';
  } else if (userRole === 'participant' || userRole === 'organizer' || userRole === 'admin') {
    actionButton = `
      <button 
        onclick="window.handleRsvp('${event.id}')" 
        class="px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${isAttending ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'}"
        ${isFull && !isAttending ? 'disabled' : ''}
      >
        ${isAttending ? 'Registered' : isFull ? 'Full' : 'Register'}
      </button>
    `;
  }

  return `
    <div class="glass rounded-xl overflow-hidden border border-white/5 hover:border-white/10 transition-all hover:shadow-lg">
      <div class="h-40 relative">
        <img src="${event.image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop'}" alt="${event.title}" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent"></div>
        <div class="absolute top-3 right-3">
          <span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium ${isFull ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}">
            ${isFull ? 'Full' : `${spotsLeft} spots`}
          </span>
        </div>
        <div class="absolute bottom-3 left-3">
          <span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 backdrop-blur text-white/90 border border-white/10">
            ${getCategoryLabel(event.category)}
          </span>
        </div>
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-lg text-white leading-tight mb-2 hover:text-purple-400 transition-colors cursor-pointer" onclick="window.navigateTo('/events/${event.id}')">${event.title}</h3>
        <div class="flex items-center gap-3 text-sm text-gray-400 mb-2">
          <span class="flex items-center gap-1">${getIcon('calendar', 12)} ${date}</span>
          <span class="flex items-center gap-1">${getIcon('clock', 12)} ${time}</span>
        </div>
        <div class="flex items-center gap-1 text-sm text-gray-400 mb-3">
          ${getIcon('mapPin', 12)}
          <span class="truncate">${event.location}</span>
        </div>
        <div class="flex items-center justify-between pt-3 border-t border-white/5">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full ${organizer.initialsColor} avatar-initials text-[10px]">${organizer.avatar}</div>
            <span class="text-xs text-gray-400">${organizer.name}</span>
          </div>
          ${actionButton}
        </div>
      </div>
    </div>
  `;
}

// ========== EVENT LIST ITEM ==========
export function EventListItem(event, isAttending = false) {
  const date = formatDate(event.date);
  return `
    <div class="flex items-center gap-4 p-4 glass rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer" onclick="window.navigateTo('/events/${event.id}')">
      <img src="${event.image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&h=200&fit=crop'}" alt="" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
      <div class="flex-1 min-w-0">
        <h4 class="font-medium text-white truncate">${event.title}</h4>
        <div class="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
          <span class="flex items-center gap-1">${getIcon('calendar', 10)} ${date}</span>
          <span class="flex items-center gap-1">${getIcon('mapPin', 10)} ${event.location}</span>
        </div>
      </div>
      <span class="px-2 py-1 rounded-full text-xs font-medium ${isAttending ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}">
        ${isAttending ? 'Attending' : getCategoryLabel(event.category)}
      </span>
    </div>
  `;
}

export { icons };