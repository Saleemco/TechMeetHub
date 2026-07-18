// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ===== DEBUG ENDPOINTS =====
app.get('/debug-files', (req, res) => {
  const fs = require('fs');
  const publicDir = path.join(__dirname, 'public');
  const files = [];
  
  function walkDir(dir, prefix = '') {
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          walkDir(fullPath, prefix + item + '/');
        } else {
          files.push(prefix + item);
        }
      }
    } catch (e) {
      // ignore
    }
  }
  
  walkDir(publicDir);
  res.json({ 
    files: files.sort(),
    cwd: process.cwd(),
    publicDir: publicDir
  });
});

app.get('/debug-check/:file(*)', (req, res) => {
  const filePath = path.join(__dirname, 'public', req.params.file);
  const fs = require('fs');
  if (fs.existsSync(filePath)) {
    res.json({ exists: true, path: filePath });
  } else {
    res.json({ exists: false, path: filePath });
  }
});

// ===== DATA STORE (In-Memory) - FRESH RESET =====
let dataStore = {
  events: [],
  users: [
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // "password"
      role: 'admin',
      avatar: 'AU',
      initialsColor: 'bg-gradient-to-br from-rose-500 to-pink-600',
      bio: 'Platform Administrator',
      skills: ['Management', 'Community', 'Tech'],
      eventsAttending: [],
      eventsHosting: [],
      joinedDate: new Date().toISOString().split('T')[0],
    }
  ],
  categories: [
    { id: 'hackathon', label: 'Hackathons', icon: 'zap', color: 'category-hackathon' },
    { id: 'meetup', label: 'Meetups', icon: 'users', color: 'category-meetup' },
    { id: 'workshop', label: 'Workshops', icon: 'wrench', color: 'category-workshop' },
    { id: 'conference', label: 'Conferences', icon: 'mic', color: 'category-conference' },
    { id: 'webinar', label: 'Webinars', icon: 'video', color: 'category-webinar' },
    { id: 'social', label: 'Social', icon: 'heart', color: 'category-social' },
  ]
};

// ===== RESET ALL DATA ENDPOINT =====
app.post('/api/reset-all', (req, res) => {
  // Clear all events
  dataStore.events = [];
  
  // Reset users - only keep admin
  dataStore.users = [
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      role: 'admin',
      avatar: 'AU',
      initialsColor: 'bg-gradient-to-br from-rose-500 to-pink-600',
      bio: 'Platform Administrator',
      skills: ['Management', 'Community', 'Tech'],
      eventsAttending: [],
      eventsHosting: [],
      joinedDate: new Date().toISOString().split('T')[0],
    }
  ];
  
  res.json({ 
    message: 'Data reset successfully!',
    users: dataStore.users.length,
    events: dataStore.events.length
  });
});

// ===== DATABASE CONNECTION (Only if DATABASE_URL exists) =====
let pool = null;
let useDatabase = false;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
    
    pool.connect((err, client, release) => {
      if (err) {
        console.log('❌ Database connection failed, using in-memory store');
        useDatabase = false;
      } else {
        console.log('✅ Connected to PostgreSQL database');
        useDatabase = true;
        release();
        initializeDatabase();
      }
    });
  } catch (e) {
    console.log('❌ Database connection failed, using in-memory store');
    useDatabase = false;
  }
} else {
  console.log('📦 No DATABASE_URL found, using in-memory data store');
}

// ===== INITIALIZE DATABASE TABLES =====
async function initializeDatabase() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(64) NOT NULL,
        role VARCHAR(20) DEFAULT 'participant',
        avatar VARCHAR(10),
        initials_color VARCHAR(100),
        bio TEXT,
        skills TEXT[],
        events_attending TEXT[],
        events_hosting TEXT[],
        joined_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        time VARCHAR(10),
        end_time VARCHAR(50),
        location VARCHAR(200),
        category VARCHAR(50),
        image VARCHAR(500),
        organizer_id VARCHAR(50),
        organizer_name VARCHAR(100),
        organizer_avatar VARCHAR(10),
        organizer_initials_color VARCHAR(100),
        attendees TEXT[] DEFAULT '{}',
        capacity INTEGER DEFAULT 100,
        tags TEXT[],
        status VARCHAR(20) DEFAULT 'upcoming',
        speakers JSONB,
        agenda JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organizer_id) REFERENCES users(id)
      )
    `);

    // Create sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        token VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        expires TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log('✅ Database tables initialized');

    // Insert default users if not exists
    await seedDefaultUsers();

  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

// ===== SEED DEFAULT USERS =====
async function seedDefaultUsers() {
  try {
    for (const user of dataStore.users) {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [user.id]);
      if (result.rows.length === 0) {
        await pool.query(
          `INSERT INTO users (id, name, email, password, role, avatar, initials_color, bio, skills, events_attending, events_hosting, joined_date)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [user.id, user.name, user.email, user.password, user.role, user.avatar, user.initialsColor, user.bio, user.skills, user.eventsAttending, user.eventsHosting, user.joinedDate]
        );
        console.log(`✅ Created default user: ${user.name}`);
      }
    }
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
}

// ===== AUTH UTILITIES =====

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function createSession(userId) {
  const token = generateToken();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  if (useDatabase) {
    await pool.query(
      'INSERT INTO sessions (token, user_id, expires) VALUES ($1, $2, $3)',
      [token, userId, expires]
    );
  }
  return token;
}

async function getUserFromToken(token) {
  if (!token) return null;
  if (useDatabase) {
    const result = await pool.query(
      'SELECT * FROM sessions WHERE token = $1 AND expires > NOW()',
      [token]
    );
    if (result.rows.length === 0) return null;
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [result.rows[0].user_id]);
    return userResult.rows[0] || null;
  } else {
    // In-memory session handling
    const session = sessions.get(token);
    if (!session || session.expires < Date.now()) {
      sessions.delete(token);
      return null;
    }
    return dataStore.users.find(u => u.id === session.userId) || null;
  }
}

// In-memory sessions for local development
const sessions = new Map();

// Auth middleware
async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;
  const user = await getUserFromToken(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  req.user = user;
  req.token = token;
  next();
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

// ===== AUTH ENDPOINTS =====

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existingUser = dataStore.users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const validRoles = ['participant', 'organizer'];
  const userRole = validRoles.includes(role) ? role : 'participant';
  const userId = 'user-' + Date.now();

  const newUser = {
    id: userId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: hashPassword(password),
    role: userRole,
    avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    initialsColor: 'bg-gradient-to-br from-brand-500 to-violet-600',
    bio: '',
    skills: [],
    eventsAttending: [],
    eventsHosting: [],
    joinedDate: new Date().toISOString().split('T')[0],
  };

  dataStore.users.push(newUser);
  const token = await createSession(newUser.id);

  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ token, user: userWithoutPassword });
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = dataStore.users.find(u => u.email === email.trim().toLowerCase());
  if (!user || user.password !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = await createSession(user.id);
  const { password: _, ...userWithoutPassword } = user;
  res.json({ token, user: userWithoutPassword });
});

// POST /api/auth/logout
app.post('/api/auth/logout', requireAuth, async (req, res) => {
  sessions.delete(req.token);
  res.json({ message: 'Logged out' });
});

// GET /api/auth/me
app.get('/api/auth/me', requireAuth, (req, res) => {
  const { password: _, ...userWithoutPassword } = req.user;
  res.json({ user: userWithoutPassword });
});

// ===== PUBLIC EVENTS API =====

app.get('/api/events', async (req, res) => {
  const { category, status, q } = req.query;
  let events = [...dataStore.events];

  if (category && category !== 'all') events = events.filter(e => e.category === category);
  if (status && status !== 'all') events = events.filter(e => e.status === status);
  if (q) {
    const query = q.toLowerCase();
    events = events.filter(e =>
      e.title.toLowerCase().includes(query) ||
      e.description.toLowerCase().includes(query) ||
      e.location.toLowerCase().includes(query) ||
      e.tags.some(t => t.toLowerCase().includes(query))
    );
  }
  
  // Transform events to include organizer object
  const transformedEvents = events.map(event => ({
    ...event,
    organizer: event.organizer || {
      id: event.organizer_id || '',
      name: event.organizer_name || 'Unknown Organizer',
      avatar: event.organizer_avatar || '?',
      initialsColor: event.organizer_initials_color || 'bg-gradient-to-br from-brand-500 to-violet-600'
    }
  }));
  
  res.json({ events: transformedEvents });
});

app.get('/api/events/:id', async (req, res) => {
  const event = dataStore.events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  // Get attendee details
  let attendeeDetails = [];
  if (event.attendees && event.attendees.length > 0) {
    attendeeDetails = event.attendees.map(uid => {
      const u = dataStore.users.find(user => user.id === uid);
      if (!u) return null;
      const { password: _, ...safe } = u;
      return { id: safe.id, name: safe.name, avatar: safe.avatar, initialsColor: safe.initialsColor };
    }).filter(Boolean);
  }

  // Format organizer with fallbacks
  const organizer = event.organizer || {
    id: event.organizer_id || '',
    name: event.organizer_name || 'Unknown Organizer',
    avatar: event.organizer_avatar || '?',
    initialsColor: event.organizer_initials_color || 'bg-gradient-to-br from-brand-500 to-violet-600',
  };

  res.json({
    event: {
      ...event,
      organizer,
      attendeeDetails,
      attendees: event.attendees || [],
      speakers: event.speakers || [],
      agenda: event.agenda || [],
    }
  });
});

app.get('/api/categories', (req, res) => {
  res.json({ categories: dataStore.categories });
});

app.get('/api/stats', (req, res) => {
  const totalEvents = dataStore.events.length;
  const totalAttendees = dataStore.events.reduce((sum, e) => sum + (e.attendees?.length || 0), 0);
  const totalUsers = dataStore.users.length;
  const totalOrganizers = dataStore.users.filter(u => u.role === 'organizer').length;

  console.log(`📊 Stats: ${totalEvents} events, ${totalAttendees} attendees, ${totalUsers} users`);

  res.json({
    totalEvents,
    totalAttendees,
    totalUsers,
    totalOrganizers,
  });
});

// ===== PROTECTED EVENTS API =====

app.post('/api/events', requireAuth, requireRole(['organizer', 'admin']), (req, res) => {
  const { title, category, date, time, location, capacity, description, tags } = req.body;
  if (!title || !category || !date || !location || !capacity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newEvent = {
    id: 'evt-' + Date.now(),
    title: title.trim(),
    description: description || '',
    date,
    time: time || '',
    location: location.trim(),
    category,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop',
    organizer: { id: req.user.id, name: req.user.name, avatar: req.user.avatar, initialsColor: req.user.initialsColor },
    attendees: [],
    capacity: parseInt(capacity, 10),
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()).filter(t => t) : []),
    status: 'upcoming',
    speakers: [],
    agenda: [],
  };

  dataStore.events.unshift(newEvent);
  req.user.eventsHosting.push(newEvent.id);
  res.status(201).json({ event: newEvent });
});

app.put('/api/events/:id', requireAuth, (req, res) => {
  const idx = dataStore.events.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Event not found' });

  const event = dataStore.events[idx];
  if (event.organizer.id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'You can only edit your own events' });
  }

  dataStore.events[idx] = { ...event, ...req.body };
  res.json({ event: dataStore.events[idx] });
});

app.delete('/api/events/:id', requireAuth, (req, res) => {
  const idx = dataStore.events.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Event not found' });

  const event = dataStore.events[idx];
  if (event.organizer.id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'You can only delete your own events' });
  }

  dataStore.events.splice(idx, 1);
  res.json({ message: 'Event deleted' });
});

// ===== RSVP =====

app.post('/api/events/:id/rsvp', requireAuth, requireRole(['participant', 'organizer', 'admin']), (req, res) => {
  const event = dataStore.events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const idx = event.attendees.indexOf(req.user.id);
  const attending = idx !== -1;

  if (attending) {
    event.attendees.splice(idx, 1);
    req.user.eventsAttending = req.user.eventsAttending.filter(id => id !== event.id);
  } else {
    if (event.attendees.length >= event.capacity) {
      return res.status(400).json({ error: 'Event is full' });
    }
    event.attendees.push(req.user.id);
    req.user.eventsAttending.push(event.id);
  }

  res.json({ attending: !attending, event });
});

app.get('/api/events/:id/rsvp', requireAuth, (req, res) => {
  const event = dataStore.events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json({ attending: event.attendees.includes(req.user.id) });
});

// ===== USER PROFILE API =====

app.get('/api/user', requireAuth, (req, res) => {
  const { password: _, ...user } = req.user;
  res.json({ user });
});

app.put('/api/user', requireAuth, (req, res) => {
  const { name, email, bio, skills } = req.body;
  if (name) req.user.name = name;
  if (email) req.user.email = email;
  if (bio !== undefined) req.user.bio = bio;
  if (skills) req.user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(s => s);
  const { password: _, ...user } = req.user;
  res.json({ user });
});

app.get('/api/user/events/attending', requireAuth, (req, res) => {
  const events = dataStore.events.filter(e => req.user.eventsAttending.includes(e.id));
  res.json({ events });
});

app.get('/api/user/events/hosting', requireAuth, (req, res) => {
  const events = dataStore.events.filter(e => e.organizer.id === req.user.id);
  res.json({ events });
});

// ===== ADMIN API =====

app.get('/api/admin/users', requireAuth, requireRole(['admin']), (req, res) => {
  const users = dataStore.users.map(u => {
    const { password: _, ...user } = u;
    return user;
  });
  res.json({ users });
});

app.get('/api/admin/events', requireAuth, requireRole(['admin']), (req, res) => {
  res.json({ events: dataStore.events });
});

app.get('/api/admin/stats', requireAuth, requireRole(['admin']), (req, res) => {
  const now = new Date().toISOString().split('T')[0];
  res.json({
    totalUsers: dataStore.users.length,
    totalEvents: dataStore.events.length,
    totalAttendees: dataStore.events.reduce((sum, e) => sum + e.attendees.length, 0),
    participants: dataStore.users.filter(u => u.role === 'participant').length,
    organizers: dataStore.users.filter(u => u.role === 'organizer').length,
    admins: dataStore.users.filter(u => u.role === 'admin').length,
    upcomingEvents: dataStore.events.filter(e => e.date >= now).length,
    pastEvents: dataStore.events.filter(e => e.date < now).length,
  });
});

app.delete('/api/admin/users/:id', requireAuth, requireRole(['admin']), (req, res) => {
  const idx = dataStore.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  if (dataStore.users[idx].id === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete yourself' });
  }
  dataStore.users.splice(idx, 1);
  res.json({ message: 'User deleted' });
});

app.delete('/api/admin/events/:id', requireAuth, requireRole(['admin']), (req, res) => {
  const idx = dataStore.events.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Event not found' });
  dataStore.events.splice(idx, 1);
  res.json({ message: 'Event deleted' });
});

// ===== RESET =====
app.post('/api/reset', requireAuth, (req, res) => {
  req.user.eventsAttending = [];
  res.json({ message: 'Data reset' });
});

// ===== SPA FALLBACK =====
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  // All other routes - serve index.html for SPA routing
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  TechMeetHub server running on http://localhost:${PORT}\n`);
  console.log(`  Demo accounts (password: "password"):`);
  console.log(`    admin:       admin@gmail.com\n`);
  console.log(`📊 Total Events: ${dataStore.events.length}`);
  console.log(`👥 Total Attendees: ${dataStore.events.reduce((sum, e) => sum + (e.attendees?.length || 0), 0)}`);
  console.log(`👤 Total Users: ${dataStore.users.length}\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`  Port ${PORT} is in use, trying port ${PORT + 1}...\n`);
    const fallbackServer = app.listen(PORT + 1, '0.0.0.0', () => {
      console.log(`\n  TechMeetHub server running on http://localhost:${PORT + 1}\n`);
      console.log(`  Demo accounts (password: "password"):`);
      console.log(`    admin:       admin@gmail.com\n`);
      console.log(`📊 Total Events: ${dataStore.events.length}`);
      console.log(`👥 Total Attendees: ${dataStore.events.reduce((sum, e) => sum + (e.attendees?.length || 0), 0)}`);
      console.log(`👤 Total Users: ${dataStore.users.length}\n`);
    });
    fallbackServer.on('error', (err2) => {
      console.error(`  Failed to start server on port ${PORT + 1}:`, err2.message);
      process.exit(1);
    });
  } else {
    console.error('  Server error:', err);
    process.exit(1);
  }
});