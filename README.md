# Vite Plugin Workspace Aliasing

You have a Vite project with [NPM workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)?
You want to work on these workspaces and trigger HRM when developing them with `npm run dev`?

Then this plugin is for you!

## Requirements

- The workspace folders must be located in your Vite project to be watched.

## Usage

```typescript
import workspaceAliasing from '@kids/vite-plugin-workspace-aliasing';

export default defineConfig({
    plugins: [
        workspaceAliasing([
            '/absolute/path/to/workspace-root-dir-1',
            '/absolute/path/to/workspace-root-dir-2'
        ])
    ]
});
```

## What does it do?

- Every import from a workspace package will be intercepted by an alias.
- Why? Vite must not use the linked workspace packages inside the `node_modules` directory, because those are not watched.
- The alias ensures the source files used are directly from the workspace directory.
- The defined entry points in the `package.json` (`exports`, `module` or `main` field) are respected while aliasing.
