import React from "react";

import { useState } from 'react';

import { ThemeProvider } from "@mui/material/styles";
import { WebDSService } from '@webds/service';
import { ISettingRegistry } from "@jupyterlab/settingregistry";

import {
    Stack,
    Typography,
    Paper
} from '@mui/material';

import { ShowContent } from "./widget_content";
import { ShowControl } from "./widget_control";

export default function MainWidget(
    props: {
        service: WebDSService;
        settingRegistry?: ISettingRegistry | null;
    }
) {
    const [start, setStart] = useState(false);
    const [progress, setProgress] = useState(0);
    const [filelist, setFileList] = useState<string[]>([]);
    const [packratError, setPackratError] = useState(false);
    const [packrat, setPackrat] = useState("");

    const webdsTheme = props.service.ui.getWebDSTheme();

    const WIDTH = 800;
    const HEIGHT_TITLE = 70;

    function onProgress(value: number) {
        setProgress(prevState => { return value});
        console.log("WIDGET PROGRESS", value);
    }

    function onStart(value: boolean) {
        setStart(prevState => { return value });
        console.log("WIDGET START", value);
    }

    function onMessage(message: string) {
        console.log("WIDGET MESSAGE", message);
        console.log("message!!!");
    }

    function showAll() {
        return (
            <Stack spacing={2}>
                <Paper
                    elevation={0}
                    sx={{
                        width: WIDTH + "px",
                        height: HEIGHT_TITLE + "px",
                        position: "relative",
                        bgcolor: "section.main"
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)"
                        }}
                    >
                        Reflash
                    </Typography>
                </Paper>

                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="stretch"

                    sx={{
                        width: WIDTH + "px",
                        bgcolor: "section.main",
                    }}
                >
                    <ShowContent service={props.service}
                        start={start}
                        progress={progress}
                        setPackratError={setPackratError}
                        setFileList={setFileList}
                        setPackrat={setPackrat}
                    />
                </Stack>
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        width: WIDTH + "px",
                        bgcolor: "section.main",
                        py: 1,
                    }}
                >
                    <ShowControl title="Reflash" list={filelist} error={packratError}
                        onStart={onStart} onProgress={onProgress} onMessage={onMessage} service={props.service} packrat={packrat} />
                </Stack>
            </Stack>
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
