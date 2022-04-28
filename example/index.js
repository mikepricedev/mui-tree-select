import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import _sampleData from "./db/sampleData";
import TreeSelect, {
  FreeSoloNode,
  DefaultOption,
  getDefaultOptionProps,
} from "mui-tree-select";
import {
  Box,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Switch,
  TextField,
  useMediaQuery,
} from "@mui/material";
const sampleData = _sampleData;
class Node {
  constructor(value) {
    this.value = value;
  }
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
  isEqual(to) {
    return to.value.id === this.value.id;
  }
  toString() {
    return this.value.name;
  }
}
const syncOrAsync = function (value, returnAsync) {
  if (returnAsync) {
    return new Promise((resolve) =>
      setTimeout(() => resolve(value), Math.random() * 500)
    );
  }
  return value;
};
const Sample = () => {
  const [runAsync, setRynAsync] = useState(false);
  const [branch, setBranch] = useState(null);
  const [value, setValue] = useState([]);
  return (
    <div style={{ width: 450 }}>
      <FormControl fullWidth>
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
        getChildren={(node) =>
          syncOrAsync(
            node
              ? node.getChildren()
              : sampleData.map((country) => new Node(country)),
            runAsync
          )
        }
        getOptionDisabled={(option) => {
          var _a;
          return (
            option.isBranch() &&
            !((_a = option.getChildren()) === null || _a === void 0
              ? void 0
              : _a.length)
          );
        }}
        getParent={(node) => syncOrAsync(node.getParent(), runAsync)}
        isBranch={(node) => syncOrAsync(node.isBranch(), runAsync)}
        isOptionEqualToValue={(option, value) => {
          return option instanceof FreeSoloNode ? false : option.isEqual(value);
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
        freeSolo={
          (branch === null || branch === void 0 ? void 0 : branch.value) &&
          "cities" in branch.value
        }
        addFreeSoloText="Add City: "
        getChildren={(node) =>
          syncOrAsync(
            node
              ? node.getChildren()
              : sampleData.map((country) => new Node(country)),
            runAsync
          )
        }
        getParent={(node) => syncOrAsync(node.getParent(), runAsync)}
        getOptionDisabled={(option) => {
          var _a;
          return (
            option.isBranch() &&
            !((_a = option.getChildren()) === null || _a === void 0
              ? void 0
              : _a.length)
          );
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
            {...((props, node) => {
              var _a, _b;
              return {
                ...props,
                ListItemTextProps: {
                  ...props.ListItemTextProps,
                  secondary:
                    node instanceof FreeSoloNode
                      ? undefined
                      : "states" in node.value
                      ? `States ${
                          ((_a = node.getChildren()) === null || _a === void 0
                            ? void 0
                            : _a.length) || 0
                        }`
                      : "cities" in node.value
                      ? `Cities ${
                          ((_b = node.getChildren()) === null || _b === void 0
                            ? void 0
                            : _b.length) || 0
                        }`
                      : undefined,
                },
              };
            })(getDefaultOptionProps(...args), args[1])}
          />
        )}
        value={value}
        onChange={(_, value) => void setValue(value)}
      />
    </div>
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 8,
        }}
      >
        <Sample />
      </Box>
    </ThemeProvider>
  );
};
ReactDOM.render(<App />, document.getElementById("root"));
