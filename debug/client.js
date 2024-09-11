const github = require("@actions/github");
const core = require("@actions/core");


async function get_authenticated_client(appId, privateKey) {
  const { Octokit } = await import("@octokit/rest");
  const { createAppAuth } = await import("@octokit/auth-app");

  const octokitApp = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: appId,
      privateKey: privateKey,
    },
  });
  const { data: installations } = await octokitApp.apps.listInstallations();
  const installation = installations.find(
    (installation) => installation.account.login === "cds-snc"
  );

  const auth = createAppAuth({
    appId: appId,
    privateKey: privateKey,
  });

  const installationAuthentication = await auth({
    type: "installation",
    installationId: installation.id,
  });
  const octokit = github.getOctokit(installationAuthentication.token);
  return octokit;
}

module.exports = { get_authenticated_client };
