const { context } = require("@actions/github");

async function step_check_workflows(github, workflows) {
  // Should identify all workflows in a PR and check their status
  // limited to the workflows specified in the input
  // slightly diff than the GH action step with github-script
  const workflowNames = JSON.parse(workflows);

  const { owner, repo } = context.repo;
  const pullRequestsStatuses = [];
  let failed = false;

  try {
    // Fetch all workflows in the repository
    const workflows = await github.rest.actions.listRepoWorkflows({
      owner,
      repo,
    });

    // Match workflows by name and get their IDs based on the filter
    const workflowIds = workflowNames
      .map((name) => {
        const workflow = workflows.data.workflows.find(
          (workflow) => workflow.name === name
        );
        if (workflow) {
          return { id: workflow.id, name: workflow.name };
        } else {
          return null;
        }
      })
      .filter(Boolean);

    const pulls = await github.rest.pulls.list({
      owner,
      repo,
      state: "open",
    });

    for (const pull of pulls.data) {
      const prNumber = pull.number;
      const prTitle = pull.title;
      const prCreator = pull.user.login;
      const prUrl = pull.html_url;
      const prHeadSha = pull.head.sha;
      const prStatuses = [];
      let prFailed = false;
      
      // Check the status of matched workflows for the pull request
      for (const { id, name } of workflowIds) {
        const runs = await github.rest.actions.listWorkflowRuns({
          owner,
          repo,
          workflow_id: id,
          event: "pull_request",
          head_sha: prHeadSha,
          per_page: 1,
        });
        console.log(
          `Found ${runs.data.workflow_runs.length} 'workflow runs' for ${name} on PR #${prNumber} ${prTitle}`
        );
        const status =
          runs.data.workflow_runs.length > 0
            ? runs.data.workflow_runs[0].conclusion
            : "No runs found";
        prStatuses.push({ name, status, id });
        if (status !== "success") {
          prFailed = true;
        }
      }

      pullRequestsStatuses.push({
        prNumber,
        prTitle,
        prCreator,
        prUrl,
        prFailed,
        workflows: prStatuses,
      });

      if (prFailed) {
        failed = true;
      }
    }
  } catch (error) {
    console.error("Error fetching pull requests:", error);
    throw error;
  }

  return { pullRequestsStatuses, failed };
}

module.exports = { step_check_workflows };
