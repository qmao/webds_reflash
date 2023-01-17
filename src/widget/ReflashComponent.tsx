import React from "react";
import { webdsService } from './local_exports';
import { useState } from 'react';

import { ThemeProvider } from "@mui/material/styles";

import { ShowContent } from "./widget_content";
import { ShowControl } from "./widget_control";
import { SeverityType } from './widget_content';

import { Canvas } from "./mui_extensions/Canvas";
import { Content } from "./mui_extensions/Content";
import { Controls } from "./mui_extensions/Controls";

export default function ReflashComponent(
    props: {
    }
) {
    const [start, setStart] = useState(false);
    const [progress, setProgress] = useState(0);
    const [filelist, setFileList] = useState<string[]>([]);
    const [packratError, setPackratError] = useState(false);
    const [packrat, setPackrat] = useState("");
    const [serverity, setServerity] = useState<SeverityType>("info");
    const [message, setMessage] = useState("");
    const [link, setLink] = useState("");
    const [alert, setAlert] = useState(false);

    const webdsTheme = webdsService.ui.getWebDSTheme();

    function onProgress(value: number) {
        setProgress(prevState => { return value});
        console.log("WIDGET PROGRESS", value);
    }

    function onStart(value: boolean) {
        setStart(prevState => { return value });
        console.log("WIDGET START", value);
    }

    function onMessage(serverityParam: SeverityType, messageParam: string, linkParam: string) {
        console.log("WIDGET MESSAGE", serverity, message, link);
        setAlert(true);
        setServerity(() => { return serverityParam });
        setMessage(messageParam);
        setLink(linkParam);
    }

    function showAll() {
        return (
            <Canvas title="Reflash">
                <Content>
                    <ShowContent
                        start={start}
                        progress={progress}
                        setPackratError={setPackratError}
                        setFileList={setFileList}
                        setPackrat={setPackrat}
                        severity={serverity}
                        message={message}
                        link={link}
                        alert={alert}
                    />
                </Content>
                <Controls
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <ShowControl title="Reflash" list={filelist} error={packratError}
                        onStart={onStart} onProgress={onProgress} onMessage={onMessage} packrat={packrat} />
                </Controls>
            </Canvas>
        );
    }


    return (
        <div className='jp-webds-widget-body'>
            <ThemeProvider theme={webdsTheme}>
                {showAll()}
            </ThemeProvider>
        </div>
    );
}
