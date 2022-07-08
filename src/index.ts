import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { WidgetTracker } from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { ShellWidget } from './wrapper'

import { extensionReflashIcon } from './icons';

import { WebDSService, WebDSWidget } from '@webds/service';


/**
 * The command IDs used by the server extension plugin.
 */
namespace CommandIDs {
  export const id = 'webds:webds-reflash';
}

/**
 * Initialization data for the extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@webds/webds_reflash:plugin',
  autoStart: true,
  optional: [ISettingRegistry],
  requires: [ILauncher, ILayoutRestorer, WebDSService],
  activate: async (
    app: JupyterFrontEnd,
    launcher: ILauncher,
    restorer: ILayoutRestorer,
    service: WebDSService,
    settingRegistry: ISettingRegistry | null) => {
    console.log('JupyterLab extension webds_reflash is activated!');

    let widget: WebDSWidget;
    const { commands, shell } = app;
    const command = CommandIDs.id;
    const category = 'WebDS'
    const extension_string = 'Reflash';


    commands.addCommand(command, {
      label: extension_string,
      caption: extension_string,
	  icon: extensionReflashIcon,
      execute: () => {
        if (!widget || widget.isDisposed) {
          let content = new ShellWidget(service, settingRegistry);

          widget = new WebDSWidget<ShellWidget>({ content });
          widget.id = 'webds_reflash_widget';
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
