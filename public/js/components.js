// public/js/router.js
import { 
  HomePage, EventsPage, EventDetailPage, CreateEventPage, 
  DashboardPage, ProfilePage, LoginPage, RegisterPage, NotFoundPage 
} from './pages/index.js';
import { Auth, Data } from './data.js';
import { Header, Footer, Sidebar, showToast } from './components.js';

const routes = {
  '/': HomePage,
  '/home': HomePage,
  '/events': EventsPage,
  '/events/:id': EventDetailPage,
  '/create': CreateEventPage,
  '/dashboard': DashboardPage,
  '/profile': ProfilePage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/admin': DashboardPage,
};

const LOADING_PLACEHOLDER = `
  <div class="flex flex-col items-center justify-center text-gray-400" style="min-height:60vh">
    <div class="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-3"></div>
    <span class="text-sm">Loading...</span>
  </div>
`;

const AUTH_LOADING_PLACEHOLDER = `
  <div class="flex flex-col items-center justify-center bg-white text-gray-500" style="min-height:100dvh">
    <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
    <span class="text-sm font-medium">Loading...</span>
  </div>
`;

const MIN_AUTH_LOADING = 400;

export class Router {
  constructor() {
    this.currentRoute = '/';
    this.currentParams = {};
    this.container = document.getElementById('main');
    this.header = document.getElementById('header');
    this.footer = document.getElementById('footer');
    this._hasRendered = false;
  }

  matchRoute(path) {
    const cleanPath = path.split('?')[0];
    if (routes[cleanPath]) return { handler: routes[cleanPath], params: [] };
    if (cleanPath.startsWith('/events/')) {
      const id = cleanPath.replace('/events/', '');
      if (id) return { handler: routes['/events/:id'], params: [id] };
    }
    return { handler: NotFoundPage, params: [] };
  }

  async navigateTo(path) {
    window.history.pushState({}, '', path);
    await this.render(path);
  }

  async render(path) {
    const isAuthPage = path === '/login' || path === '/register';
    const main = document.getElementById('main');
    const sidebarEl = document.getElementById('sidebar');
    const overlayEl = document.getElementById('sidebar-overlay');

    // 1. Kill transition and remove sidebar padding BEFORE spinner
    if (main) {
      main.style.transition = 'none';
      main.classList.remove('sidebar-visible');
      void main.offsetHeight;
    }

    if (isAuthPage) {
      document.body.classList.add('auth-page');
    } else {
      document.body.classList.remove('auth-page');
    }

    // 2. Inject spinner
    this.container.innerHTML = isAuthPage ? AUTH_LOADING_PLACEHOLDER : LOADING_PLACEHOLDER;
    this.container.offsetHeight;

    // 3. Let browser paint
    const startTime = Date.now();
    await new Promise(resolve => requestAnimationFrame(resolve));

    // 4. Fetch data
    const user = await Auth.me();
    const { handler, params } = this.matchRoute(path);
    const isHomePage = path === '/' || path === '/home';
    const showSidebar = (user || !isHomePage) && !isAuthPage;

    // 5. Enforce minimum spinner time
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_AUTH_LOADING - elapsed);
    if (remaining > 0) {
      await new Promise(resolve => setTimeout(resolve, remaining));
    }

    // 6. Header (minimal when sidebar is active) & Footer
    if (isAuthPage) {
      this.header.innerHTML = '';
      this.footer.innerHTML = '';
    } else {
      this.header.innerHTML = Header(user, showSidebar);
      this.footer.innerHTML = Footer();
    }

    // 7. Sidebar
    if (showSidebar && sidebarEl) {
      sidebarEl.classList.remove('hidden');
      sidebarEl.innerHTML = Sidebar(user, path);
      if (overlayEl) overlayEl.classList.add('hidden');
    } else if (sidebarEl) {
      sidebarEl.classList.add('hidden');
      sidebarEl.innerHTML = '';
      if (overlayEl) overlayEl.classList.add('hidden');
    }

    // 8. Swap in real content
    this.container.innerHTML = await handler(...params);

    // 9. Restore transition and apply sidebar padding
    if (main) {
      main.style.transition = '';
      if (showSidebar) {
        main.classList.add('sidebar-visible');
      }
    }

    this.updateActiveNav(path);
    this.updateSidebarActive(path);
    this.currentRoute = path;

    // 10. Reveal header/footer on first render
    if (!this._hasRendered) {
      this._hasRendered = true;
      document.getElementById('app')?.classList.add('app-ready');
    }

    setTimeout(() => this.attachEventHandlers(), 50);
  }

  updateActiveNav(path) {
    const cleanPath = path.split('?')[0];
    document.querySelectorAll('.nav-link').forEach(link => {
      const route = link.dataset.route;
      const isActive = route === cleanPath || (route === '/events' && cleanPath.startsWith('/events'));
      link.classList.toggle('text-blue-600', isActive);
      link.classList.toggle('bg-blue-50', isActive);
      link.classList.toggle('text-gray-600', !isActive);
    });
  }

  updateSidebarActive(path) {
    const cleanPath = path.split('?')[0];
    document.querySelectorAll('.sidebar-link').forEach(link => {
      const route = link.dataset.route;
      const isActive = route === cleanPath || (route === '/events' && cleanPath.startsWith('/events'));
      link.classList.toggle('active', isActive);
    });
  }

  attachEventHandlers() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      const newForm = loginForm.cloneNode(true);
      loginForm.parentNode.replaceChild(newForm, loginForm);
      newForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const btn = newForm.querySelector('#login-btn');
        const btnText = newForm.querySelector('#login-btn-text');
        const btnSpinner = newForm.querySelector('#login-btn-spinner');
        
        if (btn) btn.disabled = true;
        if (btnText) btnText.textContent = 'Signing in...';
        if (btnSpinner) btnSpinner.classList.remove('hidden');
        
        const formData = new FormData(newForm);
        try {
          await Auth.login(formData.get('email'), formData.get('password'));
          showToast('Welcome back!', 'success');
          this.navigateTo('/dashboard');
        } catch (err) {
          showToast('Invalid email or password', 'error');
          if (btn) btn.disabled = false;
          if (btnText) btnText.textContent = 'Sign In';
          if (btnSpinner) btnSpinner.classList.add('hidden');
        }
      });
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      const newForm = registerForm.cloneNode(true);
      registerForm.parentNode.replaceChild(newForm, registerForm);
      newForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const data = Object.fromEntries(new FormData(newForm).entries());
        if (data.password !== data.confirmPassword) {
          showToast('Passwords do not match', 'error');
          return;
        }
        
        const btn = newForm.querySelector('#register-btn');
        const btnText = newForm.querySelector('#register-btn-text');
        const btnSpinner = newForm.querySelector('#register-btn-spinner');
        
        if (btn) btn.disabled = true;
        if (btnText) btnText.textContent = 'Creating account...';
        if (btnSpinner) btnSpinner.classList.remove('hidden');
        
        try {
          await Auth.register(data.name, data.email, data.password, data.role);
          showToast('Account created! Welcome to TechMeetHub.', 'success');
          this.navigateTo('/dashboard');
        } catch (err) {
          showToast('Email already registered', 'error');
          if (btn) btn.disabled = false;
          if (btnText) btnText.textContent = 'Create Account';
          if (btnSpinner) btnSpinner.classList.add('hidden');
        }
      });
    }

    // Create event form
    const createForm = document.getElementById('create-event-form');
    if (createForm) {
      const newForm = createForm.cloneNode(true);
      createForm.parentNode.replaceChild(newForm, createForm);
      newForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const data = Object.fromEntries(new FormData(newForm).entries());

        if (!data.title || !data.category || !data.date || !data.time || !data.location || !data.capacity || !data.description) {
          showToast('Please fill in all required fields.', 'error');
          return;
        }

        const speakers = [];
        document.querySelectorAll('.speaker-entry').forEach(entry => {
          const name = entry.querySelector('input[name^="speaker_name_"]')?.value?.trim();
          const role = entry.querySelector('input[name^="speaker_role_"]')?.value?.trim();
          const topic = entry.querySelector('input[name^="speaker_topic_"]')?.value?.trim();
          if (name) speakers.push({ name, role: role || 'Speaker', topic: topic || '' });
        });

        const agenda = [];
        document.querySelectorAll('.agenda-entry').forEach(entry => {
          const time = entry.querySelector('input[name^="agenda_time_"]')?.value?.trim();
          const title = entry.querySelector('input[name^="agenda_title_"]')?.value?.trim();
          const type = entry.querySelector('select[name^="agenda_type_"]')?.value || 'social';
          if (time && title) agenda.push({ time, title, type });
        });

        const eventData = {
          title: data.title.trim(),
          category: data.category,
          date: data.date,
          time: data.time,
          location: data.location.trim(),
          capacity: parseInt(data.capacity, 10),
          description: data.description.trim(),
          tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
          speakers,
          agenda,
        };

        const editId = new URLSearchParams(window.location.search).get('edit');
        try {
          if (editId) {
            await Data.updateEvent(editId, eventData);
            showToast('Event updated!', 'success');
            this.navigateTo('/events/' + editId);
          } else {
            const newEvent = await Data.createEvent(eventData);
            showToast('Event created!', 'success');
            this.navigateTo('/events/' + newEvent.id);
          }
        } catch (err) {
          showToast('Error: ' + (err.message || 'Unknown error'), 'error');
        }
      });
    }

    // Profile form
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
      const newForm = profileForm.cloneNode(true);
      profileForm.parentNode.replaceChild(newForm, profileForm);
      newForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const data = Object.fromEntries(new FormData(newForm).entries());
        try {
          await Data.updateUser({
            name: data.name.trim(),
            email: data.email.trim(),
            bio: data.bio.trim(),
            skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
          });
          showToast('Profile updated!', 'success');
          await this.render(this.currentRoute);
        } catch (err) {
          showToast('Error updating profile', 'error');
        }
      });
    }

    // Search / filter listeners
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      const newInput = searchInput.cloneNode(true);
      searchInput.parentNode.replaceChild(newInput, searchInput);
      newInput.addEventListener('input', () => this.filterEvents());
    }

    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
      const newFilter = categoryFilter.cloneNode(true);
      categoryFilter.parentNode.replaceChild(newFilter, categoryFilter);
      newFilter.addEventListener('change', () => this.filterEvents());
    }

    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
      const newFilter = statusFilter.cloneNode(true);
      statusFilter.parentNode.replaceChild(newFilter, statusFilter);
      newFilter.addEventListener('change', () => this.filterEvents());
    }
  }

  async filterEvents() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const statusFilter = document.getElementById('status-filter');
    const eventsGrid = document.getElementById('events-grid');
    const eventsEmpty = document.getElementById('events-empty');
    if (!eventsGrid) return;

    const query = searchInput?.value?.trim() || '';
    const category = categoryFilter?.value || 'all';
    const status = statusFilter?.value || 'all';

    let events = query ? await Data.searchEvents(query) : await Data.getEvents();
    if (category !== 'all') events = events.filter(e => e.category === category);
    if (status !== 'all') events = events.filter(e => e.status === status);

    if (events.length === 0) {
      eventsGrid.innerHTML = '';
      eventsEmpty?.classList.remove('hidden');
    } else {
      eventsEmpty?.classList.add('hidden');
      const user = await Auth.me();
      const { EventCard } = await import('./components.js');
      eventsGrid.innerHTML = (await Promise.all(events.map((event, i) => EventCard(event, i, user)))).join('');
    }
  }

  init() {
    window.addEventListener('popstate', () => this.render(window.location.pathname));

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-navigate]');
      if (link) {
        e.preventDefault();
        this.navigateTo(link.getAttribute('href'));
      }
    });

    const path = window.location.pathname || '/';
    this.render(path);
  }
}