import { spawnSync, SpawnSyncReturns } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { createInterface } from 'readline';

import { modules } from './utils';

// Usage: npm run lib:publish [-- --dry-run] [-- --tag next]
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const tagIndex = args.indexOf('--tag');
const distTag = tagIndex >= 0 ? args[tagIndex + 1] : undefined;

const version: string = JSON.parse(
  readFileSync('./package.json', 'utf8'),
).version;

function npm(npmArgs: string[], interactive = false): SpawnSyncReturns<string> {
  return spawnSync('npm', npmArgs, {
    encoding: 'utf8',
    stdio: interactive ? 'inherit' : ['inherit', 'pipe', 'pipe'],
  });
}

function git(gitArgs: string[]): string {
  return spawnSync('git', gitArgs, { encoding: 'utf8' }).stdout.trim();
}

function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    }),
  );
}

function fail(message: string): never {
  console.error(`\n✖ ${message}`);
  process.exit(1);
}

function isPublished(name: string): boolean {
  const result = npm(['view', `${name}@${version}`, 'version']);
  return result.status === 0 && result.stdout.trim() === version;
}

function needsOtp(result: SpawnSyncReturns<string>): boolean {
  return /EOTP|one-time password/i.test(result.stderr + result.stdout);
}

async function main() {
  console.log(
    `Publish helgoland toolbox ${version}${dryRun ? ' (dry run)' : ''}\n`,
  );

  // 1. check build output
  const packages = modules.map((m) => {
    const dir = `dist/helgoland/${m}`;
    const file = `${dir}/package.json`;
    if (!existsSync(file)) {
      fail(`${dir} not found – run "npm run lib:build" first.`);
    }
    const pkg = JSON.parse(readFileSync(file, 'utf8'));
    if (pkg.version !== version) {
      fail(
        `${pkg.name} in dist has version ${pkg.version}, expected ${version} – run "npm run lib:build" again.`,
      );
    }
    return { name: pkg.name as string, dir };
  });

  // 2. check git state (warn only)
  if (git(['status', '--porcelain'])) {
    console.warn('⚠ working tree has uncommitted changes');
  }
  if (!git(['tag', '--list', `v${version}`])) {
    console.warn(`⚠ git tag v${version} does not exist`);
  }

  // 3. check npm login
  if (!dryRun && npm(['whoami']).status !== 0) {
    console.log('Not logged in to npm, starting "npm login"...');
    if (npm(['login'], true).status !== 0) {
      fail('npm login failed.');
    }
  }
  if (!dryRun) {
    console.log(`Logged in as ${npm(['whoami']).stdout.trim()}`);
  }

  // 4. skip already published modules
  const todo = packages.filter((p) => {
    if (isPublished(p.name)) {
      console.log(`- ${p.name}@${version} already published, skipping`);
      return false;
    }
    return true;
  });
  if (todo.length === 0) {
    console.log('\nNothing to publish.');
    return;
  }

  console.log(`\nModules to publish (${todo.length}):`);
  todo.forEach((p) => console.log(`  ${p.name}@${version}`));
  if (
    (
      await ask(
        `\nPublish ${todo.length} modules${
          distTag ? ` with tag "${distTag}"` : ''
        }? [y/N] `,
      )
    ).toLowerCase() !== 'y'
  ) {
    fail('aborted.');
  }

  // 5. publish, ask for a new OTP whenever npm rejects the current one
  let otp = '';
  const published: string[] = [];
  const failed: string[] = [];
  for (const p of todo) {
    const publishArgs = ['publish', p.dir, '--access', 'public'];
    if (distTag) {
      publishArgs.push('--tag', distTag);
    }
    if (dryRun) {
      publishArgs.push('--dry-run');
    }

    let result: SpawnSyncReturns<string>;
    for (;;) {
      result = npm(otp ? [...publishArgs, '--otp', otp] : publishArgs);
      if (dryRun || result.status === 0 || !needsOtp(result)) {
        break;
      }
      otp = await ask(
        `One-time password for ${p.name} (Enter = let npm ask, e.g. browser/security key): `,
      );
      if (!otp) {
        // npm only prompts itself (OTP or browser auth) when attached to the terminal
        result = npm(publishArgs, true);
        break;
      }
    }

    if (result.status === 0) {
      console.log(`✔ ${p.name}@${version}`);
      published.push(p.name);
    } else {
      console.error(`✖ ${p.name}@${version}\n${(result.stderr ?? '').trim()}`);
      failed.push(p.name);
    }
  }

  // 6. summary
  console.log(
    `\n${published.length} ${dryRun ? 'checked (dry run)' : 'published'}, ${
      failed.length
    } failed.`,
  );
  if (failed.length) {
    console.log('Run "npm run lib:publish" again to retry the failed modules:');
    failed.forEach((name) => console.log(`  ${name}`));
    process.exit(1);
  }
}

main();
