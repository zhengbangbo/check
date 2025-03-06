async function runCommand(command: string): Promise<string> {
  const cmd = new Deno.Command(command.split(' ')[0], {
    args: command.split(' ').slice(1),
    stdout: 'piped',
    stderr: 'piped',
  });

  const { stdout } = await cmd.output();
  return new TextDecoder().decode(stdout).trim();
}

export async function checkNodeLTSVersion() {
  const currentNode = (await runCommand('node -v')).replace('v', '');
  const latestLTS = (await runCommand('fnm list-remote --lts'))
    .split('\n')
    .filter(Boolean)
    .pop()
    ?.split(' ')[0]
    .replace('v', '');

  if (currentNode !== latestLTS) {
    console.log(`\x1b[33m⚠️  Your Node.js version (${currentNode}) is not the latest LTS version (${latestLTS}).\x1b[0m`);
    console.log(`\x1b[34m   Run 'fnm install --lts && fnm use lts' to update.\x1b[0m`);
  } else {
    console.log(`\x1b[32m✅  Your Node.js version (${currentNode}) is the latest LTS version.\x1b[0m`);
  }
}

export async function checkDenoVersion() {
  const currentDeno = Deno.version.deno;
  const latestDeno = await fetch('https://api.github.com/repos/denoland/deno/releases/latest')
    .then((res) => res.json())
    .then((data) => data.tag_name.replace('v', ''));

  if (currentDeno !== latestDeno) {
    console.log(`\x1b[33m⚠️  Your Deno version (${currentDeno}) is not the latest (${latestDeno}).\x1b[0m`);
    console.log(`\x1b[34m   Run 'deno upgrade' to update.\x1b[0m`);
  } else {
    console.log(`\x1b[32m✅  Your Deno version (${currentDeno}) is the latest.\x1b[0m`);
  }
}

export async function checkRustVersion() {
  const currentRust = (await runCommand('rustc --version')).split(' ')[1];
  const latestRust = await fetch('https://api.github.com/repos/rust-lang/rust/releases/latest')
    .then((res) => res.json())
    .then((data) => data.tag_name.replace('v', ''));

  if (currentRust !== latestRust) {
    console.log(`\x1b[33m⚠️  Your Rust version (${currentRust}) is not the latest (${latestRust}).\x1b[0m`);
    console.log(`\x1b[34m   Run 'rustup update' to update.\x1b[0m`);
  } else {
    console.log(`\x1b[32m✅  Your Rust version (${currentRust}) is the latest.\x1b[0m`);
  }
}

export async function check() {
  await checkNodeLTSVersion();
  await checkDenoVersion();
  await checkRustVersion();
}

if (import.meta.main) {
  await check();
}