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
exports.NodeType = exports.FreeSoloValue = void 0;
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
const primaryTypographyProps = {
    noWrap: true,
};
class Node {
    constructor(value) {
        this.value = value;
    }
    static getValue(value) {
        return value instanceof Node ? value.value : value;
    }
}
class ValueNode extends Node {
    constructor(value) {
        super(value instanceof OptionNode ? value.value : value);
    }
}
class FreeSoloValue extends ValueNode {
}
exports.FreeSoloValue = FreeSoloValue;
class OptionNode extends Node {
}
class ValueOptionNode extends OptionNode {
    constructor(value) {
        super(value);
        this.valueNode = new ValueNode(this);
    }
}
class BranchNode extends OptionNode {
    constructor(value) {
        super(value);
        this.openedBranchNode = new OpenedBranchNode(this);
    }
}
class SelectableBranchNode extends BranchNode {
    constructor(value) {
        super(value);
        this.valueOptionNode = new ValueOptionNode(value);
    }
}
class BranchPathNode extends Node {
}
class OpenedBranchNode extends BranchPathNode {
    constructor(branchNode) {
        super(branchNode.value);
        this.branchNode = branchNode;
        this.loadingBranchNode = new LoadingBranchNode(this);
    }
}
// Placeholder to render "loading" in branch node expansions.
class LoadingBranchNode extends BranchPathNode {
    constructor(openBranchNode) {
        super(openBranchNode.value);
    }
}
var NodeType;
(function (NodeType) {
    NodeType[NodeType["Leaf"] = 0] = "Leaf";
    NodeType[NodeType["Branch"] = 1] = "Branch";
    NodeType[NodeType["SelectableBranch"] = 2] = "SelectableBranch";
})(NodeType = exports.NodeType || (exports.NodeType = {}));
const TreeSelect = (props) => {
    const classes = useStyles();
    const { autoSelect, debug, defaultValue, disableClearable, disableCloseOnSelect, enterBranchText = "Enter", exitBranchText = "Exit", filterOptions: filterOptionsProp, freeSolo, getOptionDisabled: getOptionDisabledProp, getOptionLabel: getOptionLabelProp, getOptions: getOptionsProp, getOptionSelected: getOptionSelectedProp, ListboxProps: ListboxPropsProp = {}, loading: loadingProp, loadingText = "Loading…", multiple, onBlur: onBlurProp, onClose: onCloseProp, onChange: onChangeProp, onOpen: onOpenProp, open, textFieldProps = {}, value: valueProp, ...rest } = props;
    const isValueControlled = valueProp !== undefined;
    const autoCompleteProps = rest;
    const [state, setState] = react_1.useState({
        branchPath: [],
        inputValue: (() => {
            if (!multiple && !isValueControlled && defaultValue) {
                return getOptionLabelProp
                    ? getOptionLabelProp(defaultValue)
                    : defaultValue;
            }
            else {
                return "";
            }
        })(),
        loading: true,
        open: false,
        options: [],
        value: (() => {
            if (isValueControlled || defaultValue === undefined) {
                return multiple ? [] : null;
            }
            else if (multiple) {
                return defaultValue.map((v) => new ValueNode(v));
            }
            else if (defaultValue === null) {
                return null;
            }
            else {
                return new ValueNode(defaultValue);
            }
        })(),
    });
    const getOptions = react_1.useCallback(async (branchNode) => {
        return (await getOptionsProp(branchNode)).map(({ option, type }) => {
            switch (type) {
                case NodeType.Leaf:
                    return new ValueOptionNode(option);
                case NodeType.Branch:
                    return new BranchNode(option);
                case NodeType.SelectableBranch:
                    return new SelectableBranchNode(option);
            }
        });
    }, [getOptionsProp]);
    // Get Root Options
    react_1.useEffect(() => {
        getOptions().then((options) => setState((state) => ({
            ...state,
            loading: false,
            options,
        })));
    }, [setState, getOptions]);
    const getOptionDisabled = react_1.useCallback((option) => {
        if (option instanceof LoadingBranchNode) {
            return true;
        }
        else if (option instanceof OpenedBranchNode) {
            return false;
        }
        else if (state.loading) {
            return true;
        }
        else if (getOptionDisabledProp) {
            return getOptionDisabledProp(option instanceof FreeSoloValue ? option : option.value);
        }
        else {
            return false;
        }
    }, [getOptionDisabledProp, state.loading]);
    const getOptionLabel = react_1.useCallback((option) => {
        const opt = typeof option === "string" ? new FreeSoloValue(option) : option;
        if (getOptionLabelProp) {
            return getOptionLabelProp(opt instanceof FreeSoloValue
                ? opt
                : opt.value);
        }
        else {
            return opt.value;
        }
    }, [getOptionLabelProp]);
    const getOptionSelected = react_1.useCallback((option, value) => {
        if (option instanceof BranchPathNode ||
            option instanceof SelectableBranchNode) {
            return false;
        }
        else if (getOptionSelectedProp) {
            return getOptionSelectedProp(option instanceof FreeSoloValue ? option : option.value, value instanceof FreeSoloValue ? value : value.value);
        }
        else {
            return option.value === value.value;
        }
    }, [getOptionSelectedProp]);
    const filterOptions = react_1.useMemo(() => {
        const filterOptions = (() => {
            if (filterOptionsProp) {
                if (getOptionLabelProp) {
                    return (options, state) => {
                        const convertedState = {
                            ...state,
                            getOptionLabel: getOptionLabelProp,
                        };
                        return options.filter((option) => filterOptionsProp(option.value, convertedState));
                    };
                }
                else {
                    return (options, state) => {
                        const convertedState = {
                            ...state,
                            getOptionLabel: (option) => option,
                        };
                        return options.filter((option) => filterOptionsProp(option.value, convertedState));
                    };
                }
            }
            else {
                return useAutocomplete_1.createFilterOptions({
                    stringify: getOptionLabel,
                });
            }
        })();
        return (options, state) => {
            const [parentNode, opts] = options.reduce((parsed, v) => {
                if (v instanceof BranchPathNode) {
                    parsed[0].push(v);
                }
                else {
                    parsed[1].push(v);
                }
                return parsed;
            }, [[], []]);
            return [...parentNode, ...filterOptions(opts, state)];
        };
    }, [filterOptionsProp, getOptionLabelProp, getOptionLabel]);
    const upOneBranch = react_1.useCallback(() => setState((state) => {
        var _a;
        if (state.cancelLoading) {
            state.cancelLoading();
        }
        const branchPath = state.branchPath.slice(0, state.branchPath.length - 1);
        let isCanceled = false;
        getOptions((_a = lastElm(branchPath)) === null || _a === void 0 ? void 0 : _a.branchNode.value).then((options) => {
            if (isCanceled) {
                return;
            }
            setState((state) => ({
                ...state,
                cancelLoading: undefined,
                loading: false,
                options,
            }));
        });
        return {
            ...state,
            branchPath,
            cancelLoading: () => {
                isCanceled = true;
            },
            // Ensure onInputChange "reset" does not add branch name to
            // input.
            inputValue: "",
            loading: true,
        };
    }), [setState, getOptions]);
    const onClose = react_1.useMemo(() => {
        if (onCloseProp) {
            return onCloseProp;
        }
        else {
            return (...args) => {
                const [, reason] = args;
                switch (reason) {
                    case "select-option":
                        break; //onChange will handle
                    case "escape":
                        if (state.branchPath.length > 0) {
                            upOneBranch();
                        }
                        else {
                            setState((state) => ({
                                ...state,
                                open: false,
                            }));
                        }
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
            };
        }
    }, [setState, debug, upOneBranch, state.branchPath, onCloseProp]);
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
        if (option instanceof OpenedBranchNode) {
            return (react_1.default.createElement(ListItem_1.default, { className: classes.optionNode, component: "div", divider: true },
                react_1.default.createElement(ListItemIcon_1.default, null,
                    react_1.default.createElement(Tooltip_1.default, { title: exitBranchText },
                        react_1.default.createElement(ChevronLeft_1.default, null))),
                state.branchPath.length > 1 ? (react_1.default.createElement(Tooltip_1.default, { title: state.branchPath.reduce((pathStr, branch) => {
                        return `${pathStr}${pathStr ? " > " : ""}${getOptionLabel(branch)}`;
                    }, "") },
                    react_1.default.createElement(ListItemText_1.default, { primaryTypographyProps: primaryTypographyProps, primary: getOptionLabel(option) }))) : (react_1.default.createElement(ListItemText_1.default, { primaryTypographyProps: primaryTypographyProps, primary: getOptionLabel(option) }))));
        }
        else if (option instanceof LoadingBranchNode) {
            return react_1.default.createElement("div", { className: "MuiAutocomplete-loading" }, loadingText);
        }
        else if (state.loading) {
            return (react_1.default.createElement(core_1.Box, { width: "100%" },
                react_1.default.createElement(Skeleton_1.default, { animation: "wave" })));
        }
        else if (option instanceof BranchNode) {
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
        loadingText,
        getOptionLabel,
        classes.optionNode,
        state.branchPath,
        state.loading,
        enterBranchText,
        exitBranchText,
    ]);
    const onInputChange = react_1.useCallback((...args) => {
        const [, inputValue, reason] = args;
        switch (reason) {
            case "input":
                {
                    setState((state) => ({
                        ...state,
                        inputValue,
                    }));
                }
                break;
            case "clear":
                setState((state) => ({
                    ...state,
                    inputValue: "",
                }));
                break;
            case "reset":
                {
                    if (multiple) {
                        setState((state) => ({
                            ...state,
                            inputValue,
                        }));
                    }
                    else {
                        setState((state) => {
                            if (state.value) {
                                return {
                                    ...state,
                                    inputValue: getOptionLabel(state.value),
                                };
                            }
                            else {
                                return {
                                    ...state,
                                    inputValue,
                                };
                            }
                        });
                    }
                }
                break;
        }
    }, [setState, onChangeProp, getOptionLabel, multiple]);
    const onChange = react_1.useCallback((...args) => {
        // Do NOT RUN if value is or contains LoadingBranchNode
        if (multiple
            ? args[1].some((value) => value instanceof LoadingBranchNode)
            : args[1] instanceof LoadingBranchNode) {
            return;
        }
        const addSelectedOption = (newValue) => {
            // ONLY ValueOptionNode should result in a value update here.
            if (multiple) {
                const value = args[1];
                if (isValueControlled) {
                    setState((state) => ({
                        ...state,
                        inputValue: "",
                        open: !!disableCloseOnSelect,
                    }));
                }
                else {
                    // NOT controlled, set value to local state.
                    setState((state) => ({
                        ...state,
                        inputValue: "",
                        value: value.map((v) => v instanceof ValueOptionNode ? v.valueNode : v),
                        open: !!disableCloseOnSelect,
                    }));
                }
                onChangeProp(value.map((v) => (v instanceof FreeSoloValue ? v : v.value)));
            }
            else {
                if (isValueControlled) {
                    setState((state) => ({
                        ...state,
                        inputValue: getOptionLabel(newValue),
                        open: !!disableCloseOnSelect,
                    }));
                }
                else {
                    // NOT controlled, set value to local state.
                    setState((state) => ({
                        ...state,
                        inputValue: getOptionLabel(newValue),
                        value: newValue.valueNode,
                        open: !!disableCloseOnSelect,
                    }));
                }
                onChangeProp(newValue.value);
            }
        };
        const addFreeSoloValue = () => {
            if (multiple) {
                const value = args[1].map((v) => typeof v === "string" ? new FreeSoloValue(v) : v);
                if (isValueControlled) {
                    setState((state) => ({
                        ...state,
                        inputValue: "",
                    }));
                }
                else {
                    // NOT controlled, set value to local state.
                    setState((state) => ({
                        ...state,
                        inputValue: "",
                        value,
                    }));
                }
                onChangeProp(value.map((v) => (v instanceof FreeSoloValue ? v : v.value)));
            }
            else {
                const value = new FreeSoloValue(args[1]);
                if (isValueControlled) {
                    setState((state) => ({
                        ...state,
                        inputValue: value.value,
                    }));
                }
                else {
                    // NOT controlled, set value to local state.
                    setState((state) => ({
                        ...state,
                        inputValue: value.value,
                        value,
                    }));
                }
                onChangeProp(value);
            }
        };
        switch (args[2]) {
            case "select-option": // ONLY new options i.e. NOT free solo
                {
                    const newValue = multiple
                        ? lastElm(args[1])
                        : args[1];
                    if (newValue instanceof OpenedBranchNode) {
                        upOneBranch();
                    }
                    else if (newValue instanceof BranchNode) {
                        //NOTE: SelectableBranchNode inherits from BranchNode e.g. is
                        // accounted for here too.
                        let isCanceled = false;
                        setState((state) => {
                            if (state.cancelLoading) {
                                state.cancelLoading();
                            }
                            return {
                                ...state,
                                branchPath: [...state.branchPath, newValue.openedBranchNode],
                                cancelLoading: () => {
                                    isCanceled = true;
                                },
                                // Ensure onInputChange "reset" does not add branch name to
                                // input.
                                inputValue: "",
                                loading: true,
                            };
                        });
                        getOptions(newValue.value).then((options) => {
                            if (isCanceled) {
                                return;
                            }
                            setState((state) => ({
                                ...state,
                                cancelLoading: undefined,
                                loading: false,
                                options,
                            }));
                        });
                    }
                    else if (newValue instanceof ValueOptionNode) {
                        // ONLY ValueOptionNode should result in a value update here.
                        addSelectedOption(newValue);
                    }
                }
                break;
            case "remove-option": // ONLY called when Multiple is true
                {
                    const value = args[1];
                    if (!isValueControlled) {
                        // NOT controlled, set value to local state.
                        setState((state) => ({
                            ...state,
                            value,
                        }));
                    }
                    onChangeProp(value.map((v) => (v instanceof FreeSoloValue ? v : v.value)));
                }
                break;
            case "clear":
                {
                    if (!isValueControlled) {
                        setState((state) => ({
                            ...state,
                            value: multiple ? [] : null,
                        }));
                    }
                    if (multiple) {
                        onChangeProp([]);
                    }
                    else {
                        onChangeProp(null);
                    }
                }
                break;
            case "blur":
                {
                    const newValue = multiple
                        ? lastElm(args[1])
                        : args[1];
                    if (newValue instanceof ValueOptionNode) {
                        // ONLY ValueOptionNode should result in a value update here.
                        addSelectedOption(newValue);
                    }
                    else if (typeof newValue === "string") {
                        // freeSolo option.
                        addFreeSoloValue();
                    }
                    else if (!multiple) {
                        setState((state) => {
                            if (state.value) {
                                return {
                                    ...state,
                                    inputValue: getOptionLabel(state.value),
                                };
                            }
                            else {
                                return {
                                    ...state,
                                    inputValue: "",
                                };
                            }
                        });
                    }
                }
                break;
            case "create-option": // freeSolo option.
                {
                    addFreeSoloValue();
                }
                break;
        }
    }, [
        onChangeProp,
        multiple,
        setState,
        getOptionLabel,
        getOptions,
        upOneBranch,
        isValueControlled,
        disableCloseOnSelect,
    ]);
    const onBlur = react_1.useCallback((...args) => {
        // When freeSolo is true and autoSelect is false,  an uncommitted free solo
        // input value stays in the input field on blur, but is not set as a value.
        // NOTE: This is not the case when autoSelect is true.  This ambiguous state
        // and behavior is addressed here.  The behavior will be to select the value
        // as a freeSolo value in autoSelect-like manor.
        if (freeSolo && !autoSelect) {
            setState((state) => {
                if (state.inputValue.trim()) {
                    if (multiple) {
                        return {
                            ...state,
                            inputValue: "",
                            value: [
                                ...state.value,
                                new FreeSoloValue(state.inputValue),
                            ],
                        };
                    }
                    else {
                        if (!state.value ||
                            getOptionLabel(state.value) !== state.inputValue) {
                            return {
                                ...state,
                                value: new FreeSoloValue(state.inputValue),
                            };
                        }
                    }
                }
                return state;
            });
        }
        if (onBlurProp) {
            onBlurProp(...args);
        }
    }, [onBlurProp, freeSolo, autoSelect, multiple, getOptionLabel]);
    const options = react_1.useMemo(() => {
        const options = [];
        if (state.branchPath.length > 0) {
            const openBranchNode = lastElm(state.branchPath);
            options.push(openBranchNode);
            if (state.loading) {
                options.push(openBranchNode.loadingBranchNode);
            }
        }
        if (state.loading) {
            return options;
        }
        else {
            return state.options.reduce((options, option) => {
                if (option instanceof SelectableBranchNode) {
                    options.push(option.valueOptionNode, option);
                }
                else {
                    options.push(option);
                }
                return options;
            }, options);
        }
    }, [state.branchPath, state.options, state.loading]);
    const value = react_1.useMemo(() => {
        if (valueProp === undefined) {
            return state.value;
        }
        else if (valueProp === null) {
            return null;
        }
        else if (multiple) {
            return valueProp.map((v) => v instanceof FreeSoloValue ? v : new ValueNode(v));
        }
        else {
            return valueProp instanceof FreeSoloValue
                ? valueProp
                : new ValueNode(valueProp);
        }
    }, [valueProp, multiple, state.value]);
    const ListboxProps = react_1.useMemo(() => {
        if (state.branchPath.length > 0) {
            return {
                ...ListboxPropsProp,
                className: `MuiAutocomplete-listbox ${ListboxPropsProp.className || ""} ${state.loading ? classes.listBoxWLoadingBranchNode : ""}`,
            };
        }
        else {
            return ListboxPropsProp;
        }
    }, [
        ListboxPropsProp,
        state.branchPath,
        state.loading,
        classes.listBoxWLoadingBranchNode,
    ]);
    return (react_1.default.createElement(Autocomplete_1.default, Object.assign({}, autoCompleteProps, { autoSelect: autoSelect, debug: debug, disableClearable: disableClearable, disableCloseOnSelect: disableCloseOnSelect, filterOptions: filterOptions, freeSolo: freeSolo, getOptionDisabled: getOptionDisabled, getOptionLabel: getOptionLabel, getOptionSelected: getOptionSelected, inputValue: state.inputValue, ListboxProps: ListboxProps, loading: loadingProp || state.loading, loadingText: loadingText, multiple: multiple, onBlur: onBlur, onInputChange: onInputChange, onChange: onChange, onClose: onClose, onOpen: onOpen, open: open !== null && open !== void 0 ? open : state.open, options: options, renderInput: renderInput, renderOption: renderOption, value: value })));
};
exports.default = TreeSelect;
//# sourceMappingURL=index.js.map