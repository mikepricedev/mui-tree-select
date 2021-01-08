/// <reference types="react" />
import { AutocompleteProps } from "@material-ui/lab/Autocomplete";
import { Value, FilterOptionsState } from "@material-ui/lab/useAutocomplete";
import { TextFieldProps } from "@material-ui/core";
declare abstract class Node<T> {
    readonly value: T;
    constructor(value: T);
    static getValue<T>(value: T | Node<T>): T;
}
declare class ValueNode<T> extends Node<T> {
    constructor(value: T | OptionNode<T>);
}
export declare class FreeSoloValue extends ValueNode<string> {
}
declare abstract class OptionNode<T> extends Node<T> {
}
export declare enum NodeType {
    Leaf = 0,
    Branch = 1,
    SelectableBranch = 2
}
export interface Option<T> {
    option: T;
    type: NodeType;
}
export declare type FreeSoloValueMapping<FreeSolo extends boolean | undefined> = FreeSolo extends true ? FreeSoloValue : never;
export declare type TreeValue<T, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined> = Value<T | FreeSoloValueMapping<FreeSolo>, Multiple, DisableClearable, false>;
export declare type OnChange<T, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined> = (value: TreeValue<T, Multiple, DisableClearable, FreeSolo>) => void;
export declare type TreeSelectProps<T, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined> = Omit<AutocompleteProps<T | FreeSoloValueMapping<FreeSolo>, Multiple, DisableClearable, false>, "inputValue" | "onChange" | "onInputChange" | "renderInput" | "renderOption" | "filterOptions" | "options" | "freeSolo" | "defaultValue" | "value"> & {
    textFieldProps?: Omit<TextFieldProps, keyof AutocompleteProps<T | FreeSoloValueMapping<FreeSolo>, Multiple, DisableClearable, false> | "defaultValue" | "multiline" | "onChange" | "rows" | "rowsMax" | "select" | "SelectProps" | "value">;
    onChange: OnChange<T, Multiple, DisableClearable, FreeSolo>;
    getOptions(branchNode?: T): Promise<Option<T>[]> | Option<T>[];
    filterOptions?: (option: T, state: FilterOptionsState<T>) => boolean;
    enterBranchText?: string;
    exitBranchText?: string;
    freeSolo?: FreeSolo;
    value?: TreeValue<T, Multiple, DisableClearable, FreeSolo>;
    defaultValue?: TreeValue<T, Multiple, DisableClearable, FreeSolo>;
};
declare const TreeSelect: <T, Multiple extends boolean | undefined = undefined, DisableClearable extends boolean | undefined = undefined, FreeSolo extends boolean | undefined = undefined>(props: TreeSelectProps<T, Multiple, DisableClearable, FreeSolo>) => JSX.Element;
export default TreeSelect;
