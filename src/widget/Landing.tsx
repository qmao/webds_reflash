import React, { useState } from 'react';

import { ShowContent } from './widget_content';
import { ShowControl } from './widget_control';

import { Canvas } from './mui_extensions/Canvas';
import { Content } from './mui_extensions/Content';
import { Controls } from './mui_extensions/Controls';
import { Page, PackratSource } from './constants';

export default function ReflashComponent(props: any) {
    const [packratError, setPackratError] = useState(false);

    const [ui, setUi] = useState({
        page: Page.PackratServer,
        start: false,
        progress: 0,
        packrat: '',
        packratSource: PackratSource.PackratServer,
        fileName: '',
        fileList: [],
        selectedBlocks: [],
        result: {
            status: 'idle',
            message: '',
            severity: 'info',
            link: ''
        }
    });

    const onUpdate = (u: any) => {
        //console.log('UPDATE UI OLD', ui);
        //console.log('UPDATE UI NEW', u);
        if (JSON.stringify(ui) === JSON.stringify(u) && u.force_update === false) {
            return;
        }

        let update: any = JSON.parse(JSON.stringify(u));
        update.force_update = false;
        setUi(update);
    };

    return (
        <Canvas title="Reflash">
            <Content>
                <ShowContent
                    setPackratError={setPackratError}
                    ui={ui}
                    onUpdate={onUpdate}
                />
            </Content>
            <Controls
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <ShowControl
                    title="Reflash"
                    error={packratError}
                    ui={ui}
                    onUpdate={onUpdate}
                />
            </Controls>
        </Canvas>
    );
}
