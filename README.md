# PR Workflow Failure

GitHub Action to create a comment in a Pull Request listing whether the specified workflows in the repository successfully completed or failed. Optionally, it can send a Slack notification if any workflow fails.

## Inputs

- `workflows`: List of workflow names to check (required, default: `[]`)
- `slack_webhook`: Slack webhook URL (optional)
- `slack_body`: Slack message body with placeholders for statuses, pr_title, repo_name, pr_creator, pr_url (optional, default: `Workflow statuses:\n$STATUSES\nPR Details:\n<$PR_URL|PR> - $PR_TITLE by $PR_CREATOR in $REPO_NAME.\n$PR_URL`)
- `github_token`: GitHub token (required)

## Usage

Create a new workflow file in your repository at `.github/workflows/pr-workflow-failure.yml` with the following contents:

```yaml
name: PR Workflow Failure
on:
  worklflow_run:
    workflows: [your-workflow-name]
    types:
      - completed

jobs:
  pr-workflow-failure:
    runs-on: ubuntu-latest
    steps:
      - name: Check out the repository
        uses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332 # v4.1.7

      - name: PR Workflow Failure
        uses: cds-snc/pr-workflow-failure@v1
        with:
          workflows: '["your-workflow-name"]'
          slack_webhook: ${{ secrets.SLACK_WEBHOOK }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
```