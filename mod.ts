async function runCommand(
  command: string,
  args: string[] = [],
): Promise<string | null> {
  try {
    const cmd = new Deno.Command(command, {
      args,
      stdout: "piped",
      stderr: "piped",
    });

    const { stdout } = await cmd.output();
    return new TextDecoder().decode(stdout).trim();
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return null; // Command not found
    }
    throw error; // Re-throw other errors
  }
}

export async function checkNodeLTSVersion() {
  const nodeExists = await runCommand("node", ["-v"]);
  if (!nodeExists) {
    console.log("\x1b[33m⚠️  Node.js is not installed.\x1b[0m");
    return;
  }

  try {
    const currentNode = nodeExists.replace("v", "");
    const latestLTS = (await runCommand("fnm", ["list-remote", "--lts"]))
      ?.split("\n")
      .filter(Boolean)
      .pop()
      ?.split(" ")[0]
      .replace("v", "");

    if (currentNode !== latestLTS) {
      console.log(
        `\x1b[33m⚠️  Your Node.js version (${currentNode}) is not the latest LTS version (${latestLTS}).\x1b[0m`,
      );
      console.log(
        `\x1b[34m   Run 'fnm install --lts && fnm use lts' to update.\x1b[0m`,
      );
    } else {
      console.log(
        `\x1b[32m✅  Your Node.js version (${currentNode}) is the latest LTS version.\x1b[0m`,
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `\x1b[31m❌⚠️  Error checking Node.js version: ${error.message}\x1b[0m`,
      );
    } else {
      console.error(
        "\x1b[31m❌⚠️  An unknown error occurred while checking Node.js version.\x1b[0m",
      );
    }
  }
}

export async function checkDenoVersion() {
  const currentDeno = Deno.version.deno;
  const latestDeno = await fetch(
    "https://api.github.com/repos/denoland/deno/releases/latest",
  )
    .then((res) => res.json())
    .then((data) => data.tag_name.replace("v", ""));

  if (currentDeno !== latestDeno) {
    console.log(
      `\x1b[33m⚠️  Your Deno version (${currentDeno}) is not the latest (${latestDeno}).\x1b[0m`,
    );
    console.log(`\x1b[34m   Run 'deno upgrade' to update.\x1b[0m`);
  } else {
    console.log(
      `\x1b[32m✅  Your Deno version (${currentDeno}) is the latest.\x1b[0m`,
    );
  }
}

export async function checkRustVersion() {
  const rustExists = await runCommand("rustc", ["--version"]);
  if (!rustExists) {
    console.log("\x1b[33m⚠️  Rust is not installed.\x1b[0m");
    return;
  }

  try {
    const currentRust = rustExists.split(" ")[1];
    const latestRust = await fetch(
      "https://api.github.com/repos/rust-lang/rust/releases/latest",
    )
      .then((res) => res.json())
      .then((data) => data.tag_name.replace("v", ""));

    if (currentRust !== latestRust) {
      console.log(
        `\x1b[33m⚠️  Your Rust version (${currentRust}) is not the latest (${latestRust}).\x1b[0m`,
      );
      console.log(`\x1b[34m   Run 'rustup update' to update.\x1b[0m`);
    } else {
      console.log(
        `\x1b[32m✅  Your Rust version (${currentRust}) is the latest.\x1b[0m`,
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `\x1b[31m❌⚠️  Error checking Rust version: ${error.message}\x1b[0m`,
      );
    } else {
      console.error(
        "\x1b[31m❌⚠️  An unknown error occurred while checking Rust version.\x1b[0m",
      );
    }
  }
}

async function checkAndUpdateBrew() {
  const brewExists = await runCommand("brew", ["--version"]);
  if (!brewExists) {
    console.log("\x1b[33m⚠️  Homebrew is not installed.\x1b[0m");
    return;
  }

  console.log("\x1b[1;34m🔍  Checking for Homebrew updates...\x1b[0m");

  // Update Homebrew
  await runCommand("brew", ["update"]);

  // Get outdated packages
  const outdatedPackages = await runCommand("brew", ["outdated"]);

  if (!outdatedPackages) {
    console.log(
      "\x1b[1;32m✅  Homebrew and all packages are up to date.\x1b[0m",
    );
  } else {
    console.log(
      "\x1b[1;33m⚠️  The following packages have updates available:\x1b[0m",
    );
    console.log(outdatedPackages);

    // Ask the user if they want to update
    console.log("Do you want to update all packages? (y/N)");
    const buf = new Uint8Array(1);
    await Deno.stdin.read(buf);
    const answer = new TextDecoder().decode(buf).trim().toLowerCase();

    if (answer === "y") {
      console.log("\x1b[1;34m⬆️  Updating Homebrew and packages...\x1b[0m");
      await runCommand("brew", ["upgrade"]);
      console.log("\x1b[1;34m🧹  Cleaning up old versions...\x1b[0m");
      await runCommand("brew", ["cleanup"]);
      console.log("\x1b[1;32m✅  Update complete!\x1b[0m");
    } else {
      console.log("\x1b[1;33m🚀  Skipping update.\x1b[0m");
    }
  }
}

export async function check() {
  await checkNodeLTSVersion();
  await checkDenoVersion();
  await checkRustVersion();
  await checkAndUpdateBrew();
}

if (import.meta.main) {
  await check();
}
