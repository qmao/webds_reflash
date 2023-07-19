import React, { useEffect } from 'react';

import {
    ToggleButtonGroup,
    ToggleButton,
    Stack,
    Typography
} from '@mui/material';

import CheckIcon from '@mui/icons-material/Check';

export const BlockList = (props: any): JSX.Element => {
    const [formats, setFormats] = React.useState<string[]>(() => []);

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
                                key={value.ld}
                                size="small"
                                value={value.id}
                                aria-label="bold"
                                onClick={(event) =>
                                    handleFormat(event, isChecked ? [] : [value.id])
                                }
                                sx={{ position: 'relative' }}
                            >
                                {isChecked && (
                                    <CheckIcon sx={{ position: 'absolute', right: 30 }} />
                                )}
                                <Typography sx={{ fontSize: 12 }}>{value.id}</Typography>
                            </ToggleButton>
                        );
                    }
                    return null;
                })}
            </ToggleButtonGroup>
        </Stack>
    );
};
