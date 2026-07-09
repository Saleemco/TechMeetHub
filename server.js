const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const FALLBACK_PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ===== AUTH UTILITIES =====
const sessions = new Map(); // token -> { userId, expires }

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function createSession(userId) {
  const token = generateToken();
  sessions.set(token, { userId, expires: Date.now() + 24 * 60 * 60 * 1000 });
  return token;
}

function getUserFromToken(token) {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session || session.expires < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return dataStore.users.find(u => u.id === session.userId) || null;
}

// Auth middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;
  const user = getUserFromToken(token);
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

// ===== DATA STORE =====
let dataStore = {
  events: [
    {
      id: 'evt-1', title: 'AI Builders Hackathon 2025',
      description: 'Join 500+ developers for a 48-hour hackathon focused on building AI-powered applications. Prizes worth $50,000.',
      date: '2025-07-15', time: '09:00', endTime: '2025-07-17T18:00',
      location: 'San Francisco Convention Center, CA', category: 'hackathon',
      image: 'https://images.unsplash.com/photo-1504384308090-c54be3855833?w=800&h=400&fit=crop',
      organizer: { id: 'user-2', name: 'Sarah Chen', avatar: 'SC', initialsColor: 'bg-gradient-to-br from-violet-500 to-purple-600' },
      attendees: [], capacity: 500,
      tags: ['AI', 'Machine Learning', 'OpenAI', 'Python', 'JavaScript'], status: 'upcoming',
      speakers: [
        { name: 'Dr. Emily Roberts', role: 'Principal Researcher, OpenAI', topic: 'Future of LLMs' },
        { name: 'James Liu', role: 'Senior Engineer, Google DeepMind', topic: 'Multimodal AI' },
      ],
      agenda: [
        { time: '09:00', title: 'Registration & Breakfast', type: 'social' },
        { time: '10:00', title: 'Opening Keynote', type: 'keynote' },
        { time: '11:00', title: 'Team Formation', type: 'social' },
        { time: '12:00', title: 'Hacking Begins!', type: 'work' },
        { time: '18:00', title: 'Day 1 Wrap-up', type: 'social' },
      ],
    },
    {
      id: 'evt-2', title: 'React Advanced Patterns Workshop',
      description: 'Deep dive into React 19 features, Server Components, Suspense boundaries, and advanced state management patterns.',
      date: '2025-07-08', time: '14:00', endTime: '2025-07-08T18:00',
      location: 'Online (Zoom)', category: 'workshop',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
      organizer: { id: 'user-3', name: 'Alex Rivera', avatar: 'AR', initialsColor: 'bg-gradient-to-br from-cyan-500 to-blue-600' },
      attendees: [], capacity: 100,
      tags: ['React', 'JavaScript', 'Frontend', 'TypeScript'], status: 'upcoming',
      speakers: [{ name: 'Alex Rivera', role: 'React Core Team Contributor', topic: 'React 19 Deep Dive' }],
      agenda: [
        { time: '14:00', title: 'React 19 Overview', type: 'keynote' },
        { time: '15:00', title: 'Server Components Lab', type: 'work' },
        { time: '16:30', title: 'Advanced Patterns', type: 'work' },
        { time: '17:30', title: 'Q&A', type: 'social' },
      ],
    },
    {
      id: 'evt-3', title: 'TechMeetup: Building Scalable Systems',
      description: 'Monthly tech meetup featuring talks on distributed systems, microservices, and cloud architecture.',
      date: '2025-07-10', time: '18:30', endTime: '2025-07-10T21:00',
      location: 'WeWork Downtown, Austin, TX', category: 'meetup',
      image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&h=400&fit=crop',
      organizer: { id: 'user-4', name: 'Maya Patel', avatar: 'MP', initialsColor: 'bg-gradient-to-br from-emerald-500 to-teal-600' },
      attendees: [], capacity: 80,
      tags: ['System Design', 'Microservices', 'Cloud', 'Networking'], status: 'upcoming',
      speakers: [
        { name: 'David Kim', role: 'Staff Engineer, Netflix', topic: 'Scaling to 200M Users' },
        { name: 'Lisa Wong', role: 'SRE Lead, Stripe', topic: 'Incident Response at Scale' },
      ],
      agenda: [
        { time: '18:30', title: 'Doors Open & Networking', type: 'social' },
        { time: '19:00', title: 'Talk 1: Scaling to 200M Users', type: 'keynote' },
        { time: '19:45', title: 'Talk 2: Incident Response', type: 'keynote' },
        { time: '20:30', title: 'Open Networking', type: 'social' },
      ],
    },
    {
      id: 'evt-4', title: 'DevOpsDays Global Conference',
      description: 'The premier DevOps conference bringing together practitioners, thought leaders, and vendors.',
      date: '2025-08-20', time: '08:00', endTime: '2025-08-21T18:00',
      location: 'London ExCeL, UK', category: 'conference',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
      organizer: { id: 'user-4', name: 'Maya Patel', avatar: 'MP', initialsColor: 'bg-gradient-to-br from-emerald-500 to-teal-600' },
      attendees: [], capacity: 2000,
      tags: ['DevOps', 'CI/CD', 'Kubernetes', 'Observability', 'Platform Engineering'], status: 'upcoming',
      speakers: [
        { name: 'Nicole Forsgren', role: 'Partner, DORA', topic: 'State of DevOps 2025' },
        { name: 'Kelsey Hightower', role: 'Principal Engineer, Google', topic: 'Platform Engineering Future' },
      ],
      agenda: [
        { time: '08:00', title: 'Registration', type: 'social' },
        { time: '09:00', title: 'Opening Keynote', type: 'keynote' },
        { time: '10:30', title: 'Breakout Sessions', type: 'work' },
        { time: '12:30', title: 'Lunch', type: 'social' },
        { time: '14:00', title: 'Workshops', type: 'work' },
        { time: '17:00', title: 'Closing Panel', type: 'keynote' },
      ],
    },
    {
      id: 'evt-5', title: 'Intro to Web3 & Smart Contracts',
      description: 'Learn the fundamentals of blockchain development. Build your first smart contract on Ethereum.',
      date: '2025-07-05', time: '10:00', endTime: '2025-07-05T16:00',
      location: 'Online (YouTube Live)', category: 'webinar',
      image: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=800&h=400&fit=crop',
      organizer: { id: 'user-5', name: 'Ryan O\'Connor', avatar: 'RO', initialsColor: 'bg-gradient-to-br from-red-500 to-pink-600' },
      attendees: [], capacity: 1000,
      tags: ['Web3', 'Blockchain', 'Ethereum', 'Solidity', 'Smart Contracts'], status: 'upcoming',
      speakers: [{ name: 'Ryan O\'Connor', role: 'Blockchain Developer, Consensys', topic: 'Smart Contracts 101' }],
      agenda: [
        { time: '10:00', title: 'Blockchain Basics', type: 'keynote' },
        { time: '11:30', title: 'Solidity Fundamentals', type: 'work' },
        { time: '13:00', title: 'Lunch Break', type: 'social' },
        { time: '14:00', title: 'Build & Deploy', type: 'work' },
        { time: '15:30', title: 'Q&A', type: 'social' },
      ],
    },
    {
      id: 'evt-6', title: 'Tech Social: Summer Mixer',
      description: 'Unwind and connect with the tech community. Casual networking with drinks and games.',
      date: '2025-07-12', time: '19:00', endTime: '2025-07-12T23:00',
      location: 'The Rooftop, Seattle, WA', category: 'social',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=400&fit=crop',
      organizer: { id: 'user-6', name: 'Jasmine Lee', avatar: 'JL', initialsColor: 'bg-gradient-to-br from-pink-500 to-rose-600' },
      attendees: [], capacity: 120,
      tags: ['Networking', 'Social', 'Community', 'Drinks'], status: 'upcoming',
      speakers: [],
      agenda: [
        { time: '19:00', title: 'Doors Open', type: 'social' },
        { time: '20:00', title: 'Ice Breaker Games', type: 'social' },
        { time: '21:00', title: 'Open Networking', type: 'social' },
        { time: '22:30', title: 'Closing Toast', type: 'social' },
      ],
    },
    {
      id: 'evt-7', title: 'Fullstack TypeScript Masterclass',
      description: 'Build a complete production-ready app with TypeScript from database to frontend.',
      date: '2025-07-22', time: '10:00', endTime: '2025-07-22T17:00',
      location: 'Online (Discord + Zoom)', category: 'workshop',
      image: 'https://images.unsplash.com/photo-1531498860502-7c67cf02f657?w=800&h=400&fit=crop',
      organizer: { id: 'user-3', name: 'Alex Rivera', avatar: 'AR', initialsColor: 'bg-gradient-to-br from-cyan-500 to-blue-600' },
      attendees: [], capacity: 50,
      tags: ['TypeScript', 'Next.js', 'Prisma', 'tRPC', 'Fullstack'], status: 'upcoming',
      speakers: [{ name: 'Alex Rivera', role: 'Fullstack Developer', topic: 'End-to-End TypeScript' }],
      agenda: [
        { time: '10:00', title: 'Architecture Overview', type: 'keynote' },
        { time: '11:00', title: 'Database & API', type: 'work' },
        { time: '13:00', title: 'Lunch Break', type: 'social' },
        { time: '14:00', title: 'Frontend & Deployment', type: 'work' },
        { time: '16:00', title: 'Code Review & Feedback', type: 'social' },
      ],
    },
    {
      id: 'evt-8', title: 'Cloud Native Summit 2025',
      description: 'Explore the latest in Kubernetes, serverless, service mesh, and cloud-native observability.',
      date: '2025-09-05', time: '09:00', endTime: '2025-09-06T18:00',
      location: 'Berlin Congress Center, Germany', category: 'conference',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop',
      organizer: { id: 'user-4', name: 'Maya Patel', avatar: 'MP', initialsColor: 'bg-gradient-to-br from-emerald-500 to-teal-600' },
      attendees: [], capacity: 1500,
      tags: ['Kubernetes', 'Serverless', 'Cloud', 'Observability', 'Istio'], status: 'upcoming',
      speakers: [
        { name: 'Liz Rice', role: 'Chief of Open Source, Isovalent', topic: 'eBPF Revolution' },
        { name: 'Brendan Burns', role: 'Co-creator, Kubernetes', topic: 'K8s Future Roadmap' },
      ],
      agenda: [
        { time: '09:00', title: 'Registration & Breakfast', type: 'social' },
        { time: '10:00', title: 'Keynote', type: 'keynote' },
        { time: '11:30', title: 'Breakout Sessions', type: 'work' },
        { time: '13:00', title: 'Lunch', type: 'social' },
        { time: '14:30', title: 'Hands-on Labs', type: 'work' },
        { time: '17:00', title: 'Closing', type: 'keynote' },
      ],
    },
  ],
  users: [
    {
      id: 'user-1', name: 'Jordan Smith', email: 'jordan@techmeethub.dev',
      password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // "password"
      role: 'participant',
      avatar: 'JS', initialsColor: 'bg-gradient-to-br from-brand-500 to-violet-600',
      bio: 'Fullstack developer passionate about AI and open source.',
      skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AI/ML', 'System Design'],
      eventsAttending: [],
      eventsHosting: [],
      joinedDate: '2024-03-15',
    },
    {
      id: 'user-2', name: 'Sarah Chen', email: 'sarah@techmeethub.dev',
      password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      role: 'organizer',
      avatar: 'SC', initialsColor: 'bg-gradient-to-br from-violet-500 to-purple-600',
      bio: 'AI researcher and hackathon organizer. Building communities.',
      skills: ['AI', 'Python', 'TensorFlow', 'Community Building'],
      eventsAttending: [],
      eventsHosting: ['evt-1'],
      joinedDate: '2024-02-10',
    },
    {
      id: 'user-3', name: 'Alex Rivera', email: 'alex@techmeethub.dev',
      password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      role: 'organizer',
      avatar: 'AR', initialsColor: 'bg-gradient-to-br from-cyan-500 to-blue-600',
      bio: 'React Core Team Contributor. Teaching workshops worldwide.',
      skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'GraphQL'],
      eventsAttending: [],
      eventsHosting: ['evt-2', 'evt-7'],
      joinedDate: '2024-01-20',
    },
    {
      id: 'user-4', name: 'Maya Patel', email: 'maya@techmeethub.dev',
      password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      role: 'admin',
      avatar: 'MP', initialsColor: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      bio: 'Platform engineer and community admin. Keeping things running.',
      skills: ['Kubernetes', 'DevOps', 'Go', 'Rust', 'System Design'],
      eventsAttending: [],
      eventsHosting: ['evt-3', 'evt-4', 'evt-8'],
      joinedDate: '2023-11-05',
    },
    {
      id: 'user-5', name: 'Ryan O\'Connor', email: 'ryan@techmeethub.dev',
      password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      role: 'organizer',
      avatar: 'RO', initialsColor: 'bg-gradient-to-br from-red-500 to-pink-600',
      bio: 'Blockchain developer and Web3 educator.',
      skills: ['Solidity', 'Ethereum', 'Web3', 'JavaScript', 'Rust'],
      eventsAttending: [],
      eventsHosting: ['evt-5'],
      joinedDate: '2024-04-01',
    },
    {
      id: 'user-6', name: 'Jasmine Lee', email: 'jasmine@techmeethub.dev',
      password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      role: 'participant',
      avatar: 'JL', initialsColor: 'bg-gradient-to-br from-pink-500 to-rose-600',
      bio: 'Frontend developer who loves community events.',
      skills: ['Vue', 'CSS', 'Design', 'Community'],
      eventsAttending: [],
      eventsHosting: ['evt-6'],
      joinedDate: '2024-05-15',
    },
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

// ===== AUTH ENDPOINTS =====

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  if (dataStore.users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const validRoles = ['participant', 'organizer'];
  const userRole = validRoles.includes(role) ? role : 'participant';

  const newUser = {
    id: 'user-' + Date.now(),
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
  const token = createSession(newUser.id);

  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ token, user: userWithoutPassword });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = dataStore.users.find(u => u.email === email.trim().toLowerCase());
  if (!user || user.password !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = createSession(user.id);
  const { password: _, ...userWithoutPassword } = user;
  res.json({ token, user: userWithoutPassword });
});

// POST /api/auth/logout
app.post('/api/auth/logout', requireAuth, (req, res) => {
  sessions.delete(req.token);
  res.json({ message: 'Logged out' });
});

// GET /api/auth/me
app.get('/api/auth/me', requireAuth, (req, res) => {
  const { password: _, ...userWithoutPassword } = req.user;
  res.json({ user: userWithoutPassword });
});

// ===== PUBLIC EVENTS API (no auth needed) =====

app.get('/api/events', (req, res) => {
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
  res.json({ events });
});

app.get('/api/events/:id', (req, res) => {
  const event = dataStore.events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  // Include attendee details
  const attendeeDetails = event.attendees.map(uid => {
    const u = dataStore.users.find(user => user.id === uid);
    if (!u) return null;
    const { password: _, ...safe } = u;
    return { id: safe.id, name: safe.name, avatar: safe.avatar, initialsColor: safe.initialsColor };
  }).filter(Boolean);

  res.json({ event: { ...event, attendeeDetails } });
});

app.get('/api/categories', (req, res) => {
  res.json({ categories: dataStore.categories });
});

app.get('/api/stats', (req, res) => {
  res.json({
    totalEvents: dataStore.events.length,
    totalAttendees: dataStore.events.reduce((sum, e) => sum + e.attendees.length, 0),
    totalUsers: dataStore.users.length,
    totalOrganizers: dataStore.users.filter(u => u.role === 'organizer').length,
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
    date, time: time || '',
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
  // Only organizer of the event or admin can edit
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

// RSVP
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
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`\n  TechMeetHub server running on http://localhost:${PORT}\n`);
  printEndpoints();
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`  Port ${PORT} is in use, trying port ${FALLBACK_PORT}...\n`);
    const fallbackServer = app.listen(FALLBACK_PORT, () => {
      console.log(`\n  TechMeetHub server running on http://localhost:${FALLBACK_PORT}\n`);
      printEndpoints();
    });
    fallbackServer.on('error', (err2) => {
      console.error(`  Failed to start server on port ${FALLBACK_PORT}:`, err2.message);
      process.exit(1);
    });
  } else {
    console.error('  Server error:', err);
    process.exit(1);
  }
});

function printEndpoints() {
  console.log(`  Auth endpoints:`);
  console.log(`    POST /api/auth/register`);
  console.log(`    POST /api/auth/login`);
  console.log(`    POST /api/auth/logout`);
  console.log(`    GET  /api/auth/me`);
  console.log(`\n  Event endpoints:`);
  console.log(`    GET  /api/events`);
  console.log(`    GET  /api/events/:id`);
  console.log(`    POST /api/events          (organizer/admin only)`);
  console.log(`    PUT  /api/events/:id`);
  console.log(`    DELETE /api/events/:id`);
  console.log(`\n  Admin endpoints:`);
  console.log(`    GET /api/admin/users`);
  console.log(`    GET /api/admin/events`);
  console.log(`    GET /api/admin/stats`);
  console.log(`\n  Demo accounts (password: "password"):`);
  console.log(`    participant: jordan@techmeethub.dev`);
  console.log(`    organizer:   sarah@techmeethub.dev`);
  console.log(`    admin:       maya@techmeethub.dev\n`);
}
