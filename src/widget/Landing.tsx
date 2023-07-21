import React, { useState, useRef } from 'react';

import { ShowContent } from './widget_content';
import { ShowControl } from './widget_control';

import { Canvas } from './mui_extensions/Canvas';
import { Content } from './mui_extensions/Content';
import { Controls } from './mui_extensions/Controls';
import { Page, PackratSource } from './constants';

const defaultUI = {
    page: Page.MainEntry,
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
};

export default function ReflashComponent(props: any) {
    const [ui, setUi] = useState(defaultUI);
    const uiRef = useRef(defaultUI);

    const onUpdate = (u: any) => {
        //console.log('----UPDATE UI OLD', ui);
        //console.log('----UPDATE UI NEW', u);
        if (
            JSON.stringify(uiRef.current) === JSON.stringify(u) &&
            u.force_update === false
        ) {
            return;
        }

        uiRef.current = u;

        let update: any = JSON.parse(JSON.stringify(uiRef.current));
        update.force_update = false;
        setUi(update);
    };

    return (
        <Canvas title="Reflash">
            <Content>
                <ShowContent ui={ui} onUpdate={onUpdate} />
            </Content>
            <Controls
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <ShowControl ui={ui} onUpdate={onUpdate} />
            </Controls>
        </Canvas>
    );
}
