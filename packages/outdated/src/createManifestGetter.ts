import createResolver, { ResolveFunction, ResolverFactoryOptions } from '@pnpm/default-resolver'
import { DependencyManifest, Registries } from '@pnpm/types'
import { pickRegistryForPackage } from '@pnpm/utils'
import LRU = require('lru-cache')

type GetManifestOpts = {
  dir: string,
  lockfileDir: string,
  registries: Registries,
}

export type ManifestGetterOptions = Omit<ResolverFactoryOptions, 'metaCache'> & GetManifestOpts

export function createManifestGetter (
  opts: ManifestGetterOptions,
): (packageName: string, pref: string) => Promise<DependencyManifest | null> {
  const resolve = createResolver(Object.assign(opts, {
    fullMetadata: true,
    metaCache: new LRU({
      max: 10000,
      maxAge: 120 * 1000, // 2 minutes
    }) as any, // tslint:disable-line:no-any
  }))
  return getManifest.bind(null, resolve, opts)
}

export async function getManifest (
  resolve: ResolveFunction,
  opts: GetManifestOpts,
  packageName: string,
  pref: string,
) {
  const resolution = await resolve({ alias: packageName, pref }, {
    lockfileDir: opts.lockfileDir,
    preferredVersions: {},
    projectDir: opts.dir,
    registry: pickRegistryForPackage(opts.registries, packageName),
  })
  return resolution?.manifest ?? null
}
