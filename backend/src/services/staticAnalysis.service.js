// This service runs ESLint on a piece of JavaScript code and returns
// a clean, simple list of issues we can save into the database.

const { ESLint } = require("eslint");

async function runStaticAnalysis(sourceCode) {
  const eslint = new ESLint({
    // Don't look for any .eslintrc files on disk — we define our own rules here
    overrideConfigFile: true,
    overrideConfig: {
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      rules: {
        "no-unused-vars": "warn",
        "no-undef": "error",
        "eqeqeq": "warn",
        "no-var": "warn",
        "prefer-const": "warn",
        "no-empty": "warn",
        "no-duplicate-imports": "error",
        "no-dupe-keys": "error",
        "no-fallthrough": "warn",
      },
    },
  });

  const results = await eslint.lintText(sourceCode, { filePath: "submission.js" });

  // results is an array with ONE item (since we linted one file/string)
  const messages = results[0]?.messages || [];

  // Convert ESLint's format into our own simple "finding" format
  const findings = messages.map((msg) => ({
    severity: msg.severity === 2 ? "high" : "medium", // 2 = error, 1 = warning
    issue: msg.ruleId || "syntax-error",
    explanation: msg.message,
    suggested_fix: suggestFixFor(msg.ruleId),
    file_name: "submission.js",
    line_number: msg.line || null,
  }));

  const errorCount = findings.filter((f) => f.severity === "high").length;
  const warningCount = findings.filter((f) => f.severity === "medium").length;

  // Simple scoring formula: start at 100, subtract for each issue
  let overallScore = 100 - errorCount * 10 - warningCount * 3;
  if (overallScore < 0) overallScore = 0;

  return {
    findings,
    overallScore,
    summary: `${errorCount} error(s) and ${warningCount} warning(s) found.`,
  };
}

// Very small helper that gives a beginner-friendly tip for common rules
function suggestFixFor(ruleId) {
  const tips = {
    "no-unused-vars": "Remove this variable, or use it somewhere in your code.",
    "no-undef": "This variable isn't defined anywhere — check for typos or missing imports.",
    "eqeqeq": "Use === or !== instead of == or != to avoid unexpected type conversion.",
    "no-var": "Use 'let' or 'const' instead of 'var'.",
    "prefer-const": "This variable is never reassigned — use 'const' instead of 'let'.",
    "no-empty": "This block is empty — add code or remove the block.",
  };
  return tips[ruleId] || "Review this line and refactor as needed.";
}

module.exports = { runStaticAnalysis };