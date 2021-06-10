"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __value_;
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultInput = exports.mergeInputEndAdornment = exports.mergeInputStartAdornment = exports.BranchOption = exports.Option = exports.FreeSoloValue = void 0;
const react_1 = __importStar(require("react"));
const Autocomplete_1 = __importDefault(require("@material-ui/lab/Autocomplete"));
const useAutocomplete_1 = require("@material-ui/lab/useAutocomplete");
const Skeleton_1 = __importDefault(require("@material-ui/lab/Skeleton"));
const core_1 = require("@material-ui/core");
const styles_1 = require("@material-ui/styles");
const styles_2 = require("@material-ui/core/styles");
const ChevronRight_1 = __importDefault(require("@material-ui/icons/ChevronRight"));
const ChevronLeft_1 = __importDefault(require("@material-ui/icons/ChevronLeft"));
const ListItem_1 = __importDefault(require("@material-ui/core/ListItem"));
const ListItemIcon_1 = __importDefault(require("@material-ui/core/ListItemIcon"));
const ListItemText_1 = __importDefault(require("@material-ui/core/ListItemText"));
const Tooltip_1 = __importDefault(require("@material-ui/core/Tooltip"));
const core_2 = require("@material-ui/core");
const NULLISH = Symbol("NULLISH");
const lastElm = (arr) => arr[arr.length - 1];
const useStyles = styles_1.makeStyles(() => styles_1.createStyles({
    optionNode: {
        margin: "-6px -16px",
        width: "calc(100% + 32px)",
    },
    listBoxWLoadingBranchNode: {
        "& > li:nth-child(2)": {
            opacity: 1,
        },
    },
}), { defaultTheme: styles_2.createMuiTheme({}) });
const convertToString = (value) => typeof value === "symbol" ? value.toString() : `${value}`;
const primaryTypographyProps = {
    noWrap: true,
};
/**
 * Used to distinguish free solo entries from string values.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class FreeSoloValue extends String {
    constructor(value, branchPath = []) {
        super(value);
        this.branchPath = branchPath;
    }
}
exports.FreeSoloValue = FreeSoloValue;
class BaseOption {
    constructor(value) {
        __value_.set(this, void 0);
        __classPrivateFieldSet(this, __value_, value);
    }
    valueOf() {
        return __classPrivateFieldGet(this, __value_);
    }
    toString() {
        return convertToString(__classPrivateFieldGet(this, __value_));
    }
}
__value_ = new WeakMap();
/**
 * Wrapper for all option values that includes the branch path to the option.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Option extends BaseOption {
    constructor(value, branchPath = []) {
        super(value);
        this.branchPath = branchPath;
    }
}
exports.Option = Option;
/**
 * Indicates an option is a branch node.
 */
class BranchOption extends BaseOption {
}
exports.BranchOption = BranchOption;
const DEFAULT_LOADING_TEXT = "Loading…";
const LOADING_OPTION = Symbol();
const BranchPathIcon = react_1.forwardRef((props, ref) => (react_1.default.createElement(core_1.SvgIcon, Object.assign({ style: react_1.useMemo(() => ({
        ...(props.style || {}),
        cursor: "default",
    }), [props.style]), ref: ref }, props),
    react_1.default.createElement("path", { d: "M20 9C18.69 9 17.58 9.83 17.17 11H14.82C14.4 9.84 13.3 9 12 9S9.6 9.84 9.18 11H6.83C6.42 9.83 5.31 9 4 9C2.34 9 1 10.34 1 12S2.34 15 4 15C5.31 15 6.42 14.17 6.83 13H9.18C9.6 14.16 10.7 15 12 15S14.4 14.16 14.82 13H17.17C17.58 14.17 18.69 15 20 15C21.66 15 23 13.66 23 12S21.66 9 20 9" }))));
const branchPathToStr = function (branchPath, getOptionLabel) {
    return branchPath.reduce((pathStr, branch) => {
        return `${pathStr}${pathStr ? " > " : ""}${getOptionLabel(branch)}`;
    }, "");
};
const mergeInputStartAdornment = (action, adornment, inputProps) => ({
    ...inputProps,
    startAdornment: (() => {
        if (inputProps.startAdornment) {
            return action === "append" ? (react_1.default.createElement(react_1.Fragment, null,
                inputProps.startAdornment,
                adornment)) : (react_1.default.createElement(react_1.Fragment, null,
                adornment,
                inputProps.startAdornment));
        }
        else {
            return adornment;
        }
    })(),
});
exports.mergeInputStartAdornment = mergeInputStartAdornment;
const mergeInputEndAdornment = (action, adornment, inputProps) => ({
    ...inputProps,
    endAdornment: (() => {
        if (inputProps.endAdornment) {
            return action === "append" ? (react_1.default.createElement(react_1.Fragment, null,
                inputProps.endAdornment,
                adornment)) : (react_1.default.createElement(react_1.Fragment, null,
                adornment,
                inputProps.endAdornment));
        }
        else {
            return adornment;
        }
    })(),
});
exports.mergeInputEndAdornment = mergeInputEndAdornment;
/**
 * Renders a TextField
 */
const defaultInput = (params) => react_1.default.createElement(core_1.TextField, Object.assign({}, params));
exports.defaultInput = defaultInput;
const TreeSelect = (props) => {
    const classes = useStyles();
    const { autoSelect, branchPath: branchPathProp, debug, defaultValue, disableClearable, disableCloseOnSelect, enterBranchText = "Enter", exitBranchText = "Exit", filterOptions: filterOptionsProp, freeSolo, getOptionDisabled: getOptionDisabledProp, getOptionLabel: getOptionLabelProp, groupBy: groupByProp, inputValue: inputValueProp, onInputChange: onInputChangeProp, onBranchChange, getOptionSelected: getOptionSelectedProp, ListboxProps: ListboxPropsProp, loading, loadingText = DEFAULT_LOADING_TEXT, multiple, onBlur: onBlurProp, onClose: onCloseProp, onChange: onChangeProp, onOpen: onOpenProp, open, options: optionsProp, 
    /**
     * Renders a TextField
     */
    renderInput: renderInputProp = exports.defaultInput, renderTags: renderTagsProp, value: valuePropRaw, upBranchOnEsc, ...rest } = props;
    const valueProp = react_1.useMemo(() => !valuePropRaw ||
        valuePropRaw instanceof Option ||
        valuePropRaw instanceof FreeSoloValue
        ? valuePropRaw
        : new Option(valuePropRaw), [valuePropRaw]);
    const isBranchPathControlled = branchPathProp !== undefined;
    const isInputControlled = inputValueProp !== undefined;
    const isValueControlled = valueProp !== undefined;
    const autoCompleteProps = rest;
    const [state, setState] = react_1.useState(() => ({
        branchPath: [],
        inputValue: (() => {
            if (!multiple && !isInputControlled) {
                if ((valueProp !== null && valueProp !== void 0 ? valueProp : NULLISH) !== NULLISH) {
                    const value = valueProp;
                    if (getOptionLabelProp) {
                        if (value instanceof Option) {
                            return getOptionLabelProp(value.valueOf(), value.branchPath);
                        }
                        else if (value instanceof FreeSoloValue) {
                            return getOptionLabelProp(value, value.branchPath);
                        }
                        else {
                            return getOptionLabelProp(value);
                        }
                    }
                    else {
                        return convertToString(value);
                    }
                }
                else if ((defaultValue !== null && defaultValue !== void 0 ? defaultValue : NULLISH) !== NULLISH) {
                    const value = valueProp;
                    if (getOptionLabelProp) {
                        if (value instanceof Option) {
                            return getOptionLabelProp(value.valueOf(), value.branchPath);
                        }
                        else if (value instanceof FreeSoloValue) {
                            return getOptionLabelProp(value, value.branchPath);
                        }
                        else {
                            return getOptionLabelProp(value);
                        }
                    }
                    else {
                        return convertToString(value);
                    }
                }
            }
            return "";
        })(),
        open: false,
        value: (() => {
            if (isValueControlled || defaultValue === undefined) {
                return multiple ? [] : null;
            }
            else if (multiple) {
                return defaultValue.map((defaultValue) => defaultValue instanceof Option
                    ? defaultValue
                    : new Option(defaultValue));
            }
            else if (defaultValue === null) {
                return null;
            }
            else {
                return defaultValue instanceof Option
                    ? defaultValue
                    : new Option(defaultValue);
            }
        })(),
    }));
    const branchPath = (isBranchPathControlled
        ? branchPathProp
        : state.branchPath);
    const inputValue = (isInputControlled
        ? inputValueProp
        : state.inputValue);
    const value = isValueControlled ? valueProp : state.value;
    const getOptionDisabled = react_1.useCallback((option) => {
        if (option === LOADING_OPTION) {
            return true;
        }
        else if (option instanceof BranchOption &&
            branchPath.includes(option)) {
            return false;
        }
        else if (loading) {
            return true;
        }
        else if (getOptionDisabledProp) {
            if (option instanceof Option) {
                return getOptionDisabledProp(option.valueOf(), option.branchPath);
            }
            else if (option instanceof FreeSoloValue) {
                return getOptionDisabledProp(option, option.branchPath);
            }
            else {
                return getOptionDisabledProp(option, branchPath);
            }
        }
        else {
            return false;
        }
    }, [getOptionDisabledProp, loading, branchPath]);
    const getOptionLabel = react_1.useCallback((option) => {
        if (option === LOADING_OPTION) {
            return loadingText;
        }
        else if (getOptionLabelProp) {
            if (option instanceof Option) {
                return getOptionLabelProp(option.valueOf(), option.branchPath);
            }
            else if (option instanceof FreeSoloValue) {
                return getOptionLabelProp(option, option.branchPath);
            }
            else {
                return getOptionLabelProp(option, branchPath);
            }
        }
        else {
            return convertToString(option);
        }
    }, [getOptionLabelProp, loadingText, branchPath]);
    const getOptionSelected = react_1.useCallback((option, value) => {
        // An Value is NEVER a FreeSoloValue (sanity); BranchOption and
        // LOADING_OPTION are NEVER selectable.
        if (value instanceof FreeSoloValue ||
            option instanceof BranchOption ||
            option === LOADING_OPTION) {
            return false;
        }
        else if (getOptionSelectedProp) {
            return getOptionSelectedProp(option.valueOf(), value.valueOf(), {
                option: option.branchPath,
                value: value.branchPath,
            });
        }
        else {
            return option.valueOf() === value.valueOf();
        }
    }, [getOptionSelectedProp]);
    const groupBy = react_1.useMemo(() => {
        if (!groupByProp) {
            return undefined;
        }
        return (option) => {
            if (option === LOADING_OPTION) {
                return "";
            }
            else if (option instanceof Option) {
                return groupByProp(option.valueOf(), option.branchPath);
            }
            else {
                return groupByProp(option, branchPath);
            }
        };
    }, [groupByProp, branchPath]);
    const filterOptions = react_1.useMemo(() => {
        const filterOptions = filterOptionsProp
            ? (options, state) => {
                const newState = {
                    ...state,
                    getOptionLabel: (option) => state.getOptionLabel(option),
                };
                return options.filter((option) => filterOptionsProp(option, newState));
            }
            : useAutocomplete_1.createFilterOptions({
                stringify: getOptionLabel,
            });
        // Parent BranchOption and LOADING_OPTION are NEVER filtered
        return (options, filterOptionsState) => {
            const [staticOpts, filteredOpts] = options.reduce((opts, opt) => {
                const [staticOpts, filteredOpts] = opts;
                // LOADING_OPTION is NEVER filtered
                if (opt === LOADING_OPTION) {
                    staticOpts.push(opt);
                }
                else if (opt instanceof BranchOption) {
                    // Parent BranchOption are NEVER filtered
                    if (branchPath.includes(opt)) {
                        staticOpts.push(opt);
                    }
                    else {
                        filteredOpts.push(opt);
                    }
                }
                else {
                    filteredOpts.push(opt);
                }
                return opts;
            }, [[], []]);
            return [
                ...staticOpts,
                ...filterOptions(filteredOpts, filterOptionsState),
            ];
        };
    }, [filterOptionsProp, getOptionLabel, branchPath]);
    const resetInput = react_1.useCallback((event, inputValue) => {
        if (!isInputControlled) {
            setState((state) => ({
                ...state,
                inputValue,
            }));
        }
        if (onInputChangeProp) {
            onInputChangeProp(event, inputValue, "reset");
        }
    }, [isInputControlled, onInputChangeProp, setState]);
    const upOneBranch = react_1.useCallback((event, reason) => {
        if (multiple || (value !== null && value !== void 0 ? value : NULLISH) === NULLISH) {
            resetInput(event, "");
        }
        const newBranchPath = branchPath.slice(0, branchPath.length - 1);
        if (!isBranchPathControlled) {
            setState((state) => ({
                ...state,
                branchPath: newBranchPath,
            }));
        }
        onBranchChange(event, lastElm(newBranchPath), [...newBranchPath], "up", reason);
    }, [
        isBranchPathControlled,
        setState,
        branchPath,
        multiple,
        onBranchChange,
        resetInput,
        value,
    ]);
    const onClose = react_1.useCallback((...args) => {
        const [event, reason] = args;
        //onClose should NOT be called by a BranchOption
        // selection. onChange MUST handle,
        if (reason === "select-option") {
            return;
        }
        else if (reason === "escape" &&
            branchPath.length > 0 &&
            upBranchOnEsc) {
            // Escape goes up One Branch level
            upOneBranch(event, "escape");
        }
        else if (onCloseProp) {
            return onCloseProp(...args);
        }
        else {
            switch (reason) {
                case "escape":
                    setState((state) => ({
                        ...state,
                        open: false,
                    }));
                    break;
                case "blur":
                    if (debug) {
                        return;
                    }
                    setState((state) => ({
                        ...state,
                        open: false,
                    }));
                    break;
                case "toggleInput":
                    setState((state) => ({
                        ...state,
                        open: false,
                    }));
                    break;
            }
        }
    }, [onCloseProp, branchPath.length, upBranchOnEsc, debug, upOneBranch]);
    const onOpen = react_1.useMemo(() => {
        if (onOpenProp) {
            return onOpenProp;
        }
        else {
            return () => {
                setState((state) => ({
                    ...state,
                    open: true,
                }));
            };
        }
    }, [setState, onOpenProp]);
    const renderInput = react_1.useCallback((params) => {
        var _a;
        if (multiple ||
            !value ||
            !value.branchPath.length ||
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            getOptionLabel(value) !== ((_a = params === null || params === void 0 ? void 0 : params.inputProps) === null || _a === void 0 ? void 0 : _a.value)) {
            return renderInputProp(params);
        }
        else {
            return renderInputProp({
                ...params,
                InputProps: exports.mergeInputStartAdornment("prepend", react_1.default.createElement(Tooltip_1.default, { title: branchPathToStr(value.branchPath, getOptionLabel) },
                    react_1.default.createElement(BranchPathIcon, { fontSize: "small" })), params.InputProps || {}),
            });
        }
    }, [renderInputProp, multiple, value, getOptionLabel]);
    const renderOption = react_1.useCallback((option) => {
        if (option === LOADING_OPTION) {
            return (react_1.default.createElement("div", { className: "MuiAutocomplete-loading" }, getOptionLabel(LOADING_OPTION)));
        }
        else if (option instanceof BranchOption &&
            branchPath.includes(option)) {
            return (react_1.default.createElement(ListItem_1.default, { className: classes.optionNode, component: "div", divider: true },
                react_1.default.createElement(ListItemIcon_1.default, null,
                    react_1.default.createElement(Tooltip_1.default, { title: exitBranchText },
                        react_1.default.createElement(ChevronLeft_1.default, null))),
                branchPath.length > 1 ? (react_1.default.createElement(Tooltip_1.default, { title: branchPathToStr(branchPath, getOptionLabel) },
                    react_1.default.createElement(ListItemText_1.default, { primaryTypographyProps: primaryTypographyProps, primary: getOptionLabel(option) }))) : (react_1.default.createElement(ListItemText_1.default, { primaryTypographyProps: primaryTypographyProps, primary: getOptionLabel(option) }))));
        }
        else if (loading) {
            return (react_1.default.createElement(core_1.Box, { width: "100%" },
                react_1.default.createElement(Skeleton_1.default, { animation: "wave" })));
        }
        else if (option instanceof BranchOption) {
            return (react_1.default.createElement(core_1.Box, { width: "100%", display: "flex" },
                react_1.default.createElement(core_1.Box, { flexGrow: "1", clone: true },
                    react_1.default.createElement(core_2.Typography, { variant: "inherit", color: "inherit", align: "left", noWrap: true }, getOptionLabel(option))),
                react_1.default.createElement(Tooltip_1.default, { title: enterBranchText },
                    react_1.default.createElement(ChevronRight_1.default, null))));
        }
        else {
            return (react_1.default.createElement(core_2.Typography, { variant: "inherit", color: "inherit", align: "left", noWrap: true }, getOptionLabel(option)));
        }
    }, [
        getOptionLabel,
        classes.optionNode,
        branchPath,
        loading,
        enterBranchText,
        exitBranchText,
    ]);
    const renderTags = react_1.useCallback((value, getTagProps) => {
        if (renderTagsProp) {
            return renderTagsProp(value, getTagProps);
        }
        else {
            return value.map((option, index) => {
                if (option.branchPath.length) {
                    const { key, ...chipProps } = getTagProps({ index });
                    return (react_1.default.createElement(Tooltip_1.default, { key: key, title: branchPathToStr(option.branchPath, getOptionLabel) },
                        react_1.default.createElement(core_1.Chip, Object.assign({ label: getOptionLabel(option) }, chipProps))));
                }
                else {
                    return (react_1.default.createElement(core_1.Chip, Object.assign({ key: index, label: getOptionLabel(option) }, getTagProps({ index }))));
                }
            });
        }
    }, [renderTagsProp, getOptionLabel]);
    const onInputChange = react_1.useCallback((...args) => {
        const [, inputValue, reason] = args;
        // Resets are handled by resetInput
        if (reason === "reset") {
            return;
        }
        if (!isInputControlled) {
            setState((state) => ({
                ...state,
                inputValue,
            }));
        }
        if (onInputChangeProp) {
            onInputChangeProp(...args);
        }
    }, [isInputControlled, onInputChangeProp, setState]);
    const onChange = react_1.useCallback((...args) => {
        const [event, , reason] = args;
        const curValue = value;
        switch (reason) {
            case "select-option":
            case "blur":
            case "create-option":
                {
                    const value = (multiple
                        ? lastElm(args[1])
                        : args[1]);
                    if (value === LOADING_OPTION) {
                        return;
                    }
                    else if (value instanceof BranchOption) {
                        if (reason === "blur") {
                            // Do NOT follow branches on blur
                            return;
                        }
                        else if (branchPath.includes(value)) {
                            upOneBranch(event, "select-option");
                        }
                        else {
                            // Following branch reset input
                            if (multiple || (curValue !== null && curValue !== void 0 ? curValue : NULLISH) === NULLISH) {
                                resetInput(event, "");
                            }
                            const newBranchPath = [...branchPath, value];
                            if (!isBranchPathControlled) {
                                setState((state) => ({
                                    ...state,
                                    branchPath: newBranchPath,
                                }));
                            }
                            onBranchChange(event, value, [...newBranchPath], "down", "select-option");
                        }
                    }
                    else {
                        const parsedValue = value instanceof Option
                            ? new Option(value.valueOf(), branchPath)
                            : new FreeSoloValue(value, branchPath);
                        const newValue = (multiple
                            ? [...args[1].slice(0, -1), parsedValue]
                            : parsedValue);
                        // Reset input on new value
                        if (multiple) {
                            resetInput(event, "");
                        }
                        else {
                            resetInput(event, getOptionLabel(parsedValue));
                        }
                        // NOT controlled, set value to local state.
                        if (isValueControlled) {
                            setState((state) => ({
                                ...state,
                                open: !!disableCloseOnSelect,
                            }));
                        }
                        else {
                            setState((state) => ({
                                ...state,
                                value: newValue,
                                open: !!disableCloseOnSelect,
                            }));
                        }
                        if (onChangeProp) {
                            onChangeProp(event, newValue, reason);
                        }
                    }
                }
                break;
            case "clear":
            case "remove-option":
                {
                    resetInput(event, "");
                    const value = args[1];
                    if (!isValueControlled) {
                        // NOT controlled, set value to local state.
                        setState((state) => ({
                            ...state,
                            value,
                        }));
                    }
                    if (onChangeProp) {
                        onChangeProp(event, value, reason);
                    }
                }
                break;
        }
    }, [
        multiple,
        branchPath,
        upOneBranch,
        resetInput,
        setState,
        isBranchPathControlled,
        onBranchChange,
        isValueControlled,
        onChangeProp,
        getOptionLabel,
        disableCloseOnSelect,
        value,
    ]);
    const onBlur = react_1.useCallback((...args) => {
        const [event] = args;
        // When freeSolo is true and autoSelect is false,  an uncommitted free solo
        // input value stays in the input field on blur, but is not set as a value.
        // NOTE: This is not the case when autoSelect is true.  This ambiguous state
        // and behavior is addressed here.  The behavior will be to clear the input.
        if (freeSolo && !autoSelect) {
            if (inputValue.trim()) {
                if (multiple || value === null) {
                    resetInput(event, "");
                }
                else {
                    resetInput(event, getOptionLabel(value));
                }
            }
        }
        if (onBlurProp) {
            onBlurProp(...args);
        }
    }, [
        freeSolo,
        autoSelect,
        onBlurProp,
        inputValue,
        multiple,
        value,
        resetInput,
        getOptionLabel,
    ]);
    const options = react_1.useMemo(() => {
        const options = [];
        if (branchPath.length > 0) {
            const openBranchNode = lastElm(branchPath);
            options.push(openBranchNode);
            if (loading) {
                options.push(LOADING_OPTION);
            }
        }
        if (loading) {
            return options;
        }
        else {
            return optionsProp.reduce((options, option) => {
                options.push(option instanceof BranchOption
                    ? option
                    : new Option(option, branchPath));
                return options;
            }, options);
        }
    }, [branchPath, optionsProp, loading]);
    const ListboxProps = react_1.useMemo(() => {
        if (branchPath.length > 0) {
            return {
                ...(ListboxPropsProp || {}),
                className: `MuiAutocomplete-listbox ${(ListboxPropsProp || {}).className || ""} ${loading ? classes.listBoxWLoadingBranchNode : ""}`,
            };
        }
        else {
            return ListboxPropsProp;
        }
    }, [
        ListboxPropsProp,
        branchPath,
        loading,
        classes.listBoxWLoadingBranchNode,
    ]);
    return (react_1.default.createElement(Autocomplete_1.default, Object.assign({}, autoCompleteProps, { autoSelect: autoSelect, debug: debug, disableClearable: disableClearable, disableCloseOnSelect: disableCloseOnSelect, filterOptions: filterOptions, freeSolo: freeSolo, getOptionDisabled: getOptionDisabled, getOptionLabel: getOptionLabel, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getOptionSelected: getOptionSelected, groupBy: groupBy, inputValue: inputValue, ListboxProps: ListboxProps, loading: loading && branchPath.length === 0, loadingText: loadingText, multiple: multiple, onBlur: onBlur, onInputChange: onInputChange, onChange: onChange, onClose: onClose, onOpen: onOpen, open: open !== null && open !== void 0 ? open : state.open, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        options: options, renderInput: renderInput, renderOption: renderOption, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderTags: renderTags, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: value })));
};
exports.default = TreeSelect;
//# sourceMappingURL=index.js.map