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

namespace ExtensionParameter {
  export const name = 'webds-reflash';
  export const landingIcon = extensionReflashIcon;
  export const titleIcon = extensionReflashIcon;
  export const category = 'Touch - Bootstrapping';
  export const title = 'Reflash';
  export const id = 'webds:webds-reflash';
  export const rank = 20;
}

/**
 * Initialization data for the extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: `@webds/${ExtensionParameter.name}:plugin`,
  autoStart: true,
  optional: [ISettingRegistry],
  requires: [ILauncher, ILayoutRestorer, WebDSService],
  activate: async (
    app: JupyterFrontEnd,
    launcher: ILauncher,
    restorer: ILayoutRestorer,
    service: WebDSService,
    settingRegistry: ISettingRegistry | null) => {
    console.log(`JupyterLab extension ${ExtensionParameter.name} is activated!`);

    let widget: WebDSWidget;
    const { commands, shell } = app;
    const command = ExtensionParameter.id;
    const category = ExtensionParameter.category;
    const extension_string = ExtensionParameter.title;


    commands.addCommand(command, {
      label: extension_string,
      caption: extension_string,
	  icon: ExtensionParameter.landingIcon,
      execute: () => {
        if (!widget || widget.isDisposed) {
          let content = new ShellWidget(service, settingRegistry);

          widget = new WebDSWidget<ShellWidget>({ content });
          widget.id = `${ExtensionParameter.name}_widget`;
          widget.title.label = extension_string;
          widget.title.closable = true;
          widget.title.icon = ExtensionParameter.landingIcon;
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
      category: category,
      rank: ExtensionParameter.rank
    });

    let tracker = new WidgetTracker<WebDSWidget>({ namespace: `${ExtensionParameter.name}` });
    restorer.restore(tracker, { command, name: () => `${ExtensionParameter.name}` });
  }
};

export default plugin;
