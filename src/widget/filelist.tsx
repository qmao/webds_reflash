import React from 'react';

import {
  Radio,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  FormControlLabel,
  RadioGroup,
  IconButton,
  Chip,
  Typography,
  Stack
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import ListItemButton from '@mui/material/ListItemButton';

export default function FileList(props: {
  list: string[];
  onDelete: (value: string, index: number) => void;
  onSelect: (value: string) => void;
  select: string;
}) {
  const handleToggle = (value: string, index: number) => () => {
    props.onSelect(value);
  };

  return (
    <List
      sx={{
        p: 0
      }}
    >
      <RadioGroup
        aria-label="Image File"
        name="select-img"
        value={props.select}
      >
        {props.list.map((value, index) => {
          return (
            <Paper
              key={index}
              elevation={0}
              sx={
                index % 2 === 1
                  ? {
                      /*backgroundColor: '#FAFAFA'*/
                    }
                  : {}
              }
            >
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => props.onDelete(value, index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
                disablePadding
              >
                <ListItemButton
                  role={undefined}
                  onClick={handleToggle(value, index)}
                  dense
                  sx={{ pt: 0, pb: 0 }}
                >
                  <ListItemIcon>
                    <FormControlLabel
                      control={
                        <Stack
                          direction="row"
                          alignItems="center"
                          sx={{ px: 1 }}
                        >
                          <Radio color="primary" />
                          <Chip label={value.split('/')[0]} size="small" />
                        </Stack>
                      }
                      label={
                        <Typography variant="body2">
                          {value.split('/')[1]}
                        </Typography>
                      }
                    />
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            </Paper>
          );
        })}
      </RadioGroup>
    </List>
  );
}
