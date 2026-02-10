const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: cors,
      body: JSON.stringify({ ok: false, error: "Method not allowed" }),
    };
  }

  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  const planPath = process.env.PLAN_PATH || "data/plan.json";
  const token = process.env.GITHUB_TOKEN;

  if (!token || !owner || !repo) {
    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({
        ok: true,
        plan: { lastUpdated: null, days: {} },
        source: "default-no-config",
      }),
    };
  }

  const url =
    "https://api.github.com/repos/" +
    owner + "/" + repo +
    "/contents/" + encodeURIComponent(planPath) +
    "?ref=" + branch;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: "Bearer " + token,
        "User-Agent": "netlify-load-plan",
        Accept: "application/vnd.github+json",
      },
    });

    if (res.status === 404) {
      return {
        statusCode: 200,
        headers: cors,
        body: JSON.stringify({
          ok: true,
          plan: { lastUpdated: null, days: {} },
          source: "default-new",
        }),
      };
    }

    if (!res.ok) {
      const text = await res.text();
      return {
        statusCode: 500,
        headers: cors,
        body: JSON.stringify({ ok: false, error: "GitHub fetch failed", detail: text }),
      };
    }

    const data = await res.json();
    const decoded = Buffer.from(data.content, "base64").toString("utf8");
    let plan;
    try {
      plan = JSON.parse(decoded);
    } catch (e) {
      plan = { lastUpdated: null, days: {} };
    }

    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({ ok: true, plan: plan, source: "github" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ ok: false, error: "Unexpected error", detail: String(err) }),
    };
  }
};
