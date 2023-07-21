import React, { useEffect } from 'react';

import {
    ToggleButtonGroup,
    ToggleButton,
    Stack,
    Typography,
    Tooltip
} from '@mui/material';

import CheckIcon from '@mui/icons-material/Check';

export const BlockList = (props: any): JSX.Element => {
    const [formats, setFormats] = React.useState<string[]>(() => []);
    const [info, setInfo] = React.useState('IIIIIIIII');

    useEffect(() => {
        props.onUpdate(formats);
    }, [formats]);

    const handleFormat = (
        event: React.MouseEvent<HTMLElement>,
        newFormats: string[]
    ) => {
        setFormats(newFormats);
    };

    useEffect(() => {
        let flags: any = [];
        props.blocks.forEach((value: any) => {
            if (value.flag === 1) {
                flags.push(value.id);
            }
        });
        setFormats(flags);
    }, [props.blocks]);

    const handleMouseEnter = (data: any) => {
        const formattedString = `Address: ${data.address.replace(
            /0x(.+)/,
            (_, hexValue) => '0x' + hexValue.toUpperCase()
        )}\nLength: 0x${data.length
            .toString(16)
            .toUpperCase()}\nOffset: 0x${data.offset.toString(16).toUpperCase()}`;

        setInfo(formattedString);
    };

    return (
        <Stack direction="column" spacing={2} sx={{ pt: 2 }}>
            {props.blocks.length !== 0 && (
                <Typography sx={{ fontSize: 14 }}></Typography>
            )}

            <ToggleButtonGroup
                color="primary"
                value={formats}
                onChange={handleFormat}
                aria-label="text formatting"
                orientation="vertical"
            >
                {props.blocks.map((value: any) => {
                    if (value.identifier === '0x7c05e516') {
                        const isChecked = formats.includes(value.id);

                        return (
                            <ToggleButton
                                key={value.id}
                                size="small"
                                value={value.id}
                                aria-label="bold"
                                onClick={(event) =>
                                    handleFormat(event, isChecked ? [] : [value.id])
                                }
                                sx={{ position: 'relative', p: 0 }}
                                onMouseEnter={() => handleMouseEnter(value)}
                            >
                                <Tooltip
                                    title={info}
                                    placement="right"
                                    key={`tooltip-${value.id}`}
                                >
                                    <Stack
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            p: 1
                                        }}
                                        key={`stack-${value.id}`}
                                    >
                                        {isChecked && (
                                            <CheckIcon
                                                sx={{ position: 'absolute', right: 30 }}
                                                key={`checkicon-${value.id}`}
                                            />
                                        )}

                                        <Typography
                                            sx={{ fontSize: 12 }}
                                            key={`typography-${value.id}`}
                                        >
                                            {value.id}
                                        </Typography>
                                    </Stack>
                                </Tooltip>
                            </ToggleButton>
                        );
                    }
                    return null;
                })}
            </ToggleButtonGroup>
        </Stack>
    );
};
