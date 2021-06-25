import React, { ReactNode } from "react";
import { AutocompleteChangeReason, AutocompleteProps, AutocompleteRenderInputParams } from "@material-ui/lab/Autocomplete";
import { TextFieldProps } from "@material-ui/core/TextField";
import { InputProps } from "@material-ui/core/Input";
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
export declare type FreeSoloValueMapping<FreeSolo extends boolean | undefined, TBranch> = FreeSolo extends true ? FreeSoloNode<TBranch> : never;
export declare type TreeSelectProps<T, TBranch, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined> = Pick<AutocompleteProps<ValueNode<T, TBranch> | FreeSoloValueMapping<FreeSolo, TBranch>, Multiple, DisableClearable, false>, "value" | "onChange" | "renderTags"> & Pick<AutocompleteProps<ValueNode<T, TBranch> | FreeSoloValueMapping<FreeSolo, TBranch>, Multiple, DisableClearable, false>, "getOptionSelected" | "defaultValue"> & Pick<AutocompleteProps<ValueNode<T, TBranch> | BranchNode<TBranch> | FreeSoloValueMapping<FreeSolo, TBranch>, Multiple, DisableClearable, false>, "getOptionLabel"> & Pick<AutocompleteProps<ValueNode<T, TBranch> | BranchNode<TBranch>, Multiple, DisableClearable, false>, "filterOptions" | "onHighlightChange" | "renderOption" | "getOptionDisabled" | "groupBy"> & Pick<AutocompleteProps<T | BranchNode<TBranch>, Multiple, DisableClearable, false>, "options"> & Omit<AutocompleteProps<unknown, Multiple, DisableClearable, false>, "defaultValue" | "filterOptions" | "getOptionDisabled" | "getOptionLabel" | "getOptionSelected" | "groupBy" | "options" | "onChange" | "onHighlightChange" | "renderOption" | "renderTags" | "value" | "freeSolo" | "renderInput"> & {
    branch?: BranchNode<TBranch> | null;
    enterBranchText?: string;
    exitBranchText?: string;
    freeSolo?: FreeSolo;
    onBranchChange: (event: React.ChangeEvent<Record<string, unknown>>, branch: BranchNode<TBranch> | null, direction: PathDirection, reason: BranchSelectReason) => void | Promise<void>;
    renderInput?: (params: AutocompleteRenderInputParams | TextFieldProps) => JSX.Element;
};
export declare const mergeInputStartAdornment: (action: "append" | "prepend", adornment: ReactNode, inputProps?: InputProps) => InputProps;
export declare const mergeInputEndAdornment: (action: "append" | "prepend", adornment: React.ReactNode, inputProps?: InputProps) => InputProps;
export declare const useTreeSelectStyles: (props?: any) => Record<"listBox", string>;
export declare const DefaultOption: <T, TBranch>(props: {
    option: ValueNode<T, TBranch> | BranchNode<TBranch>;
    curBranch: BranchNode<TBranch> | null;
    exitBranchText?: string | undefined;
    enterBranchText?: string | undefined;
    getOptionLabel: (option: ValueNode<T, TBranch> | BranchNode<TBranch>) => string;
    renderOption?: ((option: ValueNode<T, TBranch> | BranchNode<TBranch>) => ReactNode) | undefined;
}) => JSX.Element;
/**
 * Renders a TextField
 */
export declare const defaultInput: (params: TextFieldProps | AutocompleteRenderInputParams) => JSX.Element;
declare const _default: <T, TBranch, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined>(props: Pick<AutocompleteProps<ValueNode<T, TBranch> | FreeSoloValueMapping<FreeSolo, TBranch>, Multiple, DisableClearable, false>, "onChange" | "value" | "renderTags"> & Pick<AutocompleteProps<ValueNode<T, TBranch> | FreeSoloValueMapping<FreeSolo, TBranch>, Multiple, DisableClearable, false>, "defaultValue" | "getOptionSelected"> & Pick<AutocompleteProps<ValueNode<T, TBranch> | BranchNode<TBranch> | FreeSoloValueMapping<FreeSolo, TBranch>, Multiple, DisableClearable, false>, "getOptionLabel"> & Pick<AutocompleteProps<ValueNode<T, TBranch> | BranchNode<TBranch>, Multiple, DisableClearable, false>, "renderOption" | "filterOptions" | "getOptionDisabled" | "groupBy" | "onHighlightChange"> & Pick<AutocompleteProps<T | BranchNode<TBranch>, Multiple, DisableClearable, false>, "options"> & Pick<AutocompleteProps<unknown, Multiple, DisableClearable, false>, "disabled" | "open" | "loading" | "hidden" | "dir" | "slot" | "style" | "title" | "color" | "size" | "multiple" | "translate" | "prefix" | "ref" | "classes" | "defaultChecked" | "suppressContentEditableWarning" | "suppressHydrationWarning" | "accessKey" | "className" | "contentEditable" | "contextMenu" | "draggable" | "id" | "lang" | "placeholder" | "spellCheck" | "tabIndex" | "radioGroup" | "role" | "about" | "datatype" | "inlist" | "property" | "resource" | "typeof" | "vocab" | "autoCapitalize" | "autoCorrect" | "autoSave" | "itemProp" | "itemScope" | "itemType" | "itemID" | "itemRef" | "results" | "security" | "unselectable" | "inputMode" | "is" | "aria-activedescendant" | "aria-atomic" | "aria-autocomplete" | "aria-busy" | "aria-checked" | "aria-colcount" | "aria-colindex" | "aria-colspan" | "aria-controls" | "aria-current" | "aria-describedby" | "aria-details" | "aria-disabled" | "aria-dropeffect" | "aria-errormessage" | "aria-expanded" | "aria-flowto" | "aria-grabbed" | "aria-haspopup" | "aria-hidden" | "aria-invalid" | "aria-keyshortcuts" | "aria-label" | "aria-labelledby" | "aria-level" | "aria-live" | "aria-modal" | "aria-multiline" | "aria-multiselectable" | "aria-orientation" | "aria-owns" | "aria-placeholder" | "aria-posinset" | "aria-pressed" | "aria-readonly" | "aria-relevant" | "aria-required" | "aria-roledescription" | "aria-rowcount" | "aria-rowindex" | "aria-rowspan" | "aria-selected" | "aria-setsize" | "aria-sort" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "dangerouslySetInnerHTML" | "onCopy" | "onCopyCapture" | "onCut" | "onCutCapture" | "onPaste" | "onPasteCapture" | "onCompositionEnd" | "onCompositionEndCapture" | "onCompositionStart" | "onCompositionStartCapture" | "onCompositionUpdate" | "onCompositionUpdateCapture" | "onFocus" | "onFocusCapture" | "onBlur" | "onBlurCapture" | "onChangeCapture" | "onBeforeInput" | "onBeforeInputCapture" | "onInput" | "onInputCapture" | "onReset" | "onResetCapture" | "onSubmit" | "onSubmitCapture" | "onInvalid" | "onInvalidCapture" | "onLoad" | "onLoadCapture" | "onError" | "onErrorCapture" | "onKeyDown" | "onKeyDownCapture" | "onKeyPress" | "onKeyPressCapture" | "onKeyUp" | "onKeyUpCapture" | "onAbort" | "onAbortCapture" | "onCanPlay" | "onCanPlayCapture" | "onCanPlayThrough" | "onCanPlayThroughCapture" | "onDurationChange" | "onDurationChangeCapture" | "onEmptied" | "onEmptiedCapture" | "onEncrypted" | "onEncryptedCapture" | "onEnded" | "onEndedCapture" | "onLoadedData" | "onLoadedDataCapture" | "onLoadedMetadata" | "onLoadedMetadataCapture" | "onLoadStart" | "onLoadStartCapture" | "onPause" | "onPauseCapture" | "onPlay" | "onPlayCapture" | "onPlaying" | "onPlayingCapture" | "onProgress" | "onProgressCapture" | "onRateChange" | "onRateChangeCapture" | "onSeeked" | "onSeekedCapture" | "onSeeking" | "onSeekingCapture" | "onStalled" | "onStalledCapture" | "onSuspend" | "onSuspendCapture" | "onTimeUpdate" | "onTimeUpdateCapture" | "onVolumeChange" | "onVolumeChangeCapture" | "onWaiting" | "onWaitingCapture" | "onAuxClick" | "onAuxClickCapture" | "onClick" | "onClickCapture" | "onContextMenu" | "onContextMenuCapture" | "onDoubleClick" | "onDoubleClickCapture" | "onDrag" | "onDragCapture" | "onDragEnd" | "onDragEndCapture" | "onDragEnter" | "onDragEnterCapture" | "onDragExit" | "onDragExitCapture" | "onDragLeave" | "onDragLeaveCapture" | "onDragOver" | "onDragOverCapture" | "onDragStart" | "onDragStartCapture" | "onDrop" | "onDropCapture" | "onMouseDown" | "onMouseDownCapture" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseMoveCapture" | "onMouseOut" | "onMouseOutCapture" | "onMouseOver" | "onMouseOverCapture" | "onMouseUp" | "onMouseUpCapture" | "onSelect" | "onSelectCapture" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerUp" | "onPointerUpCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerOut" | "onPointerOutCapture" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onScroll" | "onScrollCapture" | "onWheel" | "onWheelCapture" | "onAnimationStart" | "onAnimationStartCapture" | "onAnimationEnd" | "onAnimationEndCapture" | "onAnimationIteration" | "onAnimationIterationCapture" | "onTransitionEnd" | "onTransitionEndCapture" | "innerRef" | "fullWidth" | "disablePortal" | "onClose" | "autoComplete" | "onOpen" | "ChipProps" | "closeIcon" | "clearText" | "closeText" | "forcePopupIcon" | "getLimitTagsText" | "ListboxComponent" | "ListboxProps" | "loadingText" | "limitTags" | "noOptionsText" | "openText" | "PaperComponent" | "PopperComponent" | "popupIcon" | "renderGroup" | "autoHighlight" | "autoSelect" | "blurOnSelect" | "clearOnBlur" | "clearOnEscape" | "componentName" | "debug" | "disableClearable" | "disableCloseOnSelect" | "disabledItemsFocusable" | "disableListWrap" | "filterSelectedOptions" | "handleHomeEndKeys" | "includeInputInList" | "inputValue" | "onInputChange" | "openOnFocus" | "selectOnFocus"> & {
    branch?: BranchNode<TBranch> | null | undefined;
    enterBranchText?: string | undefined;
    exitBranchText?: string | undefined;
    freeSolo?: FreeSolo | undefined;
    onBranchChange: (event: React.ChangeEvent<Record<string, unknown>>, branch: BranchNode<TBranch> | null, direction: PathDirection, reason: "select-option") => void | Promise<void>;
    renderInput?: ((params: import("@material-ui/core/TextField").StandardTextFieldProps | import("@material-ui/core/TextField").FilledTextFieldProps | import("@material-ui/core/TextField").OutlinedTextFieldProps | AutocompleteRenderInputParams) => JSX.Element) | undefined;
} & React.RefAttributes<unknown>) => React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)> | null;
export default _default;
