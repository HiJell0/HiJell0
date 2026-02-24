const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async function (event) {
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

  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  const planPath = process.env.PLAN_PATH || "data/plan.json";
  const token = process.env.GITHUB_TOKEN;

  if (!token || !owner || !repo) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({
        ok: false,
        error: "Server not configured",
        debug: { owner: owner || "(missing)", repo: repo || "(missing)", hasToken: !!token }
      }),
    };
  }

  var plan;
  try {
    plan = JSON.parse(event.body || "{}");
  } catch (e) {
    return {
      statusCode: 400,
      headers: cors,
      body: JSON.stringify({ ok: false, error: "Invalid JSON" }),
    };
  }

  var content = Buffer.from(JSON.stringify(plan, null, 2)).toString("base64");

  var apiBase =
    "https://api.github.com/repos/" +
    owner + "/" + repo +
    "/contents/" + encodeURIComponent(planPath);

  var sha;
  try {
    var getRes = await fetch(apiBase + "?ref=" + branch, {
      headers: {
        Authorization: "Bearer " + token,
        "User-Agent": "netlify-save-plan",
        Accept: "application/vnd.github+json",
      },
    });
    if (getRes.ok) {
      var getData = await getRes.json();
      sha = getData.sha;
    }
  } catch (e) {
    // file may not exist yet
  }

  var putBody = {
    message: "Update plan.json from Netlify function",
    content: content,
    branch: branch,
  };
  if (sha) putBody.sha = sha;

  try {
    var putRes = await fetch(apiBase, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "User-Agent": "netlify-save-plan",
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify(putBody),
    });

    if (!putRes.ok) {
      var text = await putRes.text();
      return {
        statusCode: 500,
        headers: cors,
        body: JSON.stringify({
          ok: false,
          error: "GitHub save failed",
          detail: text,
          debug: { target: owner + "/" + repo, path: planPath, branch: branch, tokenPrefix: token.substring(0, 8) + "..." }
        }),
      };
    }

    var savedAt = new Date().toISOString();
    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({ ok: true, savedAt: savedAt }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ ok: false, error: "Unexpected error", detail: String(err) }),
    };
  }
};
