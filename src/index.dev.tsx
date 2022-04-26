import React, { useState } from "react";
import ReactDOM from "react-dom";
import _sampleData from "./example/db/sampleData";
import TreeSelect, {
  FreeSoloNode,
  DefaultOption,
  getDefaultOptionProps,
} from "./index";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

interface City {
  id: string;
  name: string;
}

interface State {
  id: string;
  name: string;
  cities: City[];
}

interface Country {
  id: string;
  name: string;
  emoji: string;
  states: State[];
}

const sampleData = _sampleData as ReadonlyArray<Country>;

class Node {
  constructor(readonly value: City | State | Country) {}

  getParent() {
    const parent = (() => {
      if ("states" in this.value) {
        return null;
      } else if ("cities" in this.value) {
        return (
          sampleData.find(({ states }) =>
            states.some(({ id }) => id === this.value.id)
          ) || null
        );
      } else {
        for (const { states } of sampleData) {
          const state = states.find(({ cities }) =>
            cities.some(({ id }) => id === this.value.id)
          );
          if (state) {
            return state;
          }
        }
        return null;
      }
    })();

    return parent ? new Node(parent) : parent;
  }

  getChildren() {
    if ("states" in this.value) {
      return this.value.states.map((state) => new Node(state));
    } else if ("cities" in this.value) {
      return this.value.cities.map((city) => new Node(city));
    } else {
      return null;
    }
  }

  isBranch() {
    return "states" in this.value || "cities" in this.value;
  }

  isEqual(to: Node) {
    return to.value.id === this.value.id;
  }

  toString() {
    return this.value.name;
  }
}

const syncOrAsync = function <T>(value: T, returnAsync: boolean) {
  if (returnAsync) {
    return new Promise<T>((resolve) =>
      setTimeout(() => resolve(value), Math.random() * 500)
    );
  }
  return value;
};

const Sample: React.FC = () => {
  const [runAsync, setRynAsync] = useState(false);

  const [branch, setBranch] = useState<Node | null>(null);
  const [value, setValue] = useState<(Node | FreeSoloNode<Node>)[]>([]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 8,
      }}
    >
      <div style={{ width: 450 }}>
        {/* <FormControl fullWidth>
          <FormControlLabel
            sx={{ m: 1 }}
            control={
              <Switch
                checked={runAsync}
                onChange={() => setRynAsync(!runAsync)}
              />
            }
            label="Run Async"
          />
          <FormHelperText>
            Run "getChildren", "getParent", and "isBranch" async.
          </FormHelperText>
        </FormControl> */}
        <Typography color={"primary"} variant="h4" align="center">
          See Current Path by Hovering "Parent Option"
        </Typography>
        <TreeSelect
          getChildren={(node) =>
            syncOrAsync(
              node
                ? node.getChildren()
                : sampleData.map((country) => new Node(country)),
              runAsync
            )
          }
          open
          getOptionDisabled={(option) =>
            option.isBranch() && !option.getChildren()?.length
          }
          getParent={(node: Node) => syncOrAsync(node.getParent(), runAsync)}
          isBranch={(node) => syncOrAsync(node.isBranch(), runAsync)}
          isOptionEqualToValue={(option, value) => {
            return option instanceof FreeSoloNode
              ? false
              : option.isEqual(value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="City"
              helperText="Select a city by its country and state."
            />
          )}
          sx={{ m: 1, mt: 2, mb: 2 }}
        />
        <TreeSelect
          sx={{ m: 1 }}
          branch={branch}
          onBranchChange={(_, branch) => void setBranch(branch)}
          // Allow adding cities.
          freeSolo={branch?.value && "cities" in branch.value}
          addFreeSoloText="Add City: "
          getChildren={(node) =>
            syncOrAsync(
              node
                ? node.getChildren()
                : sampleData.map((country) => new Node(country)),
              runAsync
            )
          }
          getParent={(node: Node) => syncOrAsync(node.getParent(), runAsync)}
          getOptionDisabled={(option) => {
            return option.isBranch() && !option.getChildren()?.length;
          }}
          isBranch={(node) => syncOrAsync(node.isBranch(), runAsync)}
          isOptionEqualToValue={(option, value) => {
            return option instanceof FreeSoloNode
              ? value instanceof FreeSoloNode &&
                  value.toString() === option.toString() &&
                  (option.parent === null || value.parent === null
                    ? option.parent === value.parent
                    : option.parent.isEqual(value.parent))
              : value instanceof FreeSoloNode
              ? false
              : option.isEqual(value);
          }}
          multiple
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cities"
              helperText="Select multiple cities by their country and state."
            />
          )}
          renderOption={(...args) => (
            <DefaultOption
              {...((props, node) => ({
                ...props,
                ListItemTextProps: {
                  ...props.ListItemTextProps,
                  secondary:
                    node instanceof FreeSoloNode
                      ? undefined
                      : "states" in node.value
                      ? `States ${node.getChildren()?.length || 0}`
                      : "cities" in node.value
                      ? `Cities ${node.getChildren()?.length || 0}`
                      : undefined,
                },
              }))(getDefaultOptionProps(...args), args[1])}
            />
          )}
          value={value}
          onChange={(_, value) => void setValue(value)}
        />
      </div>
    </Box>
  );
};

ReactDOM.render(<Sample />, document.getElementById("root"));
