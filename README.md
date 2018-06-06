# Github Scripts

Some useful github scripts for engineering ops.

The env variable `GITHUB_TOKEN` is required for these scripts to run.

## find-replace-org

Need to update a key or change a name globally? This script is for those kind of tasks.
It takes in an org and multiple find and replace pairs and batches it into one commit.

### Usage

```bash
export GITHUB_TOKEN='your github token'
# Update the script to include org and find/replace
node find-replace-org.js
```

