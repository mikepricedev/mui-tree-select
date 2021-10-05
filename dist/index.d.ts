import React, { ReactNode } from "react";
import { AutocompleteChangeReason, AutocompleteProps, AutocompleteRenderInputParams, AutocompleteRenderOptionState, Value } from "@material-ui/lab";
import { InputProps, ListItemTextProps, TextFieldProps } from "@material-ui/core";
declare module "react" {
    function forwardRef<T, P = {}>(render: (props: P, ref: React.Ref<T>) => React.ReactElement | null): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}
export declare type PathDirection = "up" | "down";
declare abstract class BaseNode<T> {
    #private;
    constructor(value: T);
    toString(): string;
    valueOf(): T;
    get [Symbol.toStringTag](): string;
}
/**
 * Replacer method for {@link JSON.stringify} 2nd argument.
 * This util assists in calling JSON.stringify on a BranchNode, ValueNode,
 * FreeSoloNode, or any object containing the formers.
 */
export declare const nodeStringifyReplacer: (key: string, value: unknown) => unknown;
export declare class BranchNode<TBranch> extends BaseNode<TBranch> {
    #private;
    constructor(branch: TBranch);
    constructor(branch: TBranch, parent: BranchNode<TBranch>);
    constructor(branch: TBranch, branchPath: Iterable<TBranch>);
    constructor(branch: TBranch, parent?: Iterable<TBranch> | BranchNode<TBranch> | null);
    /**
     * Parent BranchNode
     */
    get parent(): BranchNode<TBranch> | null;
    /**
     * Iterates up the branch path starting with self.
     */
    up(): IterableIterator<BranchNode<TBranch>>;
    /**
     * Iterates down the branch path finishing with self.
     * @alias BranchNode.[Symbol.iterator]
     */
    down(): IterableIterator<BranchNode<TBranch>>;
    /**
     * Iterates down the branch path finishing with self.
     */
    [Symbol.iterator](): IterableIterator<BranchNode<TBranch>>;
    /**
     * @param branchPath must iterate from the root "down" the branch path. Wraps
     * the last branch option in the returned {@link BranchNode}.
     */
    static createBranchNode<T>(branchPath: Iterable<T>): BranchNode<T>;
    static pathToString<T>(branchNode: BranchNode<T>, { branchToSting, delimiter, }?: {
        branchToSting?: (branchNode: BranchNode<T>) => string;
        delimiter?: string;
    }): string;
}
/**
 *  Wrapper for all options and values. Includes the branch path to the option.
 */
export declare class ValueNode<T, TBranch> extends BaseNode<T> {
    #private;
    constructor(value: T);
    constructor(value: T, parent: BranchNode<TBranch>);
    constructor(value: T, branchPath: Iterable<TBranch>);
    constructor(value: T, parent: Iterable<TBranch> | BranchNode<TBranch> | null);
    /**
     * Parent BranchNode
     */
    get parent(): BranchNode<TBranch> | null;
    /**
     * Iterates up the branch path starting with {@link ValueNode.parent}.
     */
    up(): IterableIterator<BranchNode<TBranch>>;
    /**
     * Iterates down the branch path finishing with {@link ValueNode.parent}.
     */
    down(): IterableIterator<BranchNode<TBranch>>;
    /**
     * Iterates down the branch path finishing with {@link ValueNode.parent}.
     */
    [Symbol.iterator](): IterableIterator<BranchNode<TBranch>>;
}
/**
 * Used to tie free solo entries to the tree.
 */
export declare class FreeSoloNode<TBranch = any> extends ValueNode<string, TBranch> {
}
export declare type BranchSelectReason = Extract<AutocompleteChangeReason, "select-option">;
export declare type TreeSelectRenderOptionState<T, TBranch, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined> = AutocompleteRenderOptionState & {
    value: TreeSelectValue<T, TBranch, Multiple, DisableClearable, FreeSolo>;
    branch: BranchNode<TBranch> | null;
    exitBranchText: string;
    enterBranchText: string;
    addFreeSoloText: string;
    getOptionLabel: NonNullable<TreeSelectProps<T, TBranch, Multiple, DisableClearable, FreeSolo>["getOptionLabel"]>;
};
export declare type FreeSoloValueMapping<FreeSolo extends boolean | undefined, TBranch> = FreeSolo extends true ? FreeSoloNode<TBranch> : never;
export declare type TreeSelectValue<T, TBranch, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined> = Value<ValueNode<T, TBranch> | FreeSoloValueMapping<FreeSolo, TBranch>, Multiple, DisableClearable, false>;
export declare type TreeSelectProps<T, TBranch, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined> = Pick<AutocompleteProps<ValueNode<T, TBranch> | FreeSoloValueMapping<FreeSolo, TBranch>, Multiple, DisableClearable, false>, "value" | "onChange" | "renderTags"> & Pick<AutocompleteProps<ValueNode<T, TBranch> | FreeSoloValueMapping<FreeSolo, TBranch>, Multiple, DisableClearable, false>, "getOptionSelected" | "defaultValue"> & Pick<AutocompleteProps<ValueNode<T, TBranch> | BranchNode<TBranch> | FreeSoloValueMapping<FreeSolo, TBranch>, Multiple, DisableClearable, false>, "getOptionLabel"> & Pick<AutocompleteProps<ValueNode<T, TBranch> | BranchNode<TBranch>, Multiple, DisableClearable, false>, "filterOptions" | "onHighlightChange" | "getOptionDisabled" | "groupBy"> & Pick<AutocompleteProps<T | BranchNode<TBranch>, Multiple, DisableClearable, false>, "options"> & Omit<AutocompleteProps<unknown, Multiple, DisableClearable, false>, "defaultValue" | "filterOptions" | "getOptionDisabled" | "getOptionLabel" | "getOptionSelected" | "groupBy" | "options" | "onChange" | "onHighlightChange" | "renderTags" | "value" | "freeSolo" | "renderInput" | "renderOption"> & {
    branch?: BranchNode<TBranch> | null;
    enterBranchText?: string;
    exitBranchText?: string;
    addFreeSoloText?: string;
    freeSolo?: FreeSolo;
    onBranchChange: (event: React.ChangeEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, branch: BranchNode<TBranch> | null, direction: PathDirection, reason: BranchSelectReason) => void | Promise<void>;
    renderInput?: (params: AutocompleteRenderInputParams | TextFieldProps) => JSX.Element;
    renderOption?: (props: React.HTMLAttributes<HTMLLIElement>, option: ValueNode<T, TBranch> | BranchNode<TBranch> | FreeSoloValueMapping<FreeSolo, TBranch>, state: TreeSelectRenderOptionState<T, TBranch, Multiple, DisableClearable, FreeSolo>) => React.ReactNode;
};
export declare const mergeInputStartAdornment: (action: "append" | "prepend", adornment: ReactNode, inputProps?: InputProps) => InputProps;
export declare const mergeInputEndAdornment: (action: "append" | "prepend", adornment: React.ReactNode, inputProps?: InputProps) => InputProps;
export declare const DefaultOption: <T, TBranch, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined>(props: {
    props: React.HTMLAttributes<HTMLLIElement>;
    option: ValueNode<T, TBranch> | BranchNode<TBranch> | FreeSoloValueMapping<FreeSolo, TBranch>;
    state: TreeSelectRenderOptionState<T, TBranch, Multiple, DisableClearable, FreeSolo>;
    ListItemTextProps?: Partial<ListItemTextProps<"span", "p">> | undefined;
}) => JSX.Element;
/**
 * Renders a TextField
 */
export declare const defaultInput: (params: TextFieldProps | AutocompleteRenderInputParams) => JSX.Element;
declare const _default: <T, TBranch, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined>(props: Pick<AutocompleteProps<ValueNode<T, TBranch> | FreeSoloValueMapping<FreeSolo, TBranch>, Multiple, DisableClearable, false>, "value" | "onChange" | "renderTags"> & Pick<AutocompleteProps<ValueNode<T, TBranch> | FreeSoloValueMapping<FreeSolo, TBranch>, Multiple, DisableClearable, false>, "defaultValue" | "getOptionSelected"> & Pick<AutocompleteProps<ValueNode<T, TBranch> | BranchNode<TBranch> | FreeSoloValueMapping<FreeSolo, TBranch>, Multiple, DisableClearable, false>, "getOptionLabel"> & Pick<AutocompleteProps<ValueNode<T, TBranch> | BranchNode<TBranch>, Multiple, DisableClearable, false>, "filterOptions" | "getOptionDisabled" | "groupBy" | "onHighlightChange"> & Pick<AutocompleteProps<T | BranchNode<TBranch>, Multiple, DisableClearable, false>, "options"> & Omit<AutocompleteProps<unknown, Multiple, DisableClearable, false>, "value" | "options" | "defaultValue" | "onChange" | "renderInput" | "renderOption" | "renderTags" | "filterOptions" | "freeSolo" | "getOptionDisabled" | "getOptionLabel" | "getOptionSelected" | "groupBy" | "onHighlightChange"> & {
    branch?: BranchNode<TBranch> | null | undefined;
    enterBranchText?: string | undefined;
    exitBranchText?: string | undefined;
    addFreeSoloText?: string | undefined;
    freeSolo?: FreeSolo | undefined;
    onBranchChange: (event: React.KeyboardEvent<HTMLElement> | React.ChangeEvent<HTMLElement>, branch: BranchNode<TBranch> | null, direction: PathDirection, reason: "select-option") => void | Promise<void>;
    renderInput?: ((params: TextFieldProps | AutocompleteRenderInputParams) => JSX.Element) | undefined;
    renderOption?: ((props: React.HTMLAttributes<HTMLLIElement>, option: ValueNode<T, TBranch> | BranchNode<TBranch> | FreeSoloValueMapping<FreeSolo, TBranch>, state: TreeSelectRenderOptionState<T, TBranch, Multiple, DisableClearable, FreeSolo>) => React.ReactNode) | undefined;
} & React.RefAttributes<unknown>) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
export default _default;
