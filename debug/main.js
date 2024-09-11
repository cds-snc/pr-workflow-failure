require("dotenv").config();
const core = require("@actions/core");
const github = require("@actions/github");

async function run_action_locally(octokit) {
  const { owner, repo } = github.context.repo;
  const workflows = '["Test workflow with error"]';
  const workflowNames = JSON.parse(workflows);
  
  const statuses = [];
  let failed = false;
}

async function main() {
  const appId = process.env.GH_APP_ID;
  const privateKey = process.env.GH_PRIVATE_KEY;
  const octokit = await get_authenticated_client(appId, privateKey);

  await run_action_locally(octokit);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
