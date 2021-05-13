import React, { useCallback, useMemo, useState } from "react";
import Autocomplete, {
  AutocompleteProps,
  AutocompleteRenderInputParams,
} from "@material-ui/lab/Autocomplete";
import {
  AutocompleteChangeReason,
  AutocompleteCloseReason,
  createFilterOptions,
  FilterOptionsState,
} from "@material-ui/lab/useAutocomplete";
import Skeleton from "@material-ui/lab/Skeleton";
import { Box, InputProps, TextField, TextFieldProps } from "@material-ui/core";
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

const NULLISH = Symbol("NULLISH");

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
const convertToString = (value: unknown): string =>
  typeof value === "symbol" ? value.toString() : `${value}`;

const primaryTypographyProps: NonNullable<
  ListItemTextProps["primaryTypographyProps"]
> = {
  noWrap: true,
};

/**
 * Used to distinguish free solo entries from string values.
 */
export class FreeSoloValue extends String {
  constructor(value: string) {
    super(value);
  }
}

/**
 * Options are wrapped to distinguish free solo entries from string
 * options, this is used internally only.
 */
class Option<T> {
  constructor(readonly option: T) {}
  valueOf(): T {
    return this.option;
  }

  toString(): string {
    return convertToString(this.option);
  }
}

/**
 * Indicates an option is a branch node.
 */
export class BranchOption<TBranchOption> extends Option<TBranchOption> {}

const DEFAULT_LOADING_TEXT = "Loading…" as const;

const LOADING_OPTION = Symbol();

export type BranchSelectReason =
  | Extract<AutocompleteChangeReason, "select-option">
  | Extract<AutocompleteCloseReason, "escape">;

export type BranchSelectDirection = "up" | "down";

export type FreeSoloValueMapping<
  FreeSolo extends boolean | undefined
> = FreeSolo extends true ? FreeSoloValue : never;

export type TreeSelectTextFieldProps =
  | (Omit<
      TextFieldProps,
      | keyof AutocompleteRenderInputParams
      | Exclude<
          keyof AutocompleteProps<unknown, undefined, undefined, undefined>,
          "placeholder"
        >
      | "defaultValue"
      | "multiline"
      | "onChange"
      | "rows"
      | "rowsMax"
      | "select"
      | "SelectProps"
      | "value"
    > & {
      InputProps?: Omit<InputProps, keyof TextFieldProps["InputProps"]>;
    })
  | ((
      params: AutocompleteRenderInputParams
    ) => AutocompleteRenderInputParams & TextFieldProps);

export type TreeSelectProps<
  T,
  TBranchOption,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> = Pick<
  // T ONLY
  AutocompleteProps<T, Multiple, DisableClearable, false>,
  "defaultValue" | "getOptionSelected"
> &
  // T and FreeSoloValue
  Pick<
    AutocompleteProps<
      T | FreeSoloValueMapping<FreeSolo>,
      Multiple,
      DisableClearable,
      false
    >,
    "onChange" | "renderTags" | "value"
  > &
  // T and BranchOptions
  Pick<
    AutocompleteProps<
      T | BranchOption<TBranchOption>,
      Multiple,
      DisableClearable,
      false
    >,
    "getOptionDisabled" | "groupBy" | "onHighlightChange" | "options"
  > &
  // T, FreeSoloValue, and BranchOptions
  Pick<
    AutocompleteProps<
      T | FreeSoloValueMapping<FreeSolo> | BranchOption<TBranchOption>,
      Multiple,
      DisableClearable,
      false
    >,
    "getOptionLabel"
  > &
  // Rest AutocompleteProps and Omits
  Omit<
    AutocompleteProps<unknown, Multiple, DisableClearable, false>,
    // Omit above Pick's
    | "defaultValue"
    | "filterOptions"
    | "getOptionDisabled"
    | "getOptionLabel"
    | "getOptionSelected"
    | "groupBy"
    | "onChange"
    | "onHighlightChange"
    | "renderTags"
    | "value"

    // Omits
    | "filterOptions"
    | "freeSolo"
    | "loadingText"
    | "noOptionsText"
    | "options"
    | "renderInput"
    | "renderOption"
    | "placeholder"
  > & {
    branchPath?: BranchOption<TBranchOption>[];
    enterBranchText?: string;
    exitBranchText?: string;
    /**
     * @returns `true` to keep option and `false` to filter.
     */
    filterOptions?: (
      option: T | BranchOption<TBranchOption>,
      state: FilterOptionsState<T | BranchOption<TBranchOption>>
    ) => boolean;
    freeSolo?: FreeSolo;
    loadingText?: string;
    noOptionsText?: string;
    onBranchChange: (
      event: React.ChangeEvent<Record<string, unknown>>,
      branchOption: BranchOption<TBranchOption> | undefined,
      branchPath: BranchOption<TBranchOption>[],
      direction: BranchSelectDirection,
      reason: BranchSelectReason
    ) => void | Promise<void>;
    textFieldProps?: TreeSelectTextFieldProps;
    /**
     * Goes up one branch on escape key press; unless at root, then default
     * MUI Autocomplete behavior.
     * */
    upBranchOnEsc?: boolean;
  };

const TreeSelect = <
  T,
  TBranchOption,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
>(
  props: TreeSelectProps<T, TBranchOption, Multiple, DisableClearable, FreeSolo>
): JSX.Element => {
  type TOption =
    | BranchOption<TBranchOption>
    | Option<T>
    | typeof LOADING_OPTION;

  type TValue = typeof props.value;

  interface TreeSelectState {
    branchPath: BranchOption<TBranchOption>[];
    inputValue: string;
    open: boolean;
    value: TValue;
  }

  const classes = useStyles();

  const {
    autoSelect,
    branchPath: branchPathProp,
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
    inputValue: inputValueProp,
    onInputChange: onInputChangeProp,
    onBranchChange,
    getOptionSelected: getOptionSelectedProp,
    ListboxProps: ListboxPropsProp,
    loading,
    loadingText = DEFAULT_LOADING_TEXT,
    multiple,
    onBlur: onBlurProp,
    onClose: onCloseProp,
    onChange: onChangeProp,
    onOpen: onOpenProp,
    open,
    options: optionsProp,
    textFieldProps,
    value: valueProp,
    upBranchOnEsc,
    ...rest
  } = props;

  const isBranchPathControlled = branchPathProp !== undefined;
  const isInputControlled = inputValueProp !== undefined;
  const isValueControlled = valueProp !== undefined;

  const autoCompleteProps = rest as Omit<
    AutocompleteProps<unknown, Multiple, DisableClearable, FreeSolo>,
    "defaultValue"
  >;

  const [state, setState] = useState<TreeSelectState>({
    branchPath: [],
    inputValue: (() => {
      if (!multiple && !isInputControlled) {
        if ((valueProp ?? NULLISH) !== NULLISH) {
          return getOptionLabelProp
            ? getOptionLabelProp(valueProp as T)
            : convertToString(valueProp);
        } else if ((defaultValue ?? NULLISH) !== NULLISH) {
          return getOptionLabelProp
            ? getOptionLabelProp(defaultValue as T)
            : convertToString(defaultValue);
        }
      }
      return "";
    })(),
    open: false,
    value: (() => {
      if (isValueControlled || defaultValue === undefined) {
        return multiple ? [] : null;
      } else if (multiple) {
        return (defaultValue as T[]).map((v) => new Option(v as T));
      } else if (defaultValue === null) {
        return null;
      } else {
        return new Option(defaultValue as T);
      }
    })() as typeof props.value,
  });

  const branchPath = (isBranchPathControlled
    ? branchPathProp
    : state.branchPath) as BranchOption<TBranchOption>[];

  const inputValue = (isInputControlled
    ? inputValueProp
    : state.inputValue) as string;

  const value = isValueControlled ? valueProp : state.value;

  const getOptionDisabled = useCallback<(option: TOption) => boolean>(
    (option: TOption) => {
      if (option === LOADING_OPTION) {
        return true;
      } else if (
        option instanceof BranchOption &&
        branchPath.includes(option)
      ) {
        return false;
      } else if (loading) {
        return true;
      } else if (getOptionDisabledProp) {
        return getOptionDisabledProp(
          option instanceof Option && !(option instanceof BranchOption)
            ? option.option
            : option
        );
      } else {
        return false;
      }
    },
    [getOptionDisabledProp, loading, branchPath]
  );

  const getOptionLabel = useCallback<
    (option: TOption | FreeSoloValueMapping<FreeSolo> | T) => string
  >(
    (option: TOption | FreeSoloValueMapping<FreeSolo> | T) => {
      if (option === LOADING_OPTION) {
        return loadingText;
      } else if (getOptionLabelProp) {
        return getOptionLabelProp(
          (() => {
            if (option instanceof FreeSoloValue) {
              return option as FreeSoloValueMapping<FreeSolo>;
            } else if (option instanceof BranchOption) {
              return option;
            } else if (option instanceof Option) {
              return option.option;
            } else {
              return option;
            }
          })()
        );
      } else if (option instanceof Option) {
        return convertToString(option.option);
      } else {
        return convertToString(option);
      }
    },
    [getOptionLabelProp, loadingText]
  );

  const getOptionSelected = useCallback<(option: TOption, value: T) => boolean>(
    (option: TOption, value: T | FreeSoloValue) => {
      // An Option is NEVER a FreeSoloValue (sanity); BranchOption and
      // LOADING_OPTION are NEVER selectable.
      if (
        value instanceof FreeSoloValue ||
        option instanceof BranchOption ||
        option === LOADING_OPTION
      ) {
        return false;
      } else if (getOptionSelectedProp) {
        return getOptionSelectedProp(option.option, value);
      } else {
        return option.option === value;
      }
    },
    [getOptionSelectedProp]
  );

  const filterOptions = useMemo<
    (
      options: TOption[],
      filterOptionsState: FilterOptionsState<
        Option<T> | BranchOption<TBranchOption>
      >
    ) => TOption[]
  >(() => {
    const filterOptions = filterOptionsProp
      ? (
          options: (Option<T> | BranchOption<TBranchOption>)[],
          state: FilterOptionsState<Option<T> | BranchOption<TBranchOption>>
        ) => {
          const newState = {
            ...state,
            getOptionLabel: (option: T | BranchOption<TBranchOption>) =>
              state.getOptionLabel(
                option instanceof BranchOption ? option : new Option(option)
              ),
          };

          return options.filter((option) =>
            filterOptionsProp(
              option instanceof BranchOption ? option : option.option,
              newState
            )
          );
        }
      : createFilterOptions<Option<T> | BranchOption<TBranchOption>>({
          stringify: getOptionLabel,
        });

    // Parent BranchOption and LOADING_OPTION are NEVER filtered
    return (
      options: TOption[],
      filterOptionsState: FilterOptionsState<
        Option<T> | BranchOption<TBranchOption>
      >
    ) => {
      const [staticOpts, filteredOpts] = options.reduce(
        (opts, opt) => {
          const [staticOpts, filteredOpts] = opts;

          // LOADING_OPTION and NO_OPTIONS_OPTION are NEVER filtered
          if (opt === LOADING_OPTION) {
            staticOpts.push(opt);
          } else if (opt instanceof BranchOption) {
            // Parent BranchOption are NEVER filtered
            if (branchPath.includes(opt)) {
              staticOpts.push(opt);
            } else {
              filteredOpts.push(opt);
            }
          }

          return opts;
        },
        [[], []] as [
          (BranchOption<TBranchOption> | typeof LOADING_OPTION)[],
          (Option<T> | BranchOption<TBranchOption>)[]
        ]
      );

      return [
        ...staticOpts,
        ...filterOptions(filteredOpts, filterOptionsState),
      ];
    };
  }, [filterOptionsProp, getOptionLabel, branchPath]);

  const resetInput = useCallback(
    (
      event: Parameters<
        NonNullable<
          AutocompleteProps<
            unknown,
            Multiple,
            DisableClearable,
            FreeSolo
          >["onInputChange"]
        >
      >[0],
      inputValue: string
    ) => {
      if (!isInputControlled) {
        setState((state) => ({
          ...state,
          inputValue,
        }));
      }

      if (onInputChangeProp) {
        onInputChangeProp(event, inputValue, "reset");
      }
    },
    [isInputControlled, onInputChangeProp, setState]
  );

  const upOneBranch = useCallback(
    (event: Parameters<typeof resetInput>[0], reason: BranchSelectReason) => {
      if (multiple || (value ?? NULLISH) === NULLISH) {
        resetInput(event, "");
      }

      const newBranchPath = branchPath.slice(0, branchPath.length - 1);

      if (!isBranchPathControlled) {
        setState((state) => ({
          ...state,
          branchPath: newBranchPath,
        }));
      }

      onBranchChange(
        event,
        lastElm(newBranchPath),
        [...newBranchPath],
        "up",
        reason
      );
    },
    [
      isBranchPathControlled,
      setState,
      branchPath,
      multiple,
      onBranchChange,
      resetInput,
      value,
    ]
  );

  const onClose = useCallback<
    NonNullable<
      AutocompleteProps<
        unknown,
        Multiple,
        DisableClearable,
        FreeSolo
      >["onClose"]
    >
  >(
    (...args) => {
      const [event, reason] = args;

      //onClose should NOT be called by a BranchOption
      // selection. onChange MUST handle,
      if (reason === "select-option") {
        return;
      } else if (
        reason === "escape" &&
        branchPath.length > 0 &&
        upBranchOnEsc
      ) {
        // Escape goes up One Branch level
        upOneBranch(event, "escape");
      } else if (onCloseProp) {
        return onCloseProp(...args);
      } else {
        switch (reason) {
          case "escape":
            setState((state) => ({
              ...state,
              open: false,
            }));
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
      }
    },
    [onCloseProp, branchPath.length, upBranchOnEsc, debug, upOneBranch]
  );

  const onOpen = useMemo<
    NonNullable<
      AutocompleteProps<unknown, Multiple, DisableClearable, FreeSolo>["onOpen"]
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
        unknown,
        Multiple,
        DisableClearable,
        FreeSolo
      >["renderInput"]
    >
  >(
    (params) => {
      const props =
        typeof textFieldProps === "function"
          ? textFieldProps(params)
          : {
              ...textFieldProps,
              ...params,
              InputProps: {
                ...(textFieldProps?.InputProps || {}),
                ...(params?.InputProps || {}),
              },
            };

      return <TextField {...props}></TextField>;
    },
    [textFieldProps]
  );

  const renderOption = useCallback<
    NonNullable<
      AutocompleteProps<
        TOption,
        Multiple,
        DisableClearable,
        FreeSolo
      >["renderOption"]
    >
  >(
    (option) => {
      if (option === LOADING_OPTION) {
        return (
          <div className="MuiAutocomplete-loading">
            {getOptionLabel(LOADING_OPTION)}
          </div>
        );
      } else if (
        option instanceof BranchOption &&
        branchPath.includes(option)
      ) {
        return (
          <ListItem className={classes.optionNode} component="div" divider>
            <ListItemIcon>
              <Tooltip title={exitBranchText}>
                <ChevronLeftIcon />
              </Tooltip>
            </ListItemIcon>
            {branchPath.length > 1 ? (
              <Tooltip
                title={branchPath.reduce((pathStr, branch) => {
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
      } else if (loading) {
        return (
          <Box width="100%">
            <Skeleton animation="wave" />
          </Box>
        );
      } else if (option instanceof BranchOption) {
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
      getOptionLabel,
      classes.optionNode,
      branchPath,
      loading,
      enterBranchText,
      exitBranchText,
    ]
  );

  const onInputChange = useCallback<
    NonNullable<
      AutocompleteProps<
        unknown,
        Multiple,
        DisableClearable,
        FreeSolo
      >["onInputChange"]
    >
  >(
    (...args) => {
      const [, inputValue, reason] = args;

      // Resets are handled by resetInput
      if (reason === "reset") {
        return;
      }

      if (!isInputControlled) {
        setState((state) => ({
          ...state,
          inputValue,
        }));
      }

      if (onInputChangeProp) {
        onInputChangeProp(...args);
      }
    },
    [isInputControlled, onInputChangeProp, setState]
  );

  type OnChangeParams = Parameters<
    NonNullable<
      AutocompleteProps<
        unknown,
        Multiple,
        DisableClearable,
        FreeSolo
      >["onChange"]
    >
  >;

  const onChange = useCallback<
    (
      event: OnChangeParams[0],
      value: unknown,
      reason: OnChangeParams[2],
      details: OnChangeParams[3]
    ) => void
  >(
    (...args) => {
      const [event, , reason] = args;

      const curValue = value;

      switch (reason) {
        case "select-option":
        case "blur":
        case "create-option":
          {
            const value = (multiple
              ? lastElm(args[1] as unknown[])
              : args[1]) as TOption | string;

            if (value === LOADING_OPTION) {
              return;
            } else if (value instanceof BranchOption) {
              if (reason === "blur") {
                // Do NOT follow branches on blur
                return;
              } else if (branchPath.includes(value)) {
                upOneBranch(event, "select-option");
              } else {
                // Following branch reset input
                if (multiple || (curValue ?? NULLISH) === NULLISH) {
                  resetInput(event, "");
                }

                const newBranchPath = [...branchPath, value];

                if (!isBranchPathControlled) {
                  setState((state) => ({
                    ...state,
                    branchPath: newBranchPath,
                  }));
                }

                onBranchChange(
                  event,
                  value,
                  [...newBranchPath],
                  "down",
                  "select-option"
                );
              }
            } else {
              const parsedValue =
                value instanceof Option
                  ? value.option
                  : new FreeSoloValue(value);

              const newValue = (multiple
                ? [...(args[1] as unknown[]).slice(0, -1), parsedValue]
                : parsedValue) as Exclude<TValue, undefined>;

              // Reset input on new value
              if (multiple) {
                resetInput(event, "");
              } else {
                resetInput(
                  event,
                  getOptionLabel(
                    parsedValue instanceof FreeSoloValue
                      ? (parsedValue as FreeSoloValueMapping<FreeSolo>)
                      : (value as Option<T>)
                  )
                );
              }

              // NOT controlled, set value to local state.
              if (isValueControlled) {
                setState((state) => ({
                  ...state,
                  open: !!disableCloseOnSelect,
                }));
              } else {
                setState((state) => ({
                  ...state,
                  value: newValue,
                  open: !!disableCloseOnSelect,
                }));
              }

              if (onChangeProp) {
                onChangeProp(event, newValue, reason);
              }
            }
          }
          break;
        case "clear":
        case "remove-option":
          {
            resetInput(event, "");

            const value = args[1] as Exclude<TValue, undefined>;

            if (!isValueControlled) {
              // NOT controlled, set value to local state.
              setState((state) => ({
                ...state,
                value,
              }));
            }

            if (onChangeProp) {
              onChangeProp(event, value, reason);
            }
          }
          break;
      }
    },
    [
      multiple,
      branchPath,
      upOneBranch,
      resetInput,
      setState,
      isBranchPathControlled,
      onBranchChange,
      isValueControlled,
      onChangeProp,
      getOptionLabel,
      disableCloseOnSelect,
      value,
    ]
  );

  const onBlur = useCallback<
    NonNullable<
      AutocompleteProps<unknown, Multiple, DisableClearable, FreeSolo>["onBlur"]
    >
  >(
    (...args) => {
      const [event] = args;

      // When freeSolo is true and autoSelect is false,  an uncommitted free solo
      // input value stays in the input field on blur, but is not set as a value.
      // NOTE: This is not the case when autoSelect is true.  This ambiguous state
      // and behavior is addressed here.  The behavior will be to clear the input.
      if (freeSolo && !autoSelect) {
        if (inputValue.trim()) {
          if (multiple || value === null) {
            resetInput(event, "");
          } else {
            resetInput(
              event,
              getOptionLabel(
                value instanceof FreeSoloValue
                  ? (value as FreeSoloValueMapping<FreeSolo>)
                  : new Option(value as T)
              )
            );
          }
        }
      }

      if (onBlurProp) {
        onBlurProp(...args);
      }
    },
    [
      freeSolo,
      autoSelect,
      onBlurProp,
      inputValue,
      multiple,
      value,
      resetInput,
      getOptionLabel,
    ]
  );

  const options = useMemo<TOption[]>(() => {
    const options: TOption[] = [];

    if (branchPath.length > 0) {
      const openBranchNode = lastElm(branchPath);

      options.push(openBranchNode as BranchOption<TBranchOption>);

      if (loading) {
        options.push(LOADING_OPTION);
      }
    }

    if (loading) {
      return options;
    } else {
      return optionsProp.reduce((options, option) => {
        options.push(
          option instanceof BranchOption ? option : new Option(option)
        );
        return options;
      }, options);
    }
  }, [branchPath, optionsProp, loading]);

  const ListboxProps = useMemo<
    AutocompleteProps<
      unknown,
      Multiple,
      DisableClearable,
      FreeSolo
    >["ListboxProps"]
  >(() => {
    if (branchPath.length > 0) {
      return {
        ...(ListboxPropsProp || {}),
        className: `MuiAutocomplete-listbox ${
          ((ListboxPropsProp || {}) as Record<string, string>).className || ""
        } ${loading ? classes.listBoxWLoadingBranchNode : ""}`,
      };
    } else {
      return ListboxPropsProp;
    }
  }, [
    ListboxPropsProp,
    branchPath,
    loading,
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getOptionSelected={getOptionSelected as any}
      inputValue={inputValue}
      ListboxProps={ListboxProps}
      loading={loading && branchPath.length === 0}
      loadingText={loadingText}
      multiple={multiple}
      onBlur={onBlur}
      onInputChange={onInputChange}
      onChange={onChange}
      onClose={onClose}
      onOpen={onOpen}
      open={open ?? state.open}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options={options as any[]}
      renderInput={renderInput}
      renderOption={renderOption}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value={value as any}
    />
  );
};

export default TreeSelect;
