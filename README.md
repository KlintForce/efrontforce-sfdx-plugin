efrontforce-sfdx-plugin
===========

efrontforce plugin

[![Version](https://img.shields.io/npm/v/efrontforce.svg)](https://npmjs.org/package/efrontforce)
[![Downloads/week](https://img.shields.io/npm/dw/efrontforce.svg)](https://npmjs.org/package/efrontforce)
[![License](https://img.shields.io/npm/l/efrontforce.svg)](https://github.com/benahm/efrontforce/blob/master/package.json)

<!-- toc -->

<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g efrontforce-sfdx-plugin
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
efrontforce-sfdx-plugin/1.2.0 win32-x64 node-v12.14.1
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx efrontforce:changeset:deploy -n <string> -s <string> -t <string> [-c] [-p] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-efrontforcechangesetdeploy--n-string--s-string--t-string--c--p---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx efrontforce:changeset:deploy -n <string> -s <string> -t <string> [-c] [-p] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

```
USAGE
  $ sfdx efrontforce:changeset:deploy -n <string> -s <string> -t <string> [-c] [-p] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --checkonly                                                                   Deploy wi checkonly mode
  -n, --name=name                                                                   (required) Name of the change set
  -p, --persist                                                                     Persist the change set locally
  -s, --source=source                                                               (required) Source org
  -t, --target=target                                                               (required) Target org
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  $ sfdx efrontforce:changeset:deploy -s MyOrgSource -t MyOrgTarget -n "MyChangeSet"
     [EN] This command will deploy your change set MyChangeSet from MyOrgSource to MyOrgTarget
     [FR] Cette commande va déployer votre change set MyChangeSet du MyOrgSource vers MyOrgTarget
  
  $ sfdx efrontforce:changeset:deploy -s MyOrgSource -t MyOrgTarget -n "MyChangeSet" -p
     [EN] : This command will deploy the change set MyChangeSet from MyOrgSource to MyOrgTarget et le persister en 
  locale
     [FR] : Cette commande va déployer votre change set MyChangeSet du MyOrgSource vers MyOrgTarget et le persister en 
  locale
  

     ⚠️  [EN] Warning: if a sub-folder 'temp' exists in the folder where you run the command, it will be overwritten.
     ⚠️  [FR] Attention : si un sous-dossier 'temp' existe dans le dossier de lancement de la commande, il sera ecrasé
```

_See code: [lib\commands\efrontforce\changeset\deploy.js](https://github.com/benahm/efrontforce/blob/v1.2.0/lib\commands\efrontforce\changeset\deploy.js)_
<!-- commandsstop -->
* [`sfdx efrontforce:changeset:deploy -n <string> -s <string> -t <string> [-c] [-p] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-efrontforcechangesetdeploy--n-string--s-string--t-string--c--p---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx efrontforce:changeset:deploy -n <string> -s <string> -t <string> [-c] [-p] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

```
USAGE
  $ sfdx efrontforce:changeset:deploy -n <string> -s <string> -t <string> [-c] [-p] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --checkonly                                                                   Deploy wi checkonly mode
  -n, --name=name                                                                   (required) Name of the change set
  -p, --persist                                                                     Persist the change set locally
  -s, --source=source                                                               (required) Source org
  -t, --target=target                                                               (required) Target org
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  $ sfdx efrontforce:changeset:deploy -s MyOrgSource -t MyOrgTarget -n "MyChangeSet"
     [EN] This command will deploy your change set MyChangeSet from MyOrgSource to MyOrgTarget
     [FR] Cette commande va déployer votre change set MyChangeSet du MyOrgSource vers MyOrgTarget
  
  $ sfdx efrontforce:changeset:deploy -s MyOrgSource -t MyOrgTarget -n "MyChangeSet" -p
     [EN] : This command will deploy the change set MyChangeSet from MyOrgSource to MyOrgTarget et le persister en 
  locale
     [FR] : Cette commande va déployer votre change set MyChangeSet du MyOrgSource vers MyOrgTarget et le persister en 
  locale
  

     ⚠️  [EN] Warning: if there is a folder in your project with the same name as the change set, it will be 
  overwritten.
     ⚠️  [FR] Attention : si il y un dossier dans votre projet qui porte le même nom que le change set, il sera ecrasé
```
