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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _BaseNode__value_, _BranchNode__parent_, _ValueNode__parent_;
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultInput = exports.DefaultOption = exports.mergeInputEndAdornment = exports.mergeInputStartAdornment = exports.FreeSoloNode = exports.ValueNode = exports.BranchNode = exports.nodeStringifyReplacer = void 0;
const react_1 = __importStar(require("react"));
const lab_1 = require("@material-ui/lab");
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const useControlled_1 = __importDefault(require("@material-ui/core/utils/useControlled"));
const icons_1 = require("@material-ui/icons");
const core_1 = require("@material-ui/core");
class BaseNode {
    constructor(value) {
        _BaseNode__value_.set(this, void 0);
        __classPrivateFieldSet(this, _BaseNode__value_, value, "f");
    }
    toString() {
        return String(__classPrivateFieldGet(this, _BaseNode__value_, "f"));
    }
    valueOf() {
        return __classPrivateFieldGet(this, _BaseNode__value_, "f");
    }
    get [(_BaseNode__value_ = new WeakMap(), Symbol.toStringTag)]() {
        return this.constructor.name;
    }
}
/**
 * Replacer method for {@link JSON.stringify} 2nd argument.
 * This util assists in calling JSON.stringify on a BranchNode, ValueNode,
 * FreeSoloNode, or any object containing the formers.
 */
const nodeStringifyReplacer = (key, value) => value instanceof BaseNode
    ? (0, exports.nodeStringifyReplacer)(key, value.valueOf())
    : value;
exports.nodeStringifyReplacer = nodeStringifyReplacer;
class BranchNode extends BaseNode {
    constructor(branch, parent = null) {
        super(branch);
        _BranchNode__parent_.set(this, void 0);
        if (parent === null || parent instanceof BranchNode) {
            __classPrivateFieldSet(this, _BranchNode__parent_, parent, "f");
        }
        else {
            __classPrivateFieldSet(this, _BranchNode__parent_, BranchNode.createBranchNode(parent), "f");
        }
    }
    /**
     * Parent BranchNode
     */
    get parent() {
        return __classPrivateFieldGet(this, _BranchNode__parent_, "f");
    }
    /**
     * Iterates up the branch path starting with self.
     */
    *up() {
        yield this;
        let _parent = __classPrivateFieldGet(this, _BranchNode__parent_, "f");
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
    *[(_BranchNode__parent_ = new WeakMap(), Symbol.iterator)]() {
        if (__classPrivateFieldGet(this, _BranchNode__parent_, "f")) {
            yield* __classPrivateFieldGet(this, _BranchNode__parent_, "f");
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
        _ValueNode__parent_.set(this, void 0);
        if (parent === null || parent instanceof BranchNode) {
            __classPrivateFieldSet(this, _ValueNode__parent_, parent, "f");
        }
        else {
            __classPrivateFieldSet(this, _ValueNode__parent_, BranchNode.createBranchNode(parent), "f");
        }
    }
    /**
     * Parent BranchNode
     */
    get parent() {
        return __classPrivateFieldGet(this, _ValueNode__parent_, "f");
    }
    /**
     * Iterates up the branch path starting with {@link ValueNode.parent}.
     */
    *up() {
        if (__classPrivateFieldGet(this, _ValueNode__parent_, "f")) {
            yield* __classPrivateFieldGet(this, _ValueNode__parent_, "f").up();
        }
    }
    /**
     * Iterates down the branch path finishing with {@link ValueNode.parent}.
     */
    *down() {
        if (__classPrivateFieldGet(this, _ValueNode__parent_, "f")) {
            yield* __classPrivateFieldGet(this, _ValueNode__parent_, "f").down();
        }
    }
    /**
     * Iterates down the branch path finishing with {@link ValueNode.parent}.
     */
    *[(_ValueNode__parent_ = new WeakMap(), Symbol.iterator)]() {
        if (__classPrivateFieldGet(this, _ValueNode__parent_, "f")) {
            yield* __classPrivateFieldGet(this, _ValueNode__parent_, "f");
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
const BranchPathIcon = (0, react_1.forwardRef)((props, ref) => (react_1.default.createElement(core_1.SvgIcon, { style: (0, react_1.useMemo)(() => ({
        ...(props.style || {}),
        cursor: "default",
    }), [props.style]), ref: ref, ...props },
    react_1.default.createElement("path", { d: "M20 9C18.69 9 17.58 9.83 17.17 11H14.82C14.4 9.84 13.3 9 12 9S9.6 9.84 9.18 11H6.83C6.42 9.83 5.31 9 4 9C2.34 9 1 10.34 1 12S2.34 15 4 15C5.31 15 6.42 14.17 6.83 13H9.18C9.6 14.16 10.7 15 12 15S14.4 14.16 14.82 13H17.17C17.58 14.17 18.69 15 20 15C21.66 15 23 13.66 23 12S21.66 9 20 9" }))));
const mergeInputStartAdornment = (action, adornment, inputProps = {}) => ({
    ...inputProps,
    startAdornment: (() => {
        if (inputProps.startAdornment) {
            return action === "append" ? (react_1.default.createElement(react_1.default.Fragment, null,
                inputProps.startAdornment,
                adornment)) : (react_1.default.createElement(react_1.default.Fragment, null,
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
            return action === "append" ? (react_1.default.createElement(react_1.default.Fragment, null,
                inputProps.endAdornment,
                adornment)) : (react_1.default.createElement(react_1.default.Fragment, null,
                adornment,
                inputProps.endAdornment));
        }
        else {
            return adornment;
        }
    })(),
});
exports.mergeInputEndAdornment = mergeInputEndAdornment;
const useDefaultOptionStyles = (0, makeStyles_1.default)((theme) => ({
    upBranchIcon: {
        marginLeft: `-${theme.spacing(1)}px`,
    },
    downBranchIcon: {
        marginLeft: theme.spacing(2),
    },
}));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultFilterOptions = (0, lab_1.createFilterOptions)();
const defaultListItemTextProps = {
    primaryTypographyProps: {
        noWrap: true,
    },
};
const DefaultOption = (props) => {
    const classes = useDefaultOptionStyles();
    const { props: liProps, option, state: { branch, exitBranchText, enterBranchText, addFreeSoloText, getOptionLabel, }, ListItemTextProps: ListItemTextPropsProp, } = props;
    const isAddFreeSoloOption = option instanceof FreeSoloNode;
    const optionLabel = isAddFreeSoloOption
        ? `${addFreeSoloText} "${getOptionLabel(option)}"`
        : getOptionLabel(option);
    const isBranch = !isAddFreeSoloOption && option instanceof BranchNode;
    const isUpBranch = isBranch && branch === option;
    return (react_1.default.createElement(core_1.ListItem, { ...liProps, dense: true, divider: isUpBranch },
        isUpBranch && (react_1.default.createElement(core_1.Tooltip, { title: exitBranchText },
            react_1.default.createElement(core_1.ListItemIcon, null,
                react_1.default.createElement(icons_1.ChevronLeft, { className: classes.upBranchIcon })))),
        react_1.default.createElement(core_1.ListItemText, { primary: optionLabel, ...defaultListItemTextProps, ...ListItemTextPropsProp }),
        isBranch && !isUpBranch && (react_1.default.createElement(core_1.Tooltip, { title: enterBranchText },
            react_1.default.createElement(icons_1.ChevronRight, { className: classes.downBranchIcon })))));
};
exports.DefaultOption = DefaultOption;
const CaptureOptionPlaceHolder = react_1.default.createElement("div", null);
const CaptureOption = (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
props) => CaptureOptionPlaceHolder;
/**
 * Renders a TextField
 */
const defaultInput = (params) => react_1.default.createElement(core_1.TextField, { ...params });
exports.defaultInput = defaultInput;
exports.default = (0, react_1.forwardRef)(function TreeSelect(props, ref) {
    const { defaultValue = (props.multiple ? [] : null), inputValue: inputValueProp, value: valueProp, branch: branchProp, onChange, onInputChange, onBranchChange: onBranchChangeProp, options: optionsProp, renderOption: renderOptionProp, ListboxComponent: ListboxComponentProp = "ul", getOptionLabel = defaultGetOptionLabel, renderInput: renderInputProp = exports.defaultInput, enterBranchText = "Enter", exitBranchText = "Exit", onClose, onOpen, clearOnBlur: clearOnBlurProp, open: openProp, filterOptions: filterOptionsProp = defaultFilterOptions, PaperComponent: PaperComponentProp = core_1.Paper, loadingText = "Loading…", noOptionsText = "No options", addFreeSoloText = "Add", renderTags: renderTagsProp, onHighlightChange: onHighlightChangeProp, ...rest } = props;
    const [value, setValue] = (0, useControlled_1.default)({
        controlled: valueProp,
        default: defaultValue,
        name: "TreeSelect",
        state: "value",
    });
    const [inputValue, setInputValue] = (0, useControlled_1.default)({
        controlled: inputValueProp,
        default: "",
        name: "TreeSelect",
        state: "inputValue",
    });
    const [branch, setBranch] = (0, useControlled_1.default)({
        controlled: branchProp,
        default: null,
        name: "TreeSelect",
        state: "branch",
    });
    const [open, setOpen] = (0, useControlled_1.default)({
        controlled: openProp,
        default: false,
        name: "TreeSelect",
        state: "open",
    });
    const [highlightedOption, setHighlightedOption] = (0, react_1.useState)(null);
    const handleBranchChange = (0, react_1.useCallback)((...args) => {
        setBranch(args[1]);
        if (onBranchChangeProp) {
            onBranchChangeProp(...args);
        }
    }, [onBranchChangeProp, setBranch]);
    const handleChange = (0, react_1.useCallback)((event, valueRaw, reason, ...rest) => {
        const newValue = props.multiple
            ? valueRaw[valueRaw.length - 1]
            : valueRaw;
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
    }, [props.multiple, branch, setValue, onChange]);
    const handleInputChange = (0, react_1.useCallback)((...args) => {
        setInputValue(args[1]);
        if (onInputChange) {
            onInputChange(...args);
        }
    }, [onInputChange, setInputValue]);
    const handleClose = (0, react_1.useCallback)((...args) => {
        setOpen(false);
        if (onClose) {
            onClose(...args);
        }
    }, [onClose, setOpen]);
    const handleOpen = (0, react_1.useCallback)((...args) => {
        setOpen(true);
        if (onOpen) {
            onOpen(...args);
        }
    }, [onOpen, setOpen]);
    const options = (0, react_1.useMemo)(() => (props.loading ? [] : optionsProp).reduce((options, option) => {
        options.push(option instanceof BranchNode ? option : new ValueNode(option, branch));
        return options;
    }, (branch ? [branch] : [])), [props.loading, optionsProp, branch]);
    const renderOption = (0, react_1.useCallback)((option, state) => (react_1.default.createElement(CaptureOption, { option: option, state: {
            ...state,
            value,
            branch,
            enterBranchText,
            exitBranchText,
            addFreeSoloText,
            getOptionLabel,
        } })), [
        addFreeSoloText,
        branch,
        enterBranchText,
        exitBranchText,
        getOptionLabel,
        value,
    ]);
    const renderTags = (0, react_1.useCallback)((value, getTagProps) => {
        if (renderTagsProp) {
            return renderTagsProp(value, getTagProps);
        }
        else {
            return value.map((option, index) => {
                if (option.parent) {
                    const { key, ...chipProps } = getTagProps({ index });
                    return (react_1.default.createElement(core_1.Tooltip, { key: key, title: BranchNode.pathToString(option.parent, {
                            branchToSting: getOptionLabel,
                        }) },
                        react_1.default.createElement(core_1.Chip, { label: getOptionLabel(option), ...chipProps })));
                }
                else {
                    return (react_1.default.createElement(core_1.Chip, { key: index, label: getOptionLabel(option), ...getTagProps({ index }) }));
                }
            });
        }
    }, [renderTagsProp, getOptionLabel]);
    const handleKeyDown = (0, react_1.useCallback)((event) => {
        if (event.which !== 229) {
            switch (event.key) {
                case "ArrowLeft":
                    if (highlightedOption && highlightedOption === branch) {
                        event.preventDefault();
                        event.stopPropagation();
                        if ((props.multiple && inputValue) || !value) {
                            handleInputChange(event, "", "reset");
                        }
                        handleBranchChange(event, branch.parent, "up", "select-option");
                    }
                    break;
                case "ArrowRight":
                    if (highlightedOption instanceof BranchNode &&
                        highlightedOption !== branch) {
                        event.preventDefault();
                        event.stopPropagation();
                        if ((props.multiple && inputValue) || !value) {
                            handleInputChange(event, "", "reset");
                        }
                        handleBranchChange(event, highlightedOption, "down", "select-option");
                    }
                    break;
                case "Enter":
                    if (highlightedOption && highlightedOption instanceof BranchNode) {
                        event.preventDefault();
                        event.stopPropagation();
                        if ((props.multiple && inputValue) || !value) {
                            handleInputChange(event, "", "reset");
                        }
                        const [nextBranch, direction] = highlightedOption === branch
                            ? [highlightedOption.parent, "up"]
                            : [highlightedOption, "down"];
                        handleBranchChange(event, nextBranch, direction, "select-option");
                    }
                    break;
            }
        }
    }, [
        branch,
        handleBranchChange,
        handleInputChange,
        highlightedOption,
        inputValue,
        props.multiple,
        value,
    ]);
    const renderInput = (0, react_1.useCallback)((params) => {
        var _a, _b;
        const onKeyDown = (event) => {
            handleKeyDown(event);
            if ("onKeyDown" in params && params.onKeyDown) {
                params.onKeyDown(event);
            }
        };
        if (props.multiple ||
            !((_a = value) === null || _a === void 0 ? void 0 : _a.parent) ||
            getOptionLabel(value
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) !== ((_b = params === null || params === void 0 ? void 0 : params.inputProps) === null || _b === void 0 ? void 0 : _b.value)) {
            return renderInputProp({ ...params, onKeyDown });
        }
        else {
            return renderInputProp({
                ...params,
                onKeyDown,
                InputProps: (0, exports.mergeInputStartAdornment)("prepend", react_1.default.createElement(core_1.Tooltip, { title: BranchNode.pathToString(value
                        .parent, {
                        branchToSting: getOptionLabel,
                    }) },
                    react_1.default.createElement(BranchPathIcon, { fontSize: "small" })), params.InputProps),
            });
        }
    }, [getOptionLabel, handleKeyDown, props.multiple, renderInputProp, value]);
    const noOptions = (0, react_1.useRef)(!options.length);
    const filterOptions = (0, react_1.useCallback)((options, state) => {
        const filteredOptions = options[0] === branch
            ? [options[0], ...filterOptionsProp(options.slice(1), state)]
            : filterOptionsProp(options, state);
        if (props.freeSolo && state.inputValue.trim()) {
            filteredOptions.push(new FreeSoloNode(state.inputValue, branch));
        }
        noOptions.current =
            filteredOptions.length === 0 ||
                (filteredOptions.length === 1 && options[0] === branch);
        return filteredOptions;
    }, [branch, filterOptionsProp, props.freeSolo]);
    const handleHighlightChange = (0, react_1.useCallback)((...args) => {
        setHighlightedOption(args[1]);
        if (onHighlightChangeProp) {
            onHighlightChangeProp(...args);
        }
    }, [onHighlightChangeProp]);
    const isRootOptions = !branch;
    const PaperComponent = (0, react_1.useMemo)(() => {
        return (0, react_1.forwardRef)(({ children = null, ...paperProps }, ref) => {
            return (react_1.default.createElement(PaperComponentProp, { ...paperProps, ref: ref },
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
    const ListboxComponent = (0, react_1.useMemo)(() => {
        return react_1.default.forwardRef(({ children, ...rest }, ref) => {
            return (react_1.default.createElement(ListboxComponentProp, { ref: ref, ...rest }, react_1.default.Children.map(children, (optionLi) => {
                if (optionLi &&
                    typeof optionLi === "object" &&
                    "props" in optionLi &&
                    optionLi.props.children) {
                    for (const liContent of react_1.default.Children.toArray(optionLi.props.children)) {
                        if (liContent &&
                            typeof liContent === "object" &&
                            "props" in liContent) {
                            const { option, state, } = liContent.props;
                            const renderOptionProps = {
                                ...optionLi.props,
                                onClick: (event) => {
                                    if (option instanceof BranchNode) {
                                        const [nextBranch, direction] = option === branch
                                            ? [option.parent, "up"]
                                            : [option, "down"];
                                        if ((props.multiple && state.inputValue) ||
                                            !state.value) {
                                            handleInputChange(event, "", "reset");
                                        }
                                        handleBranchChange(
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        event, nextBranch, direction, "select-option");
                                    }
                                    else if (optionLi.props.onClick) {
                                        optionLi.props.onClick(event);
                                    }
                                },
                            };
                            if (renderOptionProp) {
                                return renderOptionProp(renderOptionProps, option, state);
                            }
                            else {
                                return (react_1.default.createElement(exports.DefaultOption, { props: renderOptionProps, option: option, state: state }));
                            }
                        }
                    }
                }
                return optionLi;
            })));
        });
    }, [
        ListboxComponentProp,
        branch,
        handleBranchChange,
        handleInputChange,
        props.multiple,
        renderOptionProp,
    ]);
    return (react_1.default.createElement(lab_1.Autocomplete
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    , { ...rest, ref: ref, inputValue: inputValue, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: value, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange: handleChange, onInputChange: handleInputChange, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        options: options, getOptionLabel: getOptionLabel, renderOption: renderOption, renderInput: renderInput, open: open, clearOnBlur: clearOnBlurProp !== null && clearOnBlurProp !== void 0 ? clearOnBlurProp : (!props.freeSolo || !props.autoSelect), onClose: handleClose, onOpen: handleOpen, filterOptions: filterOptions, PaperComponent: PaperComponent, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderTags: renderTags, onHighlightChange: handleHighlightChange, ListboxComponent: ListboxComponent }));
});
//# sourceMappingURL=index.js.map