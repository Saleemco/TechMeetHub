// public/js/router.js
import { 
  HomePage, EventsPage, EventDetailPage, CreateEventPage, 
  DashboardPage, ProfilePage, LoginPage, RegisterPage, NotFoundPage 
} from './pages/index.js';
import { Auth, Data } from './data.js';
import { Header, Footer, showToast } from './components.js';

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

export class Router {
  constructor() {
    this.currentRoute = '/';
    this.container = document.getElementById('main');
    this.header = document.getElementById('header');
    this.footer = document.getElementById('footer');
  }

  matchRoute(path) {
    const cleanPath = path.split('?')[0];
    
    if (routes[cleanPath]) {
      return { handler: routes[cleanPath], params: [] };
    }
    
    if (cleanPath.startsWith('/events/')) {
      const id = cleanPath.replace('/events/', '');
      if (id) {
        return { handler: routes['/events/:id'], params: [id] };
      }
    }
    
    return { handler: NotFoundPage, params: [] };
  }

  async navigateTo(path) {
    window.history.pushState({}, '', path);
    await this.render(path);
  }

  async render(path) {
    const user = await Auth.me();
    const { handler, params } = this.matchRoute(path);
    
    // Render header and footer
    this.header.innerHTML = Header(user);
    this.footer.innerHTML = Footer();
    
    // Render the page content
    const content = await handler(...params);
    this.container.innerHTML = content;
    
    console.log(`📄 Rendered: ${path}`);
    console.log(`📄 Page: ${path === '/login' ? 'Login Page' : path === '/register' ? 'Register Page' : 'Other'}`);
    
    this.updateActiveNav(path);
    this.currentRoute = path;
    
    // Attach handlers after a small delay to ensure DOM is ready
    setTimeout(() => {
      this.attachEventHandlers();
    }, 50);
  }

  updateActiveNav(path) {
    const cleanPath = path.split('?')[0];
    document.querySelectorAll('.nav-link').forEach(link => {
      const route = link.dataset.route;
      if (route === cleanPath || (route === '/events' && cleanPath.startsWith('/events'))) {
        link.classList.add('text-brand-400', 'bg-white/5');
        link.classList.remove('text-gray-400');
      } else {
        link.classList.remove('text-brand-400', 'bg-white/5');
        link.classList.add('text-gray-400');
      }
    });
  }

  attachEventHandlers() {
    console.log('🔧 Attaching event handlers for:', this.currentRoute);
    
    // LOGIN FORM - Only attach if on login page
    if (this.currentRoute === '/login') {
      const loginForm = document.getElementById('login-form');
      if (loginForm) {
        console.log('✅ Login form found!');
        
        // Remove any existing event listeners
        const newForm = loginForm.cloneNode(true);
        loginForm.parentNode.replaceChild(newForm, loginForm);
        
        // Add submit event listener
        newForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('🔐 Login button clicked!');
          
          const formData = new FormData(newForm);
          const email = formData.get('email');
          const password = formData.get('password');
          
          console.log('📧 Email:', email);
          
          if (!email || !password) {
            showToast('Please enter email and password', 'error');
            return;
          }
          
          try {
            console.log('⏳ Logging in...');
            await Auth.login(email, password);
            console.log('✅ Login successful!');
            const user = await Auth.me();
            console.log('👤 User:', user);
            showToast('Welcome back! ' + user.name, 'success');
            this.navigateTo('/dashboard');
          } catch (err) {
            console.error('❌ Login error:', err);
            showToast('Invalid email or password', 'error');
          }
        });
        
        console.log('✅ Login handler attached!');
      } else {
        console.log('❌ Login form NOT found on login page!');
      }
    }
    
    // REGISTER FORM - Only attach if on register page
    if (this.currentRoute === '/register') {
      const registerForm = document.getElementById('register-form');
      if (registerForm) {
        console.log('✅ Register form found!');
        
        const newForm = registerForm.cloneNode(true);
        registerForm.parentNode.replaceChild(newForm, registerForm);
        
        newForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('📝 Register button clicked!');
          
          const formData = new FormData(newForm);
          const data = Object.fromEntries(formData.entries());
          
          if (data.password !== data.confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
          }
          
          try {
            console.log('⏳ Registering...');
            await Auth.register(data.name, data.email, data.password, data.role);
            console.log('✅ Registration successful!');
            showToast('Account created! Welcome to TechMeetHub.', 'success');
            this.navigateTo('/dashboard');
          } catch (err) {
            console.error('❌ Register error:', err);
            showToast('Email already registered', 'error');
          }
        });
        
        console.log('✅ Register handler attached!');
      } else {
        console.log('❌ Register form NOT found on register page!');
      }
    }

    // Create event form
    const createForm = document.getElementById('create-event-form');
    if (createForm) {
      const newForm = createForm.cloneNode(true);
      createForm.parentNode.replaceChild(newForm, createForm);
      
      newForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const formData = new FormData(newForm);
        const data = Object.fromEntries(formData.entries());
        
        if (!data.title || !data.category || !data.date || !data.time || !data.location || !data.capacity || !data.description) {
          showToast('Please fill in all required fields.', 'error');
          return;
        }
        
        const eventData = {
          title: data.title.trim(),
          category: data.category,
          date: data.date,
          time: data.time,
          location: data.location.trim(),
          capacity: parseInt(data.capacity, 10),
          description: data.description.trim(),
          tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        };
        
        const params = new URLSearchParams(window.location.search);
        const editId = params.get('edit');
        
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
        
        const formData = new FormData(newForm);
        const data = Object.fromEntries(formData.entries());
        
        try {
          await Data.updateUser({
            name: data.name.trim(),
            email: data.email.trim(),
            bio: data.bio.trim(),
            skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [],
          });
          showToast('Profile updated!', 'success');
          await this.render(this.currentRoute);
        } catch (err) {
          showToast('Error updating profile', 'error');
        }
      });
    }

    // Events search/filter
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      const newInput = searchInput.cloneNode(true);
      searchInput.parentNode.replaceChild(newInput, searchInput);
      
      newInput.addEventListener('input', () => {
        this.filterEvents();
      });
    }

    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
      const newFilter = categoryFilter.cloneNode(true);
      categoryFilter.parentNode.replaceChild(newFilter, categoryFilter);
      
      newFilter.addEventListener('change', () => {
        this.filterEvents();
      });
    }

    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
      const newFilter = statusFilter.cloneNode(true);
      statusFilter.parentNode.replaceChild(newFilter, statusFilter);
      
      newFilter.addEventListener('change', () => {
        this.filterEvents();
      });
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
      if (eventsEmpty) eventsEmpty.classList.remove('hidden');
    } else {
      if (eventsEmpty) eventsEmpty.classList.add('hidden');
      const user = await Auth.me();
      const { EventCard } = await import('./components.js');
      eventsGrid.innerHTML = (await Promise.all(events.map((event, i) => EventCard(event, i, user)))).join('');
    }
  }

  init() {
    window.addEventListener('popstate', () => {
      this.render(window.location.pathname);
    });

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-navigate]');
      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        this.navigateTo(href);
      }
    });

    const path = window.location.pathname || '/';
    this.render(path);
  }
}