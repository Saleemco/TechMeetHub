// public/js/app.js
// Force light theme
document.documentElement.setAttribute('data-theme', 'light');
document.documentElement.classList.remove('dark');
localStorage.setItem('techmeethub-theme', 'light');

import { Router } from './router.js';
import { showToast } from './components.js';
import { Auth, Data } from './data.js';

// Global functions
window.navigateTo = (path) => {
  router.navigateTo(path);
  closeSidebar();
};

window.toggleMobileMenu = () => {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('open');
};

window.toggleSidebar = () => {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const main = document.getElementById('main');
  if (sidebar) {
    sidebar.classList.toggle('-translate-x-full');
    if (overlay) {
      overlay.classList.toggle('hidden');
    }
    // Toggle the sidebar-visible class on main
    if (main) {
      main.classList.toggle('sidebar-visible');
    }
  }
};

window.closeSidebar = () => {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const main = document.getElementById('main');
  if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
    sidebar.classList.add('-translate-x-full');
    if (overlay) {
      overlay.classList.add('hidden');
    }
    if (main) {
      main.classList.remove('sidebar-visible');
    }
  }
};

window.logout = async () => {
  await Auth.logout();
  showToast('Logged out successfully', 'info');
  router.navigateTo('/');
  closeSidebar();
};

window.toggleTheme = () => {
  showToast('Theme switching is disabled in light mode', 'info');
};

// Scroll to a section on the homepage (used by the Events / About navbar links).
// If we're not already on the homepage, navigate there first, then scroll
// once the new content has rendered.
window.scrollToHomeSection = (sectionId) => {
  const mobileNav = document.getElementById('mobile-nav');
  if (mobileNav) mobileNav.classList.add('hidden');

  const scrollNow = () => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const isHome = window.location.pathname === '/' || window.location.pathname === '/home';
  if (isHome) {
    scrollNow();
  } else {
    router.navigateTo('/');
    setTimeout(scrollNow, 150);
  }
};

let isRsvpProcessing = false;

window.handleRsvp = async (eventId) => {
  if (isRsvpProcessing) return;
  isRsvpProcessing = true;
  try {
    const result = await Data.rsvpEvent(eventId);
    showToast(result.attending ? "You're registered! See you there." : 'Registration cancelled.', 'success');
    try {
      await router.render(router.currentRoute);
    } catch (renderErr) {
      window.location.reload();
    }
  } catch (err) {
    if (err.message === 'SESSION_EXPIRED') {
      showToast('Please login to register', 'error');
      router.navigateTo('/login');
    } else if (err.message && err.message.includes('full')) {
      showToast('This event is full.', 'error');
    } else {
      showToast('Registration failed. Please try again.', 'error');
    }
  } finally {
    isRsvpProcessing = false;
  }
};

window.deleteEvent = async (eventId) => {
  const event = await Data.getEvent(eventId);
  if (!event) return;

  const modalContainer = document.getElementById('modal-container');
  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4 page-transition">
      <div class="bg-white rounded-xl max-w-md w-full p-6 border border-gray-200 shadow-xl">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Delete Event</h3>
        <p class="text-gray-500 text-sm mb-6">Delete "${event.title}"? This action cannot be undone.</p>
        <div class="flex items-center justify-end gap-3">
          <button id="modal-cancel" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors">Cancel</button>
          <button id="modal-confirm" class="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('modal-cancel').onclick = () => modalContainer.innerHTML = '';
  document.getElementById('modal-confirm').onclick = async () => {
    await Data.deleteEvent(eventId);
    modalContainer.innerHTML = '';
    showToast('Event deleted.', 'success');
    router.navigateTo('/events');
  };
  modalContainer.querySelector('.modal-overlay').onclick = (e) => { if (e.target === e.currentTarget) modalContainer.innerHTML = ''; };
};

window.deleteUser = async (userId) => {
  const modalContainer = document.getElementById('modal-container');
  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4 page-transition">
      <div class="bg-white rounded-xl max-w-md w-full p-6 border border-gray-200 shadow-xl">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Delete User</h3>
        <p class="text-gray-500 text-sm mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
        <div class="flex items-center justify-end gap-3">
          <button id="modal-cancel" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors">Cancel</button>
          <button id="modal-confirm" class="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('modal-cancel').onclick = () => modalContainer.innerHTML = '';
  document.getElementById('modal-confirm').onclick = async () => {
    try { await Data.deleteUser(userId); showToast('User deleted.', 'success'); } catch (e) { showToast('Error deleting user', 'error'); }
    modalContainer.innerHTML = '';
    await router.render(router.currentRoute);
  };
  modalContainer.querySelector('.modal-overlay').onclick = (e) => { if (e.target === e.currentTarget) modalContainer.innerHTML = ''; };
};

window.deleteEventAdmin = async (eventId) => {
  const modalContainer = document.getElementById('modal-container');
  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4 page-transition">
      <div class="bg-white rounded-xl max-w-md w-full p-6 border border-gray-200 shadow-xl">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Delete Event</h3>
        <p class="text-gray-500 text-sm mb-6">Delete this event as admin? This action cannot be undone.</p>
        <div class="flex items-center justify-end gap-3">
          <button id="modal-cancel" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors">Cancel</button>
          <button id="modal-confirm" class="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('modal-cancel').onclick = () => modalContainer.innerHTML = '';
  document.getElementById('modal-confirm').onclick = async () => {
    try { await Data.deleteEventAdmin(eventId); showToast('Event deleted.', 'success'); } catch (e) { showToast('Error deleting event', 'error'); }
    modalContainer.innerHTML = '';
    await router.render(router.currentRoute);
  };
  modalContainer.querySelector('.modal-overlay').onclick = (e) => { if (e.target === e.currentTarget) modalContainer.innerHTML = ''; };
};

window.copyEventLink = (eventId) => {
  const url = window.location.origin + window.location.pathname + '/events/' + eventId;
  navigator.clipboard.writeText(url).then(() => showToast('Link copied!', 'success')).catch(() => showToast('Failed to copy', 'error'));
};

const router = new Router();
router.init();

export { router };