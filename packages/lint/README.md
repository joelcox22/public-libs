# JoelBot Lint - a personal opinionated linting tool

Usage:

```bash
yarn add -D @joelbot/lint
```

Then run `yarn lint` / `npm run lint` / etc

- any time locally
- also make your CI workflows run this

if `CI` environment variable is `1` or `true`, it will lint files and error if anything does not match my opinionated settings / formatting.

if `CI` environment variable is any other value or not set, it will re-write opinionated configuration back to your repository, then run appropriate linting tools with "fix mode" enabled to write suggested changes back to your repository. review changes to make sure they seem sensible, and commit them back to your repository. Expect that you might see opinionated changes to config/settings or code formatting any time after you update dependencies.

The opionated configuration files this generates includes default configuration support for vscode to be able to auto-format on save.

[!WARNING] I will probably make very opinionated changes to the config/settings as minor/patch versions to this tool. Upgrade your dependency on this on its own independently if you want to isolate code reformatting changes caused by this from other in-progress work if you don't want to pollute unrelated changes with code reformatting after a change as been published from this.

## Why not just use eslint directly?

I want super opionated linting that will automatically keep my config up-to-date in other projects when I use it,
and want the ability to potentially change the linting tools of choice I decide on easily later, and not have
to think much about how to upgrade my other projects when the time comes.

Also, this does markdown linting, and might add support for other things in future as well.

## Supported languages

Currently this only works with javascript / typescript repositories. I expect to continue to follow this pattern for other languages at some future point, probably by adding additional ways to depend on this outside of npm/yarn so that it can work with other relevant dependency management systems for other languages, but still following the above overall simple usage / no config pattern.

## Escape hatches

For javascript/typescript things, I'm using eslint with prettier extension under the hood to power this.

Use the standard `.eslintrc` / `// eslint-disable-line <whatever>` / `/* eslint some-rule: off */` / etc when you need to disable linting rules/expectations for some reason.

## Contributing

Don't.

This is intended to be my own a personal opinionated framework for code linting.

If you don't like what I have set here, you're welcome to fork this repository and manage your own version of it as your own dependency, or to remove the dependency from your own tools.

This should only ever be used as a `devDependency` in other projects - it should never be a `dependency` that will be installed as a transient dependency for consumers of other projects that use this tool.

The `lint` command will even help enforce that this dependency is a `devDependency` rather than a `dependency` as part of the checks it does.
