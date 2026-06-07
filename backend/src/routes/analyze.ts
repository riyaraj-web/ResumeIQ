import { Router } from 'express';
import multer from 'multer';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { extractTextFromPDF } from '../services/pdfParser';
import { extractResumeData, extractJDData, analyzeGap } from '../services/llmChain';
import { calculateFinalScore } from '../services/scorer';
import pool from '../db';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Analyze resume (no auth required for demo)
router.post('/', upload.single('resume'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resume PDF file is required' });
    }

    const { jd_text } = req.body;
    if (!jd_text) {
      return res.status(400).json({ error: 'Job description text is required' });
    }

    // Extract text from PDF
    const resumeText = await extractTextFromPDF(req.file.buffer);

    // Run LLM chain sequentially
    const resumeData = await extractResumeData(resumeText);
    const jdData = await extractJDData(jd_text);
    const gapAnalysis = await analyzeGap(resumeData, jdData);

    // Calculate final score
    const finalScore = calculateFinalScore(gapAnalysis.dimension_scores);

    // Save to database (optional - skip if no user_id)
    let analysisId = null;
    if (req.userId) {
      try {
        const result = await pool.query(
          `INSERT INTO analyses (
            user_id, role_title, final_score, dimension_scores,
            matched_skills, missing_skills, keyword_gaps,
            strengths, weaknesses, rewritten_bullets, interview_questions
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING id`,
          [
            req.userId,
            jdData.role_title,
            finalScore,
            JSON.stringify(gapAnalysis.dimension_scores),
            gapAnalysis.matched_skills,
            gapAnalysis.missing_skills,
            gapAnalysis.keyword_gaps,
            gapAnalysis.strengths,
            gapAnalysis.weaknesses,
            JSON.stringify(gapAnalysis.rewritten_bullets),
            gapAnalysis.interview_questions,
          ]
        );
        analysisId = result.rows[0].id;
      } catch (dbError) {
        console.error('Database save failed (non-critical):', dbError);
        // Continue without saving to database
      }
    }

    res.json({
      id: analysisId,
      role_title: jdData.role_title,
      final_score: finalScore,
      dimension_scores: gapAnalysis.dimension_scores,
      matched_skills: gapAnalysis.matched_skills,
      missing_skills: gapAnalysis.missing_skills,
      keyword_gaps: gapAnalysis.keyword_gaps,
      strengths: gapAnalysis.strengths,
      weaknesses: gapAnalysis.weaknesses,
      rewritten_bullets: gapAnalysis.rewritten_bullets,
      interview_questions: gapAnalysis.interview_questions,
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    if (error.message === 'Could not extract text from PDF') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Analysis failed, please try again' });
  }
});

// Get analysis by ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM analyses WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    const analysis = result.rows[0];

    res.json({
      id: analysis.id,
      role_title: analysis.role_title,
      final_score: analysis.final_score,
      dimension_scores: analysis.dimension_scores,
      matched_skills: analysis.matched_skills,
      missing_skills: analysis.missing_skills,
      keyword_gaps: analysis.keyword_gaps,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      rewritten_bullets: analysis.rewritten_bullets,
      interview_questions: analysis.interview_questions,
      created_at: analysis.created_at,
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
});

// Get all analyses for user
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      'SELECT id, role_title, final_score, created_at FROM analyses WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get analyses error:', error);
    res.status(500).json({ error: 'Failed to fetch analyses' });
  }
});

// Delete analysis
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM analyses WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json({ message: 'Analysis deleted successfully' });
  } catch (error) {
    console.error('Delete analysis error:', error);
    res.status(500).json({ error: 'Failed to delete analysis' });
  }
});

export default router;
