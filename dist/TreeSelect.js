import React, { forwardRef, useCallback, useMemo } from "react";
import {
  Autocomplete,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Chip,
  SvgIcon,
  styled,
  Paper,
  getAutocompleteUtilityClass,
  unstable_composeClasses as composeClasses,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import useTreeSelect, { NodeType, FreeSoloNode } from "./useTreeSelect";
// Cloned from Autocomplete for loading and noOptions components
// https://github.com/mui/material-ui/blob/b3645b3fd11dc26a06ea370a41b5bac1026c6792/packages/mui-material/src/Autocomplete/Autocomplete.js#L27
const useUtilityClasses = (classes) => {
  const slots = {
    loading: ["loading"],
    noOptions: ["noOptions"],
  };
  return composeClasses(slots, getAutocompleteUtilityClass, classes);
};
/**
 * Default Option Component.
 */
export const DefaultOption = (props) => {
  const {
    pathDirection = "",
    pathLabel = "",
    enterText = "",
    exitText = "",
    TooltipProps: tooltipProps,
    ListItemTextProps: listItemTextProps,
    ...listItemButtonProps
  } = props;
  return React.createElement(
    ListItemButton,
    { ...listItemButtonProps, component: "li", dense: true },
    pathDirection === "up"
      ? React.createElement(
          React.Fragment,
          null,
          React.createElement(
            Tooltip,
            { ...tooltipProps, title: exitText },
            React.createElement(
              ListItemIcon,
              null,
              React.createElement(ChevronLeftIcon, null)
            )
          ),
          React.createElement(
            Tooltip,
            { title: pathLabel },
            React.createElement(ListItemText, { ...listItemTextProps })
          )
        )
      : React.createElement(ListItemText, { ...listItemTextProps }),
    pathDirection === "down" &&
      React.createElement(
        Tooltip,
        { ...tooltipProps, title: enterText },
        React.createElement(
          ListItemIcon,
          {
            sx: {
              minWidth: "auto",
            },
          },
          React.createElement(ChevronRightIcon, null)
        )
      )
  );
};
/**
 * Returns props for {@link DefaultOption} from arguments of {@link RenderOption}
 */
export const getDefaultOptionProps = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args
) => {
  const [props, node, state] = args;
  const baseProps = {
    dense: true,
    divider: state.pathDirection === "up",
    ...props,
    ListItemTextProps: {
      primary: `${
        node instanceof FreeSoloNode && state.addFreeSoloText
          ? state.addFreeSoloText
          : ""
      }${state.optionLabel}`,
    },
  };
  if (state.pathDirection === "up") {
    return {
      ...baseProps,
      pathDirection: "up",
      pathLabel: state.pathLabel,
      divider: true,
      exitText: state.exitText,
    };
  } else if (state.pathDirection === "down") {
    return {
      ...baseProps,
      pathDirection: "down",
      enterText: state.enterText,
    };
  } else {
    return baseProps;
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultRenderOption = (...args) =>
  React.createElement(DefaultOption, { ...getDefaultOptionProps(...args) });
export const PathIcon = forwardRef(function PathIcon(props, ref) {
  return React.createElement(
    SvgIcon,
    {
      style: useMemo(
        () => ({
          ...(props.style || {}),
          cursor: "default",
        }),
        [props.style]
      ),
      ref: ref,
      ...props,
    },
    React.createElement("path", {
      d: "M20 9C18.69 9 17.58 9.83 17.17 11H14.82C14.4 9.84 13.3 9 12 9S9.6 9.84 9.18 11H6.83C6.42 9.83 5.31 9 4 9C2.34 9 1 10.34 1 12S2.34 15 4 15C5.31 15 6.42 14.17 6.83 13H9.18C9.6 14.16 10.7 15 12 15S14.4 14.16 14.82 13H17.17C17.58 14.17 18.69 15 20 15C21.66 15 23 13.66 23 12S21.66 9 20 9",
    })
  );
});
const defaultPathIcon = React.createElement(PathIcon, { fontSize: "small" });
// Cloned from Autocomplete
// https://github.com/mui/material-ui/blob/b3645b3fd11dc26a06ea370a41b5bac1026c6792/packages/mui-material/src/Autocomplete/Autocomplete.js#L251-L258
const AutocompleteLoading = styled("div", {
  name: "MuiAutocomplete",
  slot: "Loading",
  overridesResolver: (_, styles) => styles.loading,
})(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: "14px 16px",
}));
// Cloned from Autocomplete
// https://github.com/mui/material-ui/blob/b3645b3fd11dc26a06ea370a41b5bac1026c6792/packages/mui-material/src/Autocomplete/Autocomplete.js#L260-L267
const AutocompleteNoOptions = styled("div", {
  name: "MuiAutocomplete",
  slot: "NoOptions",
  overridesResolver: (props, styles) => styles.noOptions,
})(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: "14px 16px",
}));
export const TreeSelect = (props) => {
  const {
    addFreeSoloText = "Add: ",
    branch,
    defaultBranch,
    enterText = "Enter",
    exitText = "Exit",
    getChildren,
    getParent,
    isBranch,
    loadingText = "Loading…",
    noOptionsText = "No options",
    onBranchChange,
    onError,
    PaperComponent: PaperComponentProp = Paper,
    pathIcon = defaultPathIcon,
    renderOption: renderOptionProp = defaultRenderOption,
    renderInput: renderInputProp,
    ...restProps
  } = props;
  const {
    getPathLabel,
    getOptionLabel,
    handleOptionClick,
    isAtRoot,
    loadingOptions,
    noOptions,
    ...restTreeOpts
  } = useTreeSelect({
    branch,
    defaultBranch,
    getChildren,
    getParent,
    isBranch,
    onBranchChange,
    onError,
    ...restProps,
  });
  const classesClone = useUtilityClasses(props.classes);
  const PaperComponent = useMemo(() => {
    return forwardRef(({ children = null, ...paperProps }, ref) => {
      return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        React.createElement(
          PaperComponentProp,
          { ...paperProps, ref: ref },
          children,
          loadingOptions && !isAtRoot
            ? React.createElement(
                AutocompleteLoading,
                { className: classesClone.loading },
                loadingText
              )
            : null,
          !isAtRoot && !!noOptions.current && !loadingOptions
            ? React.createElement(
                AutocompleteNoOptions,
                {
                  className: classesClone.noOptions,
                  role: "presentation",
                  onMouseDown: (event) => {
                    // Prevent input blur when interacting with the "no options" content
                    event.preventDefault();
                  },
                },
                noOptionsText
              )
            : null
        )
      );
    });
  }, [
    PaperComponentProp,
    classesClone.loading,
    classesClone.noOptions,
    isAtRoot,
    loadingOptions,
    loadingText,
    noOptions,
    noOptionsText,
  ]);
  const renderInput = useMemo(() => {
    if (props.multiple) {
      return renderInputProp;
    } else {
      return (params) =>
        renderInputProp({
          ...params,
          InputProps: {
            ...params.InputProps,
            startAdornment: (() => {
              if (restTreeOpts.value) {
                return React.createElement(
                  React.Fragment,
                  null,
                  React.createElement(
                    Tooltip,
                    { title: getPathLabel(restTreeOpts.value, true) },
                    pathIcon ||
                      React.createElement(PathIcon, { fontSize: "small" })
                  ),
                  params.InputProps.startAdornment || null
                );
              } else {
                return params.InputProps.startAdornment;
              }
            })(),
          },
        });
    }
  }, [
    getPathLabel,
    pathIcon,
    props.multiple,
    renderInputProp,
    restTreeOpts.value,
  ]);
  const renderOption = useCallback(
    ({ onClick, ...props }, option, state) => {
      const { type, node } = option;
      const isUpBranch = type === NodeType.UP_BRANCH;
      const isDownBranch = type === NodeType.DOWN_BRANCH;
      return renderOptionProp(
        {
          ...props,
          key: `${props.key}-${type}`,
          onClick: (...args) => {
            handleOptionClick(option);
            onClick(...args);
          },
        },
        node,
        {
          ...state,
          addFreeSoloText,
          pathDirection: isUpBranch ? "up" : isDownBranch ? "down" : undefined,
          pathLabel:
            isUpBranch || isDownBranch
              ? getPathLabel(option, true)
              : getPathLabel(option, false),
          disabled: isUpBranch ? false : !!props["aria-disabled"],
          enterText,
          exitText,
          optionLabel: getOptionLabel(option),
        }
      );
    },
    [
      renderOptionProp,
      addFreeSoloText,
      getPathLabel,
      enterText,
      exitText,
      getOptionLabel,
      handleOptionClick,
    ]
  );
  const renderTags = useMemo(() => {
    return (value, getTagProps) =>
      value.map((option, index) => {
        const { key, ...tagProps } = getTagProps({ index });
        const title = getPathLabel(option, true);
        return React.createElement(
          Tooltip,
          { key: key, title: title },
          React.createElement(Chip, {
            label: getOptionLabel(option),
            size: props.size || "medium",
            ...tagProps,
            ...props.ChipProps,
          })
        );
      });
  }, [getPathLabel, getOptionLabel, props.ChipProps, props.size]);
  return React.createElement(
    Autocomplete,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {
      ...restProps,
      ...restTreeOpts,
      getOptionLabel: getOptionLabel,
      loading: loadingOptions,
      PaperComponent: PaperComponent,
      renderInput: renderInput,
      renderOption: renderOption,
      renderTags: renderTags,
    }
  );
};
export default TreeSelect;
//# sourceMappingURL=TreeSelect.js.map