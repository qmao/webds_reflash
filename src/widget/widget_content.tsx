import React, { useState, useEffect } from 'react';
import { requestAPI, webdsService } from './local_exports';

import {
    Typography,
    Collapse,
    Alert,
    AlertTitle,
    Stack,
    Button,
    Avatar,
    Paper,
    TextField,
    Box,
    Link
} from '@mui/material';

import FileList from './filelist';
import { green } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DehazeOutlinedIcon from '@mui/icons-material/DehazeOutlined';

import { Layout, PackratSource, Page } from './constants';
import { BlockList } from './BlockList';

export type SeverityType = 'error' | 'info' | 'success' | 'warning';

interface Props {
    ui: any;
    onUpdate: any;
}

export const ShowContent = (props: Props): JSX.Element => {
    const [open, setOpen] = useState(false);
    const [filelist, setFileList] = useState<string[]>([]);
    const [select, setSelect] = useState('');
    const [isAlert, setAlert] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<SeverityType>('info');
    const [link, setLink] = useState('');
    const [result, setResult] = useState('');
    const [blockList, setBlockList] = useState([]);

    const onMessage = (
        severityParam: SeverityType,
        messageParam: string,
        linkParam: string
    ) => {
        setMessage(messageParam);
        setSeverity(severityParam);
        setResult(severityParam.toUpperCase());
        setLink(linkParam);

        console.log(severityParam);
        console.log(messageParam);
        console.log(result);
        console.log(link);

        setAlert(true);
    };

    const get_list = async (
        exetension: string
    ): Promise<string[] | undefined> => {
        try {
            const reply = await requestAPI<any>('packrat?extension=' + exetension, {
                method: 'GET'
            });
            return Promise.resolve(reply['filelist']);
        } catch (error) {
            console.log(error);
            return Promise.reject(error.message);
        }
    };

    const get_lists = async (): Promise<string[] | undefined> => {
        try {
            let list = await get_list('img');
            setFileList(list!);
            return Promise.resolve(list);
        } catch (error) {
            console.log(error);
            setFileList([]);
            return Promise.reject(error.message);
        }
    };

    const upload_img = async (file: File): Promise<string> => {
        console.log('upload img file:', file);
        const regex = /PR\d+/g;
        const packrat = file.name.match(regex);
        let fileName = '';
        let packratID = '';

        try {
            if (!packrat) return Promise.reject('invalid file name');
            packratID = packrat![0].substr(2);
            fileName = file.name;

            const formData = new FormData();
            formData.append('fileToUpload', file, fileName);

            await requestAPI<any>('packrat/' + packratID, {
                body: formData,
                method: 'POST'
            });
        } catch (error) {
            console.error(`Error - POST /webds/packrat/${packratID}\n${error}`);
            return Promise.reject('Failed to upload blob to Packrat cache');
        }
        return Promise.resolve(packratID + '/' + fileName);
    };

    const deleteFile = async (filename: string): Promise<string | undefined> => {
        try {
            const url = `packrat/${filename}`;
            const reply = await requestAPI<any>(url, { method: 'DELETE' });

            await get_lists().then((list) => {
                if (list!.indexOf(filename) === -1) {
                    setSelect('');
                }
            });

            return reply;
        } catch (error) {
            if (error) {
                return error.message;
            }
        }
    };

    const get_image_blocks = async (
        file: string
    ): Promise<string[] | undefined> => {
        try {
            const reply = await requestAPI<any>('image/' + file, {
                method: 'GET'
            });
            return Promise.resolve(reply['data']);
        } catch (error) {
            console.log(error);
            return Promise.reject(error.message);
        }
    };

    const onFileDelete = (file: string, index: number) => {
        console.log('onFileDelete:', file, index);
        deleteFile(file);
    };

    const onFileSelect = (file: string) => {
        setSelect(file);
        console.log('onFileSelect:', file);
        get_image_blocks(file)
            .then((block: any) => {
                setBlockList(block);
                setOpen(false);
            })
            .catch((error: any) => {
                onMessage('error', error, '');
            });
    };

    const upload_file = async (file: File) => {
        if (file) {
            try {
                let filename = await upload_img(file);
                await get_lists();
                onFileSelect(filename);
            } catch (error) {
                console.log(error);
                onMessage('error', error, '');
            }
        }
    };

    function updateAlertStatus(status: any) {
        const update = { ...props.ui };
        update.result.status = status;
        props.onUpdate(update);
    }

    useEffect(() => {
        if (props.ui.result.status === 'done') {
            setAlert(true);
            setMessage(props.ui.result.message);
            setSeverity(props.ui.result.severity);
            setLink(props.ui.result.link);

            updateAlertStatus('idle');
        } else if (props.ui.result.status === 'progress') {
            setAlert(false);
            updateAlertStatus('idle');
        }
    }, [props.ui]);

    const fetchData = async () => {
        const data = await get_lists();
        console.log('data', data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const update: any = {
            ...props.ui,
            filelist: filelist
        };
        props.onUpdate(update);
    }, [filelist]);

    useEffect(() => {
        if (open) {
            setAlert(false);
            fetchData();
        }
        const update: any = {
            ...props.ui,
            page: open ? Page.FileSelect : Page.MainEntry
        };
        props.onUpdate(update);
    }, [open]);

    useEffect(() => {
        if (select !== '') {
            const update: any = {
                ...props.ui,
                packratSource: PackratSource.FsFile,
                fileName: select,
                page: Page.MainEntry
            };
            props.onUpdate(update);
        }
    }, [select]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setOpen(!open);
    };

    const handleUpload = (event: React.MouseEvent<HTMLElement>) => {
        (document.getElementById('icon-button-img') as HTMLInputElement).value = '';
    };

    function resetBlockList() {
        if (blockList.length !== 0) {
            setBlockList([]);
            const update: any = {
                ...props.ui,
                selectedBlocks: []
            };
            props.onUpdate(update);
        }
    }

    const handlFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.files) {
            upload_file(event.currentTarget.files[0])
                .then(() => {
                    console.log('upload file done');
                })
                .catch((error) => {
                    onMessage('error', error, '');
                });
        }
    };

    const webdsTheme = webdsService.ui.getWebDSTheme();

    interface TextFieldWithProgressProps {
        packrat: string;
        progress: number;
        color?: string;
    }

    function TextFieldWithProgress(props: TextFieldWithProgressProps) {
        return (
            <Box sx={{ position: 'relative', display: 'inline-flex', mr: 1 }}>
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'left'
                    }}
                >
                    <Paper
                        sx={{
                            bgcolor: green[200],
                            width: (props.progress * Layout.width) / 100,
                            height: 39
                        }}
                    />
                </Box>

                <TextField
                    value={props.packrat}
                    id="outlined-size-small"
                    size="small"
                    sx={{ width: Layout.width }}
                />
            </Box>
        );
    }

    const start_fetch = async (packrat: string): Promise<string> => {
        console.log('Packrat:', packrat);
        let path = '';
        try {
            let files = await webdsService.packrat.cache.addPackratFiles(
                ['img'],
                Number(packrat!)
            );
            path = packrat + '/PR' + packrat + '.img';
            console.log(files);
            //console.log(path);
            return Promise.resolve(path);
        } catch (error) {
            console.log(error);
            return Promise.reject('Image file not found');
        }
    };

    const handleBlur = () => {
        console.log('download image from packrat server');
        let file: string = props.ui.packrat;

        start_fetch(file)
            .then((res) => {
                onFileSelect(res);
            })
            .catch((error) => {
                onMessage('error', error, '');
            });
    };

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            handleBlur();
        }
    };

    const handleFocusEvent = () => {
        setSelect('');
        setAlert(false);
        resetBlockList();

        const update: any = {
            ...props.ui,
            //packrat: '',
            packratSource: PackratSource.PackratServer
        };
        props.onUpdate(update);
        console.log('RESET ALL!!!', update);
    };

    function LoadMainPackrat() {
        console.log('LoadMainPackrat', props.ui);

        return (
            <Stack direction="column" spacing={2}>
                <TextField
                    id="filled-basic"
                    value={
                        props.ui.packratSource === PackratSource.FsFile
                            ? props.ui.fileName
                            : props.ui.packrat
                    }
                    onChange={(e) => {
                        const update: any = { ...props.ui, packrat: e.target.value };
                        props.onUpdate(update);
                    }}
                    onFocus={handleFocusEvent}
                    onKeyPress={handleKeyPress}
                    //onBlur={handleBlur}
                    //error={packratError}
                    size="small"
                    sx={{
                        width: Layout.width
                    }}
                />
                <BlockList
                    blocks={blockList}
                    onUpdate={(bs: any) => {
                        const update: any = {
                            ...props.ui,
                            selectedBlocks: bs
                        };
                        props.onUpdate(update);
                        console.log('UPDATE SELECT BLOCKS:', bs);
                    }}
                />
            </Stack>
        );
    }
    function LoadPackratText() {
        return (
            <>
                {open ? (
                    <Paper
                        variant="outlined"
                        sx={{
                            minWidth: Layout.width
                        }}
                    >
                        <FileList
                            list={filelist}
                            onDelete={onFileDelete}
                            onSelect={onFileSelect}
                            select={select}
                        />
                    </Paper>
                ) : props.ui.start ? (
                    <TextFieldWithProgress
                        packrat={
                            props.ui.packratSource === PackratSource.FsFile
                                ? props.ui.fileName
                                : props.ui.packrat
                        }
                        progress={props.ui.progress}
                    />
                ) : (
                            <>{LoadMainPackrat()}</>
                        )}
            </>
        );
    }

    return (
        <div>
            <Collapse in={isAlert}>
                <Alert severity={severity} onClose={() => setAlert(false)}>
                    <AlertTitle> {result} </AlertTitle>
                    {message}
                    <Link href={link}>{link}</Link>
                </Alert>
            </Collapse>

            <Stack
                direction="row"
                justifyContent="center"
                alignItems="flex-start"
                sx={{
                    py: 3
                }}
            >
                <Stack
                    spacing={1}
                    sx={{
                        flexDirection: 'column',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
                        <Typography sx={{ m: 1, textAlign: 'center' }}>
                            {open
                                ? 'Select Image Files'
                                : props.ui.packratSource === PackratSource.FsFile
                                    ? 'Image Files'
                                    : 'Packrat'}
                        </Typography>
                    </Paper>

                    <Stack sx={{ position: 'relative' }}>
                        {LoadPackratText()}

                        <Stack
                            spacing={2}
                            direction="column"
                            justifyContent="flex-start"
                            sx={{ position: 'absolute', left: -64 }}
                        >
                            <Button variant="text" onClick={handleClick} sx={{ p: 0 }}>
                                <Avatar
                                    sx={{ bgcolor: webdsTheme.palette.primary.light }}
                                    variant="rounded"
                                >
                                    {open ? (
                                        <CloseIcon fontSize="large" />
                                    ) : (
                                            <DehazeOutlinedIcon fontSize="large" />
                                        )}
                                </Avatar>
                            </Button>
                            {open && (
                                <>
                                    <input
                                        accept=".img"
                                        id="icon-button-img"
                                        onChange={handlFileChange}
                                        type="file"
                                        hidden
                                    />
                                    <label htmlFor="icon-button-img">
                                        <Button
                                            variant="text"
                                            onClick={handleUpload}
                                            component="span"
                                            sx={{ p: 0 }}
                                        >
                                            <Avatar
                                                sx={{ bgcolor: webdsTheme.palette.primary.light }}
                                                variant="rounded"
                                            >
                                                <CloudUploadIcon fontSize="large" />
                                            </Avatar>
                                        </Button>
                                    </label>
                                </>
                            )}
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </div>
    );
};
