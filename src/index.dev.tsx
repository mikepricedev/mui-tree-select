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
  createTheme,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Switch,
  TextField,
  ThemeProvider,
  useMediaQuery,
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

  const [cityBranch, setCityBranch] = useState<Node | null>(null);
  const [citesBranch, setCitesBranch] = useState<Node | null>(null);

  const [value, setValue] = useState<(Node | FreeSoloNode<Node>)[]>([]);

  const getLabel = (branch: Node | null) => {
    if (branch === null) {
      return "Country";
    } else if ("states" in branch.value) {
      return "Country > State";
    } else {
      return "Country > State > City";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 8,
      }}
    >
      <div style={{ width: 450 }}>
        {/* <Typography
          sx={{
            mb: 2,
          }}
          color="primary"
          variant="h4"
          align="center"
        >
          Supports Multiple Values
        </Typography> */}
        <FormControl
          fullWidth
          sx={{
            mb: 2,
          }}
        >
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
        </FormControl>
        <TreeSelect
          sx={{
            mb: 2,
          }}
          freeSolo={cityBranch?.value && "cities" in cityBranch.value}
          branch={cityBranch}
          isBranchSelectable={(node) =>
            syncOrAsync("cities" in node.value, runAsync)
          }
          onBranchChange={(_, branch) => void setCityBranch(branch)}
          getChildren={(node) =>
            syncOrAsync(
              node
                ? node.getChildren()
                : sampleData.map((country) => new Node(country)),
              runAsync
            )
          }
          getOptionDisabled={(option) =>
            option.isBranch() && !option.getChildren()?.length
          }
          getParent={(node: Node) => syncOrAsync(node.getParent(), runAsync)}
          isBranch={(node) => syncOrAsync(node.isBranch(), runAsync)}
          isOptionEqualToValue={(option, value) => {
            if (option instanceof FreeSoloNode) {
              if (value instanceof FreeSoloNode) {
                return (
                  option.toString().replace(/^New:\s/g, "") === value.toString()
                );
              }
              return false;
            } else if (value instanceof FreeSoloNode) {
              return false;
            } else {
              return option.isEqual(value);
            }
          }}
          getOptionLabel={(option) => {
            if (option instanceof FreeSoloNode) {
              return `New: ${option.toString().replace(/^New:\s/g, "")}`;
            }
            return option.toString();
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={getLabel(cityBranch)}
              helperText="Select a city by its country and state."
            />
          )}
        />
        <TreeSelect
          branch={citesBranch}
          onBranchChange={(_, branch) => void setCitesBranch(branch)}
          // Allow adding cities.
          freeSolo={citesBranch?.value && "cities" in citesBranch.value}
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
              label={getLabel(citesBranch)}
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

const App = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Sample />
    </ThemeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
