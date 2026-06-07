interface DimensionScores {
  skills_match: number;
  experience_match: number;
  keyword_coverage: number;
  role_alignment: number;
}

export function calculateFinalScore(dimensionScores: DimensionScores): number {
  const finalScore =
    dimensionScores.skills_match * 0.4 +
    dimensionScores.experience_match * 0.25 +
    dimensionScores.keyword_coverage * 0.2 +
    dimensionScores.role_alignment * 0.15;

  return Math.round(finalScore);
}

export function getScoreLabel(score: number): string {
  if (score >= 75) return 'Strong match';
  if (score >= 55) return 'Moderate match';
  return 'Weak match';
}

export function getScoreColor(score: number): 'green' | 'amber' | 'red' {
  if (score >= 75) return 'green';
  if (score >= 55) return 'amber';
  return 'red';
}
