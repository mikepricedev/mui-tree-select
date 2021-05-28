import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import TreeSelect, {
  Option,
  BranchOption,
  FreeSoloValue,
  defaultInput,
} from "./index";

type TBranchOption = { label: string };

type TOption = string | BranchOption<TBranchOption>;

const generateOptions = (
  branchOption?: BranchOption<{ label: string }>,
  randomAsync = true
): TOption[] | Promise<TOption[]> => {
  const depth = branchOption
    ? Number.parseInt(branchOption.value.label.split(":")[0]) + 1
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

const getOptionLabel = (
  option:
    | Option<string, TBranchOption>
    | BranchOption<TBranchOption>
    | FreeSoloValue
): string => {
  if (option instanceof BranchOption) {
    return `Branch ${option.value.label}`;
  } else if (option instanceof FreeSoloValue) {
    return `${option}`;
  } else {
    return option.toString();
  }
};

const defaultBranchPath = [
  new BranchOption({ label: "0:5" }),
  new BranchOption({ label: "1:2" }),
];

const Sample: React.FC = () => {
  const [state, setState] = useState<{
    single: {
      value: string | FreeSoloValue<TBranchOption> | null;
      options: (string | TOption)[];
      loading: boolean;
      branchPath: BranchOption<TBranchOption>[];
    };
    multiple: {
      value: (string | FreeSoloValue<TBranchOption>)[];
      options: (string | TOption)[];
      loading: boolean;
      branchPath: BranchOption<TBranchOption>[];
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
      <TreeSelect<string, TBranchOption, false, false, true>
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
