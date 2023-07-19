import React, { useEffect } from 'react';

import { ToggleButtonGroup, ToggleButton } from '@mui/material';

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
    <>
      <ToggleButtonGroup
        color="primary"
        value={formats}
        onChange={handleFormat}
        aria-label="text formatting"
        orientation="vertical"
      >
        {props.blocks.map((value: any) => {
          if (value.identifier === '0x7c05e516') {
            return (
              <ToggleButton
                key={value.ld}
                size="small"
                value={value.id}
                aria-label="bold"
              >
                {value.id}
              </ToggleButton>
            );
          }
        })}
      </ToggleButtonGroup>
    </>
  );
};
