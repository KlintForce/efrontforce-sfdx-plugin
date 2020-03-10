import { flags, SfdxCommand } from "@salesforce/command";
import { AnyJson } from "@salesforce/ts-types";
import * as path from "path";
import * as fs from "fs";
import * as rimraf from "rimraf";
import * as chalk from "chalk";
import { exec } from "child-process-promise";

export default class Org extends SfdxCommand {
  public static examples = [
    `$ sfdx efrontforce:changeset:deploy -s MonOrgSource -t MonOrgDestination -n "MonChangeSet"
  Cette commande va déployer votre change set ${chalk.cyanBright(
    "MonChangeSet"
  )} du ${chalk.cyanBright("MonOrgSource")} vers ${chalk.cyanBright(
      "MonOrgDestination"
    )}
  `,
    `$ sfdx efrontforce:changeset:deploy -s MonOrgSource -t MonOrgDestination -n "MonChangeSet" -p
  Cette commande va déployer votre change set ${chalk.cyanBright(
    "MonChangeSet"
  )} du ${chalk.cyanBright("MonOrgSource")} vers ${chalk.cyanBright(
      "MonOrgDestination"
    )} et le persister en locale
  `,
    `⚠️  ${chalk.magentaBright(
      "attention : si il y un dossier dans votre projet porte le même nom que le change set, il sera ecrasé"
    )}
  `
  ];

  public static args = [{ name: "file" }];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    name: flags.string({
      required: true,
      char: "n",
      description: "Nom du change set"
    }),
    source: flags.string({
      required: true,
      char: "s",
      description: "L'org source"
    }),
    target: flags.string({
      required: true,
      char: "t",
      description: "L'org destination"
    }),
    checkonly: flags.boolean({
      char: "c",
      description: "Déploiement en mode validation"
    }),
    persist: flags.boolean({
      char: "p",
      description: "Persister le change set en locale"
    })
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = false;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = true;

  public async run(): Promise<AnyJson> {
    const changeName = this.flags.name;
    const sourceOrg = this.flags.source;
    const targetOrg = this.flags.target;
    const isCheckOnly = this.flags.checkonly;
    const doPersist = this.flags.persist;

    const retrieveChangeSetCommand = `sfdx force:source:retrieve -n "${changeName}" -u ${sourceOrg}`;

    // clean of existing folder
    await rimraf.sync(changeName);

    const deployChangeSetCommand = `sfdx force:source:deploy ${
      isCheckOnly ? "-c" : ""
    } -p "${changeName}" -u ${targetOrg}`;

    this.ux.startSpinner(
      "⬇️  " +
        chalk.yellowBright("Récupération du Change Set") +
        " " +
        chalk.cyanBright(changeName) +
        " " +
        chalk.yellowBright("depuis") +
        " " +
        chalk.cyanBright(sourceOrg)
    );
    try {
      // retrieve change set
      await exec(retrieveChangeSetCommand);
    } catch (error) {
      this.ux.stopSpinner("❌");
      this.ux.error(chalk.redBright(error.stdout));
      this.ux.error(chalk.redBright(error.stderr));
      return error;
    }

    this.ux.stopSpinner("✔️");
    this.ux.log(
      chalk.grey(`================ Contenu du change set ===================`)
    );

    listRecDir(changeName, filePath => {
      this.ux.log(chalk.grey(filePath));
    });

    this.ux.log(
      chalk.grey(`==========================================================`)
    );

    this.ux.startSpinner(
      "⬆️  " +
        chalk.yellowBright("Déploiement du Change Set") +
        " " +
        chalk.cyanBright(changeName) +
        " " +
        chalk.yellowBright("vers") +
        " " +
        chalk.cyanBright(sourceOrg)
    );

    try {
      // deploy change set
      await exec(deployChangeSetCommand);
    } catch (error) {
      this.ux.stopSpinner("❌");
      this.ux.error(chalk.redBright(error.stdout));
      this.ux.error(chalk.redBright(error.stderr));
      return error;
    }

    this.ux.stopSpinner("✔️");

    if (!doPersist) {
      // clean folder
      await rimraf.sync(changeName);
    }

    // Return an object to be displayed with --json
    return { success: true };
  }
}

/**
 * list files in a directory recursively
 * @param dir
 * @param callback
 */
function listRecDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? listRecDir(dirPath, callback) : callback(path.join(dir, f));
  });
}
