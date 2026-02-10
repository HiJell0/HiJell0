const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const branch = process.env.GITHUB_BRANCH || "main";
const planPath = process.env.PLAN_PATH || "data/plan.json";
const token = process.env.GITHUB_TOKEN;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export async function handler(event) {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: cors,
      body: JSON.stringify({ ok: false, error: "Method not allowed" }),
    };
  }

  if (!token || !owner || !repo) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ ok: false, error: "Server not configured" }),
    };
  }

  let plan;
  try {
    plan = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: cors,
      body: JSON.stringify({ ok: false, error: "Invalid JSON" }),
    };
  }

  const content = Buffer.from(JSON.stringify(plan, null, 2)).toString("base64");

  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(
    planPath
  )}`;

  let sha;
  try {
    const getRes = await fetch(`${apiBase}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "netlify-save-plan",
        Accept: "application/vnd.github+json",
      },
    });
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }
  } catch {
    // file may not exist yet
  }

  const body = {
    message: "Update plan.json from Netlify function",
    content,
    branch,
  };
  if (sha) body.sha = sha;

  try {
    const putRes = await fetch(apiBase, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "netlify-save-plan",
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify(body),
    });

    if (!putRes.ok) {
      const text = await putRes.text();
      return {
        statusCode: 500,
        headers: cors,
        body: JSON.stringify({ ok: false, error: "GitHub save failed", detail: text }),
      };
    }

    const savedAt = new Date().toISOString();
    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({ ok: true, savedAt }),
    };
  } catch {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ ok: false, error: "Unexpected error" }),
    };
  }
}
