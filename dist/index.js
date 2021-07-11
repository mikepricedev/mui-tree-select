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
var __value_, __parent_, __parent_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultInput = exports.DefaultOption = exports.useTreeSelectStyles = exports.mergeInputEndAdornment = exports.mergeInputStartAdornment = exports.FreeSoloNode = exports.ValueNode = exports.BranchNode = exports.nodeStringifyReplacer = void 0;
const react_1 = __importStar(require("react"));
const Autocomplete_1 = __importDefault(require("@material-ui/lab/Autocomplete"));
const useAutocomplete_1 = require("@material-ui/lab/useAutocomplete");
const TextField_1 = __importDefault(require("@material-ui/core/TextField"));
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const useControlled_1 = __importDefault(require("@material-ui/core/utils/useControlled"));
const react_2 = require("react");
const react_3 = require("react");
const ChevronRight_1 = __importDefault(require("@material-ui/icons/ChevronRight"));
const ChevronLeft_1 = __importDefault(require("@material-ui/icons/ChevronLeft"));
const Divider_1 = __importDefault(require("@material-ui/core/Divider"));
const Typography_1 = __importDefault(require("@material-ui/core/Typography"));
const Tooltip_1 = __importDefault(require("@material-ui/core/Tooltip"));
const Paper_1 = __importDefault(require("@material-ui/core/Paper"));
const Chip_1 = __importDefault(require("@material-ui/core/Chip"));
const SvgIcon_1 = __importDefault(require("@material-ui/core/SvgIcon"));
const react_4 = require("react");
class BaseNode {
    constructor(value) {
        __value_.set(this, void 0);
        __classPrivateFieldSet(this, __value_, value);
    }
    toString() {
        return String(__classPrivateFieldGet(this, __value_));
    }
    valueOf() {
        return __classPrivateFieldGet(this, __value_);
    }
    get [(__value_ = new WeakMap(), Symbol.toStringTag)]() {
        return this.constructor.name;
    }
}
/**
 * Replacer method for {@link JSON.stringify} 2nd argument.
 * This util assists in calling JSON.stringify on a BranchNode, ValueNode,
 * FreeSoloNode, or any object containing the formers.
 */
const nodeStringifyReplacer = (key, value) => value instanceof BaseNode
    ? exports.nodeStringifyReplacer(key, value.valueOf())
    : value;
exports.nodeStringifyReplacer = nodeStringifyReplacer;
class BranchNode extends BaseNode {
    constructor(branch, parent = null) {
        super(branch);
        __parent_.set(this, void 0);
        if (parent === null || parent instanceof BranchNode) {
            __classPrivateFieldSet(this, __parent_, parent);
        }
        else {
            __classPrivateFieldSet(this, __parent_, BranchNode.createBranchNode(parent));
        }
    }
    /**
     * Parent BranchNode
     */
    get parent() {
        return __classPrivateFieldGet(this, __parent_);
    }
    /**
     * Iterates up the branch path starting with self.
     */
    *up() {
        yield this;
        let _parent = __classPrivateFieldGet(this, __parent_);
        while (_parent) {
            yield _parent;
            _parent = _parent.parent;
        }
    }
    /**
     * Iterates down the branch path finishing with self.
     * @alias BranchNode.[Symbol.iterator]
     */
    *down() {
        yield* this;
    }
    /**
     * Iterates down the branch path finishing with self.
     */
    *[(__parent_ = new WeakMap(), Symbol.iterator)]() {
        if (__classPrivateFieldGet(this, __parent_)) {
            yield* __classPrivateFieldGet(this, __parent_);
        }
        yield this;
    }
    /**
     * @param branchPath must iterate from the root "down" the branch path. Wraps
     * the last branch option in the returned {@link BranchNode}.
     */
    static createBranchNode(branchPath) {
        let branchNode = null;
        for (const branch of branchPath) {
            branchNode = new BranchNode(branch, branchNode);
        }
        return branchNode;
    }
    static pathToString(branchNode, { branchToSting = (branchNode) => branchNode.toString(), delimiter = " > ", } = {}) {
        const iter = branchNode.down();
        let iterResult = iter.next();
        if (iterResult.done) {
            return "";
        }
        let pathStr = branchToSting(iterResult.value);
        iterResult = iter.next();
        while (!iterResult.done) {
            pathStr = pathStr + delimiter + branchToSting(iterResult.value);
            iterResult = iter.next();
        }
        return pathStr;
    }
}
exports.BranchNode = BranchNode;
/**
 *  Wrapper for all options and values. Includes the branch path to the option.
 */
class ValueNode extends BaseNode {
    constructor(value, parent = null) {
        super(value);
        __parent_1.set(this, void 0);
        if (parent === null || parent instanceof BranchNode) {
            __classPrivateFieldSet(this, __parent_1, parent);
        }
        else {
            __classPrivateFieldSet(this, __parent_1, BranchNode.createBranchNode(parent));
        }
    }
    /**
     * Parent BranchNode
     */
    get parent() {
        return __classPrivateFieldGet(this, __parent_1);
    }
    /**
     * Iterates up the branch path starting with {@link ValueNode.parent}.
     */
    *up() {
        if (__classPrivateFieldGet(this, __parent_1)) {
            yield* __classPrivateFieldGet(this, __parent_1).up();
        }
    }
    /**
     * Iterates down the branch path finishing with {@link ValueNode.parent}.
     */
    *down() {
        if (__classPrivateFieldGet(this, __parent_1)) {
            yield* __classPrivateFieldGet(this, __parent_1).down();
        }
    }
    /**
     * Iterates down the branch path finishing with {@link ValueNode.parent}.
     */
    *[(__parent_1 = new WeakMap(), Symbol.iterator)]() {
        if (__classPrivateFieldGet(this, __parent_1)) {
            yield* __classPrivateFieldGet(this, __parent_1);
        }
    }
}
exports.ValueNode = ValueNode;
/**
 * Used to tie free solo entries to the tree.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class FreeSoloNode extends ValueNode {
}
exports.FreeSoloNode = FreeSoloNode;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultGetOptionLabel = (option) => String(option);
const BranchPathIcon = react_1.forwardRef((props, ref) => (react_1.default.createElement(SvgIcon_1.default, Object.assign({ style: react_3.useMemo(() => ({
        ...(props.style || {}),
        cursor: "default",
    }), [props.style]), ref: ref }, props),
    react_1.default.createElement("path", { d: "M20 9C18.69 9 17.58 9.83 17.17 11H14.82C14.4 9.84 13.3 9 12 9S9.6 9.84 9.18 11H6.83C6.42 9.83 5.31 9 4 9C2.34 9 1 10.34 1 12S2.34 15 4 15C5.31 15 6.42 14.17 6.83 13H9.18C9.6 14.16 10.7 15 12 15S14.4 14.16 14.82 13H17.17C17.58 14.17 18.69 15 20 15C21.66 15 23 13.66 23 12S21.66 9 20 9" }))));
const mergeInputStartAdornment = (action, adornment, inputProps = {}) => ({
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
const mergeInputEndAdornment = (action, adornment, inputProps = {}) => ({
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
exports.useTreeSelectStyles = makeStyles_1.default({
    listBox: {
        "& > .MuiAutocomplete-option": {
            margin: "0px !important",
            padding: "0px !important",
        },
    },
});
const useDefaultOptionStyles = makeStyles_1.default({
    optionItemContainer: {
        width: "100%",
    },
    upBranchIcon: {
        marginLeft: "-8px",
        marginRight: "24px",
    },
    downBranchIcon: {
        marginLeft: "16px",
    },
    optionItem: {
        width: "100%",
    },
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultFilterOptions = useAutocomplete_1.createFilterOptions();
const DefaultOption = (props) => {
    const classes = useDefaultOptionStyles();
    const { option, curBranch, exitBranchText = "Exit", enterBranchText = "Enter", getOptionLabel, } = props;
    const renderOption = props.renderOption || getOptionLabel;
    const isBranch = option instanceof BranchNode;
    const isUpBranch = isBranch && curBranch === option;
    const optionNode = renderOption(option);
    const optionNodeIsStr = typeof optionNode === "string";
    const optionDiv = (react_1.default.createElement("div", { className: `MuiAutocomplete-option ${classes.optionItemContainer}` }, isUpBranch ? (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(Tooltip_1.default, { title: exitBranchText },
            react_1.default.createElement(ChevronLeft_1.default, { className: classes.upBranchIcon })),
        react_1.default.createElement(Tooltip_1.default, { title: BranchNode.pathToString(option, {
                branchToSting: getOptionLabel,
            }) }, optionNodeIsStr ? (react_1.default.createElement(Typography_1.default, { component: "div", variant: "inherit", color: "inherit", align: "left", noWrap: true }, optionNode)) : (react_1.default.createElement("div", null, optionNode))))) : (react_1.default.createElement(react_1.Fragment, null,
        optionNodeIsStr ? (react_1.default.createElement(Typography_1.default, { className: classes.optionItem, component: "div", variant: "inherit", color: "inherit", align: "left", noWrap: true }, optionNode)) : (react_1.default.createElement("div", { className: classes.optionItem }, optionNode)),
        isBranch && (react_1.default.createElement(Tooltip_1.default, { title: enterBranchText },
            react_1.default.createElement(ChevronRight_1.default, { className: classes.downBranchIcon })))))));
    return isUpBranch ? (react_1.default.createElement("div", { className: classes.optionItemContainer },
        optionDiv,
        react_1.default.createElement(Divider_1.default, null))) : (optionDiv);
};
exports.DefaultOption = DefaultOption;
/**
 * Renders a TextField
 */
const defaultInput = (params) => react_1.default.createElement(TextField_1.default, Object.assign({}, params));
exports.defaultInput = defaultInput;
exports.default = react_1.forwardRef(function TreeSelect(props, ref) {
    const classes = exports.useTreeSelectStyles();
    const isMounted = react_2.useRef(false);
    react_4.useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);
    const { defaultValue = (props.multiple ? [] : null), inputValue: inputValueProp, value: valueProp, branch: branchProp, onChange, onInputChange, onBranchChange, options: optionsProp, renderOption: renderOptionProp, ListboxProps: ListboxPropsProp, getOptionLabel = defaultGetOptionLabel, renderInput: renderInputProp = exports.defaultInput, enterBranchText, exitBranchText, onClose, onOpen, open: openProp, filterOptions: filterOptionsProp = defaultFilterOptions, PaperComponent: PaperComponentProp = Paper_1.default, loadingText = "Loading…", noOptionsText = "No options", renderTags: renderTagsProp, onBlur: onBlurProp, ...rest } = props;
    const [value, setValue] = useControlled_1.default({
        controlled: valueProp,
        default: defaultValue,
        name: "TreeSelect",
        state: "value",
    });
    const [inputValue, setInputValue] = useControlled_1.default({
        controlled: inputValueProp,
        default: "",
        name: "TreeSelect",
        state: "inputValue",
    });
    const [branch, setBranch] = useControlled_1.default({
        controlled: branchProp,
        default: null,
        name: "TreeSelect",
        state: "branch",
    });
    const [open, setOpen] = useControlled_1.default({
        controlled: openProp,
        default: false,
        name: "TreeSelect",
        state: "open",
    });
    const inputValueOnBranchSelect = react_2.useRef("continue");
    const handleChange = react_1.useCallback((event, valueRaw, reason, ...rest) => {
        const newValue = props.multiple
            ? valueRaw[valueRaw.length - 1]
            : valueRaw;
        if (newValue instanceof BranchNode) {
            if (!props.multiple && value) {
                inputValueOnBranchSelect.current = "abort";
            }
            else {
                inputValueOnBranchSelect.current = "clear";
            }
            const [newBranch, direction] = newValue === branch ? [newValue.parent, "up"] : [newValue, "down"];
            setBranch(newBranch);
            if (onBranchChange) {
                onBranchChange(event, newBranch, direction, "select-option");
            }
        }
        else {
            // If value is freeSolo convert to FreeSoloNode
            const newValueParsed = typeof newValue === "string"
                ? new FreeSoloNode(newValue, branch)
                : newValue;
            const value = props.multiple
                ? (valueRaw.length
                    ? [...valueRaw.slice(0, -1), newValueParsed]
                    : valueRaw)
                : newValueParsed;
            setValue(value);
            if (onChange) {
                onChange(event, value, reason, 
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...rest);
            }
            if (reason === "select-option" && !props.disableCloseOnSelect) {
                setOpen(false);
                if (onClose) {
                    onClose(event, "select-option");
                }
            }
        }
    }, [
        props.multiple,
        props.disableCloseOnSelect,
        branch,
        setBranch,
        onBranchChange,
        setValue,
        onChange,
        setOpen,
        onClose,
        value,
    ]);
    const handleInputChange = react_1.useCallback((event, inputValue, reason) => setTimeout(() => {
        // This timeout reverses the call order of onInputChange and onChange
        // in the underlying Autocomplete.  ONLY run if mounted.
        if (!isMounted.current) {
            return;
        }
        if (inputValueOnBranchSelect.current === "abort") {
            inputValueOnBranchSelect.current = "continue";
        }
        else if (inputValueOnBranchSelect.current === "clear") {
            inputValueOnBranchSelect.current = "continue";
            setInputValue("");
            if (onInputChange) {
                onInputChange(event, "", reason);
            }
        }
        else {
            setInputValue(inputValue);
            if (onInputChange) {
                onInputChange(event, inputValue, reason);
            }
        }
    }, 0), [onInputChange, setInputValue]);
    const handleClose = react_1.useCallback((event, reason) => {
        if (reason === "select-option") {
            return;
        }
        setOpen(false);
        if (onClose) {
            onClose(event, reason);
        }
    }, [onClose, setOpen]);
    const handleOpen = react_1.useCallback((...args) => {
        setOpen(true);
        if (onOpen) {
            onOpen(...args);
        }
    }, [onOpen, setOpen]);
    const options = react_3.useMemo(() => (props.loading ? [] : optionsProp).reduce((options, option) => {
        options.push(option instanceof BranchNode ? option : new ValueNode(option, branch));
        return options;
    }, (branch ? [branch] : [])), [props.loading, optionsProp, branch]);
    const renderOption = react_1.useCallback((option, ...rest) => {
        if (renderOptionProp) {
            return renderOptionProp(option, ...rest);
        }
        else {
            return (react_1.default.createElement(exports.DefaultOption, { option: option, curBranch: branch, exitBranchText: exitBranchText, enterBranchText: enterBranchText, getOptionLabel: getOptionLabel }));
        }
    }, [renderOptionProp, branch, exitBranchText, getOptionLabel, enterBranchText]);
    const renderTags = react_1.useCallback((value, getTagProps) => {
        if (renderTagsProp) {
            return renderTagsProp(value, getTagProps);
        }
        else {
            return value.map((option, index) => {
                if (option.parent) {
                    const { key, ...chipProps } = getTagProps({ index });
                    return (react_1.default.createElement(Tooltip_1.default, { key: key, title: BranchNode.pathToString(option.parent, {
                            branchToSting: getOptionLabel,
                        }) },
                        react_1.default.createElement(Chip_1.default, Object.assign({ label: getOptionLabel(option) }, chipProps))));
                }
                else {
                    return (react_1.default.createElement(Chip_1.default, Object.assign({ key: index, label: getOptionLabel(option) }, getTagProps({ index }))));
                }
            });
        }
    }, [renderTagsProp, getOptionLabel]);
    const renderInput = react_1.useCallback((params) => {
        var _a, _b;
        if (props.multiple ||
            !((_a = value) === null || _a === void 0 ? void 0 : _a.parent) ||
            getOptionLabel(value
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) !== ((_b = params === null || params === void 0 ? void 0 : params.inputProps) === null || _b === void 0 ? void 0 : _b.value)) {
            return renderInputProp(params);
        }
        else {
            return renderInputProp({
                ...params,
                InputProps: exports.mergeInputStartAdornment("prepend", react_1.default.createElement(Tooltip_1.default, { title: BranchNode.pathToString(value
                        .parent, {
                        branchToSting: getOptionLabel,
                    }) },
                    react_1.default.createElement(BranchPathIcon, { fontSize: "small" })), params.InputProps),
            });
        }
    }, [getOptionLabel, props.multiple, renderInputProp, value]);
    const noOptions = react_2.useRef(!options.length);
    const filterOptions = react_1.useCallback((options, state) => {
        const filteredOptions = options[0] === branch
            ? [options[0], ...filterOptionsProp(options.slice(1), state)]
            : filterOptionsProp(options, state);
        noOptions.current =
            filteredOptions.length === 0 ||
                (filteredOptions.length === 1 && options[0] === branch);
        return filteredOptions;
    }, [filterOptionsProp, branch]);
    const handleBlur = react_1.useCallback((...args) => {
        const [event] = args;
        // When freeSolo is true and autoSelect is false,  an uncommitted free solo
        // input value stays in the input field on blur, but is not set as a value.
        // NOTE: This is not the case when autoSelect is true.  This ambiguous state
        // and behavior is addressed here.  The behavior will be to clear the input.
        if (props.freeSolo && !props.autoSelect) {
            if (inputValue.trim()) {
                if (props.multiple || value === null) {
                    handleInputChange(event, "", "clear");
                }
                else {
                    handleInputChange(event, getOptionLabel(value), "reset");
                }
            }
        }
        if (onBlurProp) {
            onBlurProp(...args);
        }
    }, [
        props.freeSolo,
        props.autoSelect,
        props.multiple,
        onBlurProp,
        inputValue,
        value,
        handleInputChange,
        getOptionLabel,
    ]);
    const ListBoxProps = react_3.useMemo(() => {
        return {
            className: `MuiAutocomplete-listbox ${classes.listBox}`,
            ...(ListboxPropsProp || {}),
        };
    }, [ListboxPropsProp, classes.listBox]);
    const isRootOptions = !branch;
    const PaperComponent = react_3.useMemo(() => {
        return react_1.forwardRef(({ children = null, ...paperProps }, ref) => {
            return (react_1.default.createElement(PaperComponentProp, Object.assign({}, paperProps, { ref: ref }),
                children,
                props.loading && !isRootOptions ? (react_1.default.createElement("div", { className: "MuiAutocomplete-loading" }, loadingText)) : null,
                !isRootOptions &&
                    noOptions.current &&
                    !props.freeSolo &&
                    !props.loading ? (react_1.default.createElement("div", { className: "MuiAutocomplete-noOptions" }, noOptionsText)) : null));
        });
    }, [
        PaperComponentProp,
        isRootOptions,
        loadingText,
        noOptionsText,
        props.freeSolo,
        props.loading,
    ]);
    return (react_1.default.createElement(Autocomplete_1.default
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    , Object.assign({}, rest, { ref: ref, inputValue: inputValue, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: value, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange: handleChange, onInputChange: handleInputChange, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        options: options, ListboxProps: ListBoxProps, getOptionLabel: getOptionLabel, renderOption: renderOption, renderInput: renderInput, open: open, onClose: handleClose, onOpen: handleOpen, filterOptions: filterOptions, PaperComponent: PaperComponent, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderTags: renderTags, onBlur: handleBlur })));
});
//# sourceMappingURL=index.js.map