import { UseAutocompleteProps, AutocompleteValue } from "@mui/material";
import React from "react";
export declare type SyncOrAsync<T> = T | Promise<T>;
/**
 * Wrapper for free solo values.
 *
 * FreeSoloNode is always a leaf node.
 *
 */
export declare class FreeSoloNode<Node> extends String {
  readonly parent: Node | null;
  constructor(freeSoloValue: string, parent?: Node | null);
}
export declare type TreeSelectFreeSoloValueMapping<Node, FreeSolo> =
  FreeSolo extends true ? FreeSoloNode<Node> : never;
/**
 * @internal
 * @ignore
 */
export declare enum NodeType {
  LEAF = 0,
  DOWN_BRANCH = 1,
  UP_BRANCH = 2,
}
/**
 * @internal
 * @ignore
 */
export declare class InternalOption<
  Node,
  FreeSolo extends boolean | undefined,
  Type extends NodeType = NodeType
> {
  readonly node: Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>;
  readonly type: Type;
  readonly path: ReadonlyArray<Node>;
  constructor(
    node: Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>,
    type: Type,
    path: ReadonlyArray<Node>
  );
  toString(): string;
}
/**
 * Indicates the tree navigation direction. `"up"` in the direction of ancestors and `"down"`in the direction of descendants.
 */
export declare type PathDirection = "up" | "down";
/**
 * Utility type that gives the tree select value type.
 */
export declare type TreeSelectValue<
  Node,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> = AutocompleteValue<
  Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>,
  Multiple,
  DisableClearable,
  false
>;
/**
 * @internal
 * @ignore
 */
export interface UseTreeSelectProps<
  Node,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> extends Pick<
      UseAutocompleteProps<
        Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>,
        Multiple,
        DisableClearable,
        false
      >,
      | "componentName"
      | "defaultValue"
      | "groupBy"
      | "inputValue"
      | "isOptionEqualToValue"
      | "multiple"
      | "onChange"
      | "onClose"
      | "onHighlightChange"
      | "onInputChange"
      | "onOpen"
      | "open"
      | "value"
    >,
    Pick<
      UseAutocompleteProps<Node, Multiple, DisableClearable, false>,
      "filterOptions" | "getOptionDisabled"
    > {
  /**
   * The active **Branch** Node.  This Node's children will be displayed in the select menu.
   */
  branch?: Node | null;
  /**
   * Delimits branches in path labels.
   *
   * @default `" > "`
   */
  branchDelimiter?: string;
  /**
   * The default branch. Use when the component is not controlled.
   */
  defaultBranch?: Node | null;
  /**
   * If true, the Autocomplete is free solo, meaning that the user input is not bound to provided options.
   */
  freeSolo?: FreeSolo;
  /**
   * Used to determine the string value of a path.  `path` ascends ancestors.
   *
   * Uses {@link getOptionLabel} and {@link branchDelimiter} by default.
   */
  getPathLabel?: (
    path: ReadonlyArray<Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>>
  ) => string;
  /**
   * Used to determine the string value for a given option.
   * It's used to fill the input (and the list box options if `renderOption` is not provided).
   *
   * Defaults to `(option:Node) => String(option)`; therefor, implementing a `Node.toString` is an alternative to supplying a custom`getOptionLabel`.
   */
  getOptionLabel?: UseAutocompleteProps<
    Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>,
    Multiple,
    DisableClearable,
    false
  >["getOptionLabel"];
  /**
   * Retrieve the child nodes of `node`.
   *
   * @param node When `null`, the caller is requesting root select options.
   *
   * @returns **Child** Nodes or a nullish value when `node` does not have children.
   *
   * Returning a nullish value indicates that `node` is a **Leaf** Node.
   *
   * @warning Rejections must be handled when returning a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise | Promise}.
   */
  getChildren: (node: Node | null) => SyncOrAsync<Node[] | null | undefined>;
  /**
   * Retrieve the parent of `node`.
   *
   * @returns **Branch** Node parent of `node` or a nullish value when `node` does not have a parent.
   *
   * Returning a nullish value indicates that `node` is a root select option.
   *
   * @warning Rejections must be handled when returning a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise | Promise}.
   */
  getParent: (node: Node) => SyncOrAsync<Node | null | undefined>;
  /**
   * Determine if an option is a **Branch** or **Leaf** Node.
   *
   * Overrides default behavior which is to call {@link UseTreeSelectProps.getChildren} and to infer `node` type from the return value.
   */
  isBranch?: (node: Node) => SyncOrAsync<boolean>;
  /**
   * Determine if **Branch** Node is selectable as a value.
   *
   * @returns When `true`, will add a **Leaf** option in addition to the **Branch** option for the Node.
   */
  isBranchSelectable?: (node: Node) => SyncOrAsync<boolean>;
  /**
   * Callback fired when active branch changes.
   *
   * @param direction Indicates the direction of  along the tree.
   */
  onBranchChange?: (
    event: React.SyntheticEvent,
    branchNode: Node | null,
    direction: PathDirection
  ) => void;
}
/**
 * @internal
 * @ignore
 */
export interface UseTreeSelectReturn<
  Node,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> extends Required<
      Pick<
        UseAutocompleteProps<
          InternalOption<Node, FreeSolo>,
          Multiple,
          DisableClearable,
          FreeSolo
        >,
        | "filterOptions"
        | "getOptionDisabled"
        | "getOptionLabel"
        | "inputValue"
        | "isOptionEqualToValue"
        | "onChange"
        | "onClose"
        | "onHighlightChange"
        | "onInputChange"
        | "onOpen"
        | "open"
        | "options"
        | "value"
      >
    >,
    Pick<
      UseAutocompleteProps<
        InternalOption<Node, FreeSolo>,
        Multiple,
        DisableClearable,
        FreeSolo
      >,
      "groupBy"
    > {
  getPathLabel: (
    to: InternalOption<Node, FreeSolo>,
    includeTo: boolean
  ) => string;
  onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
  handleOptionClick: (
    branchOption: InternalOption<Node, FreeSolo, NodeType>
  ) => void;
  isAtRoot: boolean;
  loadingOptions: boolean;
  noOptions: React.RefObject<boolean>;
}
/**
 * @internal
 * @ignore
 */
export declare const useTreeSelect: <
  Node_1,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>({
  branch: branchProp,
  branchDelimiter,
  componentName,
  defaultBranch,
  defaultValue,
  filterOptions: filterOptionsProp,
  freeSolo,
  getPathLabel: getPathLabelProp,
  getChildren,
  getOptionDisabled: getOptionDisabledProp,
  getOptionLabel: getOptionLabelProp,
  getParent,
  groupBy: groupByProp,
  inputValue: inputValueProp,
  isBranch: isBranchProp,
  isBranchSelectable,
  isOptionEqualToValue: isOptionEqualToValueProp,
  multiple,
  onBranchChange,
  onChange: onChangeProp,
  onClose: onCloseProp,
  onHighlightChange: onHighlightChangeProp,
  onInputChange: onInputChangeProp,
  onOpen: onOpenProp,
  open: openProp,
  value: valueProp,
}: UseTreeSelectProps<
  Node_1,
  Multiple,
  DisableClearable,
  FreeSolo
>) => UseTreeSelectReturn<Node_1, Multiple, DisableClearable, FreeSolo>;
export default useTreeSelect;
