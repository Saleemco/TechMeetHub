// public/js/app.js
import { Router } from './router.js';
import { showToast } from './components.js';
import { Auth, Data } from './data.js';

// Global functions
window.navigateTo = (path) => {
  router.navigateTo(path);
};

window.toggleMobileMenu = () => {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('open');
};

window.logout = async () => {
  await Auth.logout();
  showToast('Logged out successfully', 'info');
  router.navigateTo('/');
};

window.toggleTheme = () => {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  if (next === 'dark') html.classList.add('dark');
  else html.classList.remove('dark');
  localStorage.setItem('techmeethub-theme', next);
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
      <div class="glass-dark rounded-xl max-w-md w-full p-6 border border-white/10">
        <h3 class="text-lg font-semibold text-white mb-2">Delete Event</h3>
        <p class="text-gray-400 text-sm mb-6">Delete "${event.title}"? This action cannot be undone.</p>
        <div class="flex items-center justify-end gap-3">
          <button id="modal-cancel" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
          <button id="modal-confirm" class="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">Delete</button>
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
      <div class="glass-dark rounded-xl max-w-md w-full p-6 border border-white/10">
        <h3 class="text-lg font-semibold text-white mb-2">Delete User</h3>
        <p class="text-gray-400 text-sm mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
        <div class="flex items-center justify-end gap-3">
          <button id="modal-cancel" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
          <button id="modal-confirm" class="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">Delete</button>
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
      <div class="glass-dark rounded-xl max-w-md w-full p-6 border border-white/10">
        <h3 class="text-lg font-semibold text-white mb-2">Delete Event</h3>
        <p class="text-gray-400 text-sm mb-6">Delete this event as admin? This action cannot be undone.</p>
        <div class="flex items-center justify-end gap-3">
          <button id="modal-cancel" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
          <button id="modal-confirm" class="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">Delete</button>
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