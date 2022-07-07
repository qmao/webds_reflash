import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

/**
 * Initialization data for the webds_reflash extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'webds_reflash:plugin',
  autoStart: true,
  optional: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settingRegistry: ISettingRegistry | null) => {
    console.log('JupyterLab extension webds_reflash is activated!');

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('webds_reflash settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error('Failed to load settings for webds_reflash.', reason);
        });
    }
  }
};

export default plugin;
