function analyzeSentiment(text) {
  const lower = text.toLowerCase();
  if (lower.includes('good') || lower.includes('excellent') || lower.includes('great')) return 'positive';
  if (lower.includes('bad') || lower.includes('poor') || lower.includes('terrible')) return 'negative';
  return 'neutral';
}

module.exports = analyzeSentiment;
