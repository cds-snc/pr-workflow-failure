const github = require("@actions/github");

async function step_check_workflows(octokit) {
  // slightly diff than the GH action step with github-script
  const { owner, repo } = github.context.repo;
  const workflows = '["Test workflow with error"]';
  const workflowNames = JSON.parse(workflows);

  const statuses = [];
  let failed = false;

  const pulls = await octokit.rest.pulls.list({
    owner,
    repo,
    state: "open",
  });

  for (const pull of pulls.data) {
    const prNumber = pull.number;
    const prTitle = pull.title;
    const prCreator = pull.user.login;
    const prUrl = pull.html_url;
    const prStatuses = [];
    let prFailed = false;

    // Fetch all workflows
    const workflows = await octokit.rest.actions.listRepoWorkflows({
      owner,
      repo,
    });

    // Match workflows by name and get their IDs
    const workflowIds = workflowNames
      .map((name) => {
        const workflow = workflows.data.workflows.find(
          (workflow) => workflow.name === name
        );
        if (workflow) {
          return { id: workflow.id, name: workflow.name };
        } else {
          prStatuses.push(`${name}: Not found`);
          return null;
        }
      })
      .filter(Boolean);

    console.log(`Found ${workflowIds.length} workflows`);

    // Check the status of matched workflows for the pull request
    for (const { id, name } of workflowIds) {
      const runs = await octokit.rest.actions.listWorkflowRuns({
        owner,
        repo,
        workflow_id: id,
        event: "pull_request",
        per_page: 1,
      });
      const status =
        runs.data.workflow_runs.length > 0
          ? runs.data.workflow_runs[0].conclusion
          : "No runs found";
      prStatuses.push(`${name}: ${status}`);
      if (status !== "success") {
        prFailed = true;
      }
    }
  }
}

module.exports = { step_check_workflows };
