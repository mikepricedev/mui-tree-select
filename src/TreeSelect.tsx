import React, { useCallback, useMemo } from "react";
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
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import useTreeSelect, {
  UseTreeSelectProps,
  TreeSelectFreeSoloValueMapping,
  InternalOption,
  NodeType,
} from "./useTreeSelect";

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

type NullableAutocompleteProp<
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
> = AutocompleteProps<Node, Multiple, DisableClearable, FreeSolo>[Prop];

interface BaseDefaultOptionsProps
  extends Omit<ListItemButtonProps<"li">, "children"> {
  ListItemTextProps: ListItemTextProps;
  TooltipProps?: Omit<TooltipProps, "children" | "title">;
}

export interface UpBranchDefaultOptionsProps<
  Type extends Extract<NodeType, "upBranch">
> extends BaseDefaultOptionsProps {
  exitText: string;
  branchPathLabel: string;
  nodeType: Type;
}

export interface DownBranchDefaultOptionsProps<
  Type extends Extract<NodeType, "downBranch">
> extends BaseDefaultOptionsProps {
  enterText: string;
  nodeType: Type;
}

export interface LeafDefaultOptionsProps<Type extends Extract<NodeType, "leaf">>
  extends BaseDefaultOptionsProps {
  nodeType: Type;
}

/**
 * Default Option Component.
 */
export function DefaultOption<Type extends NodeType>(
  props: Type extends "upBranch"
    ? UpBranchDefaultOptionsProps<Type>
    : Type extends "downBranch"
    ? DownBranchDefaultOptionsProps<Type>
    : Type extends "leaf"
    ? LeafDefaultOptionsProps<Type>
    : never
) {
  const {
    listItemButtonProps,
    listItemTextProps,
    tooltipProps,
    enterText = "",
    exitText = "",
    branchPathLabel = "",
    nodeType,
  } = (() => {
    switch (props.nodeType) {
      case "leaf": {
        const {
          nodeType,
          ListItemTextProps: listItemTextProps,
          TooltipProps: tooltipProps,
          ...listItemButtonProps
        } = props;

        return {
          listItemButtonProps,
          listItemTextProps,
          tooltipProps,
          nodeType,
        };
      }
      case "downBranch": {
        const {
          nodeType,
          ListItemTextProps: listItemTextProps,
          TooltipProps: tooltipProps,
          enterText,
          ...listItemButtonProps
        } = props;

        return {
          listItemButtonProps,
          listItemTextProps,
          tooltipProps,
          enterText,
          nodeType,
        };
      }
      case "upBranch": {
        const {
          nodeType,
          ListItemTextProps: listItemTextProps,
          TooltipProps: tooltipProps,
          branchPathLabel,
          exitText,
          ...listItemButtonProps
        } = props;

        return {
          listItemButtonProps,
          listItemTextProps,
          tooltipProps,
          exitText,
          branchPathLabel,
          nodeType,
        };
      }
    }
  })();

  return (
    <ListItemButton {...listItemButtonProps} component="li" dense>
      {nodeType === "upBranch" ? (
        <>
          <Tooltip {...tooltipProps} title={exitText}>
            <ListItemIcon>
              <ChevronLeftIcon />
            </ListItemIcon>
          </Tooltip>
          <Tooltip title={branchPathLabel}>
            <ListItemText {...listItemTextProps} />
          </Tooltip>
        </>
      ) : (
        <ListItemText {...listItemTextProps} />
      )}

      {nodeType === "downBranch" && (
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
}

export interface TreeSelectRenderOptionState
  extends AutocompleteRenderOptionState {
  branchPathLabel: string;
  disabled: boolean;
  enterText: string;
  exitText: string;
  optionLabel: string;
  type: NodeType;
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
  | UpBranchDefaultOptionsProps<"upBranch">
  | DownBranchDefaultOptionsProps<"downBranch">
  | LeafDefaultOptionsProps<"leaf"> => {
  const [props, , state] = args;

  const baseProps: BaseDefaultOptionsProps = {
    dense: true,
    divider: state.type === "upBranch",
    ...props,
    ListItemTextProps: {
      primary: state.optionLabel,
    },
  };
  switch (state.type) {
    case "leaf":
      return {
        ...baseProps,
        nodeType: state.type,
      } as LeafDefaultOptionsProps<"leaf">;

    case "downBranch":
      return {
        ...baseProps,
        enterText: state.enterText,
        nodeType: state.type,
      } as DownBranchDefaultOptionsProps<"downBranch">;

    case "upBranch":
      return {
        ...baseProps,
        branchPathLabel: state.branchPathLabel,
        exitText: state.exitText,
        nodeType: state.type,
      } as UpBranchDefaultOptionsProps<"upBranch">;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultRenderOption: RenderOption<any, true | false> = (...args) => (
  <DefaultOption {...getDefaultOptionProps(...args)} />
);

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
    branch,
    defaultBranch,
    enterText = "Enter",
    exitText = "Exit",
    getChildren,
    getParent,
    isBranch,
    onBranchChange,
    onError,
    renderOption: renderOptionProp = defaultRenderOption,
    ...restProps
  } = props;

  const {
    getBranchPathLabel,
    getOptionLabel,
    handleOptionClick,
    loadingOptions,
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

  const renderOption = useCallback<
    NonNullableAutocompleteProp<"renderOption", InternalOption<Node, FreeSolo>>
  >(
    ({ onClick, ...props }, option, state) => {
      const { type, node } = option;

      const isUpBranch = type === "upBranch";
      const isDownBranch = type === "downBranch";

      return renderOptionProp(
        {
          ...props,
          key: `${(props as { key: string }).key}-${type}`,
          onClick: (
            ...args: Parameters<React.MouseEventHandler<HTMLLIElement>>
          ) => {
            handleOptionClick(isUpBranch || isDownBranch);
            (onClick as React.MouseEventHandler<HTMLLIElement>)(...args);
          },
        },
        node,
        {
          ...state,
          branchPathLabel:
            isUpBranch || isDownBranch
              ? getBranchPathLabel(option, true)
              : getBranchPathLabel(option, false),
          disabled: isUpBranch ? false : !!props["aria-disabled"],
          enterText,
          exitText,
          optionLabel: getOptionLabel(option),
          type,
        }
      );
    },
    [
      enterText,
      exitText,
      getBranchPathLabel,
      getOptionLabel,
      handleOptionClick,
      renderOptionProp,
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

        const title = getBranchPathLabel(option, true);

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
  }, [getBranchPathLabel, getOptionLabel, props.ChipProps, props.size]);

  return (
    <Autocomplete
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(restProps as any)}
      {...restTreeOpts}
      getOptionLabel={getOptionLabel}
      loading={loadingOptions}
      renderOption={renderOption}
      renderTags={renderTags}
    />
  );
};

export default TreeSelect;
