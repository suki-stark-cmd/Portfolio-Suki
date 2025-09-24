# 🚀 Supabase Setup Guide

## Step-by-Step Supabase Configuration

### 1. Create Supabase Project
- Go to: https://supabase.com/dashboard
- Click "New Project"
- Choose organization and enter project name: `portfolio-suki`
- Set database password and region
- Click "Create new project"

### 2. Get Project Configuration
- Go to: **Settings > API**
- Copy your:
  - **Project URL**: `https://your-project-id.supabase.co`
  - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Update supabase-config.js
Replace the placeholder config:

```javascript
const supabaseConfig = {
    url: 'https://your-project-id.supabase.co',
    anonKey: 'your-anon-key-here'
};
```

### 4. Create Database Tables
Go to **SQL Editor** and run this SQL:

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Personal Information Table
CREATE TABLE personal_info (
    id BIGSERIAL PRIMARY KEY,
    name TEXT,
    title TEXT,
    bio TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    github TEXT,
    linkedin TEXT,
    twitter TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About Information Table
CREATE TABLE about_info (
    id BIGSERIAL PRIMARY KEY,
    description TEXT,
    stats JSONB,
    skill_categories JSONB,
    resume JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects Table
CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    technologies TEXT,
    image TEXT,
    demo_url TEXT,
    github_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills Table
CREATE TABLE skills (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    proficiency INTEGER CHECK (proficiency >= 0 AND proficiency <= 100),
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experience Table
CREATE TABLE experience (
    id BIGSERIAL PRIMARY KEY,
    position TEXT NOT NULL,
    company TEXT NOT NULL,
    start_date TEXT,
    end_date TEXT,
    description TEXT,
    technologies TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_read ON messages(read);

-- Enable Row Level Security
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access to portfolio data
CREATE POLICY "Public read access for personal_info" ON personal_info FOR SELECT USING (true);
CREATE POLICY "Public read access for about_info" ON about_info FOR SELECT USING (true);
CREATE POLICY "Public read access for projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access for skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read access for experience" ON experience FOR SELECT USING (true);

-- RLS Policies for authenticated admin access
CREATE POLICY "Admin full access for personal_info" ON personal_info FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for about_info" ON about_info FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for skills" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for experience" ON experience FOR ALL USING (auth.role() = 'authenticated');

-- Messages: public can create, admin can read/update/delete
CREATE POLICY "Public can create messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage messages" ON messages FOR ALL USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_personal_info_updated_at BEFORE UPDATE ON personal_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_info_updated_at BEFORE UPDATE ON about_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 5. Enable Authentication
- Go to: **Authentication > Settings**
- Enable **Email** provider
- Configure email templates (optional)
- Set site URL to your domain

### 6. Create Admin User
- Go to: **Authentication > Users**
- Click "Add user"
- Enter email: `admin@sukis-portfolio.com`
- Enter password: Create a strong password
- Set **Email Confirm**: Skip confirmation
- Click "Create user"

### 7. Configure Email Settings (Optional)
- Go to: **Settings > Auth**
- Configure SMTP settings for email verification
- Or use Supabase's built-in email service

### 8. Test Setup
1. Update `supabase-config.js` with your actual values
2. Open `init-database.html` in browser
3. Click "Initialize Database"
4. Check for successful connection and data insertion

### 9. Security Configuration
- Go to: **Settings > API**
- Configure **JWT Settings** if needed
- Review **RLS Policies** in database

## 🚨 Troubleshooting

**Supabase not connecting?**
- Check browser console for errors
- Verify project URL and anon key in config
- Ensure project is active (not paused)

**Authentication failing?**
- Check if Email provider is enabled
- Verify admin user exists and is confirmed
- Check browser console for auth errors

**Data not loading?**
- Run database schema SQL first
- Check RLS policies are properly set
- Verify tables exist in database

**CORS issues?**
- Add your domain to allowed origins in Supabase dashboard
- Check if you're using the correct anon key

## 📞 Quick Links
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🔑 Environment Variables (Optional)
For production, consider using environment variables:

```javascript
const supabaseConfig = {
    url: process.env.SUPABASE_URL || 'your-project-url',
    anonKey: process.env.SUPABASE_ANON_KEY || 'your-anon-key'
};
```

## 🎯 Next Steps
1. Initialize database with sample data
2. Test admin login functionality
3. Verify real-time updates work
4. Deploy to your hosting platform
5. Configure custom domain (optional)