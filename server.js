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

// ===== HASH PASSWORD FUNCTION =====
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// ===== DATA STORE (In-Memory) =====
let dataStore = {
  events: [],
  users: [],
  categories: [
    { id: 'hackathon', label: 'Hackathons', icon: 'zap', color: 'category-hackathon' },
    { id: 'meetup', label: 'Meetups', icon: 'users', color: 'category-meetup' },
    { id: 'workshop', label: 'Workshops', icon: 'wrench', color: 'category-workshop' },
    { id: 'conference', label: 'Conferences', icon: 'mic', color: 'category-conference' },
    { id: 'webinar', label: 'Webinars', icon: 'video', color: 'category-webinar' },
    { id: 'social', label: 'Social', icon: 'heart', color: 'category-social' },
  ]
};

// ===== SEED DATA =====
function seedData() {
  // Clear existing data
  dataStore.events = [];
  dataStore.users = [];

  const hashedPassword = hashPassword('password');

  // ===== ADMIN =====
  const admin = {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: hashedPassword,
    role: 'admin',
    avatar: 'AU',
    initialsColor: 'bg-gradient-to-br from-rose-500 to-pink-600',
    bio: 'Platform Administrator',
    skills: ['Management', 'Community', 'Tech'],
    eventsAttending: [],
    eventsHosting: [],
    joinedDate: new Date().toISOString().split('T')[0],
  };

  // ===== 5 ORGANIZERS =====
  const organizers = [
    {
      id: 'org-1',
      name: 'Sarah Chen',
      email: 'sarah@techmeethub.dev',
      password: hashedPassword,
      role: 'organizer',
      avatar: 'SC',
      initialsColor: 'bg-gradient-to-br from-violet-500 to-purple-600',
      bio: 'AI researcher and hackathon organizer. Building communities.',
      skills: ['AI', 'Python', 'TensorFlow', 'Community Building'],
      eventsAttending: [],
      eventsHosting: [],
      joinedDate: '2024-01-15',
    },
    {
      id: 'org-2',
      name: 'Alex Rivera',
      email: 'alex@techmeethub.dev',
      password: hashedPassword,
      role: 'organizer',
      avatar: 'AR',
      initialsColor: 'bg-gradient-to-br from-cyan-500 to-blue-600',
      bio: 'React Core Team Contributor. Teaching workshops worldwide.',
      skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'GraphQL'],
      eventsAttending: [],
      eventsHosting: [],
      joinedDate: '2024-01-20',
    },
    {
      id: 'org-3',
      name: 'Maya Patel',
      email: 'maya@techmeethub.dev',
      password: hashedPassword,
      role: 'organizer',
      avatar: 'MP',
      initialsColor: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      bio: 'Platform engineer and community builder.',
      skills: ['Kubernetes', 'DevOps', 'Go', 'Rust', 'System Design'],
      eventsAttending: [],
      eventsHosting: [],
      joinedDate: '2024-02-01',
    },
    {
      id: 'org-4',
      name: 'Ryan O\'Connor',
      email: 'ryan@techmeethub.dev',
      password: hashedPassword,
      role: 'organizer',
      avatar: 'RO',
      initialsColor: 'bg-gradient-to-br from-red-500 to-pink-600',
      bio: 'Blockchain developer and Web3 educator.',
      skills: ['Solidity', 'Ethereum', 'Web3', 'JavaScript', 'Rust'],
      eventsAttending: [],
      eventsHosting: [],
      joinedDate: '2024-02-15',
    },
    {
      id: 'org-5',
      name: 'Priya Sharma',
      email: 'priya@techmeethub.dev',
      password: hashedPassword,
      role: 'organizer',
      avatar: 'PS',
      initialsColor: 'bg-gradient-to-br from-amber-500 to-orange-600',
      bio: 'Data scientist and ML engineer. Passionate about teaching.',
      skills: ['Python', 'Machine Learning', 'Data Science', 'PyTorch', 'SQL'],
      eventsAttending: [],
      eventsHosting: [],
      joinedDate: '2024-03-01',
    },
  ];

  // ===== 4 PARTICIPANTS =====
  const participants = [
    {
      id: 'part-1',
      name: 'Jordan Smith',
      email: 'jordan@techmeethub.dev',
      password: hashedPassword,
      role: 'participant',
      avatar: 'JS',
      initialsColor: 'bg-gradient-to-br from-brand-500 to-violet-600',
      bio: 'Fullstack developer passionate about AI and open source.',
      skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AI/ML'],
      eventsAttending: [],
      eventsHosting: [],
      joinedDate: '2024-03-15',
    },
    {
      id: 'part-2',
      name: 'Jasmine Lee',
      email: 'jasmine@techmeethub.dev',
      password: hashedPassword,
      role: 'participant',
      avatar: 'JL',
      initialsColor: 'bg-gradient-to-br from-pink-500 to-rose-600',
      bio: 'Frontend developer who loves community events.',
      skills: ['Vue', 'CSS', 'Design', 'Community'],
      eventsAttending: [],
      eventsHosting: [],
      joinedDate: '2024-04-01',
    },
    {
      id: 'part-3',
      name: 'David Kim',
      email: 'david@techmeethub.dev',
      password: hashedPassword,
      role: 'participant',
      avatar: 'DK',
      initialsColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      bio: 'Backend engineer interested in distributed systems.',
      skills: ['Go', 'Rust', 'Kubernetes', 'Microservices'],
      eventsAttending: [],
      eventsHosting: [],
      joinedDate: '2024-04-15',
    },
    {
      id: 'part-4',
      name: 'Lisa Wong',
      email: 'lisa@techmeethub.dev',
      password: hashedPassword,
      role: 'participant',
      avatar: 'LW',
      initialsColor: 'bg-gradient-to-br from-teal-500 to-cyan-600',
      bio: 'Mobile developer exploring cross-platform solutions.',
      skills: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
      eventsAttending: [],
      eventsHosting: [],
      joinedDate: '2024-05-01',
    },
  ];

  // Add all users
  dataStore.users = [admin, ...organizers, ...participants];

  // ===== 25 EVENTS (5 per organizer) =====
  const getFutureDate = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  };

  const eventTemplates = [
    { title: 'AI & Machine Learning Summit', category: 'conference', location: 'San Francisco, CA', capacity: 500, tags: ['AI', 'ML', 'Deep Learning', 'Python'] },
    { title: 'React Advanced Patterns Workshop', category: 'workshop', location: 'Online (Zoom)', capacity: 100, tags: ['React', 'TypeScript', 'Frontend'] },
    { title: 'Tech Meetup: Building Scalable Systems', category: 'meetup', location: 'Austin, TX', capacity: 80, tags: ['System Design', 'Microservices'] },
    { title: 'Web3 & Smart Contracts Bootcamp', category: 'webinar', location: 'Online (YouTube)', capacity: 1000, tags: ['Web3', 'Blockchain', 'Solidity'] },
    { title: 'DevOps Best Practices Conference', category: 'conference', location: 'London, UK', capacity: 2000, tags: ['DevOps', 'Kubernetes', 'CI/CD'] },
    { title: 'Fullstack TypeScript Masterclass', category: 'workshop', location: 'Online (Discord)', capacity: 50, tags: ['TypeScript', 'Next.js', 'tRPC'] },
    { title: 'Cloud Native Architecture Summit', category: 'conference', location: 'Berlin, Germany', capacity: 1500, tags: ['Kubernetes', 'Serverless', 'Cloud'] },
    { title: 'Tech Social: Summer Networking Mixer', category: 'social', location: 'Seattle, WA', capacity: 120, tags: ['Networking', 'Community'] },
    { title: 'Intro to Python for Data Science', category: 'workshop', location: 'Online (Zoom)', capacity: 200, tags: ['Python', 'Data Science', 'Pandas'] },
    { title: 'Cybersecurity in the Cloud Era', category: 'webinar', location: 'Online', capacity: 500, tags: ['Security', 'Cloud', 'DevSecOps'] },
    { title: 'Mobile App Development Workshop', category: 'workshop', location: 'New York, NY', capacity: 60, tags: ['React Native', 'Flutter', 'Mobile'] },
    { title: 'Blockchain for Enterprise Conference', category: 'conference', location: 'Singapore', capacity: 800, tags: ['Blockchain', 'Enterprise', 'Web3'] },
    { title: 'UI/UX Design Masterclass', category: 'workshop', location: 'Online (Figma)', capacity: 150, tags: ['UI/UX', 'Design', 'Figma'] },
    { title: 'Tech Leadership Summit 2025', category: 'conference', location: 'Chicago, IL', capacity: 300, tags: ['Leadership', 'Management', 'Tech'] },
    { title: 'Data Engineering Bootcamp', category: 'workshop', location: 'Online (Zoom)', capacity: 100, tags: ['Data Engineering', 'ETL', 'Big Data'] },
    { title: 'AI Ethics & Responsible Tech', category: 'webinar', location: 'Online', capacity: 400, tags: ['AI Ethics', 'Responsible AI'] },
    { title: 'Kubernetes Deep Dive Workshop', category: 'workshop', location: 'San Jose, CA', capacity: 80, tags: ['Kubernetes', 'DevOps', 'Containers'] },
    { title: 'Tech Career Fair & Networking', category: 'social', location: 'Los Angeles, CA', capacity: 300, tags: ['Career', 'Networking', 'Jobs'] },
    { title: 'Modern JavaScript Ecosystem', category: 'meetup', location: 'Online (Discord)', capacity: 200, tags: ['JavaScript', 'Node.js', 'Frontend'] },
    { title: 'AI in Healthcare Conference', category: 'conference', location: 'Boston, MA', capacity: 600, tags: ['AI', 'Healthcare', 'ML'] },
    { title: 'Edge Computing & IoT Workshop', category: 'workshop', location: 'Online (Zoom)', capacity: 75, tags: ['IoT', 'Edge Computing', 'Hardware'] },
    { title: 'Tech Diversity & Inclusion Summit', category: 'conference', location: 'Portland, OR', capacity: 400, tags: ['Diversity', 'Inclusion', 'Community'] },
    { title: 'Advanced React Native Workshop', category: 'workshop', location: 'Online', capacity: 60, tags: ['React Native', 'Mobile', 'JavaScript'] },
    { title: 'Web Performance Optimization', category: 'webinar', location: 'Online', capacity: 300, tags: ['Performance', 'Web', 'Optimization'] },
    { title: 'Tech Startup Founder Meetup', category: 'meetup', location: 'Miami, FL', capacity: 150, tags: ['Startup', 'Founders', 'Networking'] },
  ];

  const eventImages = [
    'https://images.unsplash.com/photo-1504384308090-c54be3855833?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1531498860502-7c67cf02f657?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop',
  ];

  const organizerEventDescriptions = [
    'Join us for an exciting event focused on cutting-edge technology and innovation.',
    'Learn from industry experts and network with fellow tech enthusiasts.',
    'A hands-on workshop designed to take your skills to the next level.',
    'Connect with the community and explore the latest trends in tech.',
    'An immersive experience that will transform your understanding of modern technology.',
  ];

  // Create events - 5 per organizer (25 total)
  let eventId = 0;
  const allParticipantIds = participants.map(p => p.id);

  organizers.forEach((organizer, orgIndex) => {
    for (let i = 0; i < 5; i++) {
      const templateIndex = (orgIndex * 5 + i) % eventTemplates.length;
      const template = eventTemplates[templateIndex];
      const daysOffset = (orgIndex * 5 + i) * 3 + 7;
      
      const shuffled = [...allParticipantIds].sort(() => 0.5 - Math.random());
      const eventAttendees = shuffled.slice(0, 4);

      const newEvent = {
        id: 'evt-' + (++eventId),
        title: template.title,
        description: organizerEventDescriptions[orgIndex % organizerEventDescriptions.length] + ` Hosted by ${organizer.name}.`,
        date: getFutureDate(daysOffset),
        time: `${9 + (i % 8)}:${i % 2 === 0 ? '00' : '30'}`,
        endTime: `${9 + (i % 8) + 2}:${i % 2 === 0 ? '00' : '30'}`,
        location: template.location,
        category: template.category,
        image: eventImages[(orgIndex * 5 + i) % eventImages.length],
        organizer: { 
          id: organizer.id, 
          name: organizer.name, 
          avatar: organizer.avatar, 
          initialsColor: organizer.initialsColor 
        },
        attendees: eventAttendees,
        capacity: template.capacity,
        tags: template.tags,
        status: 'upcoming',
        speakers: [
          { name: organizer.name, role: 'Event Host & Speaker', topic: template.tags[0] + ' in Modern Tech' },
          { name: participants[i % participants.length].name, role: 'Guest Speaker', topic: 'Real-world Applications' },
        ],
        agenda: [
          { time: '09:00', title: 'Registration & Breakfast', type: 'social' },
          { time: '10:00', title: 'Opening Keynote', type: 'keynote' },
          { time: '11:30', title: 'Main Session', type: 'work' },
          { time: '13:00', title: 'Lunch Break', type: 'social' },
          { time: '14:00', title: 'Workshop / Panel', type: 'work' },
          { time: '16:00', title: 'Closing & Networking', type: 'social' },
        ],
      };

      dataStore.events.push(newEvent);

      eventAttendees.forEach(participantId => {
        const participant = dataStore.users.find(u => u.id === participantId);
        if (participant && participant.role === 'participant') {
          participant.eventsAttending.push(newEvent.id);
        }
      });

      organizer.eventsHosting.push(newEvent.id);
    }
  });
}

// ===== SEED THE DATA =====
seedData();

console.log('🌱 Seeded data:');
console.log(`   👤 ${dataStore.users.length} users (1 admin, 5 organizers, 4 participants)`);
console.log(`   📅 ${dataStore.events.length} events (5 per organizer)`);
console.log(`   👥 Each event has 4 participants registered`);

// ===== DATABASE CONNECTION =====
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
    // Drop existing tables to start fresh
    await pool.query(`DROP TABLE IF EXISTS sessions CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS events CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS users CASCADE`);

    // Create users table
    await pool.query(`
      CREATE TABLE users (
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
      CREATE TABLE events (
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
        FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create sessions table
    await pool.query(`
      CREATE TABLE sessions (
        token VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        expires TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database tables recreated');

    // Seed the database
    await seedDatabase();

  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // Insert users
    for (const user of dataStore.users) {
      await pool.query(
        `INSERT INTO users (id, name, email, password, role, avatar, initials_color, bio, skills, events_attending, events_hosting, joined_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (email) DO UPDATE SET
           name = EXCLUDED.name,
           password = EXCLUDED.password,
           role = EXCLUDED.role,
           avatar = EXCLUDED.avatar,
           initials_color = EXCLUDED.initials_color,
           bio = EXCLUDED.bio,
           skills = EXCLUDED.skills,
           events_attending = EXCLUDED.events_attending,
           events_hosting = EXCLUDED.events_hosting,
           joined_date = EXCLUDED.joined_date`,
        [user.id, user.name, user.email, user.password, user.role, user.avatar, user.initialsColor, user.bio, user.skills, user.eventsAttending, user.eventsHosting, user.joinedDate]
      );
    }
    console.log('✅ Users seeded');

    // Insert events
    for (const event of dataStore.events) {
      await pool.query(
        `INSERT INTO events (id, title, description, date, time, end_time, location, category, image, 
          organizer_id, organizer_name, organizer_avatar, organizer_initials_color, attendees, capacity, tags, speakers, agenda, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           date = EXCLUDED.date,
           time = EXCLUDED.time,
           end_time = EXCLUDED.end_time,
           location = EXCLUDED.location,
           category = EXCLUDED.category,
           image = EXCLUDED.image,
           organizer_id = EXCLUDED.organizer_id,
           organizer_name = EXCLUDED.organizer_name,
           organizer_avatar = EXCLUDED.organizer_avatar,
           organizer_initials_color = EXCLUDED.organizer_initials_color,
           attendees = EXCLUDED.attendees,
           capacity = EXCLUDED.capacity,
           tags = EXCLUDED.tags,
           speakers = EXCLUDED.speakers,
           agenda = EXCLUDED.agenda,
           status = EXCLUDED.status`,
        [
          event.id, event.title, event.description, event.date, event.time, event.endTime,
          event.location, event.category, event.image,
          event.organizer.id, event.organizer.name, event.organizer.avatar, event.organizer.initialsColor,
          event.attendees, event.capacity, event.tags, JSON.stringify(event.speakers), JSON.stringify(event.agenda), event.status
        ]
      );
    }
    console.log('✅ Events seeded');

    // Clear any existing sessions
    await pool.query(`DELETE FROM sessions`);
    console.log('✅ Sessions cleared');

    console.log('✅ Database seeded successfully');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

// ===== AUTH UTILITIES =====
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
    const session = sessions.get(token);
    if (!session || session.expires < Date.now()) {
      sessions.delete(token);
      return null;
    }
    return dataStore.users.find(u => u.id === session.userId) || null;
  }
}

const sessions = new Map();

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

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('🔐 Login attempt:', email);

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  let user;
  if (useDatabase) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.trim().toLowerCase()]);
    user = result.rows[0];
  } else {
    user = dataStore.users.find(u => u.email === email.trim().toLowerCase());
  }
  
  if (!user) {
    console.log('❌ User not found:', email);
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const hashedInput = hashPassword(password);
  if (user.password !== hashedInput) {
    console.log('❌ Password mismatch');
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  console.log('✅ Login successful:', user.email);

  const token = await createSession(user.id);
  const { password: _, ...userWithoutPassword } = user;
  res.json({ token, user: userWithoutPassword });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const hashedPassword = hashPassword(password);
  const userId = 'user-' + Date.now();

  const newUser = {
    id: userId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: hashedPassword,
    role: role || 'participant',
    avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    initialsColor: 'bg-gradient-to-br from-brand-500 to-violet-600',
    bio: '',
    skills: [],
    eventsAttending: [],
    eventsHosting: [],
    joinedDate: new Date().toISOString().split('T')[0],
  };

  if (useDatabase) {
    try {
      await pool.query(
        `INSERT INTO users (id, name, email, password, role, avatar, initials_color, bio, skills, events_attending, events_hosting, joined_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [newUser.id, newUser.name, newUser.email, newUser.password, newUser.role,
         newUser.avatar, newUser.initialsColor, newUser.bio, newUser.skills, newUser.eventsAttending, newUser.eventsHosting, newUser.joinedDate]
      );
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Email already registered' });
      }
      throw err;
    }
  } else {
    const existingUser = dataStore.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    dataStore.users.push(newUser);
  }

  const token = await createSession(newUser.id);
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ token, user: userWithoutPassword });
});

app.post('/api/auth/logout', requireAuth, async (req, res) => {
  if (useDatabase) {
    await pool.query('DELETE FROM sessions WHERE token = $1', [req.token]);
  } else {
    sessions.delete(req.token);
  }
  res.json({ message: 'Logged out' });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  const { password: _, ...userWithoutPassword } = req.user;
  res.json({ user: userWithoutPassword });
});

// ===== PUBLIC EVENTS API =====

app.get('/api/events', async (req, res) => {
  const { category, status, q } = req.query;
  
  let events;
  if (useDatabase) {
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
    events = result.rows;
  } else {
    events = [...dataStore.events];
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
  }
  
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
  let event;
  if (useDatabase) {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    event = result.rows[0];
  } else {
    event = dataStore.events.find(e => e.id === req.params.id);
  }
  
  if (!event) return res.status(404).json({ error: 'Event not found' });

  let attendeeDetails = [];
  if (event.attendees && event.attendees.length > 0) {
    if (useDatabase) {
      const result = await pool.query(
        'SELECT id, name, avatar, initials_color FROM users WHERE id = ANY($1)',
        [event.attendees]
      );
      attendeeDetails = result.rows;
    } else {
      attendeeDetails = event.attendees.map(uid => {
        const u = dataStore.users.find(user => user.id === uid);
        if (!u) return null;
        const { password: _, ...safe } = u;
        return { id: safe.id, name: safe.name, avatar: safe.avatar, initialsColor: safe.initialsColor };
      }).filter(Boolean);
    }
  }

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

app.get('/api/stats', async (req, res) => {
  let totalEvents, totalAttendees, totalUsers, totalOrganizers;
  
  if (useDatabase) {
    const eventsResult = await pool.query('SELECT COUNT(*) as total FROM events');
    const usersResult = await pool.query('SELECT COUNT(*) as total FROM users');
    const organizersResult = await pool.query('SELECT COUNT(*) as total FROM users WHERE role = $1', ['organizer']);
    const attendeesResult = await pool.query('SELECT COALESCE(SUM(array_length(attendees, 1)), 0) as total FROM events');
    
    totalEvents = parseInt(eventsResult.rows[0].total) || 0;
    totalUsers = parseInt(usersResult.rows[0].total) || 0;
    totalOrganizers = parseInt(organizersResult.rows[0].total) || 0;
    totalAttendees = parseInt(attendeesResult.rows[0].total) || 0;
  } else {
    totalEvents = dataStore.events.length;
    totalUsers = dataStore.users.length;
    totalOrganizers = dataStore.users.filter(u => u.role === 'organizer').length;
    totalAttendees = dataStore.events.reduce((sum, e) => sum + (e.attendees?.length || 0), 0);
  }

  res.json({
    totalEvents,
    totalAttendees,
    totalUsers,
    totalOrganizers,
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
    organizer: { id: req.user.id, name: req.user.name, avatar: req.user.avatar, initialsColor: req.user.initialsColor },
    attendees: [],
    capacity: parseInt(capacity, 10),
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()).filter(t => t) : []),
    status: 'upcoming',
    speakers: [],
    agenda: [],
  };

  if (useDatabase) {
    await pool.query(
      `INSERT INTO events (id, title, description, date, time, location, category, image, 
        organizer_id, organizer_name, organizer_avatar, organizer_initials_color, attendees, capacity, tags, speakers, agenda, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
      [
        newEvent.id, newEvent.title, newEvent.description, newEvent.date, newEvent.time,
        newEvent.location, newEvent.category, newEvent.image,
        newEvent.organizer.id, newEvent.organizer.name, newEvent.organizer.avatar, newEvent.organizer.initialsColor,
        newEvent.attendees, newEvent.capacity, newEvent.tags, newEvent.speakers, newEvent.agenda, newEvent.status
      ]
    );
    req.user.eventsHosting.push(newEvent.id);
  } else {
    dataStore.events.unshift(newEvent);
    req.user.eventsHosting.push(newEvent.id);
  }

  res.status(201).json({ event: newEvent });
});

app.put('/api/events/:id', requireAuth, async (req, res) => {
  let event;
  if (useDatabase) {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    event = result.rows[0];
  } else {
    event = dataStore.events.find(e => e.id === req.params.id);
  }
  
  if (!event) return res.status(404).json({ error: 'Event not found' });

  if (event.organizer_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'You can only edit your own events' });
  }

  const { title, description, date, time, location, category, capacity, tags } = req.body;
  
  if (useDatabase) {
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
    event = updatedResult.rows[0];
  } else {
    const idx = dataStore.events.findIndex(e => e.id === req.params.id);
    dataStore.events[idx] = { ...event, ...req.body };
    event = dataStore.events[idx];
  }

  res.json({ event });
});

app.delete('/api/events/:id', requireAuth, async (req, res) => {
  let event;
  if (useDatabase) {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    event = result.rows[0];
  } else {
    event = dataStore.events.find(e => e.id === req.params.id);
  }
  
  if (!event) return res.status(404).json({ error: 'Event not found' });

  if (event.organizer_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'You can only delete your own events' });
  }

  if (useDatabase) {
    await pool.query('DELETE FROM events WHERE id = $1', [req.params.id]);
  } else {
    const idx = dataStore.events.findIndex(e => e.id === req.params.id);
    dataStore.events.splice(idx, 1);
  }

  res.json({ message: 'Event deleted' });
});

// ===== RSVP =====

app.post('/api/events/:id/rsvp', requireAuth, requireRole(['participant', 'organizer', 'admin']), async (req, res) => {
  let event;
  if (useDatabase) {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    event = result.rows[0];
  } else {
    event = dataStore.events.find(e => e.id === req.params.id);
  }
  
  if (!event) return res.status(404).json({ error: 'Event not found' });

  let attendees = event.attendees || [];
  const idx = attendees.indexOf(req.user.id);
  const attending = idx !== -1;

  if (attending) {
    attendees.splice(idx, 1);
    if (useDatabase) {
      await pool.query('UPDATE users SET events_attending = array_remove(events_attending, $1) WHERE id = $2', [event.id, req.user.id]);
      await pool.query('UPDATE events SET attendees = $1 WHERE id = $2', [attendees, req.params.id]);
    } else {
      req.user.eventsAttending = req.user.eventsAttending.filter(id => id !== event.id);
    }
  } else {
    if (attendees.length >= event.capacity) {
      return res.status(400).json({ error: 'Event is full' });
    }
    attendees.push(req.user.id);
    if (useDatabase) {
      await pool.query('UPDATE users SET events_attending = array_append(events_attending, $1) WHERE id = $2', [event.id, req.user.id]);
      await pool.query('UPDATE events SET attendees = $1 WHERE id = $2', [attendees, req.params.id]);
    } else {
      req.user.eventsAttending.push(event.id);
    }
  }

  res.json({ attending: !attending, event: { ...event, attendees } });
});

app.get('/api/events/:id/rsvp', requireAuth, async (req, res) => {
  let event;
  if (useDatabase) {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    event = result.rows[0];
  } else {
    event = dataStore.events.find(e => e.id === req.params.id);
  }
  
  if (!event) return res.status(404).json({ error: 'Event not found' });
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

  if (useDatabase) {
    const setClause = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = Object.values(updates);
    values.push(req.user.id);
    await pool.query(`UPDATE users SET ${setClause} WHERE id = $${values.length}`, values);
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    req.user = result.rows[0];
  } else {
    Object.assign(req.user, updates);
  }

  const { password: _, ...user } = req.user;
  res.json({ user });
});

app.get('/api/user/events/attending', requireAuth, async (req, res) => {
  let events;
  if (useDatabase) {
    const userEvents = req.user.events_attending || [];
    if (userEvents.length === 0) {
      return res.json({ events: [] });
    }
    const result = await pool.query('SELECT * FROM events WHERE id = ANY($1)', [userEvents]);
    events = result.rows;
  } else {
    events = dataStore.events.filter(e => req.user.eventsAttending.includes(e.id));
  }
  res.json({ events });
});

app.get('/api/user/events/hosting', requireAuth, async (req, res) => {
  let events;
  if (useDatabase) {
    const result = await pool.query('SELECT * FROM events WHERE organizer_id = $1', [req.user.id]);
    events = result.rows;
  } else {
    events = dataStore.events.filter(e => e.organizer.id === req.user.id);
  }
  res.json({ events });
});

// ===== ADMIN API =====

app.get('/api/admin/users', requireAuth, requireRole(['admin']), async (req, res) => {
  let users;
  if (useDatabase) {
    const result = await pool.query('SELECT id, name, email, role, avatar, initials_color, bio, skills, joined_date FROM users');
    users = result.rows;
  } else {
    users = dataStore.users.map(u => {
      const { password: _, ...user } = u;
      return user;
    });
  }
  res.json({ users });
});

app.get('/api/admin/events', requireAuth, requireRole(['admin']), async (req, res) => {
  let events;
  if (useDatabase) {
    const result = await pool.query('SELECT * FROM events');
    events = result.rows;
  } else {
    events = dataStore.events;
  }
  res.json({ events });
});

app.get('/api/admin/stats', requireAuth, requireRole(['admin']), async (req, res) => {
  const now = new Date().toISOString().split('T')[0];
  let stats;
  
  if (useDatabase) {
    const usersResult = await pool.query('SELECT COUNT(*) as total FROM users');
    const eventsResult = await pool.query('SELECT COUNT(*) as total FROM events');
    const participantsResult = await pool.query('SELECT COUNT(*) as total FROM users WHERE role = $1', ['participant']);
    const organizersResult = await pool.query('SELECT COUNT(*) as total FROM users WHERE role = $1', ['organizer']);
    const adminsResult = await pool.query('SELECT COUNT(*) as total FROM users WHERE role = $1', ['admin']);
    const upcomingResult = await pool.query('SELECT COUNT(*) as total FROM events WHERE date >= $1', [now]);
    const pastResult = await pool.query('SELECT COUNT(*) as total FROM events WHERE date < $1', [now]);
    const attendeesResult = await pool.query('SELECT COALESCE(SUM(array_length(attendees, 1)), 0) as total FROM events');

    stats = {
      totalUsers: parseInt(usersResult.rows[0].total),
      totalEvents: parseInt(eventsResult.rows[0].total),
      totalAttendees: parseInt(attendeesResult.rows[0].total),
      participants: parseInt(participantsResult.rows[0].total),
      organizers: parseInt(organizersResult.rows[0].total),
      admins: parseInt(adminsResult.rows[0].total),
      upcomingEvents: parseInt(upcomingResult.rows[0].total),
      pastEvents: parseInt(pastResult.rows[0].total),
    };
  } else {
    stats = {
      totalUsers: dataStore.users.length,
      totalEvents: dataStore.events.length,
      totalAttendees: dataStore.events.reduce((sum, e) => sum + e.attendees.length, 0),
      participants: dataStore.users.filter(u => u.role === 'participant').length,
      organizers: dataStore.users.filter(u => u.role === 'organizer').length,
      admins: dataStore.users.filter(u => u.role === 'admin').length,
      upcomingEvents: dataStore.events.filter(e => e.date >= now).length,
      pastEvents: dataStore.events.filter(e => e.date < now).length,
    };
  }

  res.json(stats);
});

app.delete('/api/admin/users/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete yourself' });
  }
  if (useDatabase) {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
  } else {
    const idx = dataStore.users.findIndex(u => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });
    dataStore.users.splice(idx, 1);
  }
  res.json({ message: 'User deleted' });
});

app.delete('/api/admin/events/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  if (useDatabase) {
    await pool.query('DELETE FROM events WHERE id = $1', [req.params.id]);
  } else {
    const idx = dataStore.events.findIndex(e => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Event not found' });
    dataStore.events.splice(idx, 1);
  }
  res.json({ message: 'Event deleted' });
});

// ===== SPA FALLBACK =====
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  TechMeetHub server running on http://localhost:${PORT}\n`);
  console.log(`  Demo accounts (password: "password"):`);
  console.log(`    admin:       admin@gmail.com`);
  console.log(`    organizer:   sarah@techmeethub.dev`);
  console.log(`    organizer:   alex@techmeethub.dev`);
  console.log(`    organizer:   maya@techmeethub.dev`);
  console.log(`    organizer:   ryan@techmeethub.dev`);
  console.log(`    organizer:   priya@techmeethub.dev`);
  console.log(`    participant: jordan@techmeethub.dev`);
  console.log(`    participant: jasmine@techmeethub.dev`);
  console.log(`    participant: david@techmeethub.dev`);
  console.log(`    participant: lisa@techmeethub.dev\n`);
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
      console.log(`    admin:       admin@gmail.com`);
      console.log(`    organizer:   sarah@techmeethub.dev`);
      console.log(`    organizer:   alex@techmeethub.dev`);
      console.log(`    organizer:   maya@techmeethub.dev`);
      console.log(`    organizer:   ryan@techmeethub.dev`);
      console.log(`    organizer:   priya@techmeethub.dev`);
      console.log(`    participant: jordan@techmeethub.dev`);
      console.log(`    participant: jasmine@techmeethub.dev`);
      console.log(`    participant: david@techmeethub.dev`);
      console.log(`    participant: lisa@techmeethub.dev\n`);
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