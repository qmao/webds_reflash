import { ReactWidget } from '@jupyterlab/apputils';
import React  from 'react';

import { WebDSService } from '@webds/service';
import MainWidget from './widget';
import { ISettingRegistry } from '@jupyterlab/settingregistry';


/**
* A Counter Lumino Widget that wraps a CounterComponent.
*/
export class ShellWidget extends ReactWidget {
    _service: WebDSService;
    _settingRegistry: ISettingRegistry | null = null;
    /**
    * Constructs a new CounterWidget.
    */
    constructor(service: WebDSService, settingRegistry?: ISettingRegistry | null) {
        super();
        this.addClass('jp-webds-widget');
        this._service = service;
        this._settingRegistry = settingRegistry || null;
        console.log(this._settingRegistry);
    }

    render(): JSX.Element {
        return <MainWidget service={this._service}/>;
    }
}
