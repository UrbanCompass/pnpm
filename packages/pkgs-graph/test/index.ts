///<reference path="../../../typings/local.d.ts"/>
import pathResolve = require('better-path-resolve')
import createPkgGraph from 'pkgs-graph'
import test = require('tape')

const BAR1_PATH = pathResolve('/zkochan/src/bar')
const FOO1_PATH = pathResolve('/zkochan/src/foo')
const BAR2_PATH = pathResolve('/zkochan/src/bar@2')
const FOO2_PATH = pathResolve('/zkochan/src/foo@2')

test('create package graph', t => {
  const result = createPkgGraph([
    {
      dir: BAR1_PATH,
      manifest: {
        name: 'bar',
        version: '1.0.0',

        dependencies: {
          'foo': '^1.0.0',
          'is-positive': '1.0.0',
        },
      },
    },
    {
      dir: FOO1_PATH,
      manifest: {
        name: 'foo',
        version: '1.0.0',

        dependencies: {
          bar: '^10.0.0',
        },
      },
    },
    {
      dir: BAR2_PATH,
      manifest: {
        name: 'bar',
        version: '2.0.0',

        dependencies: {
          foo: '^2.0.0',
        },
      },
    },
    {
      dir: FOO2_PATH,
      manifest: {
        name: 'foo',
        version: '2.0.0',
      },
    },
  ])
  t.deepEqual(result.unmatched, [{ pkgName: 'bar', range: '^10.0.0' }])
  t.deepEqual(result.graph, {
    [BAR1_PATH]: {
      dependencies: [FOO1_PATH],
      package: {
        dir: BAR1_PATH,
        manifest: {
          name: 'bar',
          version: '1.0.0',

          dependencies: {
            'foo': '^1.0.0',
            'is-positive': '1.0.0',
          },
        },
      },
    },
    [FOO1_PATH]: {
      dependencies: [],
      package: {
        dir: FOO1_PATH,
        manifest: {
          name: 'foo',
          version: '1.0.0',

          dependencies: {
            bar: '^10.0.0',
          },
        },
      },
    },
    [BAR2_PATH]: {
      dependencies: [FOO2_PATH],
      package: {
        dir: BAR2_PATH,
        manifest: {
          name: 'bar',
          version: '2.0.0',

          dependencies: {
            foo: '^2.0.0',
          },
        },
      },
    },
    [FOO2_PATH]: {
      dependencies: [],
      package: {
        dir: FOO2_PATH,
        manifest: {
          name: 'foo',
          version: '2.0.0',
        },
      },
    },
  })
  t.end()
})

test('create package graph for local directory dependencies', t => {
  const result = createPkgGraph([
    {
      dir: BAR1_PATH,
      manifest: {
        name: 'bar',
        version: '1.0.0',

        dependencies: {
          'foo': '../foo',
          'is-positive': '1.0.0',
          'weird-dep': ':aaaaa', // weird deps are skipped
        },
      },
    },
    {
      dir: FOO1_PATH,
      manifest: {
        name: 'foo',
        version: '1.0.0',

        dependencies: {
          bar: '^10.0.0',
        },
      },
    },
    {
      dir: BAR2_PATH,
      manifest: {
        name: 'bar',
        version: '2.0.0',

        dependencies: {
          foo: 'file:../foo@2',
        },
      },
    },
    {
      dir: FOO2_PATH,
      manifest: {
        name: 'foo',
        version: '2.0.0',
      },
    },
  ])
  t.deepEqual(result.unmatched, [{ pkgName: 'bar', range: '^10.0.0' }])
  t.deepEqual(result.graph, {
    [BAR1_PATH]: {
      dependencies: [FOO1_PATH],
      package: {
        dir: BAR1_PATH,
        manifest: {
          name: 'bar',
          version: '1.0.0',

          dependencies: {
            'foo': '../foo',
            'is-positive': '1.0.0',
            'weird-dep': ':aaaaa',
          },
        },
      },
    },
    [FOO1_PATH]: {
      dependencies: [],
      package: {
        dir: FOO1_PATH,
        manifest: {
          name: 'foo',
          version: '1.0.0',

          dependencies: {
            bar: '^10.0.0',
          },
        },
      },
    },
    [BAR2_PATH]: {
      dependencies: [FOO2_PATH],
      package: {
        dir: BAR2_PATH,
        manifest: {
          name: 'bar',
          version: '2.0.0',

          dependencies: {
            foo: 'file:../foo@2',
          },
        },
      },
    },
    [FOO2_PATH]: {
      dependencies: [],
      package: {
        dir: FOO2_PATH,
        manifest: {
          name: 'foo',
          version: '2.0.0',
        },
      },
    },
  })
  t.end()
})

test('create package graph ignoring the workspace protocol', t => {
  const result = createPkgGraph([
    {
      dir: BAR1_PATH,
      manifest: {
        name: 'bar',
        version: '1.0.0',

        dependencies: {
          'foo': 'workspace:^1.0.0',
          'is-positive': '1.0.0',
        },
      },
    },
    {
      dir: FOO1_PATH,
      manifest: {
        name: 'foo',
        version: '1.0.0',

        dependencies: {
          bar: '^10.0.0',
        },
      },
    },
    {
      dir: BAR2_PATH,
      manifest: {
        name: 'bar',
        version: '2.0.0',

        dependencies: {
          foo: 'workspace:^2.0.0',
        },
      },
    },
    {
      dir: FOO2_PATH,
      manifest: {
        name: 'foo',
        version: '2.0.0',
      },
    },
  ])
  t.deepEqual(result.unmatched, [{ pkgName: 'bar', range: '^10.0.0' }])
  t.deepEqual(result.graph, {
    [BAR1_PATH]: {
      dependencies: [FOO1_PATH],
      package: {
        dir: BAR1_PATH,
        manifest: {
          name: 'bar',
          version: '1.0.0',

          dependencies: {
            'foo': 'workspace:^1.0.0',
            'is-positive': '1.0.0',
          },
        },
      },
    },
    [FOO1_PATH]: {
      dependencies: [],
      package: {
        dir: FOO1_PATH,
        manifest: {
          name: 'foo',
          version: '1.0.0',

          dependencies: {
            bar: '^10.0.0',
          },
        },
      },
    },
    [BAR2_PATH]: {
      dependencies: [FOO2_PATH],
      package: {
        dir: BAR2_PATH,
        manifest: {
          name: 'bar',
          version: '2.0.0',

          dependencies: {
            foo: 'workspace:^2.0.0',
          },
        },
      },
    },
    [FOO2_PATH]: {
      dependencies: [],
      package: {
        dir: FOO2_PATH,
        manifest: {
          name: 'foo',
          version: '2.0.0',
        },
      },
    },
  })
  t.end()
})
