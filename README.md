# ResumeIQ - AI-Powered Resume Analyzer

An intelligent resume analysis tool that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS) and increase their chances of landing interviews.

<img width="1882" height="893" alt="{381B245F-BE5E-42C6-9D69-526363961365}" src="https://github.com/user-attachments/assets/f91235fc-b1f4-47e5-b313-f603efee65fd" />
<img width="1275" height="832" alt="{EEECDDDA-424F-4F36-954F-DED66BB507A4}" src="https://github.com/user-attachments/assets/4c98614e-2624-405f-af17-0777b5cf09fe" />
<img width="1284" height="840" alt="{92BF77E1-4BA1-4F12-BF89-B14B61ACBD91}" src="https://github.com/user-attachments/assets/aa778872-799c-45ef-acca-ed9fb3c823e4" />





## 🌟 Features

- **AI-Powered Analysis**: Uses Groq's Llama 3.3 70B model for intelligent resume parsing
- **ATS Optimization**: Identifies gaps between your resume and job descriptions
- **Smart Rewrites**: Suggests improved bullet points tailored to specific job postings
- **Skill Matching**: Shows matched and missing skills
- **Interview Prep**: Generates likely interview questions based on your profile
- **No Login Required**: Analyze resumes instantly without creating an account
- 

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Dropzone** - File uploads

### Backend
- **Node.js + Express** - REST API
- **TypeScript** - Type safety
- **Groq SDK** - AI integration (Llama 3.3 70B)
- **PostgreSQL** - Database (Supabase)
- **PDF Parse** - Resume text extraction

### AI & Database
- **Groq** - Free AI API (14,400 requests/day)
- **Supabase** - PostgreSQL database
## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Groq API key (free from https://console.groq.com/)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/resumeiq.git
cd resumeiq
```

### 2. Install dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Set up environment variables

**Backend** (`backend/.env`):
```env
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=your_supabase_connection_string
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
PORT=4000
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4. Run the development servers

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## 📖 How It Works

1. **Upload Resume**: User uploads a PDF resume
2. **Paste Job Description**: User pastes the target job description
3. **AI Analysis**: 
   - Extracts structured data from resume
   - Parses job requirements
   - Analyzes gaps and matches
4. **Results**: Shows:
   - Overall match score
   - Skill gaps
   - Strengths & weaknesses
   - Rewritten bullets
   - Interview questions

## 🎯 API Endpoints

### POST `/api/analyze`
Analyzes a resume against a job description.

**Request:**
- `resume` (file): PDF file
- `jd_text` (string): Job description text

**Response:**
```json
{
  "role_title": "Software Engineer",
  "final_score": 85,
  "dimension_scores": {
    "skills_match": 90,
    "experience_match": 80,
    "keyword_coverage": 85,
    "role_alignment": 85
  },
  "matched_skills": ["JavaScript", "React", "Node.js"],
  "missing_skills": ["Python", "AWS"],
  "strengths": ["Strong frontend experience"],
  "weaknesses": ["Limited cloud experience"],
  "rewritten_bullets": [...],
  "interview_questions": [...]
}
```

## 🔐 Security

- Environment variables for sensitive data
- CORS protection
- JWT authentication (optional)
- Input validation
- Secure file handling

