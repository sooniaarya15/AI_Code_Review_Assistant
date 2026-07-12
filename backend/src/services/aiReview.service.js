const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

async function runAiReview(sourceCode, language) {
  const prompt = `
You are an expert senior software engineer performing a code review.
Review the following ${language} code and respond ONLY with valid JSON
(no markdown, no backticks, no extra text) in this exact structure:

{
  "overall_score": <number 0-100>,
  "summary": "<2-3 sentence summary of code quality>",
  "findings": [
    {
      "severity": "low" | "medium" | "high" | "critical",
      "issue": "<short issue title>",
      "explanation": "<why this is a problem>",
      "suggested_fix": "<how to fix it>",
      "line_number": <number or null>
    }
  ]
}

Cover: bugs, code smells, naming, performance, security, and complexity.
Limit to the 10 most important findings.

CODE:
${sourceCode}
`;

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error: ${errText}`);
  }

  const data = await response.json();
  const rawText = data.choices[0].message.content;

  const cleaned = rawText.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);

  return parsed;
}

module.exports = { runAiReview };