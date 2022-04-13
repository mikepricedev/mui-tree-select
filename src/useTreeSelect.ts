import {
  UseAutocompleteProps,
  AutocompleteValue,
  AutocompleteHighlightChangeReason,
  createFilterOptions,
  AutocompleteChangeReason,
  AutocompleteChangeDetails,
  AutocompleteInputChangeReason,
} from "@mui/base";
import useControlled from "@mui/utils/useControlled";
import { useCallback, useMemo, useRef } from "react";
import usePromise from "./usePromise";

/**
 * @internal
 * @ignore
 */
type SyncOrAsync<T> = T | Promise<T>;

/**
 * @internal
 * @ignore
 */
type Writable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * @internal
 * @ignore
 */
export type NonNullableUseAutocompleteProp<
  Prop extends keyof UseAutocompleteProps<
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
  UseAutocompleteProps<Node, Multiple, DisableClearable, FreeSolo>[Prop]
>;

/**
 * @internal
 * @ignore
 */
export type NullableUseAutocompleteProp<
  Prop extends keyof UseAutocompleteProps<
    Node,
    Multiple,
    DisableClearable,
    FreeSolo
  >,
  Node,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
> = UseAutocompleteProps<Node, Multiple, DisableClearable, FreeSolo>[Prop];

/**
 * Wrapper for free solo values.
 *
 * @remarks FreeSoloNode is always a leaf node.
 */
export class FreeSoloNode<Node> extends String {
  constructor(freeSoloValue: string, readonly parent: Node | null = null) {
    super(freeSoloValue);
  }
}

export type TreeSelectFreeSoloValueMapping<Node, FreeSolo> =
  FreeSolo extends true ? FreeSoloNode<Node> : never;

/**
 * @internal
 * @ignore
 */
export type InternalValue<
  Node,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> = Multiple extends undefined | false
  ? DisableClearable extends true
    ? Readonly<
        [Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>, ...Node[]]
      > | null
    : Readonly<
        [Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>, ...Node[]]
      >
  : Readonly<
      [Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>, ...Node[]]
    >;

/**
 * Cannot use the type InternalValue directly due to https://github.com/mui/material-ui/issues/32272#issue-1202300067.
 *
 * This Proxy is used to defeat Array.isArray.
 *
 * @internal
 * @ignore
 */
const initInternalValue = <
  Node,
  Multiple extends boolean | undefined,
  FreeSolo extends boolean | undefined
>(
  value: InternalValue<Node, Multiple, false, FreeSolo>
): InternalValue<Node, Multiple, false, FreeSolo> =>
  new Proxy(
    { target: value as InternalValue<Node, Multiple, false, FreeSolo> },
    {
      defineProperty({ target }, prop, attributes) {
        return Reflect.defineProperty(target, prop, attributes);
      },
      deleteProperty({ target }, prop) {
        return Reflect.deleteProperty(target, prop);
      },
      get({ target }, prop) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof target[prop as any] === "function") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (...args: any[]) => (target[prop as any] as any)(...args);
        }
        return Reflect.get(target, prop, target);
      },
      has({ target }, prop) {
        return Reflect.has(target, prop);
      },
      isExtensible({ target }) {
        return Reflect.isExtensible(target);
      },
      ownKeys({ target }) {
        return Reflect.ownKeys(target);
      },
      set({ target }, prop, value) {
        return Reflect.set(target, prop, value, target);
      },
      setPrototypeOf({ target }, prototype) {
        return Reflect.setPrototypeOf(target, prototype);
      },
    }
  ) as unknown as InternalValue<Node, Multiple, false, FreeSolo>;

export type NodeType = "leaf" | "downBranch" | "upBranch";

/**
 * Option signature for callback `option` parameters.
 *
 * @remarks `path` ascends ancestors of `option`
 */
export type Option<
  Node,
  AppendOption = never,
  Type extends NodeType = NodeType
> = Readonly<
  [option: Node | AppendOption, type: Type, path: ReadonlyArray<Node>]
>;

/**
 * Guarantee uniqueness internally with `symbol`s.
 * @internal
 * @ignore
 */
export type OptionType = typeof VALUE | typeof DOWN_BRANCH | typeof UP_BRANCH;

/**
 * `InternalOption` differs from `Option` to allow for uniqueness internally via and a friendly api externally.
 *
 * @internal
 * @ignore
 */
export type InternalOption<
  Node, 
  AppendOption = never,
> = Readonly<[
  option: Node | AppendOption, 
  type: OptionType
]>;

export type BranchChangeDirection = "up" | "down";

export interface UseTreeSelectProps<
  Node,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> extends Pick<
    UseAutocompleteProps<
      Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>,
      Multiple,
      DisableClearable,
      false
    >,
    | "componentName"
    | "defaultValue"
    | "inputValue"
    | "multiple"
    | "onClose"
    | "onOpen"
    | "open"
    | "value"
  > {
  /**
   * The active **Branch** Node.  This Node's children will be displayed in the select menu.
   */
  branch?: Node | null;

  /**
   * The default branch. Use when the component is not controlled.
   */
  defaultBranch?: Node | null;

  /**
   * A function that determines the filtered options to be rendered on search.
   */
  filterOptions?: NonNullableUseAutocompleteProp<
    "filterOptions",
    Option<Node, never, Exclude<NodeType, "upBranch">>,
    Multiple,
    DisableClearable,
    FreeSolo
  >;

  /**
   * If true, the Autocomplete is free solo, meaning that the user input is not bound to provided options.
   */
  freeSolo?: boolean;

  /**
   * Used to determine the string value of a branch path.
   *
   * @remarks `branchPath` ascends ancestors.
   */
  getBranchPathLabel?: (branchPath: ReadonlyArray<Node>) => string;

  /**
   * Retrieves the child nodes of `node`.
   *
   * @param node When `null`, {@link useTreeSelect} is requesting root select options.
   *
   * @returns **Child** Nodes or a nullish value when `node` does not have children.
   *
   * @remarks Returning a nullish value indicates that `node` is a **Leaf** Node.
   *
   */
  getChildren: (node: Node | null) => SyncOrAsync<Node[] | null | undefined>;

  /**
   * Used to determine the disabled state for a given option.
   *
   * @param path Index `0` is the **Parent** Node of `option`.
   */
  getOptionDisabled?: (
    option: Option<Node, never, Exclude<NodeType, "upBranch">>
  ) => boolean;

  /**
   * Used to create a unique key for option list render items.
   */
  getOptionKey?: (
    option: Option<Node>,
    state: {
      key: string;
    }
  ) => string;

  /**
   * Used to determine the string value for a given option. It's used to fill the input (and the list box options if renderOption is not provided).
   *
   * @param path Index `0` is the **Parent** Node of `option`.
   */
  getOptionLabel?: (
    option: Option<Node, TreeSelectFreeSoloValueMapping<Node, FreeSolo>>
  ) => string;

  /**
   * Retrieves the parent of `node`.
   *
   * @returns **Branch** Node parent of `node` or a nullish value when `node` does not have a parent.
   *
   * @remarks Returning a nullish value indicates that `node` is a root select option.
   */
  getParent: (node: Node) => SyncOrAsync<Node | null | undefined>;

  /**
   * If provided, the options will be grouped under the returned string. The groupBy value is also used as the text for group headings when `renderGroup` is not provided.
   */
  groupBy?: (
    option: Option<Node, never, Exclude<NodeType, "upBranch">>
  ) => string;

  /**
   * Determines if a select option is a **Branch** or **Leaf** Node.
   *
   * @remarks Overrides default behavior which is to call {@link UseTreeSelectProps.getChildren} and to infer `node` type from the return value.
   */
  isBranch?: (node: Node) => SyncOrAsync<boolean>;

  /**
   * By default all **Branch** Nodes are not selectable as values, they are only a navigation option.  This behavior can be changed by providing this method.
   *
   * @returns When `false`, `branchNode` is a navigation option.  When `true`, `branchNode` can be navigated and/or selected as a value.
   *
   */
  isBranchSelectable?: (branchNode: Node) => SyncOrAsync<boolean>;

  /**
   *
   */
  isOptionEqualToValue?: (
    option: Option<Node, TreeSelectFreeSoloValueMapping<Node, FreeSolo>>,
    value: Option<Node, TreeSelectFreeSoloValueMapping<Node, FreeSolo>>
  ) => boolean;

  /**
   * Callback fired when active branch changes.
   *
   * @param direction Indicates the direction of  along the tree.
   */
  onBranchChange?: (
    event: React.SyntheticEvent,
    branchNode: Node | null,
    direction: BranchChangeDirection
  ) => void;

  /**
   *  Callback fired when the value changes.
   */
  onChange?: (
    event: React.SyntheticEvent,
    value: AutocompleteValue<
      Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>,
      Multiple,
      DisableClearable,
      false
    >,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<
      Option<Node, TreeSelectFreeSoloValueMapping<Node, FreeSolo>, "leaf">
    >
  ) => void;

  /**
   *  Callback fired when the highlight option changes.
   */
  onHighlightChange?: (
    event: React.SyntheticEvent,
    option: Option<Node> | null,
    reason: AutocompleteHighlightChangeReason
  ) => void;

  /**
   * Callback fired when the input value changes.
   */
  onInputChange?: (
    event: React.SyntheticEvent,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => void;

  /**
   * Error Handler for async return values from:
    - {@link UseTreeSelectProps.getParent}
    - {@link UseTreeSelectProps.getChildren}
    - {@link UseTreeSelectProps.isBranch}
    - {@link UseTreeSelectProps.isBranchSelectable}
   */
  onError?: (error: Error) => void;
}

const VALUE: unique symbol = Symbol("VALUE");
const DOWN_BRANCH: unique symbol = Symbol("DOWN_BRANCH");
const UP_BRANCH: unique symbol = Symbol("UP_BRANCH");

/**
 * Option Types are unique internally to allow all possible values.
 *
 * @internal
 * @ignore
 */
export const OptionType = {
  VALUE,
  DOWN_BRANCH,
  UP_BRANCH,
} as const;

/**
 *
 * @internal
 * @ignore
 */
export const getNodeTypeFromOptionType = <Type extends NodeType = NodeType>(
  optionType: OptionType
): Type => {
  switch (optionType) {
    case OptionType.VALUE:
      return "leaf" as Type;
    case OptionType.DOWN_BRANCH:
      return "downBranch" as Type;
    case OptionType.UP_BRANCH:
      return "upBranch" as Type;
  }
};

const getOptionTypeFromNodeType = (nodeType: NodeType): OptionType => {
  switch (nodeType) {
    case "leaf":
      return OptionType.VALUE;
    case "downBranch":
      return OptionType.DOWN_BRANCH;
    case "upBranch":
      return OptionType.UP_BRANCH;
  }
};

const getOptionBranchPath = <Node>(
  optionType: OptionType,
  branchPath: Node[] | ReadonlyArray<Node>
): ReadonlyArray<Node> =>
  !branchPath.length || optionType !== OptionType.UP_BRANCH
    ? branchPath.slice(0)
    : branchPath.slice(1); // First elem of branchPath IS the up branch

const getOptionFromInternalOptionOrValue = <
  Node,
  FreeSolo extends undefined | boolean,
  Type extends NodeType = NodeType
>(
  internalOptOrVal:
    | InternalOption<Node, TreeSelectFreeSoloValueMapping<Node, FreeSolo>>
    | InternalValue<Node, true | false, false, FreeSolo>,
  branchPath: Node[] | ReadonlyArray<Node>
): Option<Node, TreeSelectFreeSoloValueMapping<Node, FreeSolo>, Type> => {
  const [option, maybeType, ...restBranchPath] = internalOptOrVal;

  switch (maybeType) {
    case OptionType.DOWN_BRANCH:
    case OptionType.UP_BRANCH:
    case OptionType.VALUE:
      return [
        option,
        getNodeTypeFromOptionType(maybeType),
        getOptionBranchPath(maybeType, branchPath),
      ] as const;
    default:
      return [
        option,
        "leaf" as Type,
        maybeType === undefined
          ? restBranchPath
          : [maybeType, ...restBranchPath],
      ] as const;
  }
};

const getPathToNodeIncl = <Node, FreeSolo extends boolean | undefined>(
  nodes: Writable<InternalValue<Node, true | false, false, FreeSolo>>,
  getParent: (node: Node) => SyncOrAsync<Node | null | undefined>
): SyncOrAsync<InternalValue<Node, true | false, false, FreeSolo>> => {
  const node = nodes[nodes.length - 1];

  let parent = node instanceof FreeSoloNode ? node.parent : getParent(node);

  while (parent !== null && parent !== undefined) {
    if (parent instanceof Promise) {
      return (async () => {
        const parentNode = await parent;
        if (parentNode !== null && parentNode !== undefined) {
          nodes.push(parentNode);
          return getPathToNodeIncl<Node, FreeSolo>(nodes, getParent);
        }
        return nodes;
      })();
    } else {
      nodes.push(parent);
      parent = getParent(parent);
    }
  }

  return nodes;
};

const defaultFilterOptions =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createFilterOptions<Option<any, never, Exclude<NodeType, "upBranch">>>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultGetOptionLabel = ([node]: Option<any>): string => String(node);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultGetOptionDisabled = () => false;

const defaultGetOptionKey = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [, type]: Option<any>,
  { key }: { key: string }
): string => `${key}-${type}`;

const defaultIsOptionEqualToValue = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [node]: Option<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [value]: Option<any>
): boolean => node === value;

export const useTreeSelect = <
  Node,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>({
  branch: branchProp,
  componentName = "useTreeSelect",
  defaultBranch,
  defaultValue,
  filterOptions: filterOptionsProp = defaultFilterOptions,
  freeSolo,
  getBranchPathLabel: getBranchPathLabelProp,
  getChildren,
  getOptionDisabled: getOptionDisabledProp = defaultGetOptionDisabled,
  getOptionLabel: getOptionLabelProp = defaultGetOptionLabel,
  getOptionKey: getOptionKeyProp = defaultGetOptionKey,
  getParent,
  groupBy: groupByProp,
  inputValue: inputValueProp,
  isBranch: isBranchProp,
  isBranchSelectable: isBranchSelectableProp,
  isOptionEqualToValue: isOptionEqualToValueProp = defaultIsOptionEqualToValue,
  multiple,
  onError,
  onBranchChange,
  onChange: onChangeProp,
  onClose: onCloseProp,
  onHighlightChange: onHighlightChangeProp,
  onInputChange: onInputChangeProp,
  onOpen: onOpenProp,
  open: openProp,
  value: valueProp,
}: UseTreeSelectProps<Node, Multiple, DisableClearable, FreeSolo>): {
  branchPath: ReadonlyArray<Node>;
  filterOptions: NonNullableUseAutocompleteProp<
    "filterOptions",
    InternalOption<Node>,
    Multiple,
    DisableClearable,
    FreeSolo
  >;
  getBranchPathLabel: (branchPath: ReadonlyArray<Node>) => string;
  getOptionDisabled: NonNullableUseAutocompleteProp<
    "getOptionDisabled",
    InternalOption<Node>,
    Multiple,
    DisableClearable,
    FreeSolo
  >;
  getOptionKey: (
    option: InternalOption<Node, TreeSelectFreeSoloValueMapping<Node, FreeSolo>>,
    state: {
      key: string;
    }
  ) => string;
  getOptionLabel: NonNullableUseAutocompleteProp<
    "getOptionLabel",
    InternalOption<Node> | InternalValue<Node, Multiple, false, FreeSolo>,
    Multiple,
    DisableClearable,
    FreeSolo
  >;
  groupBy?: NullableUseAutocompleteProp<
    "groupBy",
    InternalOption<Node> | InternalValue<Node, Multiple, false, false>,
    Multiple,
    DisableClearable,
    FreeSolo
  >;
  handleOptionClick: (isOptionBranch: boolean) => void;
  inputValue: string;
  isOptionEqualToValue: NonNullableUseAutocompleteProp<
    "isOptionEqualToValue",
    InternalOption<Node> | InternalValue<Node, Multiple, false, FreeSolo>,
    Multiple,
    DisableClearable,
    FreeSolo
  >;
  loadingOptions: boolean;
  onChange: NullableUseAutocompleteProp<
    "onChange",
    | InternalOption<Node>
    | InternalValue<Node, Multiple, DisableClearable, FreeSolo>,
    Multiple,
    DisableClearable,
    FreeSolo
  >;
  onClose: NonNullableUseAutocompleteProp<
    "onClose",
    InternalOption<Node>,
    Multiple,
    DisableClearable,
    FreeSolo
  >;
  onHighlightChange: NonNullableUseAutocompleteProp<
    "onHighlightChange",
    InternalOption<Node>,
    Multiple,
    DisableClearable,
    FreeSolo
  >;
  onInputChange: NonNullableUseAutocompleteProp<
    "onInputChange",
    InternalOption<Node>,
    Multiple,
    DisableClearable,
    FreeSolo
  >;
  onOpen: NonNullableUseAutocompleteProp<
    "onOpen",
    InternalOption<Node>,
    Multiple,
    DisableClearable,
    FreeSolo
  >;
  open: boolean;
  options: ReadonlyArray<InternalOption<Node>>;
  value: InternalValue<Node, Multiple, DisableClearable, FreeSolo>;
} => {
  const [inputValue, setInputValue] = useControlled({
    controlled: inputValueProp,
    default: "",
    name: componentName,
    state: "inputValue",
  });

  const [curValue, setValue] = useControlled({
    controlled: valueProp,
    default: multiple && defaultValue === undefined ? [] : defaultValue,
    name: componentName,
    state: "value",
  });

  const [curBranch, setBranch] = useControlled({
    controlled: branchProp,
    default: defaultBranch ?? null,
    name: componentName,
    state: "branch",
  });

  const [open, setOpen] = useControlled({
    controlled: openProp,
    default: false,
    name: componentName,
    state: "open",
  });

  const isBranch = useMemo(
    () =>
      isBranchProp ||
      ((node: Node) => {
        const result = getChildren(node);
        if (result instanceof Promise) {
          return (async () => !!(await result))();
        }
        return !!result;
      }),
    [getChildren, isBranchProp]
  );

  const isBranchSelectable = useMemo(
    () => isBranchSelectableProp || (() => false),
    [isBranchSelectableProp]
  );

  const branchPathResult = usePromise(
    useMemo(
      () =>
        curBranch === null || curBranch === undefined
          ? []
          : getPathToNodeIncl<Node, false>([curBranch], getParent),
      [curBranch, getParent]
    ),
    onError
  );

  const optionsResult = usePromise(
    useMemo(() => {
      const getOptions = (nodes: Node[]) => {
        type OptCbs = (options: InternalOption<Node>[]) => void;

        const parseBranchSelectable = (node: Node): SyncOrAsync<OptCbs> => {
          const parseResult = (isBranchOptSelectable: boolean) => {
            if (isBranchOptSelectable) {
              return (options: InternalOption<Node>[]) =>
                void options.push(
                  [node, OptionType.DOWN_BRANCH],
                  [node, OptionType.VALUE]
                );
            } else {
              return (options: InternalOption<Node>[]) =>
                void options.push([node, OptionType.DOWN_BRANCH]);
            }
          };

          const isBranchOptSelectable = isBranchSelectable(node);

          if (isBranchOptSelectable instanceof Promise) {
            return isBranchOptSelectable.then((isBranchOptSelectable) =>
              parseResult(isBranchOptSelectable)
            );
          } else {
            return parseResult(isBranchOptSelectable);
          }
        };

        const parseNode = (node: Node): SyncOrAsync<OptCbs> => {
          const parseResult = (isBranchOpt: boolean) => {
            if (isBranchOpt) {
              return parseBranchSelectable(node);
            } else {
              return (options: InternalOption<Node>[]) =>
                void options.push([node, OptionType.VALUE]);
            }
          };

          const isBranchOpt = isBranch(node);

          if (isBranchOpt instanceof Promise) {
            return isBranchOpt.then((isBranchOpt) => parseResult(isBranchOpt));
          } else {
            return parseResult(isBranchOpt);
          }
        };

        const buildOptions = (
          optCbs: IterableIterator<SyncOrAsync<OptCbs>>,
          options: InternalOption<Node>[]
        ): SyncOrAsync<InternalOption<Node>[]> => {
          let optCbResult = optCbs.next();
          while (!optCbResult.done) {
            const optCb = optCbResult.value;
            if (optCb instanceof Promise) {
              return optCb.then((optCb) => {
                optCb(options);
                return buildOptions(optCbs, options);
              });
            } else {
              optCb(options);
            }
            optCbResult = optCbs.next();
          }

          options.sort(([, a], [, b]) => {
            if (a === b) {
              return 0;
            } else if (a === OptionType.UP_BRANCH) {
              return -1;
            } else if (b === OptionType.UP_BRANCH) {
              return 1;
            } else if (a === OptionType.DOWN_BRANCH) {
              return -1;
            } else if (b === OptionType.DOWN_BRANCH) {
              return 1;
            }
            return 0; // This should never happen.
          });

          return options;
        };

        return buildOptions(
          nodes.map<SyncOrAsync<OptCbs>>((node) => parseNode(node)).values(),
          curBranch === null ? [] : [[curBranch, OptionType.UP_BRANCH]]
        );
      };

      const nodes = getChildren(curBranch);

      if (nodes instanceof Promise) {
        return nodes.then((nodes) => getOptions(nodes || []));
      } else {
        return getOptions(nodes || []);
      }
    }, [isBranch, isBranchSelectable, getChildren, curBranch]),
    onError
  );

  const valueResult = usePromise(
    useMemo(() => {
      if (curValue === null || curValue === undefined) {
        return null;
      } else if (multiple) {
        const multiValue: SyncOrAsync<
          InternalValue<Node, true, DisableClearable, FreeSolo>
        >[] = [];

        let hasPromise = false;

        for (const node of curValue as AutocompleteValue<
          Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>,
          true,
          true,
          false
        >) {
          const result = getPathToNodeIncl<Node, FreeSolo>([node], getParent);
          multiValue.push(result);

          if (result instanceof Promise) {
            hasPromise = true;
          }
        }

        if (hasPromise) {
          return Promise.all(multiValue);
        } else {
          return multiValue as InternalValue<
            Node,
            true,
            DisableClearable,
            FreeSolo
          >[];
        }
      } else {
        return getPathToNodeIncl<Node, FreeSolo>(
          [curValue as Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>],
          getParent
        );
      }
    }, [curValue, getParent, multiple]),
    onError
  );

  const value = useMemo(() => {
    if (valueResult.data !== undefined) {
      if (valueResult.data === null) {
        return null;
      } else if (multiple) {
        return (
          valueResult.data as InternalValue<
            Node,
            true,
            DisableClearable,
            FreeSolo
          >[]
        ).map((value) => initInternalValue(value));
      } else {
        return initInternalValue<Node, false, FreeSolo>(
          valueResult.data as InternalValue<Node, false, false, FreeSolo>
        );
      }
    } else if (multiple) {
      return (
        curValue as AutocompleteValue<
          Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>,
          true,
          DisableClearable,
          false
        >
      ).map((value) => initInternalValue([value]));
    } else if (curValue ?? null === null) {
      return null;
    } else {
      return initInternalValue([curValue]);
    }
  }, [curValue, multiple, valueResult.data]) as InternalValue<
    Node,
    Multiple,
    DisableClearable,
    FreeSolo
  >;

  const getOptionDisabled = useCallback<
    NonNullableUseAutocompleteProp<
      "getOptionDisabled",
      InternalOption<Node>,
      Multiple,
      DisableClearable,
      FreeSolo
    >
  >(
    ([option, type]) => {
      if (type === OptionType.UP_BRANCH) {
        return false;
      }
      return getOptionDisabledProp([
        option,
        getNodeTypeFromOptionType(type),
        branchPathResult.data || [],
      ]);
    },
    [branchPathResult.data, getOptionDisabledProp]
  );

  const getOptionLabel = useCallback<
    NonNullableUseAutocompleteProp<
      "getOptionLabel",
      InternalOption<Node> | InternalValue<Node, Multiple, false, FreeSolo>,
      Multiple,
      DisableClearable,
      FreeSolo
    >
  >(
    (internalOptOrVal) => {
      return getOptionLabelProp(
        getOptionFromInternalOptionOrValue<Node, FreeSolo>(
          internalOptOrVal,
          branchPathResult.data || []
        )
      );
    },
    [branchPathResult.data, getOptionLabelProp]
  );

  const getBranchPathLabel = useMemo<
    (branchPath: ReadonlyArray<Node>) => string
  >(
    () =>
      getBranchPathLabelProp
        ? getBranchPathLabelProp
        : (branchPath) => {
            if (!branchPath.length) {
              return "";
            }

            const [first, ...rest] = branchPath;

            return rest.reduce((label, node) => {
              return `${getOptionLabel([
                node,
                OptionType.UP_BRANCH,
              ])} > ${label}`;
            }, getOptionLabel([first, OptionType.UP_BRANCH]));
          },
    [getBranchPathLabelProp, getOptionLabel]
  );

  const getOptionKey = useCallback<
    (
      option: InternalOption<Node>,
      state: {
        key: string;
      }
    ) => string
  >(
    (option, state) =>
      getOptionKeyProp(
        getOptionFromInternalOptionOrValue<Node, false>(
          option,
          branchPathResult.data || []
        ),
        {
          ...state,
        }
      ),
    [branchPathResult.data, getOptionKeyProp]
  );

  const groupBy = useMemo<
    NullableUseAutocompleteProp<
      "groupBy",
      InternalOption<Node> | InternalValue<Node, Multiple, false, false>,
      Multiple,
      DisableClearable,
      FreeSolo
    >
  >(() => {
    if (groupByProp) {
      return (option) => {
        if (option[1] === OptionType.UP_BRANCH) {
          return "";
        } else {
          return groupByProp(
            getOptionFromInternalOptionOrValue<
              Node,
              false,
              Exclude<NodeType, "upBranch">
            >(option, branchPathResult.data || [])
          );
        }
      };
    }
  }, [branchPathResult.data, groupByProp]);

  const filterOptions = useCallback<
    NonNullableUseAutocompleteProp<
      "filterOptions",
      InternalOption<Node>,
      Multiple,
      DisableClearable,
      FreeSolo
    >
  >(
    (internalOptions, state) => {
      const [upBranch, optionsMap, options] = (() => {
        let upBranch: InternalOption<Node> | null = null;
        const options: Option<Node, never, Exclude<NodeType, "upBranch">>[] =
          [];
        const optionsMap = new Map(
          internalOptions.reduce((optionTups, internalOption) => {
            const [option, type] = internalOption;

            if (type === OptionType.UP_BRANCH) {
              upBranch = internalOption;
            } else {
              const optionKey = [
                option,
                getNodeTypeFromOptionType(type) as Exclude<
                  NodeType,
                  "upBranch"
                >,
                getOptionBranchPath(type, branchPathResult.data || []),
              ] as const;
              options.push(optionKey);
              optionTups.push([optionKey, internalOption]);
            }

            return optionTups;
          }, [] as [Option<Node>, InternalOption<Node>][])
        );
        return [upBranch, optionsMap, options] as [
          InternalOption<Node> | null,
          Map<Option<Node>, InternalOption<Node>>,
          Option<Node, never, Exclude<NodeType, "upBranch">>[]
        ];
      })();

      // Do NOT filter when input is value.
      if (
        !multiple &&
        value !== null &&
        getOptionLabel(
          value as InternalValue<Node, Multiple, false, FreeSolo>
        ) === state.inputValue
      ) {
        return internalOptions;
      }

      const filteredOptions = filterOptionsProp(options, {
        ...state,
        getOptionLabel: getOptionLabelProp,
      });

      const filtererOptionsMapCb = (
        option: Option<Node>
      ): InternalOption<Node> => {
        const internalOption = optionsMap.get(option);

        if (internalOption) {
          return internalOption;
        }

        for (const optionKey of optionsMap.keys()) {
          if (isOptionEqualToValueProp(option, optionKey)) {
            return optionsMap.get(optionKey) as InternalOption<Node>;
          }
        }

        return [option[0], getOptionTypeFromNodeType(option[1])];
      };

      return upBranch
        ? [upBranch, ...filteredOptions.map(filtererOptionsMapCb)]
        : filteredOptions.map(filtererOptionsMapCb);
    },
    [
      branchPathResult.data,
      filterOptionsProp,
      getOptionLabel,
      getOptionLabelProp,
      isOptionEqualToValueProp,
      multiple,
      value,
    ]
  );

  const isOptionEqualToValue = useCallback<
    NonNullableUseAutocompleteProp<
      "isOptionEqualToValue",
      | InternalOption<Node>
      | InternalValue<Node, DisableClearable, false, FreeSolo>,
      Multiple,
      DisableClearable,
      FreeSolo
    >
  >(
    (option, value) => {

      /**
       * Handle this case:
       * Add freeSolo call to selectNewValue and `multiple === true`
       * https://github.com/mui/material-ui/blob/f8520c409c6682a75e117947c9104a73e30de5c7/packages/mui-base/src/AutocompleteUnstyled/useAutocomplete.js#L622
       */
       

      const opt = multiple && freeSolo && typeof option === "string" ?
      getOptionFromInternalOptionOrValue(new FreeSoloNode(
        option as string,
        curBranch
      ), branchPathResult.data || [])

      return isOptionEqualToValueProp(
        (([option, type]) =>
          [
            option,
            getNodeTypeFromOptionType(type),
            getOptionBranchPath(type, branchPathResult.data || []),
          ] as const)(option as InternalOption<Node>),
          
          getOptionFromInternalOptionOrValue(value, branchPathResult.data || [])
      );
    },
    [branchPathResult.data, freeSolo, isOptionEqualToValueProp, multiple]
  );

  const onHighlightChange = useCallback<
    NonNullableUseAutocompleteProp<
      "onHighlightChange",
      InternalOption<Node>,
      Multiple,
      DisableClearable,
      FreeSolo
    >
  >(
    (event, option, reason) => {
      const [, type] = option || [];

      isSelectedOptionBranch.current =
        type === OptionType.DOWN_BRANCH || type === OptionType.UP_BRANCH;

      if (onHighlightChangeProp) {
        onHighlightChangeProp(
          event,
          option
            ? (([option, type]) => [
                option,
                getNodeTypeFromOptionType(type),
                getOptionBranchPath(type, branchPathResult.data || []),
              ])(option)
            : option,
          reason
        );
      }
    },
    [branchPathResult.data, onHighlightChangeProp]
  );

  const isSelectedOptionBranch = useRef(false);

  const handleOptionClick = useCallback((isOptionBranch: boolean) => {
    isSelectedOptionBranch.current = isOptionBranch;
  }, []);

  const onInputChange = useCallback<
    NonNullableUseAutocompleteProp<
      "onInputChange",
      InternalOption<Node>,
      Multiple,
      DisableClearable,
      FreeSolo
    >
  >(
    (...args) => {
      const [, , reason] = args;
      if (isSelectedOptionBranch.current && reason === "reset") {
        if (multiple || (value ?? null) === null) {
          args[1] = "";
        } else {
          args[1] = getOptionLabel(
            value as InternalValue<Node, Multiple, false, FreeSolo>
          );
        }
      }

      if (onInputChangeProp) {
        return onInputChangeProp(...args);
      }

      const [, newInputValue] = args;

      setInputValue(newInputValue);
    },
    [getOptionLabel, multiple, onInputChangeProp, setInputValue, value]
  );

  const onChange = useMemo<
    NonNullableUseAutocompleteProp<
      "onChange",
      | InternalOption<Node>
      | InternalValue<Node, Multiple, DisableClearable, FreeSolo>,
      Multiple,
      DisableClearable,
      FreeSolo
    >
  >(() => {
    const handleBranchChange = (
      event: React.SyntheticEvent<Element, Event>,
      node: Node,
      type: OptionType
    ): boolean => {
      if (type !== OptionType.VALUE) {
        const isUpBranch = type === OptionType.UP_BRANCH;

        if (onBranchChange) {
          onBranchChange(event, node, isUpBranch ? "up" : "down");
        }

        if (isUpBranch) {
          setBranch((branchPathResult.data || [])[1] ?? null);
        } else {
          setBranch(node);
        }

        return true;
      }

      return false;
    };

    /**
     * Allows for recursive call when `autoSelect` and `freeSolo` are `true` and `reason` is "blur" to determine if auto select is selecting an option or creating a free solo value.
     *
     * @internal
     * @ignore
     * */
    const handleChange = (
      args: Parameters<
        NonNullableUseAutocompleteProp<
          "onChange",
          | InternalOption<Node>
          | InternalValue<Node, Multiple, DisableClearable, FreeSolo>,
          Multiple,
          DisableClearable,
          FreeSolo
        >
      >,
      reasonIsBlur: boolean
    ): void => {
      type Value = AutocompleteValue<
        Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>,
        Multiple,
        DisableClearable,
        false
      >;

      const [event, , reason] = args;

      if (multiple) {
        switch (reason) {
          case "selectOption": {
            const [, rawValues, , details] = args as Parameters<
              NonNullableUseAutocompleteProp<
                "onChange",
                InternalOption<Node> | InternalValue<Node, false, true, false>,
                true,
                DisableClearable,
                false
              >
            >;

            const [[node, type]] = rawValues.slice(-1) as [
              InternalOption<Node> //
            ];

            // Selected Branch
            if (handleBranchChange(event, node, type)) {
              break;
            }

            const value = (
              rawValues as InternalValue<Node, true, true, false>[]
            ).map(([value]) => value);

            if (onChangeProp) {
              (
                onChangeProp as NonNullable<
                  UseTreeSelectProps<
                    Node,
                    true,
                    DisableClearable,
                    false
                  >["onChange"]
                >
              )(
                event,
                value,
                reasonIsBlur ? "blur" : reason,
                details
                  ? {
                      ...details,
                      option: getOptionFromInternalOptionOrValue<
                        Node,
                        false,
                        "leaf"
                      >(
                        details.option as
                          | InternalOption<Node>
                          | InternalValue<Node, Multiple, false, false>,
                        branchPathResult.data || []
                      ),
                    }
                  : details
              );
            }

            setValue(value as Value);

            break;
          }
          case "createOption": {
            // make copy of value
            const [, [...rawValues], , details] = args as Parameters<
              NonNullableUseAutocompleteProp<
                "onChange",
                InternalOption<Node> | InternalValue<Node, false, true, true>,
                true,
                DisableClearable,
                true
              >
            >;

            const [freeSoloValue] = rawValues.splice(-1) as [string];

            const value = (
              rawValues as InternalValue<Node, true, true, true>[]
            ).map(([value]) => value);

            const freeSoloNode = new FreeSoloNode(freeSoloValue, curBranch);

            value.push(freeSoloNode);

            if (onChangeProp) {
              (
                onChangeProp as NonNullable<
                  UseTreeSelectProps<
                    Node,
                    true,
                    DisableClearable,
                    true
                  >["onChange"]
                >
              )(
                event,
                value,
                reasonIsBlur ? "blur" : reason,
                details
                  ? {
                      ...details,
                      option: getOptionFromInternalOptionOrValue(
                        [freeSoloNode, ...(branchPathResult.data || [])],
                        branchPathResult.data || []
                      ),
                    }
                  : details
              );
            }

            setValue(value as Value);

            break;
          }
          case "blur": {
            const [, rawValues, , details] = args as Parameters<
              NonNullableUseAutocompleteProp<
                "onChange",
                InternalOption<Node> | InternalValue<Node, true, false, false>,
                true,
                DisableClearable,
                FreeSolo
              >
            >;

            const [newValue] = rawValues.slice(-1);

            handleChange(
              [
                event,
                args[1],
                typeof newValue === "string" ? "createOption" : "selectOption",
                details,
              ],
              true
            );

            break;
          }
          case "removeOption":
          case "clear": {
            const [, rawValues, , details] = args as Parameters<
              NonNullableUseAutocompleteProp<
                "onChange",
                InternalValue<Node, false, true, FreeSolo>,
                true,
                DisableClearable,
                FreeSolo
              >
            >;

            const value = (
              rawValues as InternalValue<Node, true, true, FreeSolo>[]
            ).map(([value]) => value);

            if (onChangeProp) {
              (
                onChangeProp as NonNullable<
                  UseTreeSelectProps<
                    Node,
                    true,
                    DisableClearable,
                    FreeSolo
                  >["onChange"]
                >
              )(
                event,
                value,
                reason,
                details
                  ? {
                      ...details,
                      option: getOptionFromInternalOptionOrValue<
                        Node,
                        FreeSolo,
                        "leaf"
                      >(
                        details.option as
                          | InternalOption<Node>
                          | InternalValue<Node, Multiple, false, FreeSolo>,
                        []
                      ),
                    }
                  : details
              );
            }

            setValue(value as Value);

            break;
          }
        }
      } else {
        switch (reason) {
          case "selectOption": {
            const [, option, , details] = args as Parameters<
              NonNullableUseAutocompleteProp<
                "onChange",
                InternalOption<Node>,
                false,
                true,
                false
              >
            >;

            const [node, type] = option;

            // Selected Branch
            if (handleBranchChange(event, node, type)) {
              break;
            }

            if (onChangeProp) {
              (
                onChangeProp as NonNullable<
                  UseTreeSelectProps<Node, false, false, false>["onChange"]
                >
              )(
                event,
                node,
                reasonIsBlur ? "blur" : reason,
                details
                  ? {
                      ...details,
                      option: getOptionFromInternalOptionOrValue<
                        Node,
                        false,
                        "leaf"
                      >(details.option, branchPathResult.data || []),
                    }
                  : details
              );
            }

            setValue(node as Value);

            break;
          }
          case "createOption": {
            const [, freeSoloValue, , details] = args as Parameters<
              NonNullableUseAutocompleteProp<
                "onChange",
                InternalOption<Node>,
                false,
                DisableClearable,
                true
              >
            >;

            const freeSoloNode = new FreeSoloNode(
              freeSoloValue as string,
              curBranch
            );

            if (onChangeProp) {
              (
                onChangeProp as NonNullable<
                  UseTreeSelectProps<
                    Node,
                    false,
                    DisableClearable,
                    true
                  >["onChange"]
                >
              )(
                event,
                freeSoloNode,
                reasonIsBlur ? "blur" : reason,
                details
                  ? {
                      ...details,
                      option: getOptionFromInternalOptionOrValue(
                        [freeSoloNode, ...(branchPathResult.data || [])],
                        branchPathResult.data || []
                      ),
                    }
                  : details
              );
            }

            setValue(freeSoloNode as Value);

            break;
          }
          case "blur": {
            const [, newValue, , details] = args as Parameters<
              NonNullableUseAutocompleteProp<
                "onChange",
                InternalOption<Node>,
                false,
                DisableClearable,
                true
              >
            >;
            handleChange(
              [
                event,
                args[1],
                typeof newValue === "string" ? "createOption" : "selectOption",
                details,
              ],
              true
            );

            break;
          }
          case "removeOption": //  Note remove only fires for multiple
          case "clear": {
            const [, , , details] = args as Parameters<
              NonNullableUseAutocompleteProp<
                "onChange",
                InternalValue<Node, false, false, FreeSolo>,
                false,
                DisableClearable,
                FreeSolo
              >
            >;

            if (onChangeProp) {
              (
                onChangeProp as NonNullable<
                  UseTreeSelectProps<Node, false, false, true>["onChange"]
                >
              )(
                event,
                null,
                reasonIsBlur ? "blur" : reason,
                details
                  ? {
                      ...details,
                      option: getOptionFromInternalOptionOrValue(
                        details.option as InternalValue<
                          Node,
                          false,
                          false,
                          FreeSolo
                        >,
                        branchPathResult.data || []
                      ),
                    }
                  : details
              );
            }

            setValue(null as Value);

            break;
          }
        }
      }
    };

    return (...args): void => handleChange(args, false);
  }, [
    branchPathResult.data,
    curBranch,
    multiple,
    onBranchChange,
    onChangeProp,
    setBranch,
    setValue,
  ]);

  const onClose = useCallback<
    NonNullableUseAutocompleteProp<
      "onClose",
      InternalOption<Node>,
      Multiple,
      DisableClearable,
      FreeSolo
    >
  >(
    (...args) => {
      const [, reason] = args;

      if (reason === "selectOption" && isSelectedOptionBranch.current) {
        return;
      }

      if (onCloseProp) {
        onCloseProp(...args);
      }

      setOpen(false);
    },
    [onCloseProp, setOpen]
  );

  const onOpen = useCallback<
    NonNullableUseAutocompleteProp<
      "onOpen",
      InternalOption<Node>,
      Multiple,
      DisableClearable,
      FreeSolo
    >
  >(
    (...args) => {
      if (onOpenProp) {
        onOpenProp(...args);
      }

      setOpen(true);
    },
    [onOpenProp, setOpen]
  );

  return {
    branchPath: branchPathResult.data || [],
    filterOptions,
    getBranchPathLabel,
    getOptionDisabled,
    getOptionKey,
    getOptionLabel,
    groupBy,
    handleOptionClick,
    inputValue,
    isOptionEqualToValue,
    loadingOptions: branchPathResult.loading || optionsResult.loading,
    onChange,
    onClose,
    onHighlightChange,
    onInputChange,
    onOpen,
    open,
    options: optionsResult.data || [],
    value,
  };
};

export default useTreeSelect;
