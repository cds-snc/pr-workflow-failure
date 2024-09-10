# PR Workflow Failure

GitHub Action to create a comment in a Pull Request listing whether the specified workflows in the repository successfully completed or failed.

If the specified workflows have failed, the comment will include a list of the failed workflows and the jobs that failed in each workflow, with links to the failed job logs.

## Usage

Create a new workflow file in your repository at `.github/workflows/pr-workflow-failure.yml` with the following contents:

```yaml
name: PR Workflow Failure
on:
  pull_request:
    types: [ opened, synchronize, reopened ]

jobs:
  pr-workflow-failure:
    runs-on: ubuntu-latest
    steps:
      - name: Check out the repository
        uses: actions/checkout@v2
    
      - name: PR Workflow Failure

```