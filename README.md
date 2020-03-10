efrontforce
===========

efrontforce plugin

[![Version](https://img.shields.io/npm/v/efrontforce.svg)](https://npmjs.org/package/efrontforce)
[![CircleCI](https://circleci.com/gh/benahm/efrontforce/tree/master.svg?style=shield)](https://circleci.com/gh/benahm/efrontforce/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/benahm/efrontforce?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/efrontforce/branch/master)
[![Codecov](https://codecov.io/gh/benahm/efrontforce/branch/master/graph/badge.svg)](https://codecov.io/gh/benahm/efrontforce)
[![Greenkeeper](https://badges.greenkeeper.io/benahm/efrontforce.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/benahm/efrontforce/badge.svg)](https://snyk.io/test/github/benahm/efrontforce)
[![Downloads/week](https://img.shields.io/npm/dw/efrontforce.svg)](https://npmjs.org/package/efrontforce)
[![License](https://img.shields.io/npm/l/efrontforce.svg)](https://github.com/benahm/efrontforce/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g efrontforce
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
efrontforce/0.0.0 win32-x64 node-v12.14.1
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx efrontforce:changeset:deploy -n <string> -s <string> -t <string> [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-efrontforcechangesetdeploy--n-string--s-string--t-string--c-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx efrontforce:changeset:deploy -n <string> -s <string> -t <string> [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

print a greeting and your org IDs

```
USAGE
  $ sfdx efrontforce:changeset:deploy -n <string> -s <string> -t <string> [-c <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --checkonly=checkonly                                                         Target org
  -n, --name=name                                                                   (required) Name of the change set
  -s, --source=source                                                               (required) Source org
  -t, --target=target                                                               (required) Target org
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  $ sfdx efrontforce:changeset:deploy --sourceorg MyOrgSource --targetorg MyOrgTarget --changesetname "My Change Set"
     Hello world! This is org: MyOrg and I will be around until Tue Mar 20 2018!
     My hub org id is: 00Dxx000000001234
  
  $ sfdx hello:org --name myname --targetusername myOrg@example.com
     Hello myname! This is org: MyOrg and I will be around until Tue Mar 20 2018!
```
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
