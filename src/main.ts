import * as core from '@actions/core';
import * as github from '@actions/github';

type ReleaseTask =
  | "create"
  | "edit"
  | "delete";

function asReleaseTask(value: string): ReleaseTask {
  switch (value) {
    case "create":
    case "edit":
    case "delete":
      return value;
  }
  throw new Error('Unknown deployment status')
}
async function run() {
  try {

    const token = core.getInput('repo_token', { required: true });
    const tagName = core.getInput('tag_name', { required: true });
    const task: ReleaseTask = asReleaseTask(core.getInput('task', { required: true }));

    const target = core.getInput('target');
    const name = core.getInput('name');
    const body = core.getInput('body');
    const draft = (core.getInput('draft') == "true");
    const prerelease = (core.getInput('prerelease') == "true");

    const client = new github.GitHub(token);

    if (task == "create") {
      await createRelease(client, tagName, target, name, body, draft, prerelease);
    } else if (task == "edit") {
      const releaseId = await getReleaseId(client, tagName);
      await editRelease(client, releaseId, tagName, target, name, body, draft, prerelease);
    } else if (task == "delete") {
      const releaseId = await getReleaseId(client, tagName);
      await deleteRelease(client, releaseId);
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

async function createRelease(
  client: github.GitHub,
  tagName: string,
  target: string,
  name: string,
  body: string,
  draft: boolean,
  prerelease: boolean
) {
  await client.repos.createRelease({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    tag_name: tagName,
    target_commitish: target,
    name: name,
    body: body,
    draft: draft,
    prerelease: prerelease
  });
}

async function editRelease(
  client: github.GitHub,
  releaseId: number,
  tagName: string,
  target: string,
  name: string,
  body: string,
  draft: boolean,
  prerelease: boolean
) {
  await client.repos.updateRelease({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    release_id: releaseId,
    tag_name: tagName,
    target_commitish: target,
    name: name,
    body: body,
    draft: draft,
    prerelease: prerelease
  });
}

async function deleteRelease(
  client: github.GitHub,
  releaseId: number
) {
  await client.repos.deleteRelease({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    release_id: releaseId
  });
}

async function getReleaseId(
  client: github.GitHub,
  tagName: string
): Promise<number> {
  const response = await client.repos.getReleaseByTag({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    tag: tagName
  });

  return response.data.id;
}

run();