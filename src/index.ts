import path from 'node:path';
import {readdirSync, readFileSync} from 'node:fs';
import * as resolve from 'resolve.exports';

const processPackage = (source: string) =>
{
    const packageJson = JSON.parse(
        readFileSync(path.join(source, 'package.json'), {encoding: 'utf8'})
    );
    const {name} = packageJson;
    const alias = {
        find: name,
        replacement: '',
        customResolver(exportPath: string)
        {
            const resolved = resolve.exports(packageJson, '.' + exportPath);
            if (resolved)
            {
                return path.join(source, resolved[0]);
            }
            return path.join(source, packageJson.module || packageJson.main);
        }
    };
    return {name, alias};
}

const processWorkspace = (source: string) => readdirSync(source, {withFileTypes: true})
    .filter(dir => dir.isDirectory() || dir.isSymbolicLink())
    .map(dir => processPackage(path.join(source, dir.name)));

const workspaceAliasing = (workspaceRootPaths: Array<string>) => ({
    name: 'workspace-aliasing',
    config()
    {
        const packages = workspaceRootPaths.map(processWorkspace).flat();

        return {
            resolve: {
                alias: packages.map(p => p.alias)
            }
        };
    }
});

module.exports = workspaceAliasing;
