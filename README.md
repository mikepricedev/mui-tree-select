# MUI Tree Select

## Description

Autocomplete component for tree data structures.

## Usage

This package wraps the material-ui [Autocomplete Component](https://material-ui.com/components/autocomplete/). Many of props from this component are passed from `TreeSelect`. Currently a typescript definition is the extent of the documentation on these props.

```
import React, {useCallback, useState} from "react";
import ReactDOM from "react-dom";
import TreeSelect, { BranchNode, ValueNode, defaultInput } from "./index";

const rootOptions = [
  "foo",
  "bar",
  new BranchNode("baz"),
  "baz",
  new BranchNode("qux")
]

const Sample: React.FC = () => {
  const [state, setState] = useState(rootOptions);

  return (
    <div style={{ width: 350, padding: 16 }}>
      <TreeSelect
        onBranchChange={useCallback((_,branch) => {
          if(branch) {
            switch(branch.option) {
              case "baz":
                setState([
                  "quux",
                  "quuz",
                  new BranchNode("corge", branch)
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
            setState(rootOptions);
          }

        },[])}
        options={state}
        renderInput={useCallback((params)=>defaultInput({
          ...params,
          label: "Sample"
        }), [])}
      />

    </div>
  );
};

ReactDOM.render(<Sample />, document.getElementById("root"));

```

### [Example](https://codesandbox.io/s/lucid-chaplygin-smyzk)

## Notes

### BranchNode

Branch nodes are wrapped in the class `BranchNode`. This class ties branch values and types to the tree.

```
import {BranchNode} from "mui-tree-select";

// path: foo > bar > baz
const bazBranch = new BranchNode("baz", ["foo", "bar" ]);

// path: foo > bar > baz > quz
const quzBranch = new BranchNode("quz", bazBranch);

```

### ValueNode and FreeSoloNode

Values and free solo values are wrapped in the `ValueNode` and `FreeSoloNode` classes respectively. These classes tie their respective values and types to the tree.

```
import {ValueNode, FreeSoloNode, BranchNode} from "mui-tree-select";

// value at path: foo > bar
const value = ValueNode("myValue", new BranchNode("bar", ["foo"]);

console.log(value.valueOf());
// myValue

// Free Solo value at path: foo > bar
console.log(new FreeSoloNode("Hello!").toString(), ["foo", "bar"]);
// Hello!

// Note: alternative methods for adding the branch path to ValueNode and FreeSoloNode.  Both are interchangeable.
```

### Lab

This component requires a specific version of [materia-ui lab](https://material-ui.com/components/about-the-lab/#about-the-lab). The lab components it uses are soon to go in to the core in @material-ui/core v5.0.0

### Typescript

Because `options` prop excepts both selectable options and `BranchNode` options, type inference will not work as it does with the native material-ui [Autocomplete Component](https://material-ui.com/components/autocomplete/).

You must provided a full generic typescript signature to the `TreeSelect` Component. For Example in JSX:

```
type Value = { value: string };
type Branch = {branch:string};

<TreeSelect<Value, Branch, false, false, false>

  options={[
    {value:"1"},
    {value:"2"},
    new BranchNode({branch:"branch1"})
  ]}
  onChange={useCallback((value) => {
    ...
  }, [])}

  getOptionLabel={useCallback((value) => value instanceof BranchNode ? value.branch : value.value, [])}

  ...
/>
```
