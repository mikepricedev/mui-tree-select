import React, { useCallback, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import TreeSelect, {
  BranchOption,
  FreeSoloValue,
  TreeSelectTextFieldProps,
} from "./index";

type TOption = string | BranchOption<{ label: string }>;

const generateOptions = (
  branchOption?: BranchOption<{ label: string }>,
  randomAsync = true
): TOption[] | Promise<TOption[]> => {
  const depth = branchOption
    ? Number.parseInt(branchOption.option.label.split(":")[0]) + 1
    : 0;

  const options: TOption[] = [];

  for (let i = 0, len = Math.ceil(Math.random() * 10); i < len; i++) {
    const option = `${depth}:${i}`;

    options.push(new BranchOption({ label: option }), option);
  }

  return randomAsync && Math.random() > 0.5
    ? new Promise((resolve) => {
        setTimeout(() => {
          resolve(options);
        }, Math.ceil(Math.random() * 1000));
      })
    : options;
};

const getOptionLabel = (option: TOption | FreeSoloValue): string => {
  if (option instanceof BranchOption) {
    return `Branch ${option.option.label}`;
  } else if (option instanceof FreeSoloValue) {
    return `${option}`;
  } else {
    return option;
  }
};

const defaultBranchPath = [
  new BranchOption({ label: "0:5" }),
  new BranchOption({ label: "1:2" }),
];

const Sample: React.FC = () => {
  const [state, setState] = useState<{
    single: {
      value: string | FreeSoloValue | null;
      options: TOption[];
      loading: boolean;
      branchPath: BranchOption<{ label: string }>[];
    };
    multiple: {
      value: (string | FreeSoloValue)[];
      options: TOption[];
      loading: boolean;
      branchPath: BranchOption<{ label: string }>[];
    };
  }>({
    single: {
      value: null,
      options: generateOptions(defaultBranchPath[1], false) as TOption[],
      loading: false,
      branchPath: defaultBranchPath,
    },
    multiple: {
      value: [],
      options: generateOptions(undefined, false) as TOption[],
      loading: false,
      branchPath: [],
    },
  });

  return (
    <div style={{ width: 350, padding: 16 }}>
      <TreeSelect<string, { label: string }, false, false, true>
        branchPath={state.single.branchPath}
        onBranchChange={(_, branchOption, branchPath) => {
          const options = generateOptions(branchOption);

          if (options instanceof Promise) {
            setState((state) => ({
              ...state,
              single: {
                ...state.single,
                branchPath,
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
                branchPath,
                options,
                loading: false,
              },
            }));
          }
        }}
        options={state.single.options}
        loading={state.single.loading}
        getOptionLabel={getOptionLabel}
        freeSolo
        textFieldProps={useMemo<TreeSelectTextFieldProps>(
          () => ({
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
      <TreeSelect<string, { label: string }, true, false, true>
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
        multiple
        textFieldProps={useMemo(
          () => ({
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
