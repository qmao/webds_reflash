import React from "react";

import { ThemeProvider } from "@mui/material/styles";
import { WebDSService } from '@webds/service';
import { ISettingRegistry } from "@jupyterlab/settingregistry";

import {
    Stack,
    Typography,
    Paper
} from '@mui/material';


export default function MainWidget(
    props: {
        service: WebDSService;
        settingRegistry?: ISettingRegistry;
    }
) {

    const webdsTheme = props.service.ui.getWebDSTheme();

    function ShowContent() {
        return (
            <Typography>
                Content
            </Typography>
        );
    }

    function ShowControl() {
        return (
            <Typography>
                Control
            </Typography>
        );
    }

    const WIDTH = 800;
    const HEIGHT_TITLE = 70;

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
                    {ShowContent()}
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
                    {ShowControl()}
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
