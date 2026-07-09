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

// ===== DATABASE CONNECTION =====
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/techmeethub',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.stack);
  } else {
    console.log('✅ Connected to PostgreSQL database');
    release();
    initializeDatabase();
  }
});

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
    const defaultUsers = [
      {
        id: 'user-1',
        name: 'Jordan Smith',
        email: 'jordan@techmeethub.dev',
        password: crypto.createHash('sha256').update('password').digest('hex'),
        role: 'participant',
        avatar: 'JS',
        initialsColor: 'bg-gradient-to-br from-brand-500 to-violet-600',
        bio: 'Fullstack developer passionate about AI and open source.',
        skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AI/ML', 'System Design'],
        joinedDate: '2024-03-15',
      },
      {
        id: 'user-2',
        name: 'Sarah Chen',
        email: 'sarah@techmeethub.dev',
        password: crypto.createHash('sha256').update('password').digest('hex'),
        role: 'organizer',
        avatar: 'SC',
        initialsColor: 'bg-gradient-to-br from-violet-500 to-purple-600',
        bio: 'AI researcher and hackathon organizer. Building communities.',
        skills: ['AI', 'Python', 'TensorFlow', 'Community Building'],
        joinedDate: '2024-02-10',
      },
      {
        id: 'user-3',
        name: 'Alex Rivera',
        email: 'alex@techmeethub.dev',
        password: crypto.createHash('sha256').update('password').digest('hex'),
        role: 'organizer',
        avatar: 'AR',
        initialsColor: 'bg-gradient-to-br from-cyan-500 to-blue-600',
        bio: 'React Core Team Contributor. Teaching workshops worldwide.',
        skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'GraphQL'],
        joinedDate: '2024-01-20',
      },
      {
        id: 'user-4',
        name: 'Maya Patel',
        email: 'maya@techmeethub.dev',
        password: crypto.createHash('sha256').update('password').digest('hex'),
        role: 'admin',
        avatar: 'MP',
        initialsColor: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        bio: 'Platform engineer and community admin. Keeping things running.',
        skills: ['Kubernetes', 'DevOps', 'Go', 'Rust', 'System Design'],
        joinedDate: '2023-11-05',
      },
      {
        id: 'user-5',
        name: 'Ryan O\'Connor',
        email: 'ryan@techmeethub.dev',
        password: crypto.createHash('sha256').update('password').digest('hex'),
        role: 'organizer',
        avatar: 'RO',
        initialsColor: 'bg-gradient-to-br from-red-500 to-pink-600',
        bio: 'Blockchain developer and Web3 educator.',
        skills: ['Solidity', 'Ethereum', 'Web3', 'JavaScript', 'Rust'],
        joinedDate: '2024-04-01',
      },
      {
        id: 'user-6',
        name: 'Jasmine Lee',
        email: 'jasmine@techmeethub.dev',
        password: crypto.createHash('sha256').update('password').digest('hex'),
        role: 'participant',
        avatar: 'JL',
        initialsColor: 'bg-gradient-to-br from-pink-500 to-rose-600',
        bio: 'Frontend developer who loves community events.',
        skills: ['Vue', 'CSS', 'Design', 'Community'],
        joinedDate: '2024-05-15',
      },
    ];

    for (const user of defaultUsers) {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [user.id]);
      if (result.rows.length === 0) {
        await pool.query(
          `INSERT INTO users (id, name, email, password, role, avatar, initials_color, bio, skills, joined_date)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [user.id, user.name, user.email, user.password, user.role, user.avatar, user.initialsColor, user.bio, user.skills, user.joinedDate]
        );
        console.log(`✅ Created default user: ${user.name}`);
      }
    }

    // Seed default events
    await seedDefaultEvents();

  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
}

async function seedDefaultEvents() {
  try {
    const defaultEvents = [
      {
        id: 'evt-1',
        title: 'AI Builders Hackathon 2025',
        description: 'Join 500+ developers for a 48-hour hackathon focused on building AI-powered applications. Prizes worth $50,000.',
        date: '2025-07-15',
        time: '09:00',
        endTime: '2025-07-17T18:00',
        location: 'San Francisco Convention Center, CA',
        category: 'hackathon',
        image: 'https://images.unsplash.com/photo-1504384308090-c54be3855833?w=800&h=400&fit=crop',
        organizerId: 'user-2',
        organizerName: 'Sarah Chen',
        organizerAvatar: 'SC',
        organizerInitialsColor: 'bg-gradient-to-br from-violet-500 to-purple-600',
        attendees: [],
        capacity: 500,
        tags: ['AI', 'Machine Learning', 'OpenAI', 'Python', 'JavaScript'],
        speakers: JSON.stringify([
          { name: 'Dr. Emily Roberts', role: 'Principal Researcher, OpenAI', topic: 'Future of LLMs' },
          { name: 'James Liu', role: 'Senior Engineer, Google DeepMind', topic: 'Multimodal AI' },
        ]),
        agenda: JSON.stringify([
          { time: '09:00', title: 'Registration & Breakfast', type: 'social' },
          { time: '10:00', title: 'Opening Keynote', type: 'keynote' },
          { time: '11:00', title: 'Team Formation', type: 'social' },
          { time: '12:00', title: 'Hacking Begins!', type: 'work' },
          { time: '18:00', title: 'Day 1 Wrap-up', type: 'social' },
        ]),
      },
      {
        id: 'evt-2',
        title: 'React Advanced Patterns Workshop',
        description: 'Deep dive into React 19 features, Server Components, Suspense boundaries, and advanced state management patterns.',
        date: '2025-07-08',
        time: '14:00',
        endTime: '2025-07-08T18:00',
        location: 'Online (Zoom)',
        category: 'workshop',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
        organizerId: 'user-3',
        organizerName: 'Alex Rivera',
        organizerAvatar: 'AR',
        organizerInitialsColor: 'bg-gradient-to-br from-cyan-500 to-blue-600',
        attendees: [],
        capacity: 100,
        tags: ['React', 'JavaScript', 'Frontend', 'TypeScript'],
        speakers: JSON.stringify([{ name: 'Alex Rivera', role: 'React Core Team Contributor', topic: 'React 19 Deep Dive' }]),
        agenda: JSON.stringify([
          { time: '14:00', title: 'React 19 Overview', type: 'keynote' },
          { time: '15:00', title: 'Server Components Lab', type: 'work' },
          { time: '16:30', title: 'Advanced Patterns', type: 'work' },
          { time: '17:30', title: 'Q&A', type: 'social' },
        ]),
      },
      {
        id: 'evt-3',
        title: 'TechMeetup: Building Scalable Systems',
        description: 'Monthly tech meetup featuring talks on distributed systems, microservices, and cloud architecture.',
        date: '2025-07-10',
        time: '18:30',
        endTime: '2025-07-10T21:00',
        location: 'WeWork Downtown, Austin, TX',
        category: 'meetup',
        image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&h=400&fit=crop',
        organizerId: 'user-4',
        organizerName: 'Maya Patel',
        organizerAvatar: 'MP',
        organizerInitialsColor: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        attendees: [],
        capacity: 80,
        tags: ['System Design', 'Microservices', 'Cloud', 'Networking'],
        speakers: JSON.stringify([
          { name: 'David Kim', role: 'Staff Engineer, Netflix', topic: 'Scaling to 200M Users' },
          { name: 'Lisa Wong', role: 'SRE Lead, Stripe', topic: 'Incident Response at Scale' },
        ]),
        agenda: JSON.stringify([
          { time: '18:30', title: 'Doors Open & Networking', type: 'social' },
          { time: '19:00', title: 'Talk 1: Scaling to 200M Users', type: 'keynote' },
          { time: '19:45', title: 'Talk 2: Incident Response', type: 'keynote' },
          { time: '20:30', title: 'Open Networking', type: 'social' },
        ]),
      },
      {
        id: 'evt-4',
        title: 'DevOpsDays Global Conference',
        description: 'The premier DevOps conference bringing together practitioners, thought leaders, and vendors.',
        date: '2025-08-20',
        time: '08:00',
        endTime: '2025-08-21T18:00',
        location: 'London ExCeL, UK',
        category: 'conference',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
        organizerId: 'user-4',
        organizerName: 'Maya Patel',
        organizerAvatar: 'MP',
        organizerInitialsColor: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        attendees: [],
        capacity: 2000,
        tags: ['DevOps', 'CI/CD', 'Kubernetes', 'Observability', 'Platform Engineering'],
        speakers: JSON.stringify([
          { name: 'Nicole Forsgren', role: 'Partner, DORA', topic: 'State of DevOps 2025' },
          { name: 'Kelsey Hightower', role: 'Principal Engineer, Google', topic: 'Platform Engineering Future' },
        ]),
        agenda: JSON.stringify([
          { time: '08:00', title: 'Registration', type: 'social' },
          { time: '09:00', title: 'Opening Keynote', type: 'keynote' },
          { time: '10:30', title: 'Breakout Sessions', type: 'work' },
          { time: '12:30', title: 'Lunch', type: 'social' },
          { time: '14:00', title: 'Workshops', type: 'work' },
          { time: '17:00', title: 'Closing Panel', type: 'keynote' },
        ]),
      },
      {
        id: 'evt-5',
        title: 'Intro to Web3 & Smart Contracts',
        description: 'Learn the fundamentals of blockchain development. Build your first smart contract on Ethereum.',
        date: '2025-07-05',
        time: '10:00',
        endTime: '2025-07-05T16:00',
        location: 'Online (YouTube Live)',
        category: 'webinar',
        image: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=800&h=400&fit=crop',
        organizerId: 'user-5',
        organizerName: 'Ryan O\'Connor',
        organizerAvatar: 'RO',
        organizerInitialsColor: 'bg-gradient-to-br from-red-500 to-pink-600',
        attendees: [],
        capacity: 1000,
        tags: ['Web3', 'Blockchain', 'Ethereum', 'Solidity', 'Smart Contracts'],
        speakers: JSON.stringify([{ name: 'Ryan O\'Connor', role: 'Blockchain Developer, Consensys', topic: 'Smart Contracts 101' }]),
        agenda: JSON.stringify([
          { time: '10:00', title: 'Blockchain Basics', type: 'keynote' },
          { time: '11:30', title: 'Solidity Fundamentals', type: 'work' },
          { time: '13:00', title: 'Lunch Break', type: 'social' },
          { time: '14:00', title: 'Build & Deploy', type: 'work' },
          { time: '15:30', title: 'Q&A', type: 'social' },
        ]),
      },
      {
        id: 'evt-6',
        title: 'Tech Social: Summer Mixer',
        description: 'Unwind and connect with the tech community. Casual networking with drinks and games.',
        date: '2025-07-12',
        time: '19:00',
        endTime: '2025-07-12T23:00',
        location: 'The Rooftop, Seattle, WA',
        category: 'social',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=400&fit=crop',
        organizerId: 'user-6',
        organizerName: 'Jasmine Lee',
        organizerAvatar: 'JL',
        organizerInitialsColor: 'bg-gradient-to-br from-pink-500 to-rose-600',
        attendees: [],
        capacity: 120,
        tags: ['Networking', 'Social', 'Community', 'Drinks'],
        speakers: JSON.stringify([]),
        agenda: JSON.stringify([
          { time: '19:00', title: 'Doors Open', type: 'social' },
          { time: '20:00', title: 'Ice Breaker Games', type: 'social' },
          { time: '21:00', title: 'Open Networking', type: 'social' },
          { time: '22:30', title: 'Closing Toast', type: 'social' },
        ]),
      },
      {
        id: 'evt-7',
        title: 'Fullstack TypeScript Masterclass',
        description: 'Build a complete production-ready app with TypeScript from database to frontend.',
        date: '2025-07-22',
        time: '10:00',
        endTime: '2025-07-22T17:00',
        location: 'Online (Discord + Zoom)',
        category: 'workshop',
        image: 'https://images.unsplash.com/photo-1531498860502-7c67cf02f657?w=800&h=400&fit=crop',
        organizerId: 'user-3',
        organizerName: 'Alex Rivera',
        organizerAvatar: 'AR',
        organizerInitialsColor: 'bg-gradient-to-br from-cyan-500 to-blue-600',
        attendees: [],
        capacity: 50,
        tags: ['TypeScript', 'Next.js', 'Prisma', 'tRPC', 'Fullstack'],
        speakers: JSON.stringify([{ name: 'Alex Rivera', role: 'Fullstack Developer', topic: 'End-to-End TypeScript' }]),
        agenda: JSON.stringify([
          { time: '10:00', title: 'Architecture Overview', type: 'keynote' },
          { time: '11:00', title: 'Database & API', type: 'work' },
          { time: '13:00', title: 'Lunch Break', type: 'social' },
          { time: '14:00', title: 'Frontend & Deployment', type: 'work' },
          { time: '16:00', title: 'Code Review & Feedback', type: 'social' },
        ]),
      },
      {
        id: 'evt-8',
        title: 'Cloud Native Summit 2025',
        description: 'Explore the latest in Kubernetes, serverless, service mesh, and cloud-native observability.',
        date: '2025-09-05',
        time: '09:00',
        endTime: '2025-09-06T18:00',
        location: 'Berlin Congress Center, Germany',
        category: 'conference',
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop',
        organizerId: 'user-4',
        organizerName: 'Maya Patel',
        organizerAvatar: 'MP',
        organizerInitialsColor: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        attendees: [],
        capacity: 1500,
        tags: ['Kubernetes', 'Serverless', 'Cloud', 'Observability', 'Istio'],
        speakers: JSON.stringify([
          { name: 'Liz Rice', role: 'Chief of Open Source, Isovalent', topic: 'eBPF Revolution' },
          { name: 'Brendan Burns', role: 'Co-creator, Kubernetes', topic: 'K8s Future Roadmap' },
        ]),
        agenda: JSON.stringify([
          { time: '09:00', title: 'Registration & Breakfast', type: 'social' },
          { time: '10:00', title: 'Keynote', type: 'keynote' },
          { time: '11:30', title: 'Breakout Sessions', type: 'work' },
          { time: '13:00', title: 'Lunch', type: 'social' },
          { time: '14:30', title: 'Hands-on Labs', type: 'work' },
          { time: '17:00', title: 'Closing', type: 'keynote' },
        ]),
      },
    ];

    for (const event of defaultEvents) {
      const result = await pool.query('SELECT * FROM events WHERE id = $1', [event.id]);
      if (result.rows.length === 0) {
        await pool.query(
          `INSERT INTO events (id, title, description, date, time, end_time, location, category, image, 
            organizer_id, organizer_name, organizer_avatar, organizer_initials_color, attendees, capacity, tags, speakers, agenda)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
          [
            event.id, event.title, event.description, event.date, event.time, event.endTime,
            event.location, event.category, event.image,
            event.organizerId, event.organizerName, event.organizerAvatar, event.organizerInitialsColor,
            event.attendees, event.capacity, event.tags, event.speakers, event.agenda
          ]
        );
        console.log(`✅ Created default event: ${event.title}`);
      }
    }
  } catch (error) {
    console.error('❌ Error seeding events:', error);
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
  await pool.query(
    'INSERT INTO sessions (token, user_id, expires) VALUES ($1, $2, $3)',
    [token, userId, expires]
  );
  return token;
}

async function getUserFromToken(token) {
  if (!token) return null;
  const result = await pool.query(
    'SELECT * FROM sessions WHERE token = $1 AND expires > NOW()',
    [token]
  );
  if (result.rows.length === 0) return null;
  const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [result.rows[0].user_id]);
  return userResult.rows[0] || null;
}

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

  const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
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

  await pool.query(
    `INSERT INTO users (id, name, email, password, role, avatar, initials_color, bio, skills, joined_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [newUser.id, newUser.name, newUser.email, newUser.password, newUser.role,
     newUser.avatar, newUser.initialsColor, newUser.bio, newUser.skills, newUser.joinedDate]
  );

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

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.trim().toLowerCase()]);
  const user = result.rows[0];

  if (!user || user.password !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = await createSession(user.id);
  const { password: _, ...userWithoutPassword } = user;
  res.json({ token, user: userWithoutPassword });
});

// POST /api/auth/logout
app.post('/api/auth/logout', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM sessions WHERE token = $1', [req.token]);
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
  let query = 'SELECT * FROM events';
  let params = [];
  let conditions = [];

  if (category && category !== 'all') {
    conditions.push(`category = $${params.length + 1}`);
    params.push(category);
  }
  if (status && status !== 'all') {
    conditions.push(`status = $${params.length + 1}`);
    params.push(status);
  }
  if (q) {
    conditions.push(`(title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1} OR location ILIKE $${params.length + 1})`);
    params.push(`%${q}%`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY date ASC';
  const result = await pool.query(query, params);
  
  // Transform events to include organizer object with fallbacks
  const events = result.rows.map(event => ({
    ...event,
    organizer: {
      id: event.organizer_id || '',
      name: event.organizer_name || 'Unknown Organizer',
      avatar: event.organizer_avatar || '?',
      initialsColor: event.organizer_initials_color || 'bg-gradient-to-br from-brand-500 to-violet-600'
    }
  }));
  
  res.json({ events });
});

app.get('/api/events/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const event = result.rows[0];

  // Get attendee details
  let attendeeDetails = [];
  if (event.attendees && event.attendees.length > 0) {
    const attendeeResult = await pool.query(
      'SELECT id, name, avatar, initials_color FROM users WHERE id = ANY($1)',
      [event.attendees]
    );
    attendeeDetails = attendeeResult.rows;
  }

  // Format organizer with fallbacks
  const organizer = {
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
  const categories = [
    { id: 'hackathon', label: 'Hackathons', icon: 'zap', color: 'category-hackathon' },
    { id: 'meetup', label: 'Meetups', icon: 'users', color: 'category-meetup' },
    { id: 'workshop', label: 'Workshops', icon: 'wrench', color: 'category-workshop' },
    { id: 'conference', label: 'Conferences', icon: 'mic', color: 'category-conference' },
    { id: 'webinar', label: 'Webinars', icon: 'video', color: 'category-webinar' },
    { id: 'social', label: 'Social', icon: 'heart', color: 'category-social' },
  ];
  res.json({ categories });
});

app.get('/api/stats', async (req, res) => {
  const eventsResult = await pool.query('SELECT COUNT(*) as total FROM events');
  const usersResult = await pool.query('SELECT COUNT(*) as total FROM users');
  const organizersResult = await pool.query('SELECT COUNT(*) as total FROM users WHERE role = $1', ['organizer']);

  res.json({
    totalEvents: parseInt(eventsResult.rows[0].total),
    totalAttendees: 0,
    totalUsers: parseInt(usersResult.rows[0].total),
    totalOrganizers: parseInt(organizersResult.rows[0].total),
  });
});

// ===== PROTECTED EVENTS API =====

app.post('/api/events', requireAuth, requireRole(['organizer', 'admin']), async (req, res) => {
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
    organizerId: req.user.id,
    organizerName: req.user.name,
    organizerAvatar: req.user.avatar,
    organizerInitialsColor: req.user.initials_color,
    attendees: [],
    capacity: parseInt(capacity, 10),
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()).filter(t => t) : []),
    status: 'upcoming',
    speakers: [],
    agenda: [],
  };

  await pool.query(
    `INSERT INTO events (id, title, description, date, time, location, category, image, 
      organizer_id, organizer_name, organizer_avatar, organizer_initials_color, attendees, capacity, tags, speakers, agenda, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
    [
      newEvent.id, newEvent.title, newEvent.description, newEvent.date, newEvent.time,
      newEvent.location, newEvent.category, newEvent.image,
      newEvent.organizerId, newEvent.organizerName, newEvent.organizerAvatar, newEvent.organizerInitialsColor,
      newEvent.attendees, newEvent.capacity, newEvent.tags, newEvent.speakers, newEvent.agenda, newEvent.status
    ]
  );

  res.status(201).json({ event: newEvent });
});

app.put('/api/events/:id', requireAuth, async (req, res) => {
  const result = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const event = result.rows[0];
  if (event.organizer_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'You can only edit your own events' });
  }

  const { title, description, date, time, location, category, capacity, tags } = req.body;
  await pool.query(
    `UPDATE events SET 
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      date = COALESCE($3, date),
      time = COALESCE($4, time),
      location = COALESCE($5, location),
      category = COALESCE($6, category),
      capacity = COALESCE($7, capacity),
      tags = COALESCE($8, tags)
     WHERE id = $9`,
    [title, description, date, time, location, category, capacity, tags, req.params.id]
  );

  const updatedResult = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
  res.json({ event: updatedResult.rows[0] });
});

app.delete('/api/events/:id', requireAuth, async (req, res) => {
  const result = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const event = result.rows[0];
  if (event.organizer_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'You can only delete your own events' });
  }

  await pool.query('DELETE FROM events WHERE id = $1', [req.params.id]);
  res.json({ message: 'Event deleted' });
});

// ===== RSVP =====

app.post('/api/events/:id/rsvp', requireAuth, requireRole(['participant', 'organizer', 'admin']), async (req, res) => {
  const result = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const event = result.rows[0];
  let attendees = event.attendees || [];
  const idx = attendees.indexOf(req.user.id);
  const attending = idx !== -1;

  if (attending) {
    attendees.splice(idx, 1);
    // Update user's eventsAttending
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];
    let userEvents = user.events_attending || [];
    userEvents = userEvents.filter(id => id !== event.id);
    await pool.query('UPDATE users SET events_attending = $1 WHERE id = $2', [userEvents, req.user.id]);
  } else {
    if (attendees.length >= event.capacity) {
      return res.status(400).json({ error: 'Event is full' });
    }
    attendees.push(req.user.id);
    // Update user's eventsAttending
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];
    let userEvents = user.events_attending || [];
    userEvents.push(event.id);
    await pool.query('UPDATE users SET events_attending = $1 WHERE id = $2', [userEvents, req.user.id]);
  }

  await pool.query('UPDATE events SET attendees = $1 WHERE id = $2', [attendees, req.params.id]);

  res.json({ attending: !attending, event: { ...event, attendees } });
});

app.get('/api/events/:id/rsvp', requireAuth, async (req, res) => {
  const result = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Event not found' });
  }
  const event = result.rows[0];
  const attendees = event.attendees || [];
  res.json({ attending: attendees.includes(req.user.id) });
});

// ===== USER PROFILE API =====

app.get('/api/user', requireAuth, (req, res) => {
  const { password: _, ...user } = req.user;
  res.json({ user });
});

app.put('/api/user', requireAuth, async (req, res) => {
  const { name, email, bio, skills } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (email) updates.email = email;
  if (bio !== undefined) updates.bio = bio;
  if (skills) updates.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(s => s);

  const setClause = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`).join(', ');
  const values = Object.values(updates);
  values.push(req.user.id);

  await pool.query(`UPDATE users SET ${setClause} WHERE id = $${values.length}`, values);

  const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
  const { password: _, ...user } = result.rows[0];
  res.json({ user });
});

app.get('/api/user/events/attending', requireAuth, async (req, res) => {
  const user = req.user;
  const events = user.events_attending || [];
  if (events.length === 0) {
    return res.json({ events: [] });
  }
  const result = await pool.query('SELECT * FROM events WHERE id = ANY($1)', [events]);
  res.json({ events: result.rows });
});

app.get('/api/user/events/hosting', requireAuth, async (req, res) => {
  const result = await pool.query('SELECT * FROM events WHERE organizer_id = $1', [req.user.id]);
  res.json({ events: result.rows });
});

// ===== ADMIN API =====

app.get('/api/admin/users', requireAuth, requireRole(['admin']), async (req, res) => {
  const result = await pool.query('SELECT id, name, email, role, avatar, initials_color, bio, skills, joined_date FROM users');
  res.json({ users: result.rows });
});

app.get('/api/admin/events', requireAuth, requireRole(['admin']), async (req, res) => {
  const result = await pool.query('SELECT * FROM events');
  res.json({ events: result.rows });
});

app.get('/api/admin/stats', requireAuth, requireRole(['admin']), async (req, res) => {
  const usersResult = await pool.query('SELECT COUNT(*) as total FROM users');
  const eventsResult = await pool.query('SELECT COUNT(*) as total FROM events');
  const participantsResult = await pool.query('SELECT COUNT(*) as total FROM users WHERE role = $1', ['participant']);
  const organizersResult = await pool.query('SELECT COUNT(*) as total FROM users WHERE role = $1', ['organizer']);
  const adminsResult = await pool.query('SELECT COUNT(*) as total FROM users WHERE role = $1', ['admin']);

  res.json({
    totalUsers: parseInt(usersResult.rows[0].total),
    totalEvents: parseInt(eventsResult.rows[0].total),
    totalAttendees: 0,
    participants: parseInt(participantsResult.rows[0].total),
    organizers: parseInt(organizersResult.rows[0].total),
    admins: parseInt(adminsResult.rows[0].total),
  });
});

app.delete('/api/admin/users/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete yourself' });
  }
  await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
  res.json({ message: 'User deleted' });
});

app.delete('/api/admin/events/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  await pool.query('DELETE FROM events WHERE id = $1', [req.params.id]);
  res.json({ message: 'Event deleted' });
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
  console.log(`    participant: jordan@techmeethub.dev`);
  console.log(`    organizer:   sarah@techmeethub.dev`);
  console.log(`    admin:       maya@techmeethub.dev\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`  Port ${PORT} is in use, trying port ${PORT + 1}...\n`);
    const fallbackServer = app.listen(PORT + 1, '0.0.0.0', () => {
      console.log(`\n  TechMeetHub server running on http://localhost:${PORT + 1}\n`);
      console.log(`  Demo accounts (password: "password"):`);
      console.log(`    participant: jordan@techmeethub.dev`);
      console.log(`    organizer:   sarah@techmeethub.dev`);
      console.log(`    admin:       maya@techmeethub.dev\n`);
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