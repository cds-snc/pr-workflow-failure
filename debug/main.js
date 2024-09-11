require("dotenv").config();
const { get_authenticated_client } = require("./client");
const { step_check_workflows } = require("./action");

async function main() {
  const appId = process.env.GH_APP_ID;
  const privateKey = process.env.GH_PRIVATE_KEY;
  const octokit = await get_authenticated_client(appId, privateKey);

  await step_check_workflows(octokit);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
