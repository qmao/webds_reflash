import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { WidgetTracker } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { ShellWidget } from './widget'

import { extensionReflashIcon } from './icons';

import { WebDSService, WebDSWidget } from '@webds/service';

/**
 * The command IDs used by the server extension plugin.
 */
namespace CommandIDs {
  export const reflash = 'webds:reflash';
}

/**
 * Initialization data for the webds_reflash extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'webds_reflash:plugin',
  autoStart: true,
  optional: [ISettingRegistry], 
  requires: [ILauncher, ILayoutRestorer, WebDSService],
  activate: (
    app: JupyterFrontEnd,
    launcher: ILauncher,
    restorer: ILayoutRestorer,
	settingRegistry: ISettingRegistry | null,
	service: WebDSService) => {
    console.log('JupyterLab extension reflash is activated!');

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

    let widget: WebDSWidget;
    const { commands, shell } = app;
    const command = CommandIDs.reflash;
    const category = 'WebDS';
    const extension_string = 'Reflash';


    commands.addCommand(command, {
      label: extension_string,
      caption: extension_string,
	  icon: extensionReflashIcon,
      execute: () => {
        if (!widget || widget.isDisposed) {
          let content = new ShellWidget(service);

          widget = new WebDSWidget<ShellWidget>({ content });
          widget.id = 'reflash';
          widget.title.label = extension_string;
          widget.title.closable = true;
          widget.title.icon = extensionReflashIcon;
        }

        if (!tracker.has(widget))
          tracker.add(widget);

        if (!widget.isAttached)
          shell.add(widget, 'main');

        shell.activateById(widget.id);
      }
    });

    // Add launcher
    launcher.add({
      command: command,
      category: category
    });

    let tracker = new WidgetTracker<WebDSWidget>({ namespace: 'webds_reflash' });
    restorer.restore(tracker, { command, name: () => 'webds_reflash' });
  }
};

export default plugin;
export default plugin;