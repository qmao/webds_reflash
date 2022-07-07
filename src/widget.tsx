import { ReactWidget } from '@jupyterlab/apputils';
import React  from 'react';
import { WebDSService } from '@webds/service';



export default function VerticalTabs(
) {
   
    return (
        <div className='jp-webds-widget-body'>
        </div>
    );

}

/**
* A Counter Lumino Widget that wraps a CounterComponent.
*/
export class ShellWidget extends ReactWidget {
	service: WebDSService | null = null;

    /**
    * Constructs a new CounterWidget.
    */
    constructor(service: WebDSService) {
        super();
        this.addClass('jp-webds-widget');
        console.log("TabPanelUiWidget is created!!!");
		this.service = service;
    }

    handleChangeFile(e: React.ChangeEvent<HTMLInputElement>) {
        console.log(e.currentTarget.files);
    }

    render(): JSX.Element {
        return <VerticalTabs/>;
    }
}
