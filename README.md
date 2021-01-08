# MUI Tree Select

## Description

Autocomplete component for tree data structures.

## Usage

This package wraps the material-ui [Autocomplete Component](https://material-ui.com/components/autocomplete/). Many of props from this component are passed through to `TreeSelect`. Currently a typescript definition is the extent of the documentation on these props.

```
import React, { useCallback, useMemo } from "react";
import ReactDOM from "react-dom";
import TreeSelect, { NodeType, Option } from "mui-tree-select"

const treeData = {
  foo: ["baz", "qux", "quux"],
  bar: ["quuz", "corge"],
};

const Sample = () => {
  return (<TreeSelect
    onChange={useCallback((...args) => {
      console.log("onChange", ...args);
    }, [])}
    getOptions={useCallback((branchNode) => {
      if (branchNode) {
        return treeData[branchNode].map((option) => ({
          option,
          type: NodeType.Leaf,
        }));
      } else {
        return Object.keys(treeData).map((option, i) => ({
          option,
          type:
            i % 2 === 0 ? NodeType.Branch : NodeType.SelectableBranch,
        }));
      }
    }, [])}
    textFieldProps={useMemo(
      () => ({
        variant: "outlined",
        label: "Sample",
      }),
      []
    )}
  />);

  ReactDOM.render(<Sample />, document.getElementById("root"));

}

```

## Notes

### Lab

This component requires a specific version of [materia-ui lab](https://material-ui.com/components/about-the-lab/#about-the-lab). The lab components it uses are soon to go in to the core in @material-ui/core v5.0.0

### Free Solo

Free solo values are passed to the `onChange` prop in a class wrapper creatively named `FreeSoloValue`.

```
import {FreeSoloValue} from "mui-tree-select";

console.log(new FreeSoloValue("Hello!")); // {value: "Hello!"}

```

### Typescript

The `options` prop is not used by MUI Tree Select. As a result type inference will not work as it does with the native material-ui [Autocomplete Component](https://material-ui.com/components/autocomplete/).

You must provided a full generic typescript signature to the `TreeSelect` Component. For Example in JSX:

```
type Value = { value: string };

<TreeSelect<Value, false, false, false>

  getOptions={useCallback((branchNode) => {
    ...
  }, [])}
  onChange={useCallback((value) => {
    ...
  }, [])}

  getOptionLabel={useCallback((value) => value.value, [])}

  ...
/>

```
