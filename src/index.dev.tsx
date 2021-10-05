import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import TreeSelect, {
  BranchNode,
  FreeSoloNode,
  ValueNode,
  defaultInput,
} from "./index";

type TBranchOption = { label: string };

type TOption = string | BranchNode<TBranchOption>;

const generateOptions = (
  parentBranch: BranchNode<{ label: string }> | null,
  randomAsync = true
): TOption[] | Promise<TOption[]> => {
  const depth = parentBranch
    ? Number.parseInt(parentBranch.valueOf().label.split(":")[0]) + 1
    : 0;

  const options: TOption[] = [];

  for (let i = 0, len = Math.ceil(Math.random() * 10); i < len; i++) {
    const option = `${depth}:${i}`;

    options.push(new BranchNode({ label: option }, parentBranch), option);
  }

  return randomAsync && Math.random() > 0.5
    ? new Promise((resolve) => {
        setTimeout(() => {
          resolve(options);
        }, Math.ceil(Math.random() * 1000));
      })
    : options;
};

const getOptionLabel = (
  option:
    | ValueNode<string, TBranchOption>
    | BranchNode<TBranchOption>
    | FreeSoloNode
): string =>
  option instanceof BranchNode ? option.valueOf().label : option.toString();

const defaultBranch = BranchNode.createBranchNode([
  { label: "0:5" },
  { label: "1:2" },
]);

const Sample: React.FC = () => {
  const [state, setState] = useState<{
    single: {
      value:
        | ValueNode<string, TBranchOption>
        | FreeSoloNode<TBranchOption>
        | null;
      options: (string | TOption)[];
      loading: boolean;
      branch: BranchNode<TBranchOption> | null;
    };
    multiple: {
      value: (ValueNode<string, TBranchOption> | FreeSoloNode<TBranchOption>)[];
      options: (string | TOption)[];
      loading: boolean;
      branch: BranchNode<TBranchOption> | null;
    };
  }>({
    single: {
      value: null,
      options: generateOptions(defaultBranch, false) as TOption[],
      loading: false,
      branch: defaultBranch,
    },
    multiple: {
      value: [],
      options: generateOptions(null, false) as TOption[],
      loading: false,
      branch: null,
    },
  });

  return (
    <div style={{ width: 350, padding: 16 }}>
      <TreeSelect<string, TBranchOption, false, false, true>
        branch={state.single.branch}
        onBranchChange={(_, branch) => {
          const options = generateOptions(branch);

          if (options instanceof Promise) {
            setState((state) => ({
              ...state,
              single: {
                ...state.single,
                branch,
                loading: true,
              },
            }));
            options.then((options) => {
              setState((state) => ({
                ...state,
                single: {
                  ...state.single,
                  options,
                  loading: false,
                },
              }));
            });
          } else {
            setState((state) => ({
              ...state,
              single: {
                ...state.single,
                branch,
                options,
                loading: false,
              },
            }));
          }
        }}
        autoSelect
        freeSolo
        options={state.single.options}
        loading={state.single.loading}
        getOptionLabel={getOptionLabel}
        renderInput={useCallback(
          (params) =>
            defaultInput({
              ...params,
              variant: "outlined",
              label: "Single",
            }),
          []
        )}
        value={state.single.value}
        onChange={useCallback(
          (_, value) => {
            setState((state) => ({
              ...state,
              single: {
                ...state.single,
                value,
              },
            }));
          },
          [setState]
        )}
      />
      <div style={{ height: "16px" }} />
      <TreeSelect<string, TBranchOption, true, false, true>
        onBranchChange={(_, branchOption) => {
          const options = generateOptions(branchOption);

          if (options instanceof Promise) {
            setState((state) => ({
              ...state,
              multiple: {
                ...state.multiple,
                loading: true,
              },
            }));
            options.then((options) => {
              setState((state) => ({
                ...state,
                multiple: {
                  ...state.multiple,
                  options,
                  loading: false,
                },
              }));
            });
          } else {
            setState((state) => ({
              ...state,
              multiple: {
                ...state.multiple,
                options,
                loading: false,
              },
            }));
          }
        }}
        options={state.multiple.options}
        loading={state.multiple.loading}
        getOptionLabel={getOptionLabel}
        freeSolo
        autoSelect
        multiple
        renderInput={useCallback(
          (params) =>
            defaultInput({
              ...params,
              variant: "outlined",
              label: "Multiple",
            }),
          []
        )}
      />
    </div>
  );
};

ReactDOM.render(<Sample />, document.getElementById("root"));
