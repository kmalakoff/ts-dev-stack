// remove NODE_OPTIONS to not interfere with tests
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import path from 'path';
import url from 'url';
import * as constants from '../../src/constants.ts';
import runCommand from '../../src/runCommand.ts';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const fixturesPath = path.join(__dirname, '..', 'fixtures');

describe('runCommand', () => {
  describe('default commands', () => {
    it('should run default commands with --dry-run', (done) => {
      runCommand('build', ['--dry-run'], { cwd: fixturesPath }, (err) => {
        assert.ifError(err);
        done();
      });
    });

    it('should error for unrecognized command', (done) => {
      runCommand('nonexistent', [], { cwd: fixturesPath }, (err) => {
        assert.ok(err);
        assert.ok(err.message.indexOf('Unrecognized command') !== -1);
        done();
      });
    });
  });

  describe('command configuration', () => {
    describe('override commands', () => {
      it('should use overridden command from config', (done) => {
        const fixturePath = path.join(fixturesPath, 'config-commands-override');
        // We can't actually run the command since tsds-vitest doesn't exist,
        // but we can verify the config is being read correctly by checking
        // that it tries to resolve the overridden module
        runCommand('test:node', ['--dry-run'], { cwd: fixturePath }, (err) => {
          // --dry-run should succeed without actually running the command
          assert.ifError(err);
          done();
        });
      });
    });

    describe('disable commands', () => {
      it('should error when running a disabled command', (done) => {
        const fixturePath = path.join(fixturesPath, 'config-commands-disable');
        runCommand('build', [], { cwd: fixturePath }, (err) => {
          assert.ok(err);
          assert.ok(err.message.indexOf('Command disabled') !== -1);
          assert.ok(err.message.indexOf('build') !== -1);
          done();
        });
      });

      it('should allow non-disabled commands to run', (done) => {
        const fixturePath = path.join(fixturesPath, 'config-commands-disable');
        runCommand('format', ['--dry-run'], { cwd: fixturePath }, (err) => {
          assert.ifError(err);
          done();
        });
      });
    });

    describe('add custom commands', () => {
      it('should recognize custom commands from config', (done) => {
        const fixturePath = path.join(fixturesPath, 'config-commands-add');
        // Custom command 'lint' should be recognized but will fail to resolve
        // since tsds-eslint doesn't exist - that's expected behavior
        runCommand('lint', ['--dry-run'], { cwd: fixturePath }, (err) => {
          // --dry-run should succeed without trying to resolve the module
          assert.ifError(err);
          done();
        });
      });

      it('should still allow default commands when custom commands are added', (done) => {
        const fixturePath = path.join(fixturesPath, 'config-commands-add');
        runCommand('build', ['--dry-run'], { cwd: fixturePath }, (err) => {
          assert.ifError(err);
          done();
        });
      });
    });

    describe('provided config option', () => {
      it('should use commands from provided config', (done) => {
        const config = {
          commands: {
            'custom-cmd': 'custom-module',
          },
        };
        runCommand('custom-cmd', ['--dry-run'], { config }, (err) => {
          assert.ifError(err);
          done();
        });
      });

      it('should disable commands via provided config', (done) => {
        const config = {
          commands: {
            build: null,
          },
        };
        runCommand('build', [], { config }, (err) => {
          assert.ok(err);
          assert.ok(err.message.indexOf('Command disabled') !== -1);
          done();
        });
      });
    });
  });

  describe('constants', () => {
    it('should have all expected default commands', () => {
      const expectedCommands = ['build', 'coverage', 'docs', 'format', 'install', 'link', 'publish', 'test:node', 'test:browser', 'unlink', 'validate', 'version'];
      for (let i = 0; i < expectedCommands.length; i++) {
        const cmd = expectedCommands[i];
        assert.ok(constants.commands[cmd], `Expected command "${cmd}" to exist`);
      }
    });
  });
});
