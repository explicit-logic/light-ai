import packageJSON from '../../package.json' with { type: 'json' };

export function getModuleVersion() {
  return packageJSON.version;
}
