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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchOption = exports.FreeSoloValue = void 0;
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
class FreeSoloValue extends String {
    constructor(value) {
        super(value);
    }
}
exports.FreeSoloValue = FreeSoloValue;
/**
 * Options are wrapped to distinguish free solo entries from string
 * options, this is used internally only.
 */
class Option {
    constructor(option) {
        this.option = option;
    }
    valueOf() {
        return this.option;
    }
    toString() {
        return convertToString(this.option);
    }
}
/**
 * Indicates an option is a branch node.
 */
class BranchOption extends Option {
}
exports.BranchOption = BranchOption;
const DEFAULT_LOADING_TEXT = "Loading…";
const LOADING_OPTION = Symbol();
const TreeSelect = (props) => {
    const classes = useStyles();
    const { autoSelect, branchPath: branchPathProp, debug, defaultValue, disableClearable, disableCloseOnSelect, enterBranchText = "Enter", exitBranchText = "Exit", filterOptions: filterOptionsProp, freeSolo, getOptionDisabled: getOptionDisabledProp, getOptionLabel: getOptionLabelProp, inputValue: inputValueProp, onInputChange: onInputChangeProp, onBranchChange, getOptionSelected: getOptionSelectedProp, ListboxProps: ListboxPropsProp, loading, loadingText = DEFAULT_LOADING_TEXT, multiple, onBlur: onBlurProp, onClose: onCloseProp, onChange: onChangeProp, onOpen: onOpenProp, open, options: optionsProp, textFieldProps, value: valueProp, upBranchOnEsc, ...rest } = props;
    const isBranchPathControlled = branchPathProp !== undefined;
    const isInputControlled = inputValueProp !== undefined;
    const isValueControlled = valueProp !== undefined;
    const autoCompleteProps = rest;
    const [state, setState] = react_1.useState({
        branchPath: [],
        inputValue: (() => {
            if (defaultValue !== undefined &&
                !multiple &&
                !isValueControlled &&
                !isInputControlled) {
                return getOptionLabelProp
                    ? getOptionLabelProp(defaultValue)
                    : convertToString(defaultValue);
            }
            else {
                return "";
            }
        })(),
        open: false,
        value: (() => {
            if (isValueControlled || defaultValue === undefined) {
                return multiple ? [] : null;
            }
            else if (multiple) {
                return defaultValue.map((v) => new Option(v));
            }
            else if (defaultValue === null) {
                return null;
            }
            else {
                return new Option(defaultValue);
            }
        })(),
    });
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
            return getOptionDisabledProp(option);
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
            return getOptionLabelProp((() => {
                if (option instanceof FreeSoloValue) {
                    return option;
                }
                else if (option instanceof BranchOption) {
                    return option;
                }
                else if (option instanceof Option) {
                    return option.option;
                }
                else {
                    return option;
                }
            })());
        }
        else if (option instanceof Option) {
            return convertToString(option.option);
        }
        else {
            return convertToString(option);
        }
    }, [getOptionLabelProp, loadingText]);
    const getOptionSelected = react_1.useCallback((option, value) => {
        // An Option is NEVER a FreeSoloValue (sanity); BranchOption and
        // LOADING_OPTION are NEVER selectable.
        if (value instanceof FreeSoloValue ||
            option instanceof BranchOption ||
            option === LOADING_OPTION) {
            return false;
        }
        else if (getOptionSelectedProp) {
            return getOptionSelectedProp(option.option, value);
        }
        else {
            return option.option === value;
        }
    }, [getOptionSelectedProp]);
    const filterOptions = react_1.useMemo(() => {
        const filterOptions = filterOptionsProp
            ? (options, state) => {
                const newState = {
                    ...state,
                    getOptionLabel: (option) => state.getOptionLabel(option instanceof BranchOption ? option : new Option(option)),
                };
                return options.filter((option) => filterOptionsProp(option instanceof BranchOption ? option : option.option, newState));
            }
            : useAutocomplete_1.createFilterOptions({
                stringify: getOptionLabel,
            });
        // Parent BranchOption and LOADING_OPTION are NEVER filtered
        return (options, filterOptionsState) => {
            const [staticOpts, filteredOpts] = options.reduce((opts, opt) => {
                const [staticOpts, filteredOpts] = opts;
                // LOADING_OPTION are NEVER filtered
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
        return react_1.default.createElement(core_1.TextField, Object.assign({}, textFieldProps, params));
    }, [textFieldProps]);
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
                branchPath.length > 1 ? (react_1.default.createElement(Tooltip_1.default, { title: branchPath.reduce((pathStr, branch) => {
                        return `${pathStr}${pathStr ? " > " : ""}${getOptionLabel(branch)}`;
                    }, "") },
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
                            ? value.option
                            : new FreeSoloValue(value);
                        const newValue = (multiple
                            ? [...args[1].slice(0, -1), parsedValue]
                            : parsedValue);
                        // Reset input on new value
                        if (multiple) {
                            resetInput(event, "");
                        }
                        else {
                            resetInput(event, getOptionLabel(parsedValue instanceof FreeSoloValue
                                ? parsedValue
                                : value));
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
                    resetInput(event, getOptionLabel(value instanceof FreeSoloValue
                        ? value
                        : new Option(value)));
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
                options.push(option instanceof BranchOption ? option : new Option(option));
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
        getOptionSelected: getOptionSelected, inputValue: inputValue, ListboxProps: ListboxProps, loading: loading && branchPath.length === 0, loadingText: loadingText, multiple: multiple, onBlur: onBlur, onInputChange: onInputChange, onChange: onChange, onClose: onClose, onOpen: onOpen, open: open !== null && open !== void 0 ? open : state.open, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        options: options, renderInput: renderInput, renderOption: renderOption, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: value })));
};
exports.default = TreeSelect;
//# sourceMappingURL=index.js.map