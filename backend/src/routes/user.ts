import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import pool from '../db';

const router = Router();

// Get user stats
router.get('/stats', authMiddleware, async (req: AuthRequest, res) => {
  try {
    // Get total analyses
    const totalResult = await pool.query(
      'SELECT COUNT(*) as total FROM analyses WHERE user_id = $1',
      [req.userId]
    );
    const totalAnalyses = parseInt(totalResult.rows[0].total);

    // Get average score
    const avgResult = await pool.query(
      'SELECT AVG(final_score) as avg_score FROM analyses WHERE user_id = $1',
      [req.userId]
    );
    const avgScore = avgResult.rows[0].avg_score ? Math.round(parseFloat(avgResult.rows[0].avg_score)) : 0;

    // Get best score
    const bestResult = await pool.query(
      'SELECT MAX(final_score) as best_score FROM analyses WHERE user_id = $1',
      [req.userId]
    );
    const bestScore = bestResult.rows[0].best_score || 0;

    // Get score trend (last 7 analyses)
    const trendResult = await pool.query(
      `SELECT final_score, created_at 
       FROM analyses 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 7`,
      [req.userId]
    );
    const scoreTrend = trendResult.rows.reverse().map(row => ({
      score: row.final_score,
      date: row.created_at,
    }));

    res.json({
      total_analyses: totalAnalyses,
      avg_score: avgScore,
      best_score: bestScore,
      score_trend: scoreTrend,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
