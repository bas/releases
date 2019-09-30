# Releases

Action to create, edit or delete [GitHub Releases](https://developer.github.com/v3/repos/releases/).

> NOTE: this is a very rudimentary first release with no changelog or asset uploads.

## Inputs 

### `repo_token`

**Required** The GITHUB_TOKEN.

### `task`

The task to execute: `create`, `edit` or `delete`. Default `create`.

### `tag_name`

**Required** The name of the tag.

### `target`

Specifies the commitish value that determines where the Git tag is created from. Can be any branch or commit SHA. 

### `name`

The name of the release.

### `body`

Text describing the contents of the tag.

### `draft`

`true` to create a draft (unpublished) release, `false` to create a published one. Default: `false`.

### `prerelease`

`true` to identify the release as a prerelease. `false` to identify the release as a full release. Default: `false`.

## Example usage

```yaml
- uses: bas/releases@v1
    with:
      repo_token: ${{ secrets.GITHUB_TOKEN }}
      tag_name: ${{ github.ref }}
```

