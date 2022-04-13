import React, { useCallback, useMemo } from "react";
import {
  Autocomplete,
  AutocompleteProps,
  AutocompleteRenderGetTagProps,
  AutocompleteRenderOptionState,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Chip,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import useTreeSelect, {
  UseTreeSelectProps,
  Option,
  TreeSelectFreeSoloValueMapping,
  InternalOption,
  OptionType,
  InternalValue,
} from "./useTreeSelect";

type NonNullableAutocompleteProp<
  Prop extends keyof AutocompleteProps<
    Node,
    Multiple,
    DisableClearable,
    FreeSolo
  >,
  Node,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
> = NonNullable<
  AutocompleteProps<Node, Multiple, DisableClearable, FreeSolo>[Prop]
>;

type NullableAutocompleteProp<
  Prop extends keyof AutocompleteProps<
    Node,
    Multiple,
    DisableClearable,
    FreeSolo
  >,
  Node,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
> = AutocompleteProps<Node, Multiple, DisableClearable, FreeSolo>[Prop];

export interface TreeSelectProps<
  Node,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> extends UseTreeSelectProps<Node, Multiple, DisableClearable, FreeSolo>,
    Omit<
      AutocompleteProps<Node, Multiple, DisableClearable, FreeSolo>,
      | keyof UseTreeSelectProps<Node, Multiple, DisableClearable, FreeSolo>
      | "loading"
      | "options"
      | "renderOption"
      | "renderTags"
    > {
  /**
   * Override the default down branch icon tooltip `title`.
   *
   * @default 'Enter'
   */
  enterText?: string;

  /**
   * Override the default up branch icon tooltip `title`.
   *
   * @default 'Exit'
   */
  exitText?: string;

  /**
   * 	Render the option, use `getOptionLabel` by default.
   */
  renderOption?: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: Option<Node>,
    state: AutocompleteRenderOptionState
  ) => React.ReactNode;

  /**
   * Render the selected value.
   */
  renderTags?: (
    value: Option<
      Node,
      TreeSelectFreeSoloValueMapping<Node, FreeSolo>,
      "leaf"
    >[],
    getTagProps: AutocompleteRenderGetTagProps
  ) => React.ReactNode;
}

export const TreeSelect = <
  Node,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(
  props: TreeSelectProps<Node, Multiple, DisableClearable, FreeSolo>
): JSX.Element => {
  const {
    branch,
    defaultBranch,
    enterText = "Enter",
    exitText = "Exit",
    getChildren,
    getOptionKey: getOptionKeyProp,
    getParent,
    isBranch,
    onBranchChange,
    onError,
    // renderOption: renderOptionProp,
    ...restProps
  } = props;

  const {
    branchPath,
    getBranchPathLabel,
    getOptionKey,
    getOptionLabel,
    handleOptionClick,
    loadingOptions,
    ...restTreeOpts
  } = useTreeSelect({
    branch,
    defaultBranch,
    getChildren,
    getOptionKey: getOptionKeyProp,
    getParent,
    isBranch,
    onBranchChange,
    onError,
    ...restProps,
  });

  const renderOption = useCallback<
    NonNullableAutocompleteProp<"renderOption", InternalOption<Node>>
  >(
    ({ onClick, ...props }, option, { selected }) => {
      const [, type] = option;

      const isUpBranch = type === OptionType.UP_BRANCH;
      const isDownBranch = type === OptionType.DOWN_BRANCH;

      const disabled = isUpBranch ? false : !!props["aria-disabled"];

      const key = getOptionKey(option, {
        key: (props as { key: string }).key,
      });

      return (
        <ListItemButton
          {...props}
          key={key}
          onClick={(
            ...args: Parameters<React.MouseEventHandler<HTMLLIElement>>
          ) => {
            handleOptionClick(isUpBranch || isDownBranch);
            (onClick as React.MouseEventHandler<HTMLLIElement>)(...args);
          }}
          component="li"
          dense
          divider={isUpBranch}
          disabled={disabled}
          selected={selected && !isUpBranch}
        >
          {isUpBranch ? (
            <>
              <Tooltip title={exitText}>
                <ListItemIcon>
                  <ChevronLeftIcon />
                </ListItemIcon>
              </Tooltip>
              <Tooltip title={getBranchPathLabel(branchPath)}>
                <ListItemText primary={getOptionLabel(option)} />
              </Tooltip>
            </>
          ) : (
            <ListItemText primary={getOptionLabel(option)} />
          )}

          {isDownBranch && (
            <Tooltip title={enterText}>
              <ListItemIcon
                sx={{
                  minWidth: "auto",
                }}
              >
                <ChevronRightIcon />
              </ListItemIcon>
            </Tooltip>
          )}
        </ListItemButton>
      );
    },
    [
      branchPath,
      enterText,
      exitText,
      getBranchPathLabel,
      getOptionKey,
      getOptionLabel,
      handleOptionClick,
    ]
  );

  const renderTags = useMemo<
    NonNullableAutocompleteProp<
      "renderTags",
      InternalValue<Node, Multiple, false, FreeSolo>
    >
  >(() => {
    return (value, getTagProps) =>
      value.map((option, index) => {
        const { key, ...tagProps } = getTagProps({ index });

        const title = getBranchPathLabel(
          (option as InternalValue<Node, Multiple, false, false>).slice(1)
        );

        return (
          <Tooltip key={key} title={title}>
            <Chip
              label={getOptionLabel(option)}
              size={props.size || "medium"}
              {...tagProps}
              {...props.ChipProps}
            />
          </Tooltip>
        );
      });
  }, [getBranchPathLabel, getOptionLabel, props.ChipProps, props.size]);

  return (
    <Autocomplete
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(restProps as any)}
      {...restTreeOpts}
      getOptionLabel={getOptionLabel}
      loading={loadingOptions}
      renderOption={renderOption}
      renderTags={renderTags}
    />
  );
};

export default TreeSelect;
