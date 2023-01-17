import { ReactWidget } from '@jupyterlab/apputils';
import React  from 'react';

import ReflashComponent from './ReflashComponent';

/**
* A Counter Lumino Widget that wraps a CounterComponent.
*/
export class ReflashWidget extends ReactWidget {
    _id: string;
    /**
    * Constructs a new CounterWidget.
    */
    constructor(id: string) {
        super();
        this._id = id;
    }

    render(): JSX.Element {
        return (
            <div id={this._id + "_component"} >
                <ReflashComponent />
            </div>
        )
    }
}
