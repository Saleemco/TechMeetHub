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

// ===== ASYNC ERROR HANDLING =====
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error('Route error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  };
}

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
        if (stats.isDirectory()) walkDir(fullPath, prefix + item + '/');
        else files.push(prefix + item);
      }
    } catch (e) {}
  }
  walkDir(publicDir);
  res.json({ files: files.sort(), cwd: process.cwd(), publicDir: publicDir });
});

app.get('/debug-check/:file(*)', (req, res) => {
  const filePath = path.join(__dirname, 'public', req.params.file);
  const fs = require('fs');
  if (fs.existsSync(filePath)) res.json({ exists: true, path: filePath });
  else res.json({ exists: false, path: filePath });
});

// ===== HASH PASSWORD FUNCTION =====
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// ===== DATA STORE (In-Memory) =====
let dataStore = {
  events: [],
  users: [],
  attendance: [],
  notifications: [],
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
  dataStore.events = [];
  dataStore.users = [];
  const hashedPassword = hashPassword('password');

  const admin = {
    id: 'admin-1', name: 'Admin User', email: 'admin@gmail.com', password: hashedPassword, role: 'admin',
    avatar: 'AU', initialsColor: 'bg-gradient-to-br from-rose-500 to-pink-600',
    bio: 'Platform Administrator', skills: ['Management', 'Community', 'Tech'],
    eventsAttending: [], eventsHosting: [], joinedDate: new Date().toISOString().split('T')[0],
  };

  const organizers = [
    { id: 'org-1', name: 'Sarah Chen', email: 'sarah@techmeethub.dev', password: hashedPassword, role: 'organizer',
      avatar: 'SC', initialsColor: 'bg-gradient-to-br from-violet-500 to-purple-600',
      bio: 'AI researcher and hackathon organizer. Building communities.',
      skills: ['AI', 'Python', 'TensorFlow', 'Community Building'],
      eventsAttending: [], eventsHosting: [], joinedDate: '2024-01-15' },
    { id: 'org-2', name: 'Alex Rivera', email: 'alex@techmeethub.dev', password: hashedPassword, role: 'organizer',
      avatar: 'AR', initialsColor: 'bg-gradient-to-br from-cyan-500 to-blue-600',
      bio: 'React Core Team Contributor. Teaching workshops worldwide.',
      skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'GraphQL'],
      eventsAttending: [], eventsHosting: [], joinedDate: '2024-01-20' },
    { id: 'org-3', name: 'Maya Patel', email: 'maya@techmeethub.dev', password: hashedPassword, role: 'organizer',
      avatar: 'MP', initialsColor: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      bio: 'Platform engineer and community builder.',
      skills: ['Kubernetes', 'DevOps', 'Go', 'Rust', 'System Design'],
      eventsAttending: [], eventsHosting: [], joinedDate: '2024-02-01' },
    { id: 'org-4', name: "Ryan O'Connor", email: 'ryan@techmeethub.dev', password: hashedPassword, role: 'organizer',
      avatar: 'RO', initialsColor: 'bg-gradient-to-br from-red-500 to-pink-600',
      bio: 'Blockchain developer and Web3 educator.',
      skills: ['Solidity', 'Ethereum', 'Web3', 'JavaScript', 'Rust'],
      eventsAttending: [], eventsHosting: [], joinedDate: '2024-02-15' },
    { id: 'org-5', name: 'Priya Sharma', email: 'priya@techmeethub.dev', password: hashedPassword, role: 'organizer',
      avatar: 'PS', initialsColor: 'bg-gradient-to-br from-amber-500 to-orange-600',
      bio: 'Data scientist and ML engineer. Passionate about teaching.',
      skills: ['Python', 'Machine Learning', 'Data Science', 'PyTorch', 'SQL'],
      eventsAttending: [], eventsHosting: [], joinedDate: '2024-03-01' },
  ];

  const participants = [
    { id: 'part-1', name: 'Jordan Smith', email: 'jordan@techmeethub.dev', password: hashedPassword, role: 'participant',
      avatar: 'JS', initialsColor: 'bg-gradient-to-br from-brand-500 to-violet-600',
      bio: 'Fullstack developer passionate about AI and open source.',
      skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AI/ML'],
      eventsAttending: [], eventsHosting: [], joinedDate: '2024-03-15' },
    { id: 'part-2', name: 'Jasmine Lee', email: 'jasmine@techmeethub.dev', password: hashedPassword, role: 'participant',
      avatar: 'JL', initialsColor: 'bg-gradient-to-br from-pink-500 to-rose-600',
      bio: 'Frontend developer who loves community events.',
      skills: ['Vue', 'CSS', 'Design', 'Community'],
      eventsAttending: [], eventsHosting: [], joinedDate: '2024-04-01' },
    { id: 'part-3', name: 'David Kim', email: 'david@techmeethub.dev', password: hashedPassword, role: 'participant',
      avatar: 'DK', initialsColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      bio: 'Backend engineer interested in distributed systems.',
      skills: ['Go', 'Rust', 'Kubernetes', 'Microservices'],
      eventsAttending: [], eventsHosting: [], joinedDate: '2024-04-15' },
    { id: 'part-4', name: 'Lisa Wong', email: 'lisa@techmeethub.dev', password: hashedPassword, role: 'participant',
      avatar: 'LW', initialsColor: 'bg-gradient-to-br from-teal-500 to-cyan-600',
      bio: 'Mobile developer exploring cross-platform solutions.',
      skills: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
      eventsAttending: [], eventsHosting: [], joinedDate: '2024-05-01' },
  ];

  dataStore.users = [admin, ...organizers, ...participants];

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
        organizer: { id: organizer.id, name: organizer.name, avatar: organizer.avatar, initialsColor: organizer.initialsColor },
        attendees: eventAttendees,
        attendance: [],
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

seedData();
console.log('🌱 Seeded data:');
console.log(`   👤 ${dataStore.users.length} users (1 admin, 5 organizers, 4 participants)`);
console.log(`   📅 ${dataStore.events.length} events (5 per organizer)`);
console.log(`   👥 Each event has 4 participants registered`);

// ===== EMAIL (BREVO) =====
const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM_ADDRESS || 'noreply@techmeethub.dev';
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'TechMeetHub';
const emailEnabled = !!BREVO_API_KEY;

if (emailEnabled) {
  console.log(`✅ Brevo email ready — sending as "${EMAIL_FROM_NAME}" <${EMAIL_FROM_ADDRESS}>`);
} else {
  console.log('⚠️  Email not configured. Notifications will log to console only.');
  console.log('   Set BREVO_API_KEY (and optionally EMAIL_FROM_ADDRESS, EMAIL_FROM_NAME) to enable real email.');
}

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
    try {
      await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS attendance TEXT[] DEFAULT '{}'`);
    } catch (e) {}

    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance_records (
        id VARCHAR(50) PRIMARY KEY,
        event_id VARCHAR(50) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        marked_by VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'present',
        UNIQUE(event_id, user_id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(50) PRIMARY KEY,
        event_id VARCHAR(50) REFERENCES events(id) ON DELETE SET NULL,
        recipient_email VARCHAR(100) NOT NULL,
        recipient_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
        subject VARCHAR(200) NOT NULL,
        body TEXT NOT NULL,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        type VARCHAR(50) DEFAULT 'general',
        status VARCHAR(20) DEFAULT 'sent'
      )
    `);

    const checkResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'users'
      )
    `);
    const tablesExist = checkResult.rows[0].exists;

    if (tablesExist) {
      console.log('✅ Database already initialized, skipping reseed');
      return;
    }

    await pool.query(`DROP TABLE IF EXISTS sessions CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS events CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS users CASCADE`);

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
        attendance TEXT[] DEFAULT '{}',
        capacity INTEGER DEFAULT 100,
        tags TEXT[],
        status VARCHAR(20) DEFAULT 'upcoming',
        speakers JSONB,
        agenda JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

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
    await seedDatabase();
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');
    for (const user of dataStore.users) {
      await pool.query(
        `INSERT INTO users (id, name, email, password, role, avatar, initials_color, bio, skills, events_attending, events_hosting, joined_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (email) DO UPDATE SET
           name = EXCLUDED.name, password = EXCLUDED.password, role = EXCLUDED.role,
           avatar = EXCLUDED.avatar, initials_color = EXCLUDED.initials_color,
           bio = EXCLUDED.bio, skills = EXCLUDED.skills,
           events_attending = EXCLUDED.events_attending, events_hosting = EXCLUDED.events_hosting,
           joined_date = EXCLUDED.joined_date`,
        [user.id, user.name, user.email, user.password, user.role, user.avatar, user.initialsColor, user.bio, user.skills, user.eventsAttending, user.eventsHosting, user.joinedDate]
      );
    }
    console.log('✅ Users seeded');

    for (const event of dataStore.events) {
      await pool.query(
        `INSERT INTO events (id, title, description, date, time, end_time, location, category, image, 
          organizer_id, organizer_name, organizer_avatar, organizer_initials_color, attendees, attendance, capacity, tags, speakers, agenda, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title, description = EXCLUDED.description, date = EXCLUDED.date,
           time = EXCLUDED.time, end_time = EXCLUDED.end_time, location = EXCLUDED.location,
           category = EXCLUDED.category, image = EXCLUDED.image,
           organizer_id = EXCLUDED.organizer_id, organizer_name = EXCLUDED.organizer_name,
           organizer_avatar = EXCLUDED.organizer_avatar, organizer_initials_color = EXCLUDED.organizer_initials_color,
           attendees = EXCLUDED.attendees, attendance = EXCLUDED.attendance,
           capacity = EXCLUDED.capacity, tags = EXCLUDED.tags,
           speakers = EXCLUDED.speakers, agenda = EXCLUDED.agenda, status = EXCLUDED.status`,
        [
          event.id, event.title, event.description, event.date, event.time, event.endTime,
          event.location, event.category, event.image,
          event.organizer.id, event.organizer.name, event.organizer.avatar, event.organizer.initialsColor,
          event.attendees, event.attendance, event.capacity, event.tags,
          JSON.stringify(event.speakers), JSON.stringify(event.agenda), event.status
        ]
      );
    }
    console.log('✅ Events seeded');
    await pool.query(`DELETE FROM sessions`);
    console.log('✅ Sessions cleared');
    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

// ===== EMAIL HELPERS (BREVO) =====
async function sendEmail({ to, toName, subject, html, text }) {
  if (!emailEnabled) {
    console.log('=== EMAIL (console fallback) ===');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('================================');
    return { success: true, messageId: 'console-' + Date.now(), logged: true };
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: EMAIL_FROM_NAME, email: EMAIL_FROM_ADDRESS },
        to: [{ email: to, name: toName || undefined }],
        subject,
        htmlContent: html,
        ...(text ? { textContent: text } : {}),
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('📧 Brevo email send failed:', response.status, data);
      return { success: false, error: data.message || `Brevo API error (${response.status})` };
    }

    console.log('📧 Email sent via Brevo:', data.messageId);
    return { success: true, messageId: data.messageId };
  } catch (err) {
    console.error('📧 Email send failed:', err.message);
    return { success: false, error: err.message };
  }
}

async function logNotification({ eventId, recipientEmail, recipientId, subject, body, type, status }) {
  const id = 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
  if (useDatabase) {
    await pool.query(
      `INSERT INTO notifications (id, event_id, recipient_email, recipient_id, subject, body, type, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [id, eventId || null, recipientEmail, recipientId || null, subject, body, type, status]
    );
  } else {
    dataStore.notifications.push({ 
      id, event_id: eventId, recipient_email: recipientEmail, recipient_id: recipientId, 
      subject, body, sent_at: new Date().toISOString(), type, status 
    });
  }
  return id;
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

const requireAuth = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;
  const user = await getUserFromToken(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  req.user = user;
  req.token = token;
  next();
});

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

// ===== AUTH ENDPOINTS =====
app.post('/api/auth/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log('🔐 Login attempt:', email);
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  let user;
  if (useDatabase) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.trim().toLowerCase()]);
    user = result.rows[0];
  } else {
    user = dataStore.users.find(u => u.email === email.trim().toLowerCase());
  }
  if (!user) { console.log('❌ User not found:', email); return res.status(401).json({ error: 'Invalid email or password' }); }

  const hashedInput = hashPassword(password);
  if (user.password !== hashedInput) { console.log('❌ Password mismatch'); return res.status(401).json({ error: 'Invalid email or password' }); }

  console.log('✅ Login successful:', user.email);
  const token = await createSession(user.id);
  const { password: _, ...userWithoutPassword } = user;
  res.json({ token, user: userWithoutPassword });
}));

app.post('/api/auth/register', asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required' });

  const hashedPassword = hashPassword(password);
  const userId = 'user-' + Date.now();
  const newUser = {
    id: userId, name: name.trim(), email: email.trim().toLowerCase(), password: hashedPassword,
    role: role || 'participant',
    avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    initialsColor: 'bg-gradient-to-br from-brand-500 to-violet-600',
    bio: '', skills: [], eventsAttending: [], eventsHosting: [],
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
      if (err.code === '23505') return res.status(409).json({ error: 'Email already registered' });
      throw err;
    }
  } else {
    if (dataStore.users.find(u => u.email === email)) return res.status(409).json({ error: 'Email already registered' });
    dataStore.users.push(newUser);
  }

  const token = await createSession(newUser.id);
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ token, user: userWithoutPassword });
}));

app.post('/api/auth/logout', requireAuth, asyncHandler(async (req, res) => {
  if (useDatabase) await pool.query('DELETE FROM sessions WHERE token = $1', [req.token]);
  else sessions.delete(req.token);
  res.json({ message: 'Logged out' });
}));

app.get('/api/auth/me', requireAuth, (req, res) => {
  const { password: _, ...userWithoutPassword } = req.user;
  res.json({ user: userWithoutPassword });
});

// ===== PUBLIC EVENTS API =====
app.get('/api/events', asyncHandler(async (req, res) => {
  const { category, status, q } = req.query;
  let events;
  if (useDatabase) {
    let query = 'SELECT * FROM events';
    let params = [];
    let conditions = [];
    if (category && category !== 'all') { conditions.push(`category = $${params.length + 1}`); params.push(category); }
    if (status && status !== 'all') { conditions.push(`status = $${params.length + 1}`); params.push(status); }
    if (q) { conditions.push(`(title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1} OR location ILIKE $${params.length + 1})`); params.push(`%${q}%`); }
    if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY date ASC';
    const result = await pool.query(query, params);
    events = result.rows;
  } else {
    events = [...dataStore.events];
    if (category && category !== 'all') events = events.filter(e => e.category === category);
    if (status && status !== 'all') events = events.filter(e => e.status === status);
    if (q) {
      const query = q.toLowerCase();
      events = events.filter(e => e.title.toLowerCase().includes(query) || e.description.toLowerCase().includes(query) || e.location.toLowerCase().includes(query) || e.tags.some(t => t.toLowerCase().includes(query)));
    }
  }
  const transformedEvents = events.map(event => ({
    ...event,
    organizer: event.organizer || {
      id: event.organizer_id || '', name: event.organizer_name || 'Unknown Organizer',
      avatar: event.organizer_avatar || '?',
      initialsColor: event.organizer_initials_color || 'bg-gradient-to-br from-brand-500 to-violet-600'
    }
  }));
  res.json({ events: transformedEvents });
}));

app.get('/api/events/:id', asyncHandler(async (req, res) => {
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
      const result = await pool.query('SELECT id, name, avatar, initials_color FROM users WHERE id = ANY($1)', [event.attendees]);
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
    id: event.organizer_id || '', name: event.organizer_name || 'Unknown Organizer',
    avatar: event.organizer_avatar || '?',
    initialsColor: event.organizer_initials_color || 'bg-gradient-to-br from-brand-500 to-violet-600',
  };

  res.json({
    event: { ...event, organizer, attendeeDetails, attendees: event.attendees || [], speakers: event.speakers || [], agenda: event.agenda || [] }
  });
}));

app.get('/api/categories', (req, res) => {
  res.json({ categories: dataStore.categories });
});

app.get('/api/stats', asyncHandler(async (req, res) => {
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
  res.json({ totalEvents, totalAttendees, totalUsers, totalOrganizers });
}));

// ===== VENUE CONFLICT DETECTION =====
function timeToMinutes(t) {
  if (!t) return null;
  const [h, m] = t.split(':').map(Number);
  if (Number.isNaN(h)) return null;
  return h * 60 + (Number.isNaN(m) ? 0 : m);
}

function minutesToTime(mins) {
  const wrapped = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// If no end time is given, assume a 2-hour block so a conflict check has something to compare.
function computeDefaultEndTime(time) {
  const start = timeToMinutes(time);
  if (start === null) return '';
  return minutesToTime(start + 120);
}

function rangesOverlap(startA, endA, startB, endB) {
  const aStart = timeToMinutes(startA);
  const bStart = timeToMinutes(startB);
  if (aStart === null || bStart === null) return false;
  const aEnd = timeToMinutes(endA) ?? aStart + 1;
  const bEnd = timeToMinutes(endB) ?? bStart + 1;
  return aStart < bEnd && bStart < aEnd;
}

// Looks for another event at the same venue, on the same date, whose time range overlaps.
async function findVenueConflict({ location, date, time, endTime, excludeEventId }) {
  if (!location || !date || !time) return null;
  let candidates = [];
  if (useDatabase) {
    const result = await pool.query(
      'SELECT id, title, time, end_time FROM events WHERE location = $1 AND date = $2 AND id != $3',
      [location, date, excludeEventId || '']
    );
    candidates = result.rows.map((r) => ({ id: r.id, title: r.title, time: r.time, endTime: r.end_time }));
  } else {
    candidates = dataStore.events
      .filter((e) => e.location === location && e.date === date && e.id !== excludeEventId)
      .map((e) => ({ id: e.id, title: e.title, time: e.time, endTime: e.endTime }));
  }
  return candidates.find((e) => rangesOverlap(time, endTime, e.time, e.endTime)) || null;
}

// ===== PROTECTED EVENTS API =====
app.post('/api/events', requireAuth, requireRole(['organizer', 'admin']), asyncHandler(async (req, res) => {
  const { title, category, date, time, endTime, location, capacity, description, tags } = req.body;
  if (!title || !category || !date || !location || !capacity) return res.status(400).json({ error: 'Missing required fields' });

  const trimmedLocation = location.trim();
  const finalEndTime = endTime || computeDefaultEndTime(time);

  if (time && finalEndTime && timeToMinutes(finalEndTime) <= timeToMinutes(time)) {
    return res.status(400).json({ error: 'End time must be after start time' });
  }

  const conflict = await findVenueConflict({ location: trimmedLocation, date, time, endTime: finalEndTime });
  if (conflict) {
    return res.status(409).json({
      error: `Venue conflict: "${trimmedLocation}" is already booked for "${conflict.title}" on ${date} from ${conflict.time} to ${conflict.endTime || 'TBD'}.`,
    });
  }

  const newEvent = {
    id: 'evt-' + Date.now(), title: title.trim(), description: description || '', date,
    time: time || '', endTime: finalEndTime, location: trimmedLocation, category,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop',
    organizer: { id: req.user.id, name: req.user.name, avatar: req.user.avatar, initialsColor: req.user.initialsColor },
    attendees: [], attendance: [], capacity: parseInt(capacity, 10),
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()).filter(t => t) : []),
    status: 'upcoming', speakers: [], agenda: [],
  };

  if (useDatabase) {
    await pool.query(
      `INSERT INTO events (id, title, description, date, time, end_time, location, category, image, 
        organizer_id, organizer_name, organizer_avatar, organizer_initials_color, attendees, attendance, capacity, tags, speakers, agenda, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
      [
        newEvent.id, newEvent.title, newEvent.description, newEvent.date, newEvent.time, newEvent.endTime,
        newEvent.location, newEvent.category, newEvent.image,
        newEvent.organizer.id, newEvent.organizer.name, newEvent.organizer.avatar, newEvent.organizer.initialsColor,
        newEvent.attendees, newEvent.attendance, newEvent.capacity, newEvent.tags,
        JSON.stringify(newEvent.speakers), JSON.stringify(newEvent.agenda), newEvent.status
      ]
    );
  } else {
    dataStore.events.unshift(newEvent);
    req.user.eventsHosting.push(newEvent.id);
  }
  res.status(201).json({ event: newEvent });
}));

app.put('/api/events/:id', requireAuth, asyncHandler(async (req, res) => {
  let event;
  if (useDatabase) {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    event = result.rows[0];
  } else {
    event = dataStore.events.find(e => e.id === req.params.id);
  }
  if (!event) return res.status(404).json({ error: 'Event not found' });
  if (event.organizer_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'You can only edit your own events' });

  const { title, description, date, time, endTime, location, category, capacity, tags } = req.body;

  const existingEndTime = event.end_time !== undefined ? event.end_time : event.endTime;
  const mergedDate = date || event.date;
  const mergedTime = time || event.time;
  const mergedLocation = location ? location.trim() : event.location;
  const mergedEndTime = endTime || (time ? computeDefaultEndTime(time) : existingEndTime);

  if (mergedTime && mergedEndTime && timeToMinutes(mergedEndTime) <= timeToMinutes(mergedTime)) {
    return res.status(400).json({ error: 'End time must be after start time' });
  }

  const conflict = await findVenueConflict({
    location: mergedLocation, date: mergedDate, time: mergedTime, endTime: mergedEndTime, excludeEventId: req.params.id,
  });
  if (conflict) {
    return res.status(409).json({
      error: `Venue conflict: "${mergedLocation}" is already booked for "${conflict.title}" on ${mergedDate} from ${conflict.time} to ${conflict.endTime || 'TBD'}.`,
    });
  }

  if (useDatabase) {
    await pool.query(
      `UPDATE events SET title = COALESCE($1, title), description = COALESCE($2, description), date = COALESCE($3, date),
        time = COALESCE($4, time), end_time = COALESCE($5, end_time), location = COALESCE($6, location), category = COALESCE($7, category),
        capacity = COALESCE($8, capacity), tags = COALESCE($9, tags) WHERE id = $10`,
      [title, description, date, time, endTime, location, category, capacity, tags, req.params.id]
    );
    const updatedResult = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    event = updatedResult.rows[0];
  } else {
    const idx = dataStore.events.findIndex(e => e.id === req.params.id);
    dataStore.events[idx] = { ...event, ...req.body, endTime: mergedEndTime };
    event = dataStore.events[idx];
  }
  res.json({ event });
}));

app.delete('/api/events/:id', requireAuth, asyncHandler(async (req, res) => {
  let event;
  if (useDatabase) {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    event = result.rows[0];
  } else {
    event = dataStore.events.find(e => e.id === req.params.id);
  }
  if (!event) return res.status(404).json({ error: 'Event not found' });
  if (event.organizer_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'You can only delete your own events' });

  if (useDatabase) await pool.query('DELETE FROM events WHERE id = $1', [req.params.id]);
  else { const idx = dataStore.events.findIndex(e => e.id === req.params.id); dataStore.events.splice(idx, 1); }
  res.json({ message: 'Event deleted' });
}));

// ===== RSVP =====
app.post('/api/events/:id/rsvp', requireAuth, requireRole(['participant', 'organizer', 'admin']), asyncHandler(async (req, res) => {
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
    if (attendees.length >= event.capacity) return res.status(400).json({ error: 'Event is full' });
    attendees.push(req.user.id);
    if (useDatabase) {
      await pool.query('UPDATE users SET events_attending = array_append(events_attending, $1) WHERE id = $2', [event.id, req.user.id]);
      await pool.query('UPDATE events SET attendees = $1 WHERE id = $2', [attendees, req.params.id]);
    } else {
      req.user.eventsAttending.push(event.id);
    }
  }
  res.json({ attending: !attending, event: { ...event, attendees } });
}));

app.get('/api/events/:id/rsvp', requireAuth, asyncHandler(async (req, res) => {
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
}));

// ===== USER PROFILE API =====
app.get('/api/user', requireAuth, (req, res) => {
  const { password: _, ...user } = req.user;
  res.json({ user });
});

app.put('/api/user', requireAuth, asyncHandler(async (req, res) => {
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
}));

app.get('/api/user/events/attending', requireAuth, asyncHandler(async (req, res) => {
  let events;
  if (useDatabase) {
    const userEvents = req.user.events_attending || [];
    if (userEvents.length === 0) return res.json({ events: [] });
    const result = await pool.query('SELECT * FROM events WHERE id = ANY($1)', [userEvents]);
    events = result.rows;
  } else {
    events = dataStore.events.filter(e => req.user.eventsAttending.includes(e.id));
  }
  res.json({ events });
}));

app.get('/api/user/events/hosting', requireAuth, asyncHandler(async (req, res) => {
  let events;
  if (useDatabase) {
    const result = await pool.query('SELECT * FROM events WHERE organizer_id = $1', [req.user.id]);
    events = result.rows;
  } else {
    events = dataStore.events.filter(e => e.organizer.id === req.user.id);
  }
  res.json({ events });
}));

// ===== ADMIN API =====
app.get('/api/admin/users', requireAuth, requireRole(['admin']), asyncHandler(async (req, res) => {
  let users;
  if (useDatabase) {
    const result = await pool.query('SELECT id, name, email, role, avatar, initials_color, bio, skills, joined_date FROM users');
    users = result.rows;
  } else {
    users = dataStore.users.map(u => { const { password: _, ...user } = u; return user; });
  }
  res.json({ users });
}));

app.delete('/api/admin/users', requireAuth, requireRole(['admin']), asyncHandler(async (req, res) => {
  if (useDatabase) await pool.query("DELETE FROM users WHERE role != 'admin'");
  else {
    const removedIds = dataStore.users.filter(u => u.role !== 'admin').map(u => u.id);
    dataStore.users = dataStore.users.filter(u => u.role === 'admin');
    dataStore.events = dataStore.events.filter(e => !removedIds.includes(e.organizer?.id));
  }
  res.json({ message: 'All non-admin users deleted' });
}));

app.get('/api/admin/events', requireAuth, requireRole(['admin']), asyncHandler(async (req, res) => {
  let events;
  if (useDatabase) {
    const result = await pool.query('SELECT * FROM events');
    events = result.rows;
  } else {
    events = dataStore.events;
  }
  res.json({ events });
}));

app.get('/api/admin/stats', requireAuth, requireRole(['admin']), asyncHandler(async (req, res) => {
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
      totalUsers: parseInt(usersResult.rows[0].total), totalEvents: parseInt(eventsResult.rows[0].total),
      totalAttendees: parseInt(attendeesResult.rows[0].total), participants: parseInt(participantsResult.rows[0].total),
      organizers: parseInt(organizersResult.rows[0].total), admins: parseInt(adminsResult.rows[0].total),
      upcomingEvents: parseInt(upcomingResult.rows[0].total), pastEvents: parseInt(pastResult.rows[0].total),
    };
  } else {
    stats = {
      totalUsers: dataStore.users.length, totalEvents: dataStore.events.length,
      totalAttendees: dataStore.events.reduce((sum, e) => sum + e.attendees.length, 0),
      participants: dataStore.users.filter(u => u.role === 'participant').length,
      organizers: dataStore.users.filter(u => u.role === 'organizer').length,
      admins: dataStore.users.filter(u => u.role === 'admin').length,
      upcomingEvents: dataStore.events.filter(e => e.date >= now).length,
      pastEvents: dataStore.events.filter(e => e.date < now).length,
    };
  }
  res.json(stats);
}));

app.delete('/api/admin/users/:id', requireAuth, requireRole(['admin']), asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ error: 'Cannot delete yourself' });
  if (useDatabase) await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
  else {
    const idx = dataStore.users.findIndex(u => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });
    dataStore.users.splice(idx, 1);
  }
  res.json({ message: 'User deleted' });
}));

app.delete('/api/admin/events/:id', requireAuth, requireRole(['admin']), asyncHandler(async (req, res) => {
  if (useDatabase) await pool.query('DELETE FROM events WHERE id = $1', [req.params.id]);
  else {
    const idx = dataStore.events.findIndex(e => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Event not found' });
    dataStore.events.splice(idx, 1);
  }
  res.json({ message: 'Event deleted' });
}));

// ===== ATTENDANCE ENDPOINTS =====
app.post('/api/events/:id/attendance', requireAuth, requireRole(['organizer', 'admin']), asyncHandler(async (req, res) => {
  const { userId, status = 'present' } = req.body;
  const eventId = req.params.id;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  let event;
  if (useDatabase) {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
    event = result.rows[0];
  } else {
    event = dataStore.events.find(e => e.id === eventId);
  }
  if (!event) return res.status(404).json({ error: 'Event not found' });
  if (event.organizer_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only the event organizer or admin can mark attendance' });
  }

  const recordId = 'att-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
  if (useDatabase) {
    await pool.query(
      `INSERT INTO attendance_records (id, event_id, user_id, marked_by, status)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (event_id, user_id) DO UPDATE SET status = EXCLUDED.status, marked_at = CURRENT_TIMESTAMP, marked_by = EXCLUDED.marked_by`,
      [recordId, eventId, userId, req.user.id, status]
    );
    await pool.query(
      `UPDATE events SET attendance = array_append(attendance, $1) WHERE id = $2 AND NOT ($1 = ANY(attendance))`,
      [userId, eventId]
    );
  } else {
    const existing = dataStore.attendance.find(a => a.event_id === eventId && a.user_id === userId);
    if (existing) {
      existing.status = status;
      existing.marked_at = new Date().toISOString();
      existing.marked_by = req.user.id;
    } else {
      dataStore.attendance.push({ id: recordId, event_id: eventId, user_id: userId, marked_by: req.user.id, marked_at: new Date().toISOString(), status });
    }
    if (!event.attendance) event.attendance = [];
    if (!event.attendance.includes(userId)) event.attendance.push(userId);
  }

  let attendee;
  if (useDatabase) {
    const r = await pool.query('SELECT name, email FROM users WHERE id = $1', [userId]);
    attendee = r.rows[0];
  } else {
    attendee = dataStore.users.find(u => u.id === userId);
  }
  if (attendee) {
    const subject = `Attendance Marked: ${event.title}`;
    const html = `<h2>Attendance Confirmation</h2><p>Hi ${attendee.name},</p><p>Your attendance at <strong>${event.title}</strong> on ${event.date} has been marked as <strong>${status}</strong>.</p><p>Thank you for attending!</p>`;
    await sendEmail({ to: attendee.email, toName: attendee.name, subject, html });
    await logNotification({ eventId, recipientEmail: attendee.email, recipientId: userId, subject, body: html, type: 'attendance', status: 'sent' });
  }
  res.json({ message: 'Attendance marked', userId, status });
}));

app.delete('/api/events/:id/attendance/:userId', requireAuth, requireRole(['organizer', 'admin']), asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const userId = req.params.userId;
  let event;
  if (useDatabase) {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
    event = result.rows[0];
  } else {
    event = dataStore.events.find(e => e.id === eventId);
  }
  if (!event) return res.status(404).json({ error: 'Event not found' });
  if (event.organizer_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  if (useDatabase) {
    await pool.query('DELETE FROM attendance_records WHERE event_id = $1 AND user_id = $2', [eventId, userId]);
    await pool.query('UPDATE events SET attendance = array_remove(attendance, $1) WHERE id = $2', [userId, eventId]);
  } else {
    dataStore.attendance = dataStore.attendance.filter(a => !(a.event_id === eventId && a.user_id === userId));
    if (event.attendance) event.attendance = event.attendance.filter(id => id !== userId);
  }
  res.json({ message: 'Attendance removed' });
}));

app.get('/api/events/:id/attendance', requireAuth, requireRole(['organizer', 'admin']), asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  let records;
  if (useDatabase) {
    const result = await pool.query(
      `SELECT a.*, u.name, u.email, u.avatar, u.initials_color
       FROM attendance_records a JOIN users u ON a.user_id = u.id
       WHERE a.event_id = $1 ORDER BY a.marked_at DESC`, [eventId]);
    records = result.rows;
  } else {
    records = dataStore.attendance
      .filter(a => a.event_id === eventId)
      .map(a => {
        const u = dataStore.users.find(user => user.id === a.user_id);
        return { ...a, name: u?.name, email: u?.email, avatar: u?.avatar, initials_color: u?.initialsColor };
      });
  }
  res.json({ attendance: records });
}));

app.get('/api/user/attendance', requireAuth, asyncHandler(async (req, res) => {
  let records;
  if (useDatabase) {
    const result = await pool.query(
      `SELECT a.*, e.title as event_title, e.date as event_date, e.location as event_location
       FROM attendance_records a JOIN events e ON a.event_id = e.id
       WHERE a.user_id = $1 ORDER BY e.date DESC`, [req.user.id]);
    records = result.rows;
  } else {
    records = dataStore.attendance
      .filter(a => a.user_id === req.user.id)
      .map(a => {
        const e = dataStore.events.find(ev => ev.id === a.event_id);
        return { ...a, event_title: e?.title, event_date: e?.date, event_location: e?.location };
      });
  }
  res.json({ attendance: records });
}));

// ===== NOTIFICATION ENDPOINTS =====
app.post('/api/notifications/send', requireAuth, requireRole(['organizer', 'admin']), asyncHandler(async (req, res) => {
  const { eventId, subject, message, type = 'announcement' } = req.body;
  if (!eventId || !subject || !message) return res.status(400).json({ error: 'eventId, subject, and message are required' });

  let event;
  if (useDatabase) {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
    event = result.rows[0];
  } else {
    event = dataStore.events.find(e => e.id === eventId);
  }
  if (!event) return res.status(404).json({ error: 'Event not found' });
  if (event.organizer_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  const attendees = event.attendees || [];
  const results = [];
  for (const attendeeId of attendees) {
    let attendee;
    if (useDatabase) {
      const r = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [attendeeId]);
      attendee = r.rows[0];
    } else {
      attendee = dataStore.users.find(u => u.id === attendeeId);
    }
    if (!attendee) continue;
    const html = `<h2>${subject}</h2><p>Hi ${attendee.name},</p><p>${message.replace(/\n/g, '<br>')}</p><p><em>Event: ${event.title} | ${event.date} | ${event.location}</em></p>`;
    const emailResult = await sendEmail({ to: attendee.email, toName: attendee.name, subject, html });
    const notifId = await logNotification({ eventId, recipientEmail: attendee.email, recipientId: attendee.id, subject, body: message, type, status: emailResult.success ? 'sent' : 'failed' });
    results.push({ userId: attendee.id, email: attendee.email, sent: emailResult.success });
  }
  res.json({ message: 'Notifications sent', count: results.length, results });
}));

app.get('/api/notifications', requireAuth, requireRole(['organizer', 'admin']), asyncHandler(async (req, res) => {
  let notifications;
  if (useDatabase) {
    const result = await pool.query(
      `SELECT n.*, e.title as event_title FROM notifications n
       LEFT JOIN events e ON n.event_id = e.id ORDER BY n.sent_at DESC LIMIT 100`);
    notifications = result.rows;
  } else {
    notifications = dataStore.notifications.map(n => {
      const e = dataStore.events.find(ev => ev.id === n.event_id);
      return { ...n, event_title: e?.title };
    }).reverse();
  }
  res.json({ notifications });
}));

// ===== REPORTING ENDPOINTS =====
app.get('/api/reports/attendance/:eventId', requireAuth, requireRole(['organizer', 'admin']), asyncHandler(async (req, res) => {
  const eventId = req.params.eventId;
  let event;
  if (useDatabase) {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
    event = result.rows[0];
  } else {
    event = dataStore.events.find(e => e.id === eventId);
  }
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const attendees = event.attendees || [];
  let attendanceRecords;
  if (useDatabase) {
    const result = await pool.query('SELECT user_id, status FROM attendance_records WHERE event_id = $1', [eventId]);
    attendanceRecords = result.rows;
  } else {
    attendanceRecords = dataStore.attendance.filter(a => a.event_id === eventId);
  }

  const attendedIds = new Set(attendanceRecords.map(a => a.user_id));
  const presentCount = attendanceRecords.filter(a => a.status === 'present').length;
  const absentCount = attendanceRecords.filter(a => a.status === 'absent').length;
  const noShowCount = attendees.length - attendedIds.size;

  res.json({
    event: { id: event.id, title: event.title, date: event.date, location: event.location, capacity: event.capacity },
    summary: {
      registered: attendees.length, present: presentCount, absent: absentCount, noShow: noShowCount,
      attendanceRate: attendees.length > 0 ? Math.round((presentCount / attendees.length) * 100) : 0,
    },
    attendees: attendees.map(id => {
      const record = attendanceRecords.find(a => a.user_id === id);
      return { userId: id, status: record ? record.status : 'unmarked' };
    }),
  });
}));

app.get('/api/reports/platform', requireAuth, requireRole(['admin']), asyncHandler(async (req, res) => {
  const now = new Date().toISOString().split('T')[0];
  let report;
  if (useDatabase) {
    const totalEvents = await pool.query('SELECT COUNT(*) as total FROM events');
    const upcomingEvents = await pool.query('SELECT COUNT(*) as total FROM events WHERE date >= $1', [now]);
    const pastEvents = await pool.query('SELECT COUNT(*) as total FROM events WHERE date < $1', [now]);
    const totalUsers = await pool.query('SELECT COUNT(*) as total FROM users');
    const totalParticipants = await pool.query('SELECT COUNT(*) as total FROM users WHERE role = $1', ['participant']);
    const totalOrganizers = await pool.query('SELECT COUNT(*) as total FROM users WHERE role = $1', ['organizer']);
    const totalAttendees = await pool.query('SELECT COALESCE(SUM(array_length(attendees, 1)), 0) as total FROM events');
    const totalAttendance = await pool.query('SELECT COUNT(*) as total FROM attendance_records WHERE status = $1', ['present']);
    const topEvents = await pool.query(
      `SELECT id, title, date, array_length(attendees, 1) as registrations FROM events ORDER BY array_length(attendees, 1) DESC NULLS LAST LIMIT 5`);
    const categoryBreakdown = await pool.query(`SELECT category, COUNT(*) as count FROM events GROUP BY category ORDER BY count DESC`);
    report = {
      totalEvents: parseInt(totalEvents.rows[0].total), upcomingEvents: parseInt(upcomingEvents.rows[0].total),
      pastEvents: parseInt(pastEvents.rows[0].total), totalUsers: parseInt(totalUsers.rows[0].total),
      totalParticipants: parseInt(totalParticipants.rows[0].total), totalOrganizers: parseInt(totalOrganizers.rows[0].total),
      totalRegistrations: parseInt(totalAttendees.rows[0].total), totalAttendanceMarked: parseInt(totalAttendance.rows[0].total),
      topEvents: topEvents.rows, categoryBreakdown: categoryBreakdown.rows,
    };
  } else {
    const events = dataStore.events;
    const users = dataStore.users;
    const attendance = dataStore.attendance;
    report = {
      totalEvents: events.length, upcomingEvents: events.filter(e => e.date >= now).length,
      pastEvents: events.filter(e => e.date < now).length, totalUsers: users.length,
      totalParticipants: users.filter(u => u.role === 'participant').length,
      totalOrganizers: users.filter(u => u.role === 'organizer').length,
      totalRegistrations: events.reduce((sum, e) => sum + (e.attendees?.length || 0), 0),
      totalAttendanceMarked: attendance.filter(a => a.status === 'present').length,
      topEvents: [...events].sort((a, b) => (b.attendees?.length || 0) - (a.attendees?.length || 0)).slice(0, 5).map(e => ({
        id: e.id, title: e.title, date: e.date, registrations: e.attendees?.length || 0
      })),
      categoryBreakdown: Object.entries(events.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + 1; return acc; }, {}))
        .map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count),
    };
  }
  res.json(report);
}));

app.get('/api/reports/organizer', requireAuth, requireRole(['organizer', 'admin']), asyncHandler(async (req, res) => {
  const organizerId = req.user.id;
  let events;
  if (useDatabase) {
    const result = await pool.query('SELECT * FROM events WHERE organizer_id = $1 ORDER BY date DESC', [organizerId]);
    events = result.rows;
  } else {
    events = dataStore.events.filter(e => e.organizer?.id === organizerId || e.organizer_id === organizerId);
  }

  const eventReports = events.map(event => {
    const registered = event.attendees?.length || 0;
    let present = 0;
    if (!useDatabase) {
      present = dataStore.attendance.filter(a => a.event_id === event.id && a.status === 'present').length;
    }
    return { id: event.id, title: event.title, date: event.date, registered, present, rate: registered > 0 ? Math.round((present / registered) * 100) : 0 };
  });

  if (useDatabase) {
    for (const ev of eventReports) {
      const r = await pool.query('SELECT COUNT(*) as total FROM attendance_records WHERE event_id = $1 AND status = $2', [ev.id, 'present']);
      ev.present = parseInt(r.rows[0].total);
      ev.rate = ev.registered > 0 ? Math.round((ev.present / ev.registered) * 100) : 0;
    }
  }
  res.json({ events: eventReports });
}));

app.get('/api/reports/attendance/:eventId/csv', requireAuth, requireRole(['organizer', 'admin']), asyncHandler(async (req, res) => {
  const eventId = req.params.eventId;
  let event;
  let attendeeDetails = [];
  let attendanceRecords = [];

  if (useDatabase) {
    const ev = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
    event = ev.rows[0];
    if (event) {
      const ad = await pool.query('SELECT id, name, email FROM users WHERE id = ANY($1)', [event.attendees || []]);
      attendeeDetails = ad.rows;
      const ar = await pool.query('SELECT user_id, status, marked_at FROM attendance_records WHERE event_id = $1', [eventId]);
      attendanceRecords = ar.rows;
    }
  } else {
    event = dataStore.events.find(e => e.id === eventId);
    if (event) {
      attendeeDetails = (event.attendees || []).map(id => {
        const u = dataStore.users.find(user => user.id === id);
        return u ? { id: u.id, name: u.name, email: u.email } : null;
      }).filter(Boolean);
      attendanceRecords = dataStore.attendance.filter(a => a.event_id === eventId);
    }
  }

  if (!event) return res.status(404).json({ error: 'Event not found' });
  const rows = attendeeDetails.map(u => {
    const record = attendanceRecords.find(a => a.user_id === u.id);
    return { name: u.name, email: u.email, status: record ? record.status : 'Not marked', marked_at: record ? record.marked_at : '' };
  });

  const csvHeader = 'Name,Email,Attendance Status,Marked At\n';
  const csvBody = rows.map(r => `"${r.name}","${r.email}","${r.status}","${r.marked_at || ''}"`).join('\n');
  const csv = csvHeader + csvBody;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="attendance-${eventId}.csv"`);
  res.send(csv);
}));

// ===== SPA FALLBACK =====
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API endpoint not found' });
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== GLOBAL ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Internal server error' });
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