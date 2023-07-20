import React, { useState, useEffect, useRef } from 'react';
import { webdsService } from './local_exports';

import { Box, Typography, Button } from '@mui/material';
import { Page, PackratSource } from './constants';
import { start_reflash, start_fetch } from './api';
interface Props {
    children?: React.ReactNode;
    index?: any;
    value?: any;
    alert?: any;
    ui: any;
    onUpdate: any;
}

export const ShowControl = (props: Props): JSX.Element => {
    const { children, value, index, alert, ...other } = props;
    const [disable, setDisable] = useState(true);
    const [progress, setProgress] = React.useState(0);
    const [isStart, setStart] = React.useState(false);
    const link = useRef('');

    // SSE START
    const eventSource = useRef<undefined | EventSource>(undefined);
    const eventError = useRef(false);
    const eventType = 'reflash';
    const eventRoute = '/webds/reflash';

    const removeEvent = () => {
        const SSE_CLOSED = 2;
        if (eventSource.current && eventSource.current!.readyState !== SSE_CLOSED) {
            eventSource.current!.removeEventListener(eventType, eventHandler, false);
            eventSource.current!.close();
            eventSource.current = undefined;
            console.log('SSE EVENT IS REMOVED');
        }
    };

    const donwloadConfigJson = () => {
        if (webdsService.pinormos !== undefined) {
            const external = webdsService.pinormos.isExternal();
            if (external) {
                webdsService.packrat.cache
                    .addPublicConfig()
                    .then((ret: any) => {
                        console.log('download config file:', ret);
                    })
                    .catch((e: any) => {
                        console.log('download config file failed:', e);
                    });
            } else {
                webdsService.packrat.cache
                    .addPrivateConfig()
                    .then((ret: any) => {
                        console.log('download config file:', ret);
                    })
                    .catch((e: any) => {
                        console.log('download config file failed:', e);
                    });
            }
        }
    };

    const eventHandler = (event: any) => {
        let obj = JSON.parse(event.data);

        if (obj.progress) {
            setProgress(obj.progress);
        }
        if (obj.status && obj.message) {
            setStatus(false, obj.status === 'success', JSON.stringify(obj.message));
        }
    };

    const errorHandler = (error: any) => {
        eventError.current = true;
        removeEvent();
        //setLoading(false);
        //showMessage('error', `Error on GET ${eventRoute}`);
    };

    const addEvent = () => {
        if (eventSource.current) {
            return;
        }
        eventError.current = false;
        eventSource.current = new window.EventSource(eventRoute);
        eventSource.current!.addEventListener(eventType, eventHandler, false);
        eventSource.current!.addEventListener('error', errorHandler, false);
    };
    // SSE END

    const go = (file: string) => {
        setStatus(true);

        addEvent();

        start_reflash(file, props.ui.selectedBlocks)
            .then((res) => {
                setStatus(true);
            })
            .catch((error) => {
                console.log(error, 'Promise error');
                removeEvent();
                setStatus(false, false, error);
            });
    };

    useEffect(() => {
        let update: any = { ...props.ui };
        update.progress = progress;
        props.onUpdate(update);
    }, [progress]);

    useEffect(() => {
        if (
            isStart ||
            props.ui.selectedBlocks.length === 0 ||
            props.ui.page === Page.FileSelect
        ) {
            setDisable(true);
        } else {
            setDisable(false);
        }
    }, [props.ui]);

    const show_result = (pass: boolean, message: string) => {
        console.log('pass:', pass);

        let result: any = {
            status: 'done',
            message: message,
            severity: pass ? 'success' : 'error',
            link: link.current
        };

        let update: any = { ...props.ui };
        update.result = result;
        props.onUpdate(update);
    };

    const setStatus = (start: boolean, status?: boolean, result?: string) => {
        if (start) {
            link.current = '';
        } else {
            console.log(result);
            show_result(status!, result || '');
            setStart(false);
            removeEvent();
            if (status) {
                donwloadConfigJson();
            }
        }

        setProgress(0);
    };

    useEffect(() => {
        let file: string;

        let update: any = { ...props.ui };
        update.start = isStart;
        update.result.status = 'progress';
        props.onUpdate(update);

        if (isStart) {
            console.log('START!!!!', props.ui);
            if (props.ui.packratSource === PackratSource.FsFile) {
                file = props.ui.fileName;

                if (file === '') {
                    setStatus(false, false, 'Please choose an image file');
                }
                go(file);
            } else if (props.ui.packratSource === PackratSource.PackratServer) {
                console.log('download image from packrat server');
                file = props.ui.packrat;
                start_fetch(file)
                    .then((res) => {
                        go(res);
                    })
                    .catch((error) => {
                        console.log(error, 'Promise error');
                        setStatus(false, false, error);
                    });
            }
        }
    }, [isStart]);

    function download() {
        const update: any = {
            ...props.ui,
            download: true
        };
        props.onUpdate(update);
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row-reverse',
                mb: 1
            }}
        >
            <div {...other}>
                {props.ui.page !== Page.FileSelect && (
                    <>
                        {props.ui.selectedBlocks.length === 0 ? (
                            <Button
                                disabled={props.ui.packrat === ''}
                                color="primary"
                                variant="contained"
                                onClick={() => download()}
                                sx={{ width: 150, mt: 1 }}
                            >
                                Download
                            </Button>
                        ) : (
                                <Button
                                    disabled={disable}
                                    color="primary"
                                    variant="contained"
                                    onClick={() => setStart(true)}
                                    sx={{ width: 150, mt: 1 }}
                                >
                                    {isStart && (
                                        <Typography
                                            variant="caption"
                                            component="div"
                                            color="text.secondary"
                                            sx={{ mr: 1 }}
                                        >
                                            {`${Math.round(progress)}%`}
                                        </Typography>
                                    )}
                Reflash
                                </Button>
                            )}
                    </>
                )}
            </div>
        </Box>
    );
};
