import React, { forwardRef, useCallback, useMemo } from "react";
import {
  Autocomplete,
  AutocompleteProps,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  TooltipProps,
  Chip,
  AutocompleteRenderOptionState,
  ListItemButtonProps,
  ListItemTextProps,
  SvgIconProps,
  SvgIcon,
  styled,
  Paper,
  PaperProps,
  getAutocompleteUtilityClass,
  unstable_composeClasses as composeClasses,
  AutocompleteRenderGetTagProps,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import useTreeSelect, {
  UseTreeSelectProps,
  TreeSelectFreeSoloValueMapping,
  InternalOption,
  NodeType,
  PathDirection,
  FreeSoloNode,
} from "./useTreeSelect";

// Cloned from Autocomplete for loading and noOptions components
// https://github.com/mui/material-ui/blob/b3645b3fd11dc26a06ea370a41b5bac1026c6792/packages/mui-material/src/Autocomplete/Autocomplete.js#L27
const useUtilityClasses = (classes?: Record<string, string>) => {
  const slots = {
    loading: ["loading"],
    noOptions: ["noOptions"],
  };

  return composeClasses(slots, getAutocompleteUtilityClass, classes);
};

type NonNullableAutocompleteProp<
  Prop extends keyof AutocompleteProps<
    Node,
    Multiple,
    DisableClearable,
    FreeSolo
  >,
  Node,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
> = Required<
  AutocompleteProps<Node, Multiple, DisableClearable, FreeSolo>
>[Prop];

export interface BaseDefaultOptionsProps
  extends Omit<ListItemButtonProps<"li">, "children"> {
  ListItemTextProps: ListItemTextProps;
}

export interface UpBranchDefaultOptionsProps extends BaseDefaultOptionsProps {
  exitIcon: React.ReactNode;
  exitText: string;
  pathLabel: string;
  pathDirection: Extract<PathDirection, "up">;
  TooltipProps?: Pick<IndividualTooltipProps, "exit" | "currentPath">;
}

export interface DownBranchDefaultOptionsProps extends BaseDefaultOptionsProps {
  enterIcon: React.ReactNode;
  enterText: string;
  pathDirection: Extract<PathDirection, "down">;
  TooltipProps?: Omit<Partial<TooltipProps>, "children">;
}

/**
 * Default Option Component.
 */
export const DefaultOption = (
  props:
    | UpBranchDefaultOptionsProps
    | DownBranchDefaultOptionsProps
    | BaseDefaultOptionsProps
) => {
  const {
    pathDirection = "",
    pathLabel = "",
    enterIcon = null,
    enterText = "",
    exitIcon = null,
    exitText = "",
    TooltipProps: tooltipProps,
    ListItemTextProps: listItemTextProps,
    ...listItemButtonProps
  } = props as Omit<
    | Omit<UpBranchDefaultOptionsProps, "pathDirection">
    | Omit<DownBranchDefaultOptionsProps, "pathDirection">,
    "pathLabel" | "enterText" | "exitText"
  > &
    Partial<
      Pick<UpBranchDefaultOptionsProps, "pathLabel" | "exitIcon" | "exitText"> &
        Pick<DownBranchDefaultOptionsProps, "enterIcon" | "enterText"> &
        (
          | Pick<UpBranchDefaultOptionsProps, "pathDirection">
          | Pick<DownBranchDefaultOptionsProps, "pathDirection">
        )
    >;

  return (
    <ListItemButton {...listItemButtonProps} component="li" dense>
      {pathDirection === "up" ? (
        <>
          <Tooltip
            title={exitText}
            {...(
              tooltipProps as Pick<
                IndividualTooltipProps,
                "exit" | "currentPath"
              >
            )?.exit}
          >
            <ListItemIcon>{exitIcon}</ListItemIcon>
          </Tooltip>
          <Tooltip
            title={pathLabel}
            {...(
              tooltipProps as Pick<
                IndividualTooltipProps,
                "exit" | "currentPath"
              >
            )?.currentPath}
          >
            <ListItemText {...listItemTextProps} />
          </Tooltip>
        </>
      ) : (
        <ListItemText {...listItemTextProps} />
      )}

      {pathDirection === "down" && (
        <Tooltip
          title={enterText}
          {...(tooltipProps as Omit<Partial<TooltipProps>, "children">)}
        >
          <ListItemIcon
            sx={{
              minWidth: "auto",
            }}
          >
            {enterIcon}
          </ListItemIcon>
        </Tooltip>
      )}
    </ListItemButton>
  );
};

export interface TreeSelectRenderOptionState<
  Direction extends PathDirection = PathDirection
> extends AutocompleteRenderOptionState {
  addFreeSoloText: string;
  pathLabel: string;
  disabled: boolean;
  enterIcon: React.ReactNode;
  enterText: string;
  exitIcon: React.ReactNode;
  exitText: string;
  optionLabel: string;
  pathDirection?: Direction;
  TooltipProps?: Direction extends "up"
    ? Pick<IndividualTooltipProps, "exit" | "currentPath">
    : Omit<Partial<TooltipProps>, "children">;
}

export type RenderOption<Node, FreeSolo extends boolean | undefined> = (
  props: React.HTMLAttributes<HTMLLIElement> & { key: React.Key },
  option: Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>,
  state: TreeSelectRenderOptionState
) => React.ReactNode;

export interface RenderTagsState {
  getPathLabel: (index: number) => string;
}

/**
 * Returns props for {@link DefaultOption} from arguments of {@link RenderOption}
 */
export const getDefaultOptionProps = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: Parameters<RenderOption<any, true | false>>
):
  | UpBranchDefaultOptionsProps
  | DownBranchDefaultOptionsProps
  | BaseDefaultOptionsProps => {
  const [props, node, state] = args;

  const baseProps: BaseDefaultOptionsProps = {
    dense: true,
    divider: state.pathDirection === "up",
    ...props,
    ListItemTextProps: {
      primary: `${
        node instanceof FreeSoloNode && state.addFreeSoloText
          ? state.addFreeSoloText
          : ""
      }${state.optionLabel}`,
    },
  };

  if (state.pathDirection === "up") {
    return {
      ...baseProps,
      pathDirection: "up",
      pathLabel: state.pathLabel,
      divider: true,
      exitIcon: state.exitIcon,
      exitText: state.exitText,
      TooltipProps: state.TooltipProps,
    } as UpBranchDefaultOptionsProps;
  } else if (state.pathDirection === "down") {
    return {
      ...baseProps,
      pathDirection: "down",
      enterIcon: state.enterIcon,
      enterText: state.enterText,
      TooltipProps: state.TooltipProps,
    } as DownBranchDefaultOptionsProps;
  } else {
    return baseProps;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultRenderOption: RenderOption<any, true | false> = (...args) => (
  <DefaultOption {...getDefaultOptionProps(...args)} />
);

const defaultGetOptionKey: NonNullable<
  TreeSelectProps<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    true | false,
    true | false,
    true | false
  >["getOptionKey"]
> = (_, { key }) => key;

export const PathIcon = forwardRef<SVGSVGElement, SvgIconProps>(
  function PathIcon(props: SvgIconProps, ref) {
    return (
      <SvgIcon
        style={{
          ...props.style,
          cursor: "default",
        }}
        ref={ref}
        {...props}
      >
        <path d="M20 9C18.69 9 17.58 9.83 17.17 11H14.82C14.4 9.84 13.3 9 12 9S9.6 9.84 9.18 11H6.83C6.42 9.83 5.31 9 4 9C2.34 9 1 10.34 1 12S2.34 15 4 15C5.31 15 6.42 14.17 6.83 13H9.18C9.6 14.16 10.7 15 12 15S14.4 14.16 14.82 13H17.17C17.58 14.17 18.69 15 20 15C21.66 15 23 13.66 23 12S21.66 9 20 9" />
      </SvgIcon>
    );
  }
) as (props: SvgIconProps) => JSX.Element;

const defaultEnterIcon = <ChevronRightIcon />;
const defaultExitIcon = <ChevronLeftIcon />;

const defaultPathIcon = <PathIcon fontSize="small" />;

/**
 * Individual customize props for {@link https://mui.com/material-ui/react-tooltip | Tooltip} elements in TreeSelect.
 *
 * @property `enter` - Tooltip around the enter icon
 * @property `exit` - Tooltip around the exit icon
 * @property `currentPath` - Tooltip for current branch path.
 * @property `valuePath` - Tooltip for the selected value path or paths when `multiple === true`
 */
export interface IndividualTooltipProps {
  enter?: Omit<Partial<TooltipProps>, "children">;
  exit?: Omit<Partial<TooltipProps>, "children">;
  currentPath?: Omit<Partial<TooltipProps>, "children">;
  valuePath?: Omit<Partial<TooltipProps>, "children">;
}

// Cloned from Autocomplete
// https://github.com/mui/material-ui/blob/b3645b3fd11dc26a06ea370a41b5bac1026c6792/packages/mui-material/src/Autocomplete/Autocomplete.js#L251-L258
const AutocompleteLoading = styled("div", {
  name: "MuiAutocomplete",
  slot: "Loading",
  overridesResolver: (_, styles) => styles.loading,
})(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: "14px 16px",
}));

// Cloned from Autocomplete
// https://github.com/mui/material-ui/blob/b3645b3fd11dc26a06ea370a41b5bac1026c6792/packages/mui-material/src/Autocomplete/Autocomplete.js#L260-L267
const AutocompleteNoOptions = styled("div", {
  name: "MuiAutocomplete",
  slot: "NoOptions",
  overridesResolver: (props, styles) => styles.noOptions,
})(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: "14px 16px",
}));

export interface TreeSelectProps<
  Node,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
> extends UseTreeSelectProps<Node, Multiple, DisableClearable, FreeSolo>,
    Omit<
      AutocompleteProps<
        Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>,
        Multiple,
        DisableClearable,
        FreeSolo
      >,
      | keyof UseTreeSelectProps<Node, Multiple, DisableClearable, FreeSolo>
      | "loading"
      | "options"
      | "renderOption"
      | "renderTags"
    > {
  /**
   * Prefix option label for a adding freeSolo values.
   *
   * @default `"Add: "`
   *
   */
  addFreeSoloText?: string;

  /**
   * The icon to display in place of the default enter icon.
   *
   * @default `<ChevronRightIcon />`
   */
  enterIcon?: React.ReactNode;

  /**
   * Override the default down branch icon tooltip `title`.
   *
   * @default `"Enter"`
   */
  enterText?: string;

  /**
   * The icon to display in place of the default exit icon.
   *
   * @default `<ChevronLeftIcon />`
   */
  exitIcon?: React.ReactNode;

  /**
   * Override the default up branch icon tooltip `title`.
   *
   * @default `"Exit"`
   */
  exitText?: string;

  /**
   * Used to provided custom [`key`](https://reactjs.org/docs/lists-and-keys.html#keys) prop to rendered options.
   *
   * Option keys are generated by {@link UseTreeSelectProps.getOptionLabel}.
   * A keys' uniqueness can be compromised when `getOptionLabel` returns the
   * same string for two different options.  Use this method to resolve such
   * conflicts.
   */
  getOptionKey?: (
    option: Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>,
    state: {
      key: string;
    }
  ) => string;

  /**
   * The icon to display in place of the default path icon.
   *
   * Rendered when `multiple === false`.
   *
   * @default `<PathIcon fontSize="small" />`
   */
  pathIcon?: React.ReactNode;

  /**
   *  Render the option, use `getOptionLabel` by default.
   */
  renderOption?: RenderOption<Node, FreeSolo>;

  /**
   * Render the selected value.
   */
  renderTags?: (
    value: (Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>)[],
    getTagProps: AutocompleteRenderGetTagProps,
    state: RenderTagsState
  ) => React.ReactNode;

  /**
   * Props applied to the {@link https://mui.com/material-ui/react-tooltip | Tooltip} elements.
   */
  TooltipProps?:
    | Omit<Partial<TooltipProps>, "children">
    | IndividualTooltipProps;
}

const _TreeSelect = <
  Node,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(
  props: TreeSelectProps<Node, Multiple, DisableClearable, FreeSolo>,
  ref: React.Ref<unknown>
): JSX.Element => {
  const {
    addFreeSoloText = "Add: ",
    branch,
    branchDelimiter,
    defaultBranch,
    enterIcon = defaultEnterIcon,
    enterText = "Enter",
    exitIcon = defaultExitIcon,
    exitText = "Exit",
    getChildren,
    getParent,
    getOptionKey = defaultGetOptionKey,
    isBranch,
    isBranchSelectable,
    loadingText = "Loading…",
    noOptionsText = "No options",
    onBranchChange,
    PaperComponent: PaperComponentProp = Paper,
    pathIcon = defaultPathIcon,
    renderOption: renderOptionProp = defaultRenderOption,
    renderInput: renderInputProp,
    renderTags: renderTagsProp,
    TooltipProps,
    ...restProps
  } = props;

  const {
    getPathLabel,
    getOptionLabel,
    handleOptionClick,
    isAtRoot,
    loadingOptions,
    noOptions,
    ...restTreeOpts
  } = useTreeSelect({
    branch,
    defaultBranch,
    getChildren,
    getParent,
    isBranch,
    isBranchSelectable,
    onBranchChange,
    branchDelimiter,
    ...restProps,
  });

  const classesClone = useUtilityClasses(props.classes);

  const PaperComponent = useMemo(() => {
    return forwardRef(({ children = null, ...paperProps }: PaperProps, ref) => {
      return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <PaperComponentProp {...paperProps} ref={ref as any}>
          {children}
          {loadingOptions && !isAtRoot ? (
            <AutocompleteLoading className={classesClone.loading}>
              {loadingText}
            </AutocompleteLoading>
          ) : null}
          {!isAtRoot && !!noOptions.current && !loadingOptions ? (
            <AutocompleteNoOptions
              className={classesClone.noOptions}
              role="presentation"
              onMouseDown={(event) => {
                // Prevent input blur when interacting with the "no options" content
                event.preventDefault();
              }}
            >
              {noOptionsText}
            </AutocompleteNoOptions>
          ) : null}
        </PaperComponentProp>
      );
    });
  }, [
    PaperComponentProp,
    classesClone.loading,
    classesClone.noOptions,
    isAtRoot,
    loadingOptions,
    loadingText,
    noOptions,
    noOptionsText,
  ]);

  const toolTipProps = useMemo<IndividualTooltipProps | undefined>(() => {
    if (!TooltipProps) {
      return undefined;
    } else if (
      "enter" in TooltipProps ||
      "exit" in TooltipProps ||
      "currentPath" in TooltipProps ||
      "valuePath" in TooltipProps
    ) {
      return TooltipProps;
    } else {
      return {
        enter: TooltipProps,
        exit: TooltipProps,
        currentPath: TooltipProps,
        valuePath: TooltipProps,
      } as IndividualTooltipProps;
    }
  }, [TooltipProps]);

  const renderInput = useCallback<typeof renderInputProp>(
    (params) => {
      if (props.multiple) {
        return renderInputProp(params);
      } else {
        return renderInputProp({
          ...params,
          InputProps: {
            ...params.InputProps,
            startAdornment: (() => {
              if (restTreeOpts.value) {
                return (
                  <>
                    <Tooltip
                      title={getPathLabel(
                        restTreeOpts.value as InternalOption<
                          Node,
                          FreeSolo,
                          NodeType
                        >,
                        true
                      )}
                      {...toolTipProps?.valuePath}
                    >
                      {/* eslint-disable-next-line
                    @typescript-eslint/no-explicit-any */}
                      {pathIcon || ((<PathIcon fontSize="small" />) as any)}
                    </Tooltip>
                    {params.InputProps.startAdornment || null}
                  </>
                );
              } else {
                return params.InputProps.startAdornment;
              }
            })(),
          },
        });
      }
    },
    [
      getPathLabel,
      pathIcon,
      props.multiple,
      renderInputProp,
      restTreeOpts.value,
      toolTipProps?.valuePath,
    ]
  );

  const renderOption = useCallback<
    NonNullableAutocompleteProp<"renderOption", InternalOption<Node, FreeSolo>>
  >(
    ({ onClick, ...props }, option, state) => {
      const { type, node } = option;

      const isUpBranch = type === NodeType.UP_BRANCH;
      const isDownBranch = type === NodeType.DOWN_BRANCH;

      return renderOptionProp(
        {
          ...props,
          key: getOptionKey(node, {
            key: `${(props as { key: string }).key}-${type}`,
          }),
          onClick: (
            ...args: Parameters<React.MouseEventHandler<HTMLLIElement>>
          ) => {
            handleOptionClick(option);
            (onClick as React.MouseEventHandler<HTMLLIElement>)(...args);
          },
        },
        node,
        {
          ...state,
          addFreeSoloText,
          pathDirection: isUpBranch ? "up" : isDownBranch ? "down" : undefined,
          pathLabel:
            isUpBranch || isDownBranch
              ? getPathLabel(option, true)
              : getPathLabel(option, false),
          disabled: isUpBranch ? false : !!props["aria-disabled"],
          enterIcon,
          enterText,
          exitIcon,
          exitText,
          optionLabel: getOptionLabel(option),
          TooltipProps: isUpBranch
            ? toolTipProps?.exit || toolTipProps?.currentPath
              ? {
                  exit: toolTipProps?.exit,
                  currentPath: toolTipProps?.currentPath,
                }
              : undefined
            : isDownBranch
            ? toolTipProps?.enter
            : undefined,
        }
      );
    },
    [
      renderOptionProp,
      getOptionKey,
      addFreeSoloText,
      getPathLabel,
      enterIcon,
      enterText,
      exitIcon,
      exitText,
      getOptionLabel,
      toolTipProps?.exit,
      toolTipProps?.currentPath,
      toolTipProps?.enter,
      handleOptionClick,
    ]
  );

  const renderTags = useCallback<
    NonNullableAutocompleteProp<
      "renderTags",
      InternalOption<Node, FreeSolo>,
      Multiple,
      DisableClearable,
      FreeSolo
    >
  >(
    (value, getTagProps) => {
      if (renderTagsProp) {
        return renderTagsProp(
          value.map(({ node }) => node),
          getTagProps,
          {
            getPathLabel: (index) => getPathLabel(value[index], true),
          }
        );
      }

      return value.map((option, index) => {
        const { key, ...tagProps } = getTagProps({ index });

        const title = getPathLabel(option, true);

        return (
          <Tooltip title={title} {...toolTipProps?.valuePath} key={key}>
            <Chip
              label={getOptionLabel(option)}
              size={props.size || "medium"}
              {...tagProps}
              {...props.ChipProps}
            />
          </Tooltip>
        );
      });
    },
    [
      renderTagsProp,
      getPathLabel,
      toolTipProps?.valuePath,
      getOptionLabel,
      props.size,
      props.ChipProps,
    ]
  );

  return (
    <Autocomplete
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(restProps as any)}
      {...restTreeOpts}
      getOptionLabel={getOptionLabel}
      loading={loadingOptions}
      loadingText={loadingText}
      noOptionsText={noOptionsText}
      PaperComponent={PaperComponent}
      renderInput={renderInput}
      renderOption={renderOption}
      renderTags={renderTags}
      ref={ref}
    />
  );
};

export const TreeSelect = forwardRef(_TreeSelect) as <
  Node,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(
  props: TreeSelectProps<Node, Multiple, DisableClearable, FreeSolo>
) => JSX.Element;

export default TreeSelect;
