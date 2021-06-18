import React, {
  forwardRef,
  Fragment,
  useCallback,
  useMemo,
  useState,
} from "react";
import Autocomplete, {
  AutocompleteProps,
  AutocompleteRenderInputParams,
  AutocompleteRenderOptionState,
} from "@material-ui/lab/Autocomplete";
import {
  AutocompleteChangeReason,
  AutocompleteCloseReason,
  createFilterOptions,
  FilterOptionsState,
  Value,
} from "@material-ui/lab/useAutocomplete";
import Skeleton from "@material-ui/lab/Skeleton";
import {
  Box,
  Chip,
  ChipProps,
  InputProps,
  SvgIcon,
  SvgIconProps,
  TextField,
  TextFieldProps,
} from "@material-ui/core";
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
import { ReactNode } from "react";

// https://stackoverflow.com/a/58473012
declare module "react" {
  // eslint-disable-next-line @typescript-eslint/ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FreeSoloValue<TBranchOption = any> extends String {
  constructor(
    value: string,
    readonly branchPath: BranchOption<TBranchOption>[] = []
  ) {
    super(value);
  }
}

abstract class BaseOption<T> {
  #_value_: T;
  constructor(value: T) {
    this.#_value_ = value;
  }
  valueOf(): T {
    return this.#_value_;
  }

  toString(): string {
    return convertToString(this.#_value_);
  }
}

/**
 * Wrapper for all option values that includes the branch path to the option.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Option<T, TBranchOption = any> extends BaseOption<T> {
  constructor(
    value: T,
    readonly branchPath: BranchOption<TBranchOption>[] = []
  ) {
    super(value);
  }
}

/**
 * Indicates an option is a branch node.
 */
export class BranchOption<TBranchOption> extends BaseOption<TBranchOption> {}

const DEFAULT_LOADING_TEXT = "Loading…" as const;

const LOADING_OPTION = Symbol();

const BranchPathIcon = forwardRef<SVGSVGElement, SvgIconProps>(
  (props: SvgIconProps, ref) => (
    <SvgIcon
      style={useMemo(
        () => ({
          ...(props.style || {}),
          cursor: "default",
        }),
        [props.style]
      )}
      ref={ref}
      {...props}
    >
      <path d="M20 9C18.69 9 17.58 9.83 17.17 11H14.82C14.4 9.84 13.3 9 12 9S9.6 9.84 9.18 11H6.83C6.42 9.83 5.31 9 4 9C2.34 9 1 10.34 1 12S2.34 15 4 15C5.31 15 6.42 14.17 6.83 13H9.18C9.6 14.16 10.7 15 12 15S14.4 14.16 14.82 13H17.17C17.58 14.17 18.69 15 20 15C21.66 15 23 13.66 23 12S21.66 9 20 9" />
    </SvgIcon>
  )
);

const branchPathToStr = function <TBranchOption>(
  branchPath: BranchOption<TBranchOption>[],
  getOptionLabel: (option: BranchOption<TBranchOption>) => string
): string {
  return branchPath.reduce((pathStr, branch) => {
    return `${pathStr}${pathStr ? " > " : ""}${getOptionLabel(branch)}`;
  }, "");
};

export const mergeInputStartAdornment = (
  action: "append" | "prepend",
  adornment: React.ReactNode,
  inputProps: InputProps
): InputProps => ({
  ...inputProps,
  startAdornment: (() => {
    if (inputProps.startAdornment) {
      return action === "append" ? (
        <Fragment>
          {inputProps.startAdornment}
          {adornment}
        </Fragment>
      ) : (
        <Fragment>
          {adornment}
          {inputProps.startAdornment}
        </Fragment>
      );
    } else {
      return adornment;
    }
  })(),
});

export const mergeInputEndAdornment = (
  action: "append" | "prepend",
  adornment: React.ReactNode,
  inputProps: InputProps
): InputProps => ({
  ...inputProps,
  endAdornment: (() => {
    if (inputProps.endAdornment) {
      return action === "append" ? (
        <Fragment>
          {inputProps.endAdornment}
          {adornment}
        </Fragment>
      ) : (
        <Fragment>
          {adornment}
          {inputProps.endAdornment}
        </Fragment>
      );
    } else {
      return adornment;
    }
  })(),
});

/**
 * Renders a TextField
 */
export const defaultInput = (
  params: TextFieldProps | AutocompleteRenderInputParams
): JSX.Element => <TextField {...params} />;

export type BranchSelectReason =
  | Extract<AutocompleteChangeReason, "select-option">
  | Extract<AutocompleteCloseReason, "escape">;

export type BranchSelectDirection = "up" | "down";

export type FreeSoloValueMapping<
  FreeSolo extends boolean | undefined,
  TBranchOption
> = FreeSolo extends true ? FreeSoloValue<TBranchOption> : never;

export type TreeSelectProps<
  T,
  TBranchOption,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> =
  //T and Option
  Pick<
    AutocompleteProps<
      | T
      | Option<T, TBranchOption>
      | FreeSoloValueMapping<FreeSolo, TBranchOption>,
      Multiple,
      DisableClearable,
      false
    >,
    "defaultValue"
  > &
    // Option and FreeSoloValue
    Pick<
      AutocompleteProps<
        | Option<T, TBranchOption>
        | FreeSoloValueMapping<FreeSolo, TBranchOption>,
        Multiple,
        DisableClearable,
        false
      >,
      "onChange" | "renderTags"
    > &
    // T, Option and FreeSoloValue
    Pick<
      AutocompleteProps<
        | T
        | Option<T, TBranchOption>
        | FreeSoloValueMapping<FreeSolo, TBranchOption>,
        Multiple,
        DisableClearable,
        false
      >,
      "value"
    > &
    // Option and BranchOptions
    Pick<
      AutocompleteProps<
        Option<T, TBranchOption> | BranchOption<TBranchOption>,
        Multiple,
        DisableClearable,
        false
      >,
      "onHighlightChange"
    > &
    // T, BranchOptions
    Pick<
      AutocompleteProps<
        T | BranchOption<TBranchOption>,
        Multiple,
        DisableClearable,
        false
      >,
      "options"
    > &
    // Option, FreeSoloValue, and BranchOptions
    /* Pick<
    AutocompleteProps<
      | Option<T, TBranchOption>
      | FreeSoloValueMapping<FreeSolo, TBranchOption>
      | BranchOption<TBranchOption>,
      Multiple,
      DisableClearable,
      false
    >,
    "getOptionLabel"
  >  & */
    // Rest AutocompleteProps and Omits
    Omit<
      AutocompleteProps<unknown, Multiple, DisableClearable, false>,
      // Omit above Pick's
      | "defaultValue"
      | "filterOptions"
      | "options"
      | "onChange"
      | "onHighlightChange"
      | "renderTags"
      | "value"

      // Omits
      | "filterOptions"
      | "freeSolo"
      | "getOptionDisabled"
      | "getOptionLabel"
      | "getOptionSelected"
      | "groupBy"
      | "loadingText"
      | "noOptionsText"
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
        option: Option<T, TBranchOption> | BranchOption<TBranchOption>,
        state: FilterOptionsState<
          Option<T, TBranchOption> | BranchOption<TBranchOption>
        >
      ) => boolean;
      freeSolo?: FreeSolo;
      getOptionLabel?: (
        option:
          | T
          | BranchOption<TBranchOption>
          | FreeSoloValueMapping<FreeSolo, TBranchOption>,
        branchPath?: BranchOption<TBranchOption>[]
      ) => string;
      getOptionDisabled?: (
        option: T | BranchOption<TBranchOption>,
        branchPath?: BranchOption<TBranchOption>[]
      ) => boolean;
      getOptionSelected?: (
        option: T,
        value: T,
        branchPath?: {
          option: BranchOption<TBranchOption>[];
          value: BranchOption<TBranchOption>[];
        }
      ) => boolean;
      groupBy?: (
        option: T | BranchOption<TBranchOption>,
        branchPath?: BranchOption<TBranchOption>[]
      ) => string;
      loadingText?: string;
      noOptionsText?: string;
      onBranchChange: (
        event: React.ChangeEvent<Record<string, unknown>>,
        branchOption: BranchOption<TBranchOption> | undefined,
        branchPath: BranchOption<TBranchOption>[],
        direction: BranchSelectDirection,
        reason: BranchSelectReason
      ) => void | Promise<void>;
      renderInput?: (
        params: AutocompleteRenderInputParams | TextFieldProps
      ) => JSX.Element;
      renderOption?: (
        option: Option<T, TBranchOption> | BranchOption<TBranchOption>,
        state: AutocompleteRenderOptionState & {
          getOptionLabel: (
            option: Option<T, TBranchOption> | BranchOption<TBranchOption>
          ) => string;
        }
      ) => ReactNode;
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
  props: TreeSelectProps<
    T,
    TBranchOption,
    Multiple,
    DisableClearable,
    FreeSolo
  >,
  ref: React.ForwardedRef<unknown>
): JSX.Element => {
  type TOption =
    | BranchOption<TBranchOption>
    | Option<T, TBranchOption>
    | typeof LOADING_OPTION;

  type TValue = Value<
    Option<T, TBranchOption> | FreeSoloValueMapping<FreeSolo, TBranchOption>,
    Multiple,
    DisableClearable,
    false
  >;

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
    groupBy: groupByProp,
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
    /**
     * Renders a TextField
     */
    renderInput: renderInputProp = defaultInput,
    renderOption: renderOptionProp,
    renderTags: renderTagsProp,
    value: valuePropRaw,
    upBranchOnEsc,
    ...rest
  } = props;

  const valueProp = useMemo(
    () =>
      !valuePropRaw ||
      valuePropRaw instanceof Option ||
      valuePropRaw instanceof FreeSoloValue
        ? valuePropRaw
        : new Option(valuePropRaw),

    [valuePropRaw]
  );

  const isBranchPathControlled = branchPathProp !== undefined;
  const isInputControlled = inputValueProp !== undefined;
  const isValueControlled = valueProp !== undefined;

  const autoCompleteProps = rest as Omit<
    AutocompleteProps<unknown, Multiple, DisableClearable, FreeSolo>,
    "defaultValue"
  >;

  const [state, setState] = useState<TreeSelectState>(() => ({
    branchPath: [],
    inputValue: (() => {
      if (!multiple && !isInputControlled) {
        if ((valueProp ?? NULLISH) !== NULLISH) {
          const value = valueProp as NonNullable<
            TreeSelectProps<T, TBranchOption, false, true, false>["value"]
          >;

          if (getOptionLabelProp) {
            if (value instanceof Option) {
              return getOptionLabelProp(value.valueOf(), value.branchPath);
            } else if (value instanceof FreeSoloValue) {
              return getOptionLabelProp(value, value.branchPath);
            } else {
              return getOptionLabelProp(value);
            }
          } else {
            return convertToString(value);
          }
        } else if ((defaultValue ?? NULLISH) !== NULLISH) {
          const value = valueProp as NonNullable<
            TreeSelectProps<
              T,
              TBranchOption,
              false,
              true,
              false
            >["defaultValue"]
          >;

          if (getOptionLabelProp) {
            if (value instanceof Option) {
              return getOptionLabelProp(value.valueOf(), value.branchPath);
            } else if (value instanceof FreeSoloValue) {
              return getOptionLabelProp(value, value.branchPath);
            } else {
              return getOptionLabelProp(value);
            }
          } else {
            return convertToString(value);
          }
        }
      }
      return "";
    })(),
    open: false,
    value: (() => {
      if (isValueControlled || defaultValue === undefined) {
        return multiple ? [] : null;
      } else if (multiple) {
        return (defaultValue as (
          | T
          | Option<T, TBranchOption>
        )[]).map((defaultValue) =>
          defaultValue instanceof Option
            ? defaultValue
            : new Option<T, TBranchOption>(defaultValue as T)
        );
      } else if (defaultValue === null) {
        return null;
      } else {
        return defaultValue instanceof Option
          ? defaultValue
          : new Option<T, TBranchOption>(defaultValue as T);
      }
    })() as TValue,
  }));

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
        if (option instanceof Option) {
          return getOptionDisabledProp(option.valueOf(), option.branchPath);
        } else if (option instanceof FreeSoloValue) {
          return getOptionDisabledProp(option, option.branchPath);
        } else {
          return getOptionDisabledProp(option, branchPath);
        }
      } else {
        return false;
      }
    },
    [getOptionDisabledProp, loading, branchPath]
  );

  const getOptionLabel = useCallback<
    (option: TOption | FreeSoloValueMapping<FreeSolo, TBranchOption>) => string
  >(
    (
      option: TOption | FreeSoloValueMapping<FreeSolo, TBranchOption>
    ): string => {
      if (option === LOADING_OPTION) {
        return loadingText;
      } else if (getOptionLabelProp) {
        if (option instanceof Option) {
          return getOptionLabelProp(option.valueOf(), option.branchPath);
        } else if (option instanceof FreeSoloValue) {
          return getOptionLabelProp(option, option.branchPath);
        } else {
          return getOptionLabelProp(option, branchPath);
        }
      } else {
        return convertToString(option);
      }
    },
    [getOptionLabelProp, loadingText, branchPath]
  );

  const getOptionSelected = useCallback<
    (
      option: TOption,
      value: Option<T, TBranchOption> | FreeSoloValue
    ) => boolean
  >(
    (option: TOption, value: Option<T, TBranchOption> | FreeSoloValue) => {
      // An Value is NEVER a FreeSoloValue (sanity); BranchOption and
      // LOADING_OPTION are NEVER selectable.
      if (
        value instanceof FreeSoloValue ||
        option instanceof BranchOption ||
        option === LOADING_OPTION
      ) {
        return false;
      } else if (getOptionSelectedProp) {
        return getOptionSelectedProp(option.valueOf(), value.valueOf(), {
          option: option.branchPath,
          value: value.branchPath,
        });
      } else {
        return option.valueOf() === value.valueOf();
      }
    },
    [getOptionSelectedProp]
  );

  const groupBy = useMemo<((option: TOption) => string) | undefined>(() => {
    if (!groupByProp) {
      return undefined;
    }

    return (option) => {
      if (option === LOADING_OPTION) {
        return "";
      } else if (option instanceof Option) {
        return groupByProp(option.valueOf(), option.branchPath);
      } else {
        return groupByProp(option, branchPath);
      }
    };
  }, [groupByProp, branchPath]);

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
          options: (Option<T, TBranchOption> | BranchOption<TBranchOption>)[],
          state: FilterOptionsState<
            Option<T, TBranchOption> | BranchOption<TBranchOption>
          >
        ) => {
          const newState = {
            ...state,
            getOptionLabel: (
              option: Option<T, TBranchOption> | BranchOption<TBranchOption>
            ) => state.getOptionLabel(option),
          };

          return options.filter((option) =>
            filterOptionsProp(option, newState)
          );
        }
      : createFilterOptions<
          Option<T, TBranchOption> | BranchOption<TBranchOption>
        >({
          stringify: getOptionLabel,
        });

    // Parent BranchOption and LOADING_OPTION are NEVER filtered
    return (
      options: TOption[],
      filterOptionsState: FilterOptionsState<
        Option<T, TBranchOption> | BranchOption<TBranchOption>
      >
    ) => {
      const [staticOpts, filteredOpts] = options.reduce(
        (opts, opt) => {
          const [staticOpts, filteredOpts] = opts;

          // LOADING_OPTION is NEVER filtered
          if (opt === LOADING_OPTION) {
            staticOpts.push(opt);
          } else if (opt instanceof BranchOption) {
            // Parent BranchOption are NEVER filtered
            if (branchPath.includes(opt)) {
              staticOpts.push(opt);
            } else {
              filteredOpts.push(opt);
            }
          } else {
            filteredOpts.push(opt);
          }

          return opts;
        },
        [[], []] as [
          (BranchOption<TBranchOption> | typeof LOADING_OPTION)[],
          (Option<T, TBranchOption> | BranchOption<TBranchOption>)[]
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

  const renderInput = useCallback<NonNullable<typeof props.renderInput>>(
    (params) => {
      if (
        multiple ||
        !value ||
        !(value instanceof Option || value instanceof FreeSoloValue) ||
        !value.branchPath.length ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getOptionLabel(value as any) !== (params?.inputProps as any)?.value
      ) {
        return renderInputProp(params);
      } else {
        return renderInputProp({
          ...params,
          InputProps: mergeInputStartAdornment(
            "prepend",
            <Tooltip
              title={branchPathToStr<TBranchOption>(
                (value as
                  | Option<T, TBranchOption>
                  | FreeSoloValueMapping<FreeSolo, TBranchOption>).branchPath,
                getOptionLabel
              )}
            >
              <BranchPathIcon fontSize="small" />
            </Tooltip>,
            params.InputProps || {}
          ),
        });
      }
    },
    [renderInputProp, multiple, value, getOptionLabel]
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
    (option, state) => {
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
                title={branchPathToStr<TBranchOption>(
                  branchPath,
                  getOptionLabel
                )}
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
        const renderOptionResult =
          renderOptionProp?.call(null, option, {
            ...state,
            getOptionLabel,
          }) || getOptionLabel(option);
        return (
          <Box width="100%" display="flex">
            <Box flexGrow="1" clone>
              {typeof renderOptionResult === "string" ? (
                <Typography
                  variant="inherit"
                  color="inherit"
                  align="left"
                  noWrap
                >
                  {renderOptionResult}
                </Typography>
              ) : (
                renderOptionResult
              )}
            </Box>
            <Tooltip title={enterBranchText}>
              <ChevronRightIcon />
            </Tooltip>
          </Box>
        );
      } else {
        const renderOptionResult =
          renderOptionProp?.call(null, option, {
            ...state,
            getOptionLabel,
          }) || getOptionLabel(option);

        return typeof renderOptionResult === "string" ? (
          <Typography variant="inherit" color="inherit" align="left" noWrap>
            {renderOptionResult}
          </Typography>
        ) : (
          renderOptionResult
        );
      }
    },
    [
      renderOptionProp,
      getOptionLabel,
      classes.optionNode,
      branchPath,
      loading,
      enterBranchText,
      exitBranchText,
    ]
  );

  const renderTags = useCallback<
    NonNullable<
      AutocompleteProps<
        | Option<T, TBranchOption>
        | FreeSoloValueMapping<FreeSolo, TBranchOption>,
        Multiple,
        DisableClearable,
        FreeSolo
      >["renderTags"]
    >
  >(
    (value, getTagProps) => {
      if (renderTagsProp) {
        return renderTagsProp(value, getTagProps);
      } else {
        return value.map((option, index) => {
          if (option.branchPath.length) {
            const { key, ...chipProps } = getTagProps({ index }) as {
              key: React.Key;
            } & ChipProps;
            return (
              <Tooltip
                key={key}
                title={branchPathToStr<TBranchOption>(
                  option.branchPath,
                  getOptionLabel
                )}
              >
                <Chip label={getOptionLabel(option)} {...chipProps} />
              </Tooltip>
            );
          } else {
            return (
              <Chip
                key={index}
                label={getOptionLabel(option)}
                {...getTagProps({ index })}
              />
            );
          }
        });
      }
    },
    [renderTagsProp, getOptionLabel]
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
                  ? new Option(value.valueOf(), branchPath)
                  : new FreeSoloValue(value, branchPath);

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
                    parsedValue as
                      | TOption
                      | FreeSoloValueMapping<FreeSolo, TBranchOption>
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
                value as FreeSoloValueMapping<FreeSolo, TBranchOption> | TOption
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
          option instanceof BranchOption
            ? option
            : new Option(option, branchPath)
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
      ref={ref}
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
      groupBy={groupBy}
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
      renderTags={renderTags as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value={value as any}
    />
  );
};
export default React.forwardRef(TreeSelect);
