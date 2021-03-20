import React, { useCallback, useEffect, useMemo, useState } from "react";
import Autocomplete, { AutocompleteProps } from "@material-ui/lab/Autocomplete";
import {
  Value,
  createFilterOptions,
  FilterOptionsState,
} from "@material-ui/lab/useAutocomplete";
import Skeleton from "@material-ui/lab/Skeleton";
import { Box, TextField, TextFieldProps } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText, {
  ListItemTextProps,
} from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import { Typography } from "@material-ui/core";

const lastElm = <T extends unknown>(arr: T[]): T | undefined =>
  arr[arr.length - 1];

const useStyles = makeStyles(
  () =>
    createStyles({
      optionNode: {
        margin: "-6px -16px",
        width: "calc(100% + 32px)",
      },
      listBoxWLoadingBranchNode: {
        "& > li:nth-child(2)": {
          opacity: 1,
        },
      },
    }),
  { defaultTheme: createMuiTheme({}) }
);

const primaryTypographyProps: NonNullable<
  ListItemTextProps["primaryTypographyProps"]
> = {
  noWrap: true,
};

abstract class Node<T> {
  constructor(readonly value: T) {}
  static getValue<T>(value: T | Node<T>): T {
    return value instanceof Node ? value.value : value;
  }
}

class ValueNode<T> extends Node<T> {
  constructor(value: T | OptionNode<T>) {
    super(value instanceof OptionNode ? value.value : value);
  }
}
export class FreeSoloValue extends ValueNode<string> {}

abstract class OptionNode<T> extends Node<T> {}
class ValueOptionNode<T> extends OptionNode<T> {
  readonly valueNode: ValueNode<T>;
  constructor(value: T) {
    super(value);
    this.valueNode = new ValueNode(this);
  }
}

class BranchNode<T> extends OptionNode<T> {
  readonly openedBranchNode: OpenedBranchNode<T>;
  constructor(value: T) {
    super(value);
    this.openedBranchNode = new OpenedBranchNode(this);
  }
}
class SelectableBranchNode<T> extends BranchNode<T> {
  readonly valueOptionNode: ValueOptionNode<T>;
  constructor(value: T) {
    super(value);
    this.valueOptionNode = new ValueOptionNode(value);
  }
}
abstract class BranchPathNode<T> extends Node<T> {}
class OpenedBranchNode<T> extends BranchPathNode<T> {
  readonly loadingBranchNode: LoadingBranchNode<T>;
  constructor(readonly branchNode: BranchNode<T>) {
    super(branchNode.value);
    this.loadingBranchNode = new LoadingBranchNode(this);
  }
}
// Placeholder to render "loading" in branch node expansions.
class LoadingBranchNode<T> extends BranchPathNode<T> {
  constructor(openBranchNode: OpenedBranchNode<T>) {
    super(openBranchNode.value);
  }
}

export enum NodeType {
  Leaf,
  Branch,
  SelectableBranch,
}

export interface Option<T> {
  option: T;
  type: NodeType;
}

export type FreeSoloValueMapping<
  FreeSolo extends boolean | undefined
> = FreeSolo extends true ? FreeSoloValue : never;

export type TreeValue<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> = Value<
  T | FreeSoloValueMapping<FreeSolo>,
  Multiple,
  DisableClearable,
  false
>;
export type OnChange<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> = (value: TreeValue<T, Multiple, DisableClearable, FreeSolo>) => void;

export type TreeSelectProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> = Omit<
  AutocompleteProps<
    T | FreeSoloValueMapping<FreeSolo>,
    Multiple,
    DisableClearable,
    false
  >,
  | "inputValue"
  | "onChange"
  | "onInputChange"
  | "renderInput"
  | "renderOption"
  | "filterOptions"
  | "options"
  | "freeSolo"
  | "defaultValue"
  | "value"
> & {
  textFieldProps?: Omit<
    TextFieldProps,
    | keyof AutocompleteProps<
        T | FreeSoloValueMapping<FreeSolo>,
        Multiple,
        DisableClearable,
        false
      >
    | "defaultValue"
    | "multiline"
    | "onChange"
    | "rows"
    | "rowsMax"
    | "select"
    | "SelectProps"
    | "value"
  >;
  onChange: OnChange<T, Multiple, DisableClearable, FreeSolo>;
  getOptions(branchNode?: T): Promise<Option<T>[]> | Option<T>[];
  filterOptions?: (option: T, state: FilterOptionsState<T>) => boolean;
  enterBranchText?: string;
  exitBranchText?: string;
  freeSolo?: FreeSolo;
  value?: TreeValue<T, Multiple, DisableClearable, FreeSolo>;
  defaultValue?: TreeValue<T, Multiple, DisableClearable, FreeSolo>;
};

const TreeSelect = <
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(
  props: TreeSelectProps<T, Multiple, DisableClearable, FreeSolo>
): JSX.Element => {
  type TValue = ValueNode<T> | FreeSoloValue;
  interface TreeSelectState {
    branchPath: OpenedBranchNode<T>[];
    cancelLoading?: () => void;
    inputValue: string;
    loading: boolean;
    open: boolean;
    options: OptionNode<T>[];
    value: TValue | TValue[] | null;
    // Value<TValue, Multiple, DisableClearable, false>;
  }

  type TOptions = OptionNode<T> | BranchPathNode<T>;
  const classes = useStyles();

  const {
    autoSelect,
    debug,
    defaultValue,
    disableClearable,
    disableCloseOnSelect,
    enterBranchText = "Enter",
    exitBranchText = "Exit",
    filterOptions: filterOptionsProp,
    freeSolo,
    getOptionDisabled: getOptionDisabledProp,
    getOptionLabel: getOptionLabelProp,
    getOptions: getOptionsProp,
    getOptionSelected: getOptionSelectedProp,
    ListboxProps: ListboxPropsProp = {},
    loading: loadingProp,
    loadingText = "Loading…",
    multiple,
    onBlur: onBlurProp,
    onClose: onCloseProp,
    onChange: onChangeProp,
    onOpen: onOpenProp,
    open,
    textFieldProps = {},
    value: valueProp,
    ...rest
  } = props;

  const isValueControlled = valueProp !== undefined;

  const autoCompleteProps = rest as Omit<
    AutocompleteProps<
      Node<T> | FreeSoloValueMapping<FreeSolo>,
      Multiple,
      DisableClearable,
      FreeSolo
    >,
    "defaultValue"
  >;

  const [state, setState] = useState<TreeSelectState>({
    branchPath: [],
    inputValue: (() => {
      if (!multiple && !isValueControlled && defaultValue) {
        return getOptionLabelProp
          ? getOptionLabelProp(defaultValue as T)
          : ((defaultValue as unknown) as string);
      } else {
        return "";
      }
    })(),
    loading: true, //ALWAYS loading for FIRST call to getOptions
    open: false,
    options: [],
    value: (() => {
      if (isValueControlled || defaultValue === undefined) {
        return multiple ? [] : null;
      } else if (multiple) {
        return (defaultValue as T[]).map((v) => new ValueNode(v as T));
      } else if (defaultValue === null) {
        return null;
      } else {
        return new ValueNode(defaultValue as T);
      }
    })(),
  });

  const getOptions = useCallback(
    async (branchNode?: T): Promise<OptionNode<T>[]> => {
      return (await getOptionsProp(branchNode)).map(({ option, type }) => {
        switch (type) {
          case NodeType.Leaf:
            return new ValueOptionNode(option);
          case NodeType.Branch:
            return new BranchNode(option);
          case NodeType.SelectableBranch:
            return new SelectableBranchNode(option);
        }
      });
    },
    [getOptionsProp]
  );

  // Get Root Options
  useEffect(() => {
    getOptions().then((options) =>
      setState((state) => ({
        ...state,
        loading: false,
        options,
      }))
    );
  }, [setState, getOptions]);

  const getOptionDisabled = useCallback<
    NonNullable<
      AutocompleteProps<
        TOptions | FreeSoloValueMapping<FreeSolo>,
        Multiple,
        DisableClearable,
        FreeSolo
      >["getOptionDisabled"]
    >
  >(
    (option) => {
      if (option instanceof LoadingBranchNode) {
        return true;
      } else if (option instanceof OpenedBranchNode) {
        return false;
      } else if (state.loading) {
        return true;
      } else if (getOptionDisabledProp) {
        return getOptionDisabledProp(
          option instanceof FreeSoloValue ? option : option.value
        );
      } else {
        return false;
      }
    },
    [getOptionDisabledProp, state.loading]
  );

  const getOptionLabel = useCallback<
    NonNullable<
      AutocompleteProps<
        ValueNode<T> | TOptions | FreeSoloValueMapping<FreeSolo> | string,
        Multiple,
        DisableClearable,
        FreeSolo
      >["getOptionLabel"]
    >
  >(
    (option) => {
      const opt =
        typeof option === "string" ? new FreeSoloValue(option) : option;
      if (getOptionLabelProp) {
        return getOptionLabelProp(
          opt instanceof FreeSoloValue
            ? (opt as FreeSoloValueMapping<FreeSolo>)
            : opt.value
        );
      } else {
        return (opt.value as unknown) as string;
      }
    },
    [getOptionLabelProp]
  );

  const getOptionSelected = useCallback<
    NonNullable<
      AutocompleteProps<
        TOptions | FreeSoloValueMapping<FreeSolo>,
        Multiple,
        DisableClearable,
        FreeSolo
      >["getOptionSelected"]
    >
  >(
    (option, value) => {
      if (
        option instanceof BranchPathNode ||
        option instanceof SelectableBranchNode
      ) {
        return false;
      } else if (getOptionSelectedProp) {
        return getOptionSelectedProp(
          option instanceof FreeSoloValue ? option : option.value,
          value instanceof FreeSoloValue ? value : value.value
        );
      } else {
        return option.value === value.value;
      }
    },
    [getOptionSelectedProp]
  );

  const filterOptions = useMemo<
    NonNullable<
      AutocompleteProps<
        TOptions,
        Multiple,
        DisableClearable,
        FreeSolo
      >["filterOptions"]
    >
  >(() => {
    const filterOptions = (() => {
      if (filterOptionsProp) {
        if (getOptionLabelProp) {
          return (options: TOptions[], state: FilterOptionsState<TOptions>) => {
            const convertedState = {
              ...state,
              getOptionLabel: getOptionLabelProp,
            };

            return options.filter((option) =>
              filterOptionsProp(option.value, convertedState)
            );
          };
        } else {
          return (options: TOptions[], state: FilterOptionsState<TOptions>) => {
            const convertedState = {
              ...state,
              getOptionLabel: (option: T) => (option as unknown) as string,
            };

            return options.filter((option) =>
              filterOptionsProp(option.value, convertedState)
            );
          };
        }
      } else {
        return createFilterOptions<TOptions>({
          stringify: getOptionLabel,
        });
      }
    })();

    return (options, state) => {
      const [parentNode, opts] = options.reduce(
        (parsed, v) => {
          if (v instanceof BranchPathNode) {
            parsed[0].push(v);
          } else {
            parsed[1].push(v);
          }
          return parsed;
        },
        [[], []] as [BranchPathNode<T>[], TOptions[]]
      );

      return [...parentNode, ...filterOptions(opts, state)];
    };
  }, [filterOptionsProp, getOptionLabelProp, getOptionLabel]);

  const upOneBranch = useCallback(
    () =>
      setState((state) => {
        if (state.cancelLoading) {
          state.cancelLoading();
        }

        const branchPath = state.branchPath.slice(
          0,
          state.branchPath.length - 1
        );

        let isCanceled = false;
        getOptions(lastElm(branchPath)?.branchNode.value).then((options) => {
          if (isCanceled) {
            return;
          }

          setState((state) => ({
            ...state,
            cancelLoading: undefined,
            loading: false,
            options,
          }));
        });

        return {
          ...state,
          branchPath,
          cancelLoading: () => {
            isCanceled = true;
          },
          // Ensure onInputChange "reset" does not add branch name to
          // input.
          inputValue: "",
          loading: true,
        };
      }),
    [setState, getOptions]
  );

  const onClose = useMemo<
    NonNullable<
      AutocompleteProps<
        Node<T> | FreeSoloValueMapping<FreeSolo>,
        Multiple,
        DisableClearable,
        FreeSolo
      >["onClose"]
    >
  >(() => {
    if (onCloseProp) {
      return onCloseProp;
    } else {
      return (...args) => {
        const [, reason] = args;
        switch (reason) {
          case "select-option":
            break; //onChange will handle
          case "escape":
            if (state.branchPath.length > 0) {
              upOneBranch();
            } else {
              setState((state) => ({
                ...state,
                open: false,
              }));
            }
            break;
          case "blur":
            if (debug) {
              return;
            }
            setState((state) => ({
              ...state,
              open: false,
            }));
            break;

          case "toggleInput":
            setState((state) => ({
              ...state,
              open: false,
            }));
            break;
        }
      };
    }
  }, [setState, debug, upOneBranch, state.branchPath, onCloseProp]);

  const onOpen = useMemo<
    NonNullable<
      AutocompleteProps<
        Node<T> | FreeSoloValueMapping<FreeSolo>,
        Multiple,
        DisableClearable,
        FreeSolo
      >["onOpen"]
    >
  >(() => {
    if (onOpenProp) {
      return onOpenProp;
    } else {
      return () => {
        setState((state) => ({
          ...state,
          open: true,
        }));
      };
    }
  }, [setState, onOpenProp]);

  const renderInput = useCallback<
    NonNullable<
      AutocompleteProps<
        ValueNode<T> | FreeSoloValueMapping<FreeSolo>,
        Multiple,
        DisableClearable,
        FreeSolo
      >["renderInput"]
    >
  >(
    (params) => {
      return <TextField {...textFieldProps} {...params}></TextField>;
    },
    [textFieldProps]
  );

  const renderOption = useCallback<
    NonNullable<
      AutocompleteProps<
        TOptions,
        Multiple,
        DisableClearable,
        FreeSolo
      >["renderOption"]
    >
  >(
    (option) => {
      if (option instanceof OpenedBranchNode) {
        return (
          <ListItem className={classes.optionNode} component="div" divider>
            <ListItemIcon>
              <Tooltip title={exitBranchText}>
                <ChevronLeftIcon />
              </Tooltip>
            </ListItemIcon>
            {state.branchPath.length > 1 ? (
              <Tooltip
                title={state.branchPath.reduce((pathStr, branch) => {
                  return `${pathStr}${pathStr ? " > " : ""}${getOptionLabel(
                    branch
                  )}`;
                }, "")}
              >
                <ListItemText
                  primaryTypographyProps={primaryTypographyProps}
                  primary={getOptionLabel(option)}
                />
              </Tooltip>
            ) : (
              <ListItemText
                primaryTypographyProps={primaryTypographyProps}
                primary={getOptionLabel(option)}
              />
            )}
          </ListItem>
        );
      } else if (option instanceof LoadingBranchNode) {
        return <div className="MuiAutocomplete-loading">{loadingText}</div>;
      } else if (state.loading) {
        return (
          <Box width="100%">
            <Skeleton animation="wave" />
          </Box>
        );
      } else if (option instanceof BranchNode) {
        return (
          <Box width="100%" display="flex">
            <Box flexGrow="1" clone>
              <Typography variant="inherit" color="inherit" align="left" noWrap>
                {getOptionLabel(option)}
              </Typography>
            </Box>
            <Tooltip title={enterBranchText}>
              <ChevronRightIcon />
            </Tooltip>
          </Box>
        );
      } else {
        return (
          <Typography variant="inherit" color="inherit" align="left" noWrap>
            {getOptionLabel(option)}
          </Typography>
        );
      }
    },
    [
      loadingText,
      getOptionLabel,
      classes.optionNode,
      state.branchPath,
      state.loading,
      enterBranchText,
      exitBranchText,
    ]
  );

  const onInputChange = useCallback<
    NonNullable<
      AutocompleteProps<
        Node<T> | FreeSoloValueMapping<FreeSolo>,
        Multiple,
        DisableClearable,
        FreeSolo
      >["onInputChange"]
    >
  >(
    (...args) => {
      const [, inputValue, reason] = args;

      switch (reason) {
        case "input":
          {
            setState((state) => ({
              ...state,
              inputValue,
            }));
          }
          break;
        case "clear":
          setState((state) => ({
            ...state,
            inputValue: "",
          }));
          break;
        case "reset":
          {
            if (multiple) {
              setState((state) => ({
                ...state,
                inputValue,
              }));
            } else {
              setState((state) => {
                if (state.value) {
                  return {
                    ...state,
                    inputValue: getOptionLabel(state.value as ValueNode<T>),
                  };
                } else {
                  return {
                    ...state,
                    inputValue,
                  };
                }
              });
            }
          }

          break;
      }
    },
    [setState, onChangeProp, getOptionLabel, multiple]
  );

  const onChange = useCallback<
    NonNullable<
      AutocompleteProps<
        TOptions | TValue,
        Multiple,
        DisableClearable,
        FreeSolo
      >["onChange"]
    >
  >(
    (...args) => {
      // Do NOT RUN if value is or contains LoadingBranchNode
      if (
        multiple
          ? (args[1] as Value<
              Node<T> | FreeSoloValueMapping<FreeSolo>,
              true,
              DisableClearable,
              FreeSolo
            >).some((value) => value instanceof LoadingBranchNode)
          : args[1] instanceof LoadingBranchNode
      ) {
        return;
      }

      const addSelectedOption = (newValue: ValueOptionNode<T>) => {
        // ONLY ValueOptionNode should result in a value update here.
        if (multiple) {
          const value = args[1] as (ValueOptionNode<T> | TValue)[];

          if (isValueControlled) {
            setState((state) => ({
              ...state,
              inputValue: "",
              open: !!disableCloseOnSelect,
            }));
          } else {
            // NOT controlled, set value to local state.
            setState((state) => ({
              ...state,
              inputValue: "",
              value: value.map((v) =>
                v instanceof ValueOptionNode ? v.valueNode : v
              ),
              open: !!disableCloseOnSelect,
            }));
          }

          (onChangeProp as OnChange<T, true, true, true>)(
            value.map((v) => (v instanceof FreeSoloValue ? v : v.value))
          );
        } else {
          if (isValueControlled) {
            setState((state) => ({
              ...state,
              inputValue: getOptionLabel(newValue),
              open: !!disableCloseOnSelect,
            }));
          } else {
            // NOT controlled, set value to local state.
            setState((state) => ({
              ...state,
              inputValue: getOptionLabel(newValue),
              value: newValue.valueNode,
              open: !!disableCloseOnSelect,
            }));
          }
          (onChangeProp as OnChange<T, false, false, false>)(newValue.value);
        }
      };

      const addFreeSoloValue = () => {
        if (multiple) {
          const value = (args[1] as (TValue | string)[]).map((v) =>
            typeof v === "string" ? new FreeSoloValue(v) : v
          );

          if (isValueControlled) {
            setState((state) => ({
              ...state,
              inputValue: "",
            }));
          } else {
            // NOT controlled, set value to local state.

            setState((state) => ({
              ...state,
              inputValue: "",
              value,
            }));
          }

          (onChangeProp as OnChange<T, true, true, true>)(
            value.map((v) => (v instanceof FreeSoloValue ? v : v.value))
          );
        } else {
          const value = new FreeSoloValue(args[1] as string);

          if (isValueControlled) {
            setState((state) => ({
              ...state,
              inputValue: value.value,
            }));
          } else {
            // NOT controlled, set value to local state.
            setState((state) => ({
              ...state,
              inputValue: value.value,
              value,
            }));
          }

          (onChangeProp as OnChange<T, false, true, true>)(value);
        }
      };

      switch (args[2]) {
        case "select-option": // ONLY new options i.e. NOT free solo
          {
            const newValue = multiple
              ? (lastElm(
                  args[1] as Value<TOptions, true, true, false>
                ) as TOptions)
              : (args[1] as Value<TOptions, false, true, false>);

            if (newValue instanceof OpenedBranchNode) {
              upOneBranch();
            } else if (newValue instanceof BranchNode) {
              //NOTE: SelectableBranchNode inherits from BranchNode e.g. is
              // accounted for here too.
              let isCanceled = false;
              setState((state) => {
                if (state.cancelLoading) {
                  state.cancelLoading();
                }
                return {
                  ...state,
                  branchPath: [...state.branchPath, newValue.openedBranchNode],
                  cancelLoading: () => {
                    isCanceled = true;
                  },
                  // Ensure onInputChange "reset" does not add branch name to
                  // input.
                  inputValue: "",
                  loading: true,
                };
              });

              getOptions(newValue.value).then((options) => {
                if (isCanceled) {
                  return;
                }
                setState((state) => ({
                  ...state,
                  cancelLoading: undefined,
                  loading: false,
                  options,
                }));
              });
            } else if (newValue instanceof ValueOptionNode) {
              // ONLY ValueOptionNode should result in a value update here.
              addSelectedOption(newValue);
            }
          }

          break;

        case "remove-option": // ONLY called when Multiple is true
          {
            const value = args[1] as TValue[];
            if (!isValueControlled) {
              // NOT controlled, set value to local state.
              setState((state) => ({
                ...state,
                value,
              }));
            }

            (onChangeProp as OnChange<T, true, true, true>)(
              value.map((v) => (v instanceof FreeSoloValue ? v : v.value))
            );
          }
          break;
        case "clear":
          {
            if (!isValueControlled) {
              setState((state) => ({
                ...state,
                value: multiple ? [] : null,
              }));
            }
            if (multiple) {
              (onChangeProp as OnChange<T, true, DisableClearable, FreeSolo>)(
                []
              );
            } else {
              (onChangeProp as OnChange<T, false, false, FreeSolo>)(null);
            }
          }
          break;

        case "blur":
          {
            const newValue = multiple
              ? (lastElm(
                  args[1] as Value<TOptions, true, true, true>
                ) as TOptions)
              : (args[1] as Value<TOptions, false, true, true>);

            if (newValue instanceof ValueOptionNode) {
              // ONLY ValueOptionNode should result in a value update here.
              addSelectedOption(newValue);
            } else if (typeof newValue === "string") {
              // freeSolo option.
              addFreeSoloValue();
            } else if (!multiple) {
              setState((state) => {
                if (state.value) {
                  return {
                    ...state,
                    inputValue: getOptionLabel(state.value as ValueNode<T>),
                  };
                } else {
                  return {
                    ...state,
                    inputValue: "",
                  };
                }
              });
            }
          }
          break;
        case "create-option": // freeSolo option.
          {
            addFreeSoloValue();
          }
          break;
      }
    },
    [
      onChangeProp,
      multiple,
      setState,
      getOptionLabel,
      getOptions,
      upOneBranch,
      isValueControlled,
      disableCloseOnSelect,
    ]
  );

  const onBlur = useCallback<
    NonNullable<
      AutocompleteProps<
        TOptions | TValue,
        Multiple,
        DisableClearable,
        FreeSolo
      >["onBlur"]
    >
  >(
    (...args) => {
      // When freeSolo is true and autoSelect is false,  an uncommitted free solo
      // input value stays in the input field on blur, but is not set as a value.
      // NOTE: This is not the case when autoSelect is true.  This ambiguous state
      // and behavior is addressed here.  The behavior will be to select the value
      // as a freeSolo value in autoSelect-like manor.
      if (freeSolo && !autoSelect) {
        setState((state) => {
          if (state.inputValue.trim()) {
            if (multiple) {
              return {
                ...state,
                inputValue: "",
                value: [
                  ...(state.value as TValue[]),
                  new FreeSoloValue(state.inputValue),
                ],
              };
            } else {
              if (
                !state.value ||
                getOptionLabel(state.value as ValueNode<T>) !== state.inputValue
              ) {
                return {
                  ...state,
                  value: new FreeSoloValue(state.inputValue),
                };
              }
            }
          }

          return state;
        });
      }

      if (onBlurProp) {
        onBlurProp(...args);
      }
    },
    [onBlurProp, freeSolo, autoSelect, multiple, getOptionLabel]
  );

  const options = useMemo<TOptions[]>(() => {
    const options: TOptions[] = [];

    if (state.branchPath.length > 0) {
      const openBranchNode = lastElm(state.branchPath) as OpenedBranchNode<T>;

      options.push(openBranchNode);

      if (state.loading) {
        options.push(openBranchNode.loadingBranchNode);
      }
    }

    if (state.loading) {
      return options;
    } else {
      return state.options.reduce((options, option) => {
        if (option instanceof SelectableBranchNode) {
          options.push(option.valueOptionNode, option);
        } else {
          options.push(option);
        }
        return options;
      }, options);
    }
  }, [state.branchPath, state.options, state.loading]);

  const value = useMemo<TValue | TValue[] | null>(() => {
    if (valueProp === undefined) {
      return state.value;
    } else if (valueProp === null) {
      return null;
    } else if (multiple) {
      return (valueProp as (T | FreeSoloValue)[]).map((v) =>
        v instanceof FreeSoloValue ? v : new ValueNode<T>(v)
      );
    } else {
      return valueProp instanceof FreeSoloValue
        ? valueProp
        : new ValueNode<T>(valueProp as T);
    }
  }, [valueProp, multiple, state.value]);

  const ListboxProps = useMemo<
    AutocompleteProps<
      Node<T>,
      Multiple,
      DisableClearable,
      FreeSolo
    >["ListboxProps"]
  >(() => {
    if (state.branchPath.length > 0) {
      return {
        ...ListboxPropsProp,
        className: `MuiAutocomplete-listbox ${
          (ListboxPropsProp as Record<string, string>).className || ""
        } ${state.loading ? classes.listBoxWLoadingBranchNode : ""}`,
      };
    } else {
      return ListboxPropsProp;
    }
  }, [
    ListboxPropsProp,
    state.branchPath,
    state.loading,
    classes.listBoxWLoadingBranchNode,
  ]);

  return (
    <Autocomplete
      {...autoCompleteProps}
      autoSelect={autoSelect}
      debug={debug}
      disableClearable={disableClearable}
      disableCloseOnSelect={disableCloseOnSelect}
      filterOptions={filterOptions}
      freeSolo={freeSolo}
      getOptionDisabled={getOptionDisabled}
      getOptionLabel={getOptionLabel}
      getOptionSelected={getOptionSelected}
      inputValue={state.inputValue}
      ListboxProps={ListboxProps}
      loading={loadingProp || state.loading}
      loadingText={loadingText}
      multiple={multiple}
      onBlur={onBlur}
      onInputChange={onInputChange}
      onChange={onChange}
      onClose={onClose}
      onOpen={onOpen}
      open={open ?? state.open}
      options={options}
      renderInput={renderInput}
      renderOption={renderOption}
      value={value as Value<Node<T>, Multiple, DisableClearable, FreeSolo>}
    />
  );
};

export default TreeSelect;
