import React from "react";
import {
  AutocompleteProps,
  TooltipProps,
  AutocompleteRenderOptionState,
  ListItemButtonProps,
  ListItemTextProps,
  SvgIconProps,
} from "@mui/material";
import {
  UseTreeSelectProps,
  TreeSelectFreeSoloValueMapping,
  PathDirection,
} from "./useTreeSelect";
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
export declare const DefaultOption: (
  props:
    | UpBranchDefaultOptionsProps
    | DownBranchDefaultOptionsProps
    | BaseDefaultOptionsProps
) => JSX.Element;
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
export declare type RenderOption<Node, FreeSolo extends boolean | undefined> = (
  props: React.HTMLAttributes<HTMLLIElement> & {
    key: React.Key;
  },
  option: Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>,
  state: TreeSelectRenderOptionState
) => React.ReactNode;
/**
 * Returns props for {@link DefaultOption} from arguments of {@link RenderOption}
 */
export declare const getDefaultOptionProps: (
  props: React.HTMLAttributes<HTMLLIElement> & {
    key: React.Key;
  },
  option: any,
  state: TreeSelectRenderOptionState
) =>
  | UpBranchDefaultOptionsProps
  | DownBranchDefaultOptionsProps
  | BaseDefaultOptionsProps;
export declare const PathIcon: (props: SvgIconProps) => JSX.Element;
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
   * Override the default down branch icon tooltip `title`.
   *
   * @default `"Enter"`
   */
  enterText?: string;
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
