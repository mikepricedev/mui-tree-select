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
  TooltipProps?: Omit<TooltipProps, "children" | "title">;
}

export interface UpBranchDefaultOptionsProps extends BaseDefaultOptionsProps {
  exitText: string;
  pathLabel: string;
  pathDirection: Extract<PathDirection, "up">;
}

export interface DownBranchDefaultOptionsProps extends BaseDefaultOptionsProps {
  enterText: string;
  pathDirection: Extract<PathDirection, "down">;
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
    enterText = "",
    exitText = "",
    TooltipProps: tooltipProps,
    ListItemTextProps: listItemTextProps,
    ...listItemButtonProps
  } = props as Omit<
    Omit<UpBranchDefaultOptionsProps, "pathDirection"> &
      Omit<DownBranchDefaultOptionsProps, "pathDirection">,
    "pathLabel" | "enterText" | "exitText"
  > &
    Partial<
      Pick<UpBranchDefaultOptionsProps, "pathLabel" | "exitText"> &
        Pick<DownBranchDefaultOptionsProps, "enterText"> &
        (
          | Pick<UpBranchDefaultOptionsProps, "pathDirection">
          | Pick<DownBranchDefaultOptionsProps, "pathDirection">
        )
    >;

  return (
    <ListItemButton {...listItemButtonProps} component="li" dense>
      {pathDirection === "up" ? (
        <>
          <Tooltip {...tooltipProps} title={exitText}>
            <ListItemIcon>
              <ChevronLeftIcon />
            </ListItemIcon>
          </Tooltip>
          <Tooltip title={pathLabel}>
            <ListItemText {...listItemTextProps} />
          </Tooltip>
        </>
      ) : (
        <ListItemText {...listItemTextProps} />
      )}

      {pathDirection === "down" && (
        <Tooltip {...tooltipProps} title={enterText}>
          <ListItemIcon
            sx={{
              minWidth: "auto",
            }}
          >
            <ChevronRightIcon />
          </ListItemIcon>
        </Tooltip>
      )}
    </ListItemButton>
  );
};

export interface TreeSelectRenderOptionState
  extends AutocompleteRenderOptionState {
  addFreeSoloText: string;
  pathLabel: string;
  disabled: boolean;
  enterText: string;
  exitText: string;
  optionLabel: string;
  pathDirection?: PathDirection;
}

export type RenderOption<Node, FreeSolo extends boolean | undefined> = (
  props: React.HTMLAttributes<HTMLLIElement> & { key: React.Key },
  option: Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>,
  state: TreeSelectRenderOptionState
) => React.ReactNode;

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
      exitText: state.exitText,
    };
  } else if (state.pathDirection === "down") {
    return {
      ...baseProps,
      pathDirection: "down",
      enterText: state.enterText,
    };
  } else {
    return baseProps;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultRenderOption: RenderOption<any, true | false> = (...args) => (
  <DefaultOption {...getDefaultOptionProps(...args)} />
);

export const PathIcon = forwardRef<SVGSVGElement, SvgIconProps>(
  function PathIcon(props: SvgIconProps, ref) {
    return (
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
    );
  }
);

const defaultPathIcon = <PathIcon fontSize="small" />;

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
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
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
   * @default "Add: "
   *
   */
  addFreeSoloText?: string;

  /**
   * Override the default down branch icon tooltip `title`.
   *
   * @default 'Enter'
   */
  enterText?: string;

  /**
   * Override the default up branch icon tooltip `title`.
   *
   * @default 'Exit'
   */
  exitText?: string;

  /**
   * The icon to display in place of the default path icon.
   *
   * @remarks Only rendered when `multiple === false`.
   *
   * @default <PathIcon fontSize="small" />
   */
  pathIcon?: React.ReactNode;

  /**
   *  Render the option, use `getOptionLabel` by default.
   */
  renderOption?: RenderOption<Node, FreeSolo>;
}

export const TreeSelect = <
  Node,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(
  props: TreeSelectProps<Node, Multiple, DisableClearable, FreeSolo>
): JSX.Element => {
  const {
    addFreeSoloText = "Add: ",
    branch,
    defaultBranch,
    enterText = "Enter",
    exitText = "Exit",
    getChildren,
    getParent,
    isBranch,
    loadingText = "Loading…",
    noOptionsText = "No options",
    onBranchChange,
    onError,
    PaperComponent: PaperComponentProp = Paper,
    pathIcon = defaultPathIcon,
    renderOption: renderOptionProp = defaultRenderOption,
    renderInput: renderInputProp,
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
    onBranchChange,
    onError,
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

  const renderInput = useMemo<typeof renderInputProp>(() => {
    if (props.multiple) {
      return renderInputProp;
    } else {
      return (params) =>
        renderInputProp({
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
  }, [
    getPathLabel,
    pathIcon,
    props.multiple,
    renderInputProp,
    restTreeOpts.value,
  ]);

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
          key: `${(props as { key: string }).key}-${type}`,
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
          enterText,
          exitText,
          optionLabel: getOptionLabel(option),
        }
      );
    },
    [
      renderOptionProp,
      addFreeSoloText,
      getPathLabel,
      enterText,
      exitText,
      getOptionLabel,
      handleOptionClick,
    ]
  );

  const renderTags = useMemo<
    NonNullableAutocompleteProp<
      "renderTags",
      InternalOption<Node, FreeSolo>,
      Multiple,
      DisableClearable,
      FreeSolo
    >
  >(() => {
    return (value, getTagProps) =>
      value.map((option, index) => {
        const { key, ...tagProps } = getTagProps({ index });

        const title = getPathLabel(option, true);

        return (
          <Tooltip key={key} title={title}>
            <Chip
              label={getOptionLabel(option)}
              size={props.size || "medium"}
              {...tagProps}
              {...props.ChipProps}
            />
          </Tooltip>
        );
      });
  }, [getPathLabel, getOptionLabel, props.ChipProps, props.size]);

  return (
    <Autocomplete
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(restProps as any)}
      {...restTreeOpts}
      getOptionLabel={getOptionLabel}
      loading={loadingOptions}
      PaperComponent={PaperComponent}
      renderInput={renderInput}
      renderOption={renderOption}
      renderTags={renderTags}
    />
  );
};

export default TreeSelect;
