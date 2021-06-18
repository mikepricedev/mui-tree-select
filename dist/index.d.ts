import React from "react";
import { AutocompleteProps, AutocompleteRenderInputParams, AutocompleteRenderOptionState } from "@material-ui/lab/Autocomplete";
import { AutocompleteChangeReason, AutocompleteCloseReason, FilterOptionsState } from "@material-ui/lab/useAutocomplete";
import { InputProps, TextFieldProps } from "@material-ui/core";
import { ReactNode } from "react";
declare module "react" {
    function forwardRef<T, P = {}>(render: (props: P, ref: React.Ref<T>) => React.ReactElement | null): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}
/**
 * Used to distinguish free solo entries from string values.
 */
export declare class FreeSoloValue<TBranchOption = any> extends String {
    readonly branchPath: BranchOption<TBranchOption>[];
    constructor(value: string, branchPath?: BranchOption<TBranchOption>[]);
}
declare abstract class BaseOption<T> {
    #private;
    constructor(value: T);
    valueOf(): T;
    toString(): string;
}
/**
 * Wrapper for all option values that includes the branch path to the option.
 */
export declare class Option<T, TBranchOption = any> extends BaseOption<T> {
    readonly branchPath: BranchOption<TBranchOption>[];
    constructor(value: T, branchPath?: BranchOption<TBranchOption>[]);
}
/**
 * Indicates an option is a branch node.
 */
export declare class BranchOption<TBranchOption> extends BaseOption<TBranchOption> {
}
export declare const mergeInputStartAdornment: (action: "append" | "prepend", adornment: React.ReactNode, inputProps: InputProps) => InputProps;
export declare const mergeInputEndAdornment: (action: "append" | "prepend", adornment: React.ReactNode, inputProps: InputProps) => InputProps;
/**
 * Renders a TextField
 */
export declare const defaultInput: (params: TextFieldProps | AutocompleteRenderInputParams) => JSX.Element;
export declare type BranchSelectReason = Extract<AutocompleteChangeReason, "select-option"> | Extract<AutocompleteCloseReason, "escape">;
export declare type BranchSelectDirection = "up" | "down";
export declare type FreeSoloValueMapping<FreeSolo extends boolean | undefined, TBranchOption> = FreeSolo extends true ? FreeSoloValue<TBranchOption> : never;
export declare type TreeSelectProps<T, TBranchOption, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined> = Pick<AutocompleteProps<T | Option<T, TBranchOption> | FreeSoloValueMapping<FreeSolo, TBranchOption>, Multiple, DisableClearable, false>, "defaultValue"> & Pick<AutocompleteProps<Option<T, TBranchOption> | FreeSoloValueMapping<FreeSolo, TBranchOption>, Multiple, DisableClearable, false>, "onChange" | "renderTags"> & Pick<AutocompleteProps<T | Option<T, TBranchOption> | FreeSoloValueMapping<FreeSolo, TBranchOption>, Multiple, DisableClearable, false>, "value"> & Pick<AutocompleteProps<Option<T, TBranchOption> | BranchOption<TBranchOption>, Multiple, DisableClearable, false>, "onHighlightChange"> & Pick<AutocompleteProps<T | BranchOption<TBranchOption>, Multiple, DisableClearable, false>, "options"> & Omit<AutocompleteProps<unknown, Multiple, DisableClearable, false>, "defaultValue" | "filterOptions" | "options" | "onChange" | "onHighlightChange" | "renderTags" | "value" | "filterOptions" | "freeSolo" | "getOptionDisabled" | "getOptionLabel" | "getOptionSelected" | "groupBy" | "loadingText" | "noOptionsText" | "renderInput" | "renderOption" | "placeholder"> & {
    branchPath?: BranchOption<TBranchOption>[];
    enterBranchText?: string;
    exitBranchText?: string;
    /**
     * @returns `true` to keep option and `false` to filter.
     */
    filterOptions?: (option: Option<T, TBranchOption> | BranchOption<TBranchOption>, state: FilterOptionsState<Option<T, TBranchOption> | BranchOption<TBranchOption>>) => boolean;
    freeSolo?: FreeSolo;
    getOptionLabel?: (option: T | BranchOption<TBranchOption> | FreeSoloValueMapping<FreeSolo, TBranchOption>, branchPath?: BranchOption<TBranchOption>[]) => string;
    getOptionDisabled?: (option: T | BranchOption<TBranchOption>, branchPath?: BranchOption<TBranchOption>[]) => boolean;
    getOptionSelected?: (option: T, value: T, branchPath?: {
        option: BranchOption<TBranchOption>[];
        value: BranchOption<TBranchOption>[];
    }) => boolean;
    groupBy?: (option: T | BranchOption<TBranchOption>, branchPath?: BranchOption<TBranchOption>[]) => string;
    loadingText?: string;
    noOptionsText?: string;
    onBranchChange: (event: React.ChangeEvent<Record<string, unknown>>, branchOption: BranchOption<TBranchOption> | undefined, branchPath: BranchOption<TBranchOption>[], direction: BranchSelectDirection, reason: BranchSelectReason) => void | Promise<void>;
    renderInput?: (params: AutocompleteRenderInputParams | TextFieldProps) => JSX.Element;
    renderOption?: (option: Option<T, TBranchOption> | BranchOption<TBranchOption>, state: AutocompleteRenderOptionState & {
        getOptionLabel: (option: Option<T, TBranchOption> | BranchOption<TBranchOption>) => string;
    }) => ReactNode;
    /**
     * Goes up one branch on escape key press; unless at root, then default
     * MUI Autocomplete behavior.
     * */
    upBranchOnEsc?: boolean;
};
declare const _default: <T, TBranchOption, Multiple extends boolean | undefined, DisableClearable extends boolean | undefined, FreeSolo extends boolean | undefined>(props: Pick<AutocompleteProps<T | Option<T, TBranchOption> | FreeSoloValueMapping<FreeSolo, TBranchOption>, Multiple, DisableClearable, false>, "defaultValue"> & Pick<AutocompleteProps<Option<T, TBranchOption> | FreeSoloValueMapping<FreeSolo, TBranchOption>, Multiple, DisableClearable, false>, "onChange" | "renderTags"> & Pick<AutocompleteProps<T | Option<T, TBranchOption> | FreeSoloValueMapping<FreeSolo, TBranchOption>, Multiple, DisableClearable, false>, "value"> & Pick<AutocompleteProps<Option<T, TBranchOption> | BranchOption<TBranchOption>, Multiple, DisableClearable, false>, "onHighlightChange"> & Pick<AutocompleteProps<T | BranchOption<TBranchOption>, Multiple, DisableClearable, false>, "options"> & Pick<AutocompleteProps<unknown, Multiple, DisableClearable, false>, "disabled" | "open" | "loading" | "hidden" | "dir" | "slot" | "style" | "title" | "color" | "size" | "multiple" | "translate" | "prefix" | "ref" | "classes" | "defaultChecked" | "suppressContentEditableWarning" | "suppressHydrationWarning" | "accessKey" | "className" | "contentEditable" | "contextMenu" | "draggable" | "id" | "lang" | "spellCheck" | "tabIndex" | "radioGroup" | "role" | "about" | "datatype" | "inlist" | "property" | "resource" | "typeof" | "vocab" | "autoCapitalize" | "autoCorrect" | "autoSave" | "itemProp" | "itemScope" | "itemType" | "itemID" | "itemRef" | "results" | "security" | "unselectable" | "inputMode" | "is" | "aria-activedescendant" | "aria-atomic" | "aria-autocomplete" | "aria-busy" | "aria-checked" | "aria-colcount" | "aria-colindex" | "aria-colspan" | "aria-controls" | "aria-current" | "aria-describedby" | "aria-details" | "aria-disabled" | "aria-dropeffect" | "aria-errormessage" | "aria-expanded" | "aria-flowto" | "aria-grabbed" | "aria-haspopup" | "aria-hidden" | "aria-invalid" | "aria-keyshortcuts" | "aria-label" | "aria-labelledby" | "aria-level" | "aria-live" | "aria-modal" | "aria-multiline" | "aria-multiselectable" | "aria-orientation" | "aria-owns" | "aria-placeholder" | "aria-posinset" | "aria-pressed" | "aria-readonly" | "aria-relevant" | "aria-required" | "aria-roledescription" | "aria-rowcount" | "aria-rowindex" | "aria-rowspan" | "aria-selected" | "aria-setsize" | "aria-sort" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "dangerouslySetInnerHTML" | "onCopy" | "onCopyCapture" | "onCut" | "onCutCapture" | "onPaste" | "onPasteCapture" | "onCompositionEnd" | "onCompositionEndCapture" | "onCompositionStart" | "onCompositionStartCapture" | "onCompositionUpdate" | "onCompositionUpdateCapture" | "onFocus" | "onFocusCapture" | "onBlur" | "onBlurCapture" | "onChangeCapture" | "onBeforeInput" | "onBeforeInputCapture" | "onInput" | "onInputCapture" | "onReset" | "onResetCapture" | "onSubmit" | "onSubmitCapture" | "onInvalid" | "onInvalidCapture" | "onLoad" | "onLoadCapture" | "onError" | "onErrorCapture" | "onKeyDown" | "onKeyDownCapture" | "onKeyPress" | "onKeyPressCapture" | "onKeyUp" | "onKeyUpCapture" | "onAbort" | "onAbortCapture" | "onCanPlay" | "onCanPlayCapture" | "onCanPlayThrough" | "onCanPlayThroughCapture" | "onDurationChange" | "onDurationChangeCapture" | "onEmptied" | "onEmptiedCapture" | "onEncrypted" | "onEncryptedCapture" | "onEnded" | "onEndedCapture" | "onLoadedData" | "onLoadedDataCapture" | "onLoadedMetadata" | "onLoadedMetadataCapture" | "onLoadStart" | "onLoadStartCapture" | "onPause" | "onPauseCapture" | "onPlay" | "onPlayCapture" | "onPlaying" | "onPlayingCapture" | "onProgress" | "onProgressCapture" | "onRateChange" | "onRateChangeCapture" | "onSeeked" | "onSeekedCapture" | "onSeeking" | "onSeekingCapture" | "onStalled" | "onStalledCapture" | "onSuspend" | "onSuspendCapture" | "onTimeUpdate" | "onTimeUpdateCapture" | "onVolumeChange" | "onVolumeChangeCapture" | "onWaiting" | "onWaitingCapture" | "onAuxClick" | "onAuxClickCapture" | "onClick" | "onClickCapture" | "onContextMenu" | "onContextMenuCapture" | "onDoubleClick" | "onDoubleClickCapture" | "onDrag" | "onDragCapture" | "onDragEnd" | "onDragEndCapture" | "onDragEnter" | "onDragEnterCapture" | "onDragExit" | "onDragExitCapture" | "onDragLeave" | "onDragLeaveCapture" | "onDragOver" | "onDragOverCapture" | "onDragStart" | "onDragStartCapture" | "onDrop" | "onDropCapture" | "onMouseDown" | "onMouseDownCapture" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseMoveCapture" | "onMouseOut" | "onMouseOutCapture" | "onMouseOver" | "onMouseOverCapture" | "onMouseUp" | "onMouseUpCapture" | "onSelect" | "onSelectCapture" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerUp" | "onPointerUpCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerOut" | "onPointerOutCapture" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onScroll" | "onScrollCapture" | "onWheel" | "onWheelCapture" | "onAnimationStart" | "onAnimationStartCapture" | "onAnimationEnd" | "onAnimationEndCapture" | "onAnimationIteration" | "onAnimationIterationCapture" | "onTransitionEnd" | "onTransitionEndCapture" | "innerRef" | "fullWidth" | "disablePortal" | "onClose" | "autoComplete" | "onOpen" | "ChipProps" | "closeIcon" | "clearText" | "closeText" | "forcePopupIcon" | "getLimitTagsText" | "ListboxComponent" | "ListboxProps" | "limitTags" | "openText" | "PaperComponent" | "PopperComponent" | "popupIcon" | "renderGroup" | "autoHighlight" | "autoSelect" | "blurOnSelect" | "clearOnBlur" | "clearOnEscape" | "componentName" | "debug" | "disableClearable" | "disableCloseOnSelect" | "disabledItemsFocusable" | "disableListWrap" | "filterSelectedOptions" | "handleHomeEndKeys" | "includeInputInList" | "inputValue" | "onInputChange" | "openOnFocus" | "selectOnFocus"> & {
    branchPath?: BranchOption<TBranchOption>[] | undefined;
    enterBranchText?: string | undefined;
    exitBranchText?: string | undefined;
    /**
     * @returns `true` to keep option and `false` to filter.
     */
    filterOptions?: ((option: Option<T, TBranchOption> | BranchOption<TBranchOption>, state: FilterOptionsState<Option<T, TBranchOption> | BranchOption<TBranchOption>>) => boolean) | undefined;
    freeSolo?: FreeSolo | undefined;
    getOptionLabel?: ((option: T | BranchOption<TBranchOption> | FreeSoloValueMapping<FreeSolo, TBranchOption>, branchPath?: BranchOption<TBranchOption>[] | undefined) => string) | undefined;
    getOptionDisabled?: ((option: T | BranchOption<TBranchOption>, branchPath?: BranchOption<TBranchOption>[] | undefined) => boolean) | undefined;
    getOptionSelected?: ((option: T, value: T, branchPath?: {
        option: BranchOption<TBranchOption>[];
        value: BranchOption<TBranchOption>[];
    } | undefined) => boolean) | undefined;
    groupBy?: ((option: T | BranchOption<TBranchOption>, branchPath?: BranchOption<TBranchOption>[] | undefined) => string) | undefined;
    loadingText?: string | undefined;
    noOptionsText?: string | undefined;
    onBranchChange: (event: React.ChangeEvent<Record<string, unknown>>, branchOption: BranchOption<TBranchOption> | undefined, branchPath: BranchOption<TBranchOption>[], direction: BranchSelectDirection, reason: BranchSelectReason) => void | Promise<void>;
    renderInput?: ((params: import("@material-ui/core").StandardTextFieldProps | import("@material-ui/core").FilledTextFieldProps | import("@material-ui/core").OutlinedTextFieldProps | AutocompleteRenderInputParams) => JSX.Element) | undefined;
    renderOption?: ((option: Option<T, TBranchOption> | BranchOption<TBranchOption>, state: AutocompleteRenderOptionState & {
        getOptionLabel: (option: Option<T, TBranchOption> | BranchOption<TBranchOption>) => string;
    }) => React.ReactNode) | undefined;
    /**
     * Goes up one branch on escape key press; unless at root, then default
     * MUI Autocomplete behavior.
     * */
    upBranchOnEsc?: boolean | undefined;
} & React.RefAttributes<unknown>) => React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)> | null;
export default _default;
