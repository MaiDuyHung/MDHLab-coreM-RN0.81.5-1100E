<h1 align="center">
  <img alt="logo" src="./assets/icon.png" width="124px" style="border-radius:10px"/><br/>
MDHLab Core </h1>

> Reusable React Native core for MDHLab projects. Clone it, assemble the
> foundation modules a project needs, rename the app identity, ship.
>
> Based on the [Obytes starter](https://starter.obytes.com); the `upstream`
> git remote still points at it, so template updates can be pulled in.

## Requirements

- [React Native dev environment ](https://reactnative.dev/docs/environment-setup)
- [Node.js LTS release](https://nodejs.org/en/)
- [Git](https://git-scm.com/)
- [Watchman](https://facebook.github.io/watchman/docs/install#buildinstall), required only for macOS or Linux users
- [Pnpm](https://pnpm.io/installation)
- [Cursor](https://www.cursor.com/) or [VS Code Editor](https://code.visualstudio.com/download) ⚠️ Make sure to install all recommended extension from `.vscode/extensions.json`

## 👋 Quick start

Clone the repo to your machine and install deps :

```sh
git clone git@github.com:MaiDuyHung/MDHLab-coreM-RN0.81.5-1100E.git

cd ./MDHLab-coreM-RN0.81.5-1100E

pnpm install
```

To run the app on ios

```sh
pnpm ios
```

To run the app on Android

```sh
pnpm android
```

## ✍️ Documentation

- [Rules and Conventions](https://starter.obytes.com/getting-started/rules-and-conventions/)
- [Project structure](https://starter.obytes.com/getting-started/project-structure)
- [Environment vars and config](https://starter.obytes.com/getting-started/environment-vars-config)
- [UI and Theming](https://starter.obytes.com/ui-and-theme/ui-theming)
- [Components](https://starter.obytes.com/ui-and-theme/components)
- [Forms](https://starter.obytes.com/ui-and-theme/Forms)
- [Data fetching](https://starter.obytes.com/guides/data-fetching)
- [Contribute to starter](https://starter.obytes.com/how-to-contribute/)

## App identity

Display name, bundle id, package and deep-link scheme all come from `env.ts`,
one set per environment, so the three builds install side by side:

| Env | Package / bundle id | Scheme |
| --- | --- | --- |
| development | `com.mdhlab.core.development` | `mdhlabCore` |
| preview | `com.mdhlab.core.preview` | `mdhlabCore.preview` |
| production | `com.mdhlab.core` | `mdhlabCore` |

When cloning this core for a new project, change `NAME`, `BUNDLE_IDS`,
`PACKAGES` and `SCHEMES` in `env.ts`, `slug` in `app.config.ts`, and the
`APP_ID` the Maestro jobs use in `.github/workflows/e2e-android*.yml`.

`EXPO_ACCOUNT_OWNER` and `EAS_PROJECT_ID` in `app.config.ts` are intentionally
empty: run `eas init` and paste the values it prints.

## Commerce modules

See [commerce.md](./commerce.md) for the catalog and cart modules and how to
point them at a different backend.
