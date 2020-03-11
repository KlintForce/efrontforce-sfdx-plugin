import { flags, SfdxCommand } from "@salesforce/command";
import { AnyJson } from "@salesforce/ts-types";
import * as path from "path";
import * as fs from "fs";
import * as rimraf from "rimraf";
import * as chalk from "chalk";
import { exec } from "child-process-promise";

export default class Org extends SfdxCommand {
  public static examples = [
    `$ sfdx efrontforce:changeset:deploy -s MyOrgSource -t MyOrgTarget -n "MyChangeSet"
  [EN] This command will deploy your change set ${chalk.cyanBright(
    "MyChangeSet"
  )} from ${chalk.cyanBright("MyOrgSource")} to ${chalk.cyanBright(
      "MyOrgTarget"
    )}
  [FR] Cette commande va déployer votre change set ${chalk.cyanBright(
    "MyChangeSet"
  )} du ${chalk.cyanBright("MyOrgSource")} vers ${chalk.cyanBright(
      "MyOrgTarget"
    )}
  `,
    `$ sfdx efrontforce:changeset:deploy -s MyOrgSource -t MyOrgTarget -n "MyChangeSet" -p
  [EN] : This command will deploy the change set ${chalk.cyanBright(
    "MyChangeSet"
  )} from ${chalk.cyanBright("MyOrgSource")} to ${chalk.cyanBright(
      "MyOrgTarget"
    )} et le persister en locale
  [FR] : Cette commande va déployer votre change set ${chalk.cyanBright(
    "MyChangeSet"
  )} du ${chalk.cyanBright("MyOrgSource")} vers ${chalk.cyanBright(
      "MyOrgTarget"
    )} et le persister en locale
  `,
    `
  ⚠️  ${chalk.magentaBright(
    "[EN] Warning: if there is a folder in your project with the same name as the change set, it will be overwritten."
  )}
  ⚠️  ${chalk.magentaBright(
    "[FR] Attention : si il y un dossier dans votre projet qui porte le même nom que le change set, il sera ecrasé"
    )}
  `
  ];

  public static args = [{ name: "file" }];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    name: flags.string({
      required: true,
      char: "n",
      description: "Name of the change set"
    }),
    source: flags.string({
      required: true,
      char: "s",
      description: "Source org"
    }),
    target: flags.string({
      required: true,
      char: "t",
      description: "Target org"
    }),
    checkonly: flags.boolean({
      char: "c",
      description: "Deploy wi checkonly mode"
    }),
    persist: flags.boolean({
      char: "p",
      description: "Persist the change set locally"
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
        chalk.yellowBright("Retrieving the Change Set") +
        " " +
        chalk.cyanBright(changeName) +
        " " +
        chalk.yellowBright("from") +
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
      chalk.grey(`================ Content of the change set ===================`)
    );

    listRecDir(changeName, filePath => {
      this.ux.log(chalk.grey(filePath));
    });

    this.ux.log(
      chalk.grey(`==============================================================`)
    );

    this.ux.startSpinner(
      "⬆️  " +
        chalk.yellowBright("Deploying the Change Set") +
        " " +
        chalk.cyanBright(changeName) +
        " " +
        chalk.yellowBright("to") +
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
