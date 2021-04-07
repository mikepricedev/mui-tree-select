# MUI Tree Select

## Description

Autocomplete component for tree data structures.

## Usage

This package wraps the material-ui [Autocomplete Component](https://material-ui.com/components/autocomplete/). Many of props from this component are passed from `TreeSelect`. Currently a typescript definition is the extent of the documentation on these props.

```
import React, {useCallback, useMemo, useState} from "react";
import ReactDOM from "react-dom";
import TreeSelect, { BranchOption } from "./index";

const baseOptions = [
  "foo",
  "bar",
  new BranchOption("baz"),
  "baz",
  new BranchOption("qux")
]

const Sample: React.FC = () => {
  const [state, setState] = useState(baseOptions);

  return (
    <div style={{ width: 350, padding: 16 }}>
      <TreeSelect
        onBranchChange={useCallback((_,branchOption) => {
          if(branchOption) {
            switch(branchOption.option) {
              case "baz":
                setState([
                  "quux",
                  "quuz",
                  new BranchOption("corge")
                ]);
                break;

              case "qux":
                setState([
                  "grault",
                  "garply"
                ]);
                break;

              case "corge":
                setState([
                  "waldo",
                  "fred",
                  "plugh"
                ]);
                break;
            }

          } else {
            setState(baseOptions);
          }

        },[setState])}
        options={state}
        textFieldProps={useMemo(
          () => ({
            label: "Sample",
          }),
          []
        )}
      />

    </div>
  );
};

ReactDOM.render(<Sample />, document.getElementById("root"));

```

### [Example](https://codesandbox.io/s/lucid-chaplygin-smyzk)

## Notes

### BranchOption

Branch node options are wrapped in the class `BranchOption`. `BranchOption` instances are passed to the `options` prop array along with selectable options.

```
import {BranchOption } from "mui-tree-select";

console.log(new BranchOption("BranchNode")); // BranchOption {option: "BranchNode"}
```

### Lab

This component requires a specific version of [materia-ui lab](https://material-ui.com/components/about-the-lab/#about-the-lab). The lab components it uses are soon to go in to the core in @material-ui/core v5.0.0

### Free Solo

Free solo values are passed to the `onChange` prop in a class wrapper that extends the native String class. It is creatively named `FreeSoloValue`.

```
import {FreeSoloValue} from "mui-tree-select";

console.log(new FreeSoloValue("Hello!")); // FreeSoloValue {"Hello"}

```

### Typescript

Because `options` prop excepts both selectable options and [BranchOption](#branchoption)s, type inference will not work as it does with the native material-ui [Autocomplete Component](https://material-ui.com/components/autocomplete/).

You must provided a full generic typescript signature to the `TreeSelect` Component. For Example in JSX:

```
type Value = { value: string };

<TreeSelect<Value, false, false, false>

  options={[
    {value:"1"},
    {value:"2"},
    new BranchOption({value:"branch1"})
  ]}
  onChange={useCallback((value) => {
    ...
  }, [])}

  getOptionLabel={useCallback((value) => value.value, [])}

  ...
/>

```
