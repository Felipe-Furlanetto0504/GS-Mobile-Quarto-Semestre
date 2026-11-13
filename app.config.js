// Completa o app.json com o hash do commit usado no build (mostrado na tela "Sobre o App").
// No EAS Build o hash vem da variável EAS_BUILD_GIT_COMMIT_HASH; localmente, do próprio git.
const { execSync } = require('child_process');

function hashDoCommit() {
  if (process.env.EAS_BUILD_GIT_COMMIT_HASH) return process.env.EAS_BUILD_GIT_COMMIT_HASH;
  try {
    return execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    commitHash: hashDoCommit(),
  },
});
