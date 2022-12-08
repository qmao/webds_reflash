import { ReactWidget } from '@jupyterlab/apputils';
import React  from 'react';

import { WebDSService } from '@webds/service';
import ReflashComponent from './ReflashComponent';
import { ISettingRegistry } from '@jupyterlab/settingregistry';


/**
* A Counter Lumino Widget that wraps a CounterComponent.
*/
export class ReflashWidget extends ReactWidget {
    _id: string;
    _service: WebDSService;
    _settingRegistry: ISettingRegistry | null = null;
    /**
    * Constructs a new CounterWidget.
    */
    constructor(id: string, service: WebDSService, settingRegistry?: ISettingRegistry | null) {
        super();
        this._id = id;
        this._service = service;
        this._settingRegistry = settingRegistry || null;
        console.log(this._settingRegistry);
    }

    render(): JSX.Element {
        return (
            <div id={this._id + "_component"} >
                <ReflashComponent service={this._service} />
            </div>
        )
    }
}
