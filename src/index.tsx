import React, {
  useCallback,
  ReactNode,
  forwardRef,
  Fragment,
  ForwardedRef,
} from "react";
import Autocomplete, {
  AutocompleteChangeReason,
  AutocompleteProps,
  AutocompleteRenderInputParams,
} from "@material-ui/lab/Autocomplete";
import { createFilterOptions, Value } from "@material-ui/lab/useAutocomplete";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useControlled from "@material-ui/core/utils/useControlled";
import { useRef } from "react";
import { useMemo } from "react";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Paper, { PaperProps } from "@material-ui/core/Paper";
import Chip, { ChipProps } from "@material-ui/core/Chip";
import { InputProps } from "@material-ui/core/Input";
import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { useEffect } from "react";

// https://stackoverflow.com/a/58473012
declare module "react" {
  // eslint-disable-next-line @typescript-eslint/ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export type PathDirection = "up" | "down";

abstract class BaseNode<T> {
  #_value_: T;
  constructor(value: T) {
    this.#_value_ = value;
  }

  toString(): string {
    return String(this.#_value_);
  }

  valueOf(): T {
    return this.#_value_;
  }

  get [Symbol.toStringTag](): string {
    return this.constructor.name;
  }
}

export class BranchNode<TBranch> extends BaseNode<TBranch> {
  #_parent_: BranchNode<TBranch> | null;
  constructor(branch: TBranch);
  constructor(branch: TBranch, parent: BranchNode<TBranch>);
  constructor(branch: TBranch, branchPath: Iterable<TBranch>);
  constructor(
    branch: TBranch,
    parent?: Iterable<TBranch> | BranchNode<TBranch> | null
  );
  constructor(
    branch: TBranch,
    parent: Iterable<TBranch> | BranchNode<TBranch> | null = null
  ) {
    super(branch);

    if (parent === null || parent instanceof BranchNode) {
      this.#_parent_ = parent;
    } else {
      this.#_parent_ = BranchNode.createBranchNode(parent);
    }
  }

  /**
   * Parent BranchNode
   */
  get parent(): BranchNode<TBranch> | null {
    return this.#_parent_;
  }

  /**
   * Iterates up the branch path starting with self.
   */
  *up(): IterableIterator<BranchNode<TBranch>> {
    yield this;
    let _parent = this.#_parent_;
    while (_parent) {
      yield _parent;
      _parent = _parent.parent;
    }
  }

  /**
   * Iterates down the branch path finishing with self.
   * @alias BranchNode.[Symbol.iterator]
   */
  *down(): IterableIterator<BranchNode<TBranch>> {
    yield* this;
  }

  /**
   * Iterates down the branch path finishing with self.
   */
  *[Symbol.iterator](): IterableIterator<BranchNode<TBranch>> {
    if (this.#_parent_) {
      yield* this.#_parent_;
    }
    yield this;
  }

  /**
   * @param branchPath must iterate from the root "down" the branch path. Wraps
   * the last branch option in the returned {@link BranchNode}.
   */
  static createBranchNode<T>(branchPath: Iterable<T>): BranchNode<T> {
    let branchNode: BranchNode<T> | null = null;
    for (const branch of branchPath) {
      branchNode = new BranchNode(branch, branchNode);
    }

    return branchNode as BranchNode<T>;
  }

  static pathToString<T>(
    branchNode: BranchNode<T>,
    {
      branchToSting = (branchNode) => branchNode.toString(),
      delimiter = " > ",
    }: {
      branchToSting?: (branchNode: BranchNode<T>) => string;
      delimiter?: string;
    } = {}
  ): string {
    const iter = branchNode.down();
    let iterResult = iter.next();

    if (iterResult.done) {
      return "";
    }

    let pathStr = branchToSting(iterResult.value);
    iterResult = iter.next();
    while (!iterResult.done) {
      pathStr = pathStr + delimiter + branchToSting(iterResult.value);
      iterResult = iter.next();
    }

    return pathStr;
  }
}

/**
 *  Wrapper for all options and values. Includes the branch path to the option.
 */
export class ValueNode<T, TBranch> extends BaseNode<T> {
  #_parent_: BranchNode<TBranch> | null;
  constructor(value: T);
  constructor(value: T, parent: BranchNode<TBranch>);
  constructor(value: T, branchPath: Iterable<TBranch>);
  constructor(value: T, parent: Iterable<TBranch> | BranchNode<TBranch> | null);
  constructor(
    value: T,
    parent: Iterable<TBranch> | BranchNode<TBranch> | null = null
  ) {
    super(value);

    if (parent === null || parent instanceof BranchNode) {
      this.#_parent_ = parent;
    } else {
      this.#_parent_ = BranchNode.createBranchNode(parent);
    }
  }

  /**
   * Parent BranchNode
   */
  get parent(): BranchNode<TBranch> | null {
    return this.#_parent_;
  }

  /**
   * Iterates up the branch path starting with {@link ValueNode.parent}.
   */
  *up(): IterableIterator<BranchNode<TBranch>> {
    if (this.#_parent_) {
      yield* this.#_parent_.up();
    }
  }

  /**
   * Iterates down the branch path finishing with {@link ValueNode.parent}.
   */
  *down(): IterableIterator<BranchNode<TBranch>> {
    if (this.#_parent_) {
      yield* this.#_parent_.down();
    }
  }

  /**
   * Iterates down the branch path finishing with {@link ValueNode.parent}.
   */
  *[Symbol.iterator](): IterableIterator<BranchNode<TBranch>> {
    if (this.#_parent_) {
      yield* this.#_parent_;
    }
  }
}

/**
 * Used to tie free solo entries to the tree.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FreeSoloNode<TBranch = any> extends ValueNode<string, TBranch> {}

export type BranchSelectReason = Extract<
  AutocompleteChangeReason,
  "select-option"
>;

export type FreeSoloValueMapping<
  FreeSolo extends boolean | undefined,
  TBranch
> = FreeSolo extends true ? FreeSoloNode<TBranch> : never;

export type TreeSelectValue<
  T,
  TBranch,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> = Value<
  ValueNode<T, TBranch> | FreeSoloValueMapping<FreeSolo, TBranch>,
  Multiple,
  DisableClearable,
  false
>;

export type TreeSelectProps<
  T,
  TBranch,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> =
  // ValueNode and FreeSoloNode
  Pick<
    AutocompleteProps<
      ValueNode<T, TBranch> | FreeSoloValueMapping<FreeSolo, TBranch>,
      Multiple,
      DisableClearable,
      false
    >,
    "value" | "onChange" | "renderTags"
  > &
    // ValueNode
    Pick<
      AutocompleteProps<
        ValueNode<T, TBranch> | FreeSoloValueMapping<FreeSolo, TBranch>,
        Multiple,
        DisableClearable,
        false
      >,
      "getOptionSelected" | "defaultValue"
    > &
    // ValueNode, BranchNode and FreeSoloNode
    Pick<
      AutocompleteProps<
        | ValueNode<T, TBranch>
        | BranchNode<TBranch>
        | FreeSoloValueMapping<FreeSolo, TBranch>,
        Multiple,
        DisableClearable,
        false
      >,
      "getOptionLabel"
    > &
    // ValueNode and BranchNode
    Pick<
      AutocompleteProps<
        ValueNode<T, TBranch> | BranchNode<TBranch>,
        Multiple,
        DisableClearable,
        false
      >,
      | "filterOptions"
      | "onHighlightChange"
      | "renderOption"
      | "getOptionDisabled"
      | "groupBy"
    > &
    // T, BranchNode
    Pick<
      AutocompleteProps<
        T | BranchNode<TBranch>,
        Multiple,
        DisableClearable,
        false
      >,
      "options"
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
      | "options"
      | "onChange"
      | "onHighlightChange"
      | "renderOption"
      | "renderTags"
      | "value"

      // Omits
      | "freeSolo"
      | "renderInput"
    > & {
      branch?: BranchNode<TBranch> | null;
      enterBranchText?: string;
      exitBranchText?: string;
      freeSolo?: FreeSolo;
      onBranchChange: (
        event: React.ChangeEvent<Record<string, unknown>>,
        branch: BranchNode<TBranch> | null,
        direction: PathDirection,
        reason: BranchSelectReason
      ) => void | Promise<void>;
      renderInput?: (
        params: AutocompleteRenderInputParams | TextFieldProps
      ) => JSX.Element;
    };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultGetOptionLabel = (option: any): string => String(option);

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

export const mergeInputStartAdornment = (
  action: "append" | "prepend",
  adornment: ReactNode,
  inputProps: InputProps = {}
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
  inputProps: InputProps = {}
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

export const useTreeSelectStyles = makeStyles({
  listBox: {
    "& > .MuiAutocomplete-option": {
      margin: "0px !important",
      padding: "0px !important",
    },
  },
});

const useDefaultOptionStyles = makeStyles({
  optionItemContainer: {
    width: "100%",
  },
  upBranchIcon: {
    marginLeft: "-8px",
    marginRight: "24px",
  },
  downBranchIcon: {
    marginLeft: "16px",
  },
  optionItem: {
    width: "100%",
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultFilterOptions = createFilterOptions<any>();

export const DefaultOption = <T, TBranch>(props: {
  option: ValueNode<T, TBranch> | BranchNode<TBranch>;
  curBranch: BranchNode<TBranch> | null;
  exitBranchText?: string;
  enterBranchText?: string;
  getOptionLabel: (
    option: ValueNode<T, TBranch> | BranchNode<TBranch>
  ) => string;
  renderOption?: (
    option: ValueNode<T, TBranch> | BranchNode<TBranch>
  ) => ReactNode;
}): JSX.Element => {
  const classes = useDefaultOptionStyles();

  const {
    option,
    curBranch,
    exitBranchText = "Exit",
    enterBranchText = "Enter",
    getOptionLabel,
  } = props;

  const renderOption = props.renderOption || getOptionLabel;

  const isBranch = option instanceof BranchNode;
  const isUpBranch = isBranch && curBranch === option;

  const optionNode = renderOption(option);
  const optionNodeIsStr = typeof optionNode === "string";

  const optionDiv = (
    <div className={`MuiAutocomplete-option ${classes.optionItemContainer}`}>
      {isUpBranch ? (
        <Fragment>
          <Tooltip title={exitBranchText}>
            <ChevronLeftIcon className={classes.upBranchIcon} />
          </Tooltip>
          <Tooltip
            title={BranchNode.pathToString(option as BranchNode<TBranch>, {
              branchToSting: getOptionLabel,
            })}
          >
            {optionNodeIsStr ? (
              <Typography
                component="div"
                variant="inherit"
                color="inherit"
                align="left"
                noWrap
              >
                {optionNode as string}
              </Typography>
            ) : (
              <div>{optionNode}</div>
            )}
          </Tooltip>
        </Fragment>
      ) : (
        <Fragment>
          {optionNodeIsStr ? (
            <Typography
              className={classes.optionItem}
              component="div"
              variant="inherit"
              color="inherit"
              align="left"
              noWrap
            >
              {optionNode as string}
            </Typography>
          ) : (
            <div className={classes.optionItem}>{optionNode}</div>
          )}

          {isBranch && (
            <Tooltip title={enterBranchText}>
              <ChevronRightIcon className={classes.downBranchIcon} />
            </Tooltip>
          )}
        </Fragment>
      )}
    </div>
  );

  return isUpBranch ? (
    <div className={classes.optionItemContainer}>
      {optionDiv}
      <Divider />
    </div>
  ) : (
    optionDiv
  );
};

/**
 * Renders a TextField
 */
export const defaultInput = (
  params: TextFieldProps | AutocompleteRenderInputParams
): JSX.Element => <TextField {...params} />;

export default forwardRef(function TreeSelect<
  T,
  TBranch,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
>(
  props: TreeSelectProps<T, TBranch, Multiple, DisableClearable, FreeSolo>,

  ref: ForwardedRef<unknown>
) {
  type Props = TreeSelectProps<
    T,
    TBranch,
    Multiple,
    DisableClearable,
    FreeSolo
  >;

  const classes = useTreeSelectStyles();

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const {
    defaultValue = (props.multiple ? [] : null) as typeof valueProp,
    inputValue: inputValueProp,
    value: valueProp,
    branch: branchProp,
    onChange,
    onInputChange,
    onBranchChange,
    options: optionsProp,
    renderOption: renderOptionProp,
    ListboxProps: ListboxPropsProp,
    getOptionLabel = defaultGetOptionLabel,
    renderInput: renderInputProp = defaultInput,
    enterBranchText,
    exitBranchText,
    onClose,
    onOpen,
    open: openProp,
    filterOptions: filterOptionsProp = defaultFilterOptions,
    PaperComponent: PaperComponentProp = Paper,
    loadingText = "Loading…",
    noOptionsText = "No options",
    renderTags: renderTagsProp,
    onBlur: onBlurProp,
    ...rest
  } = props;

  const [value, setValue] = useControlled({
    controlled: valueProp,
    default: defaultValue,
    name: "TreeSelect",
    state: "value",
  });

  const [inputValue, setInputValue] = useControlled({
    controlled: inputValueProp,
    default: "",
    name: "TreeSelect",
    state: "inputValue",
  });

  const [branch, setBranch] = useControlled({
    controlled: branchProp,
    default: null,
    name: "TreeSelect",
    state: "branch",
  });

  const [open, setOpen] = useControlled({
    controlled: openProp,
    default: false,
    name: "TreeSelect",
    state: "open",
  });

  const inputValueOnBranchSelect = useRef<"clear" | "abort" | "continue">(
    "continue"
  );

  const handleChange = useCallback<
    // Assume the MOST permissable typing
    NonNullable<
      AutocompleteProps<
        ValueNode<T, TBranch> | BranchNode<TBranch>,
        Multiple,
        false,
        true
      >["onChange"]
    >
  >(
    (event, valueRaw, reason, ...rest) => {
      type TValueMultiple = Value<
        ValueNode<T, TBranch> | BranchNode<TBranch>,
        true,
        false,
        true
      >;

      const newValue = props.multiple
        ? (valueRaw as TValueMultiple)[(valueRaw as TValueMultiple).length - 1]
        : (valueRaw as Value<
            ValueNode<T, TBranch> | BranchNode<TBranch>,
            false,
            false,
            true
          >);

      if (newValue instanceof BranchNode) {
        if (!props.multiple && value) {
          inputValueOnBranchSelect.current = "abort";
        } else {
          inputValueOnBranchSelect.current = "clear";
        }

        const [newBranch, direction]: [
          BranchNode<TBranch> | null,
          PathDirection
        ] = newValue === branch ? [newValue.parent, "up"] : [newValue, "down"];

        setBranch(newBranch);

        if (onBranchChange) {
          onBranchChange(event, newBranch, direction, "select-option");
        }
      } else {
        // If value is freeSolo convert to FreeSoloNode
        const newValueParsed =
          typeof newValue === "string"
            ? new FreeSoloNode(newValue as string, branch)
            : newValue;

        const value = props.multiple
          ? (((valueRaw as TValueMultiple).length
              ? [...(valueRaw as TValueMultiple).slice(0, -1), newValueParsed]
              : valueRaw) as TreeSelectValue<
              T,
              TBranch,
              true,
              DisableClearable,
              true
            >)
          : newValueParsed;

        setValue(
          value as TreeSelectValue<
            T,
            TBranch,
            Multiple,
            DisableClearable,
            FreeSolo
          >
        );

        if (onChange) {
          onChange(
            event,
            value as TreeSelectValue<
              T,
              TBranch,
              Multiple,
              DisableClearable,
              FreeSolo
            >,
            reason,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(rest as any[])
          );
        }

        if (reason === "select-option" && !props.disableCloseOnSelect) {
          setOpen(false);

          if (onClose) {
            onClose(event, "select-option");
          }
        }
      }
    },
    [
      props.multiple,
      props.disableCloseOnSelect,
      branch,
      setBranch,
      onBranchChange,
      setValue,
      onChange,
      setOpen,
      onClose,
      value,
    ]
  );

  const handleInputChange = useCallback<NonNullable<Props["onInputChange"]>>(
    (event, inputValue, reason) =>
      setTimeout(() => {
        // This timeout reverses the call order of onInputChange and onChange
        // in the underlying Autocomplete.  ONLY run if mounted.
        if (!isMounted.current) {
          return;
        }

        if (inputValueOnBranchSelect.current === "abort") {
          inputValueOnBranchSelect.current = "continue";
        } else if (inputValueOnBranchSelect.current === "clear") {
          inputValueOnBranchSelect.current = "continue";

          setInputValue("");

          if (onInputChange) {
            onInputChange(event, "", reason);
          }
        } else {
          setInputValue(inputValue);

          if (onInputChange) {
            onInputChange(event, inputValue, reason);
          }
        }
      }, 0),
    [onInputChange, setInputValue]
  );

  const handleClose = useCallback<NonNullable<Props["onClose"]>>(
    (event, reason) => {
      if (reason === "select-option") {
        return;
      }
      setOpen(false);
      if (onClose) {
        onClose(event, reason);
      }
    },
    [onClose, setOpen]
  );

  const handleOpen = useCallback<NonNullable<Props["onOpen"]>>(
    (...args) => {
      setOpen(true);
      if (onOpen) {
        onOpen(...args);
      }
    },
    [onOpen, setOpen]
  );

  const options = useMemo(
    () =>
      (props.loading ? [] : optionsProp).reduce((options, option) => {
        options.push(
          option instanceof BranchNode ? option : new ValueNode(option, branch)
        );
        return options;
      }, (branch ? [branch] : []) as (BranchNode<TBranch> | ValueNode<T, TBranch>)[]),
    [props.loading, optionsProp, branch]
  );

  const renderOption = useCallback<NonNullable<Props["renderOption"]>>(
    (option, ...rest) => {
      if (renderOptionProp) {
        return renderOptionProp(option, ...rest);
      } else {
        return (
          <DefaultOption
            option={option}
            curBranch={branch}
            exitBranchText={exitBranchText}
            enterBranchText={enterBranchText}
            getOptionLabel={getOptionLabel}
          />
        );
      }
    },
    [renderOptionProp, branch, exitBranchText, getOptionLabel, enterBranchText]
  );

  const renderTags = useCallback<NonNullable<Props["renderTags"]>>(
    (value, getTagProps) => {
      if (renderTagsProp) {
        return renderTagsProp(value, getTagProps);
      } else {
        return value.map((option, index) => {
          if (option.parent) {
            const { key, ...chipProps } = getTagProps({ index }) as {
              key: React.Key;
            } & ChipProps;
            return (
              <Tooltip
                key={key}
                title={BranchNode.pathToString(option.parent, {
                  branchToSting: getOptionLabel,
                })}
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

  const renderInput = useCallback<NonNullable<Props["renderInput"]>>(
    (params) => {
      if (
        props.multiple ||
        !(value as TreeSelectValue<T, TBranch, false, false, true>)?.parent ||
        getOptionLabel(
          value as TreeSelectValue<T, TBranch, false, true, FreeSolo>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) !== (params?.inputProps as any)?.value
      ) {
        return renderInputProp(params);
      } else {
        return renderInputProp({
          ...params,
          InputProps: mergeInputStartAdornment(
            "prepend",
            <Tooltip
              title={BranchNode.pathToString(
                (value as TreeSelectValue<T, TBranch, false, true, true>)
                  .parent as NonNullable<
                  TreeSelectValue<T, TBranch, false, true, true>["parent"]
                >,
                {
                  branchToSting: getOptionLabel,
                }
              )}
            >
              <BranchPathIcon fontSize="small" />
            </Tooltip>,
            params.InputProps
          ),
        });
      }
    },
    [getOptionLabel, props.multiple, renderInputProp, value]
  );

  const noOptions = useRef<boolean>(!options.length);
  const filterOptions = useCallback<NonNullable<Props["filterOptions"]>>(
    (options, state) => {
      const filteredOptions =
        options[0] === branch
          ? [options[0], ...filterOptionsProp(options.slice(1), state)]
          : filterOptionsProp(options, state);

      noOptions.current =
        filteredOptions.length === 0 ||
        (filteredOptions.length === 1 && options[0] === branch);

      return filteredOptions;
    },
    [filterOptionsProp, branch]
  );

  const handleBlur = useCallback<NonNullable<Props["onBlur"]>>(
    (...args) => {
      const [event] = args;

      // When freeSolo is true and autoSelect is false,  an uncommitted free solo
      // input value stays in the input field on blur, but is not set as a value.
      // NOTE: This is not the case when autoSelect is true.  This ambiguous state
      // and behavior is addressed here.  The behavior will be to clear the input.
      if (props.freeSolo && !props.autoSelect) {
        if (inputValue.trim()) {
          if (props.multiple || value === null) {
            handleInputChange(event, "", "clear");
          } else {
            handleInputChange(
              event,
              getOptionLabel(
                value as TreeSelectValue<T, TBranch, false, true, FreeSolo>
              ),
              "reset"
            );
          }
        }
      }

      if (onBlurProp) {
        onBlurProp(...args);
      }
    },
    [
      props.freeSolo,
      props.autoSelect,
      props.multiple,
      onBlurProp,
      inputValue,
      value,
      handleInputChange,
      getOptionLabel,
    ]
  );

  const ListBoxProps = useMemo<NonNullable<Props["ListboxProps"]>>(() => {
    return {
      className: `MuiAutocomplete-listbox ${classes.listBox}`,
      ...(ListboxPropsProp || {}),
    };
  }, [ListboxPropsProp, classes.listBox]);

  const isRootOptions = !branch;
  const PaperComponent = useMemo(() => {
    return forwardRef(({ children = null, ...paperProps }: PaperProps, ref) => {
      return (
        <PaperComponentProp {...paperProps} ref={ref}>
          {children}
          {props.loading && !isRootOptions ? (
            <div className="MuiAutocomplete-loading">{loadingText}</div>
          ) : null}
          {!isRootOptions &&
          noOptions.current &&
          !props.freeSolo &&
          !props.loading ? (
            <div className="MuiAutocomplete-noOptions">{noOptionsText}</div>
          ) : null}
        </PaperComponentProp>
      );
    });
  }, [
    PaperComponentProp,
    isRootOptions,
    loadingText,
    noOptionsText,
    props.freeSolo,
    props.loading,
  ]);

  return (
    <Autocomplete
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(rest as any[])}
      ref={ref}
      inputValue={inputValue}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value={value as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange={handleChange as any}
      onInputChange={handleInputChange}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options={options as any}
      ListboxProps={ListBoxProps}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      renderInput={renderInput}
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      filterOptions={filterOptions}
      PaperComponent={PaperComponent}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      renderTags={renderTags as any}
      onBlur={handleBlur}
    />
  );
});
