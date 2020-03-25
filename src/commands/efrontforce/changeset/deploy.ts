import { flags, SfdxCommand } from "@salesforce/command";
import { AnyJson } from "@salesforce/ts-types";
import * as path from "path";
import * as fs from "fs";
import * as rimraf from "rimraf";
import * as chalk from "chalk";
import * as AdmZip from "adm-zip";
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
    "[EN] Warning: if a sub-folder 'temp' exists in the folder where you run the command, it will be overwritten."
  )}
  ⚠️  ${chalk.magentaBright(
    "[FR] Attention : si un sous-dossier 'temp' existe dans le dossier de lancement de la commande, il sera ecrasé"
  )}
  `
  ];

  // supported flags
  protected static flagsConfig = {
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
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
    const TEMP_FOLDER = "temp";
    const changeName = this.flags.name;
    const sourceOrg = this.flags.source;
    const targetOrg = this.flags.target;
    const isCheckOnly = this.flags.checkonly;
    const doPersist = this.flags.persist;

    // retrieve command
    const retrieveChangeSetCommand = `sfdx force:mdapi:retrieve -p "${changeName}" -u ${sourceOrg} -r temp`;
    // deploy command
    const deployChangeSetCommand = `sfdx force:mdapi:deploy ${
      isCheckOnly ? "-c" : ""
    } -d "${TEMP_FOLDER}/${changeName}" -u ${targetOrg} -w -1`;

    // clean of existing folder
    await rimraf.sync(TEMP_FOLDER);

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

    // extract the zip
    const zip = new AdmZip(TEMP_FOLDER + "/unpackaged.zip");
    zip.extractAllTo(TEMP_FOLDER, true);
    await fs.unlinkSync(TEMP_FOLDER + "/unpackaged.zip");

    this.ux.stopSpinner("✔️");
    this.ux.log(
      chalk.grey(
        `================ Content of the change set ===================`
      )
    );

    listRecDir(TEMP_FOLDER + "/" + changeName, filePath => {
      this.ux.log(chalk.grey(filePath));
    });

    this.ux.log(
      chalk.grey(
        `==============================================================`
      )
    );

    this.ux.startSpinner(
      "⬆️  " +
        chalk.yellowBright("Deploying the Change Set") +
        " " +
        chalk.cyanBright(changeName) +
        " " +
        chalk.yellowBright("to") +
        " " +
        chalk.cyanBright(targetOrg)
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
      await rimraf.sync(TEMP_FOLDER);
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
