import React from "react";
import {
  AutocompleteProps,
  TooltipProps,
  AutocompleteRenderOptionState,
  ListItemButtonProps,
  ListItemTextProps,
  SvgIconProps,
  AutocompleteRenderGetTagProps,
} from "@mui/material";
import {
  UseTreeSelectProps,
  TreeSelectFreeSoloValueMapping,
  PathDirection,
} from "./useTreeSelect";
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
export declare const DefaultOption: (
  props:
    | UpBranchDefaultOptionsProps
    | DownBranchDefaultOptionsProps
    | BaseDefaultOptionsProps
) => JSX.Element;
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
export declare type RenderOption<Node, FreeSolo extends boolean | undefined> = (
  props: React.HTMLAttributes<HTMLLIElement> & {
    key: React.Key;
  },
  option: Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>,
  state: TreeSelectRenderOptionState
) => React.ReactNode;
export interface RenderTagsState {
  getPathLabel: (index: number) => string;
}
/**
 * Returns props for {@link DefaultOption} from arguments of {@link RenderOption}
 */
export declare const getDefaultOptionProps: (
  props: React.HTMLAttributes<HTMLLIElement> & {
    key: React.Key;
  },
  option: any,
  state: TreeSelectRenderOptionState<PathDirection>
) =>
  | UpBranchDefaultOptionsProps
  | DownBranchDefaultOptionsProps
  | BaseDefaultOptionsProps;
export declare const PathIcon: (props: SvgIconProps) => JSX.Element;
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
export declare const TreeSelect: <
  Node_1,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(
  props: TreeSelectProps<Node_1, Multiple, DisableClearable, FreeSolo>
) => JSX.Element;
export default TreeSelect;
