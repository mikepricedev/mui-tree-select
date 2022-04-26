import React from "react";
import {
  AutocompleteProps,
  TooltipProps,
  AutocompleteRenderOptionState,
  ListItemButtonProps,
  ListItemTextProps,
  SvgIconProps,
} from "@mui/material";
import {
  UseTreeSelectProps,
  TreeSelectFreeSoloValueMapping,
  PathDirection,
} from "./useTreeSelect";
export interface BaseDefaultOptionsProps
  extends Omit<ListItemButtonProps<"li">, "children"> {
  ListItemTextProps: ListItemTextProps;
  TooltipProps?: Omit<TooltipProps, "children" | "title">;
}
export interface UpBranchDefaultOptionsProps extends BaseDefaultOptionsProps {
  exitText: string;
  pathLabel: string;
  pathDirection: Extract<PathDirection, "up">;
}
export interface DownBranchDefaultOptionsProps extends BaseDefaultOptionsProps {
  enterText: string;
  pathDirection: Extract<PathDirection, "down">;
}
/**
 * Default Option Component.
 */
export declare const DefaultOption: (
  props:
    | UpBranchDefaultOptionsProps
    | DownBranchDefaultOptionsProps
    | BaseDefaultOptionsProps
) => JSX.Element;
export interface TreeSelectRenderOptionState
  extends AutocompleteRenderOptionState {
  addFreeSoloText: string;
  pathLabel: string;
  disabled: boolean;
  enterText: string;
  exitText: string;
  optionLabel: string;
  pathDirection?: PathDirection;
}
export declare type RenderOption<Node, FreeSolo extends boolean | undefined> = (
  props: React.HTMLAttributes<HTMLLIElement> & {
    key: React.Key;
  },
  option: Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>,
  state: TreeSelectRenderOptionState
) => React.ReactNode;
/**
 * Returns props for {@link DefaultOption} from arguments of {@link RenderOption}
 */
export declare const getDefaultOptionProps: (
  props: React.HTMLAttributes<HTMLLIElement> & {
    key: React.Key;
  },
  option: any,
  state: TreeSelectRenderOptionState
) =>
  | UpBranchDefaultOptionsProps
  | DownBranchDefaultOptionsProps
  | BaseDefaultOptionsProps;
export declare const PathIcon: React.ForwardRefExoticComponent<
  Pick<
    SvgIconProps<"svg", {}>,
    | "string"
    | "filter"
    | "values"
    | "fill"
    | "max"
    | "type"
    | "accumulate"
    | "offset"
    | "key"
    | "id"
    | "media"
    | "origin"
    | "height"
    | "width"
    | "end"
    | "name"
    | "alignmentBaseline"
    | "baselineShift"
    | "clip"
    | "clipPath"
    | "clipRule"
    | "color"
    | "colorInterpolation"
    | "colorInterpolationFilters"
    | "cursor"
    | "direction"
    | "display"
    | "dominantBaseline"
    | "fillOpacity"
    | "fillRule"
    | "floodColor"
    | "floodOpacity"
    | "fontFamily"
    | "fontSize"
    | "fontSizeAdjust"
    | "fontStretch"
    | "fontStyle"
    | "fontVariant"
    | "fontWeight"
    | "imageRendering"
    | "letterSpacing"
    | "lightingColor"
    | "markerEnd"
    | "markerMid"
    | "markerStart"
    | "mask"
    | "opacity"
    | "order"
    | "overflow"
    | "paintOrder"
    | "pointerEvents"
    | "rotate"
    | "scale"
    | "shapeRendering"
    | "stopColor"
    | "stopOpacity"
    | "stroke"
    | "strokeDasharray"
    | "strokeDashoffset"
    | "strokeLinecap"
    | "strokeLinejoin"
    | "strokeMiterlimit"
    | "strokeOpacity"
    | "strokeWidth"
    | "textAnchor"
    | "textDecoration"
    | "textRendering"
    | "transform"
    | "unicodeBidi"
    | "visibility"
    | "wordSpacing"
    | "writingMode"
    | "alphabetic"
    | "hanging"
    | "ideographic"
    | "path"
    | "method"
    | "target"
    | "lang"
    | "children"
    | "tabIndex"
    | "orientation"
    | "local"
    | "x"
    | "y"
    | "mathematical"
    | "azimuth"
    | "colorRendering"
    | "glyphOrientationVertical"
    | "vectorEffect"
    | "additive"
    | "crossOrigin"
    | "href"
    | "min"
    | "role"
    | "aria-activedescendant"
    | "aria-atomic"
    | "aria-autocomplete"
    | "aria-busy"
    | "aria-checked"
    | "aria-colcount"
    | "aria-colindex"
    | "aria-colspan"
    | "aria-controls"
    | "aria-current"
    | "aria-describedby"
    | "aria-details"
    | "aria-disabled"
    | "aria-dropeffect"
    | "aria-errormessage"
    | "aria-expanded"
    | "aria-flowto"
    | "aria-grabbed"
    | "aria-haspopup"
    | "aria-hidden"
    | "aria-invalid"
    | "aria-keyshortcuts"
    | "aria-label"
    | "aria-labelledby"
    | "aria-level"
    | "aria-live"
    | "aria-modal"
    | "aria-multiline"
    | "aria-multiselectable"
    | "aria-orientation"
    | "aria-owns"
    | "aria-placeholder"
    | "aria-posinset"
    | "aria-pressed"
    | "aria-readonly"
    | "aria-relevant"
    | "aria-required"
    | "aria-roledescription"
    | "aria-rowcount"
    | "aria-rowindex"
    | "aria-rowspan"
    | "aria-selected"
    | "aria-setsize"
    | "aria-sort"
    | "aria-valuemax"
    | "aria-valuemin"
    | "aria-valuenow"
    | "aria-valuetext"
    | "accentHeight"
    | "allowReorder"
    | "amplitude"
    | "arabicForm"
    | "ascent"
    | "attributeName"
    | "attributeType"
    | "autoReverse"
    | "baseFrequency"
    | "baseProfile"
    | "bbox"
    | "begin"
    | "bias"
    | "by"
    | "calcMode"
    | "capHeight"
    | "clipPathUnits"
    | "colorProfile"
    | "contentScriptType"
    | "contentStyleType"
    | "cx"
    | "cy"
    | "d"
    | "decelerate"
    | "descent"
    | "diffuseConstant"
    | "divisor"
    | "dur"
    | "dx"
    | "dy"
    | "edgeMode"
    | "elevation"
    | "enableBackground"
    | "exponent"
    | "externalResourcesRequired"
    | "filterRes"
    | "filterUnits"
    | "focusable"
    | "format"
    | "fr"
    | "from"
    | "fx"
    | "fy"
    | "g1"
    | "g2"
    | "glyphName"
    | "glyphOrientationHorizontal"
    | "glyphRef"
    | "gradientTransform"
    | "gradientUnits"
    | "horizAdvX"
    | "horizOriginX"
    | "in2"
    | "in"
    | "intercept"
    | "k1"
    | "k2"
    | "k3"
    | "k4"
    | "k"
    | "kernelMatrix"
    | "kernelUnitLength"
    | "kerning"
    | "keyPoints"
    | "keySplines"
    | "keyTimes"
    | "lengthAdjust"
    | "limitingConeAngle"
    | "markerHeight"
    | "markerUnits"
    | "markerWidth"
    | "maskContentUnits"
    | "maskUnits"
    | "mode"
    | "numOctaves"
    | "operator"
    | "orient"
    | "overlinePosition"
    | "overlineThickness"
    | "panose1"
    | "pathLength"
    | "patternContentUnits"
    | "patternTransform"
    | "patternUnits"
    | "points"
    | "pointsAtX"
    | "pointsAtY"
    | "pointsAtZ"
    | "preserveAlpha"
    | "preserveAspectRatio"
    | "primitiveUnits"
    | "r"
    | "radius"
    | "refX"
    | "refY"
    | "renderingIntent"
    | "repeatCount"
    | "repeatDur"
    | "requiredExtensions"
    | "requiredFeatures"
    | "restart"
    | "result"
    | "rx"
    | "ry"
    | "seed"
    | "slope"
    | "spacing"
    | "specularConstant"
    | "specularExponent"
    | "speed"
    | "spreadMethod"
    | "startOffset"
    | "stdDeviation"
    | "stemh"
    | "stemv"
    | "stitchTiles"
    | "strikethroughPosition"
    | "strikethroughThickness"
    | "surfaceScale"
    | "systemLanguage"
    | "tableValues"
    | "targetX"
    | "targetY"
    | "textLength"
    | "to"
    | "u1"
    | "u2"
    | "underlinePosition"
    | "underlineThickness"
    | "unicode"
    | "unicodeRange"
    | "unitsPerEm"
    | "vAlphabetic"
    | "version"
    | "vertAdvY"
    | "vertOriginX"
    | "vertOriginY"
    | "vHanging"
    | "vIdeographic"
    | "viewBox"
    | "viewTarget"
    | "vMathematical"
    | "widths"
    | "x1"
    | "x2"
    | "xChannelSelector"
    | "xHeight"
    | "xlinkActuate"
    | "xlinkArcrole"
    | "xlinkHref"
    | "xlinkRole"
    | "xlinkShow"
    | "xlinkTitle"
    | "xlinkType"
    | "xmlBase"
    | "xmlLang"
    | "xmlns"
    | "xmlnsXlink"
    | "xmlSpace"
    | "y1"
    | "y2"
    | "yChannelSelector"
    | "z"
    | "zoomAndPan"
    | "dangerouslySetInnerHTML"
    | "onCopy"
    | "onCopyCapture"
    | "onCut"
    | "onCutCapture"
    | "onPaste"
    | "onPasteCapture"
    | "onCompositionEnd"
    | "onCompositionEndCapture"
    | "onCompositionStart"
    | "onCompositionStartCapture"
    | "onCompositionUpdate"
    | "onCompositionUpdateCapture"
    | "onFocus"
    | "onFocusCapture"
    | "onBlur"
    | "onBlurCapture"
    | "onChange"
    | "onChangeCapture"
    | "onBeforeInput"
    | "onBeforeInputCapture"
    | "onInput"
    | "onInputCapture"
    | "onReset"
    | "onResetCapture"
    | "onSubmit"
    | "onSubmitCapture"
    | "onInvalid"
    | "onInvalidCapture"
    | "onLoad"
    | "onLoadCapture"
    | "onError"
    | "onErrorCapture"
    | "onKeyDown"
    | "onKeyDownCapture"
    | "onKeyPress"
    | "onKeyPressCapture"
    | "onKeyUp"
    | "onKeyUpCapture"
    | "onAbort"
    | "onAbortCapture"
    | "onCanPlay"
    | "onCanPlayCapture"
    | "onCanPlayThrough"
    | "onCanPlayThroughCapture"
    | "onDurationChange"
    | "onDurationChangeCapture"
    | "onEmptied"
    | "onEmptiedCapture"
    | "onEncrypted"
    | "onEncryptedCapture"
    | "onEnded"
    | "onEndedCapture"
    | "onLoadedData"
    | "onLoadedDataCapture"
    | "onLoadedMetadata"
    | "onLoadedMetadataCapture"
    | "onLoadStart"
    | "onLoadStartCapture"
    | "onPause"
    | "onPauseCapture"
    | "onPlay"
    | "onPlayCapture"
    | "onPlaying"
    | "onPlayingCapture"
    | "onProgress"
    | "onProgressCapture"
    | "onRateChange"
    | "onRateChangeCapture"
    | "onSeeked"
    | "onSeekedCapture"
    | "onSeeking"
    | "onSeekingCapture"
    | "onStalled"
    | "onStalledCapture"
    | "onSuspend"
    | "onSuspendCapture"
    | "onTimeUpdate"
    | "onTimeUpdateCapture"
    | "onVolumeChange"
    | "onVolumeChangeCapture"
    | "onWaiting"
    | "onWaitingCapture"
    | "onAuxClick"
    | "onAuxClickCapture"
    | "onClick"
    | "onClickCapture"
    | "onContextMenu"
    | "onContextMenuCapture"
    | "onDoubleClick"
    | "onDoubleClickCapture"
    | "onDrag"
    | "onDragCapture"
    | "onDragEnd"
    | "onDragEndCapture"
    | "onDragEnter"
    | "onDragEnterCapture"
    | "onDragExit"
    | "onDragExitCapture"
    | "onDragLeave"
    | "onDragLeaveCapture"
    | "onDragOver"
    | "onDragOverCapture"
    | "onDragStart"
    | "onDragStartCapture"
    | "onDrop"
    | "onDropCapture"
    | "onMouseDown"
    | "onMouseDownCapture"
    | "onMouseEnter"
    | "onMouseLeave"
    | "onMouseMove"
    | "onMouseMoveCapture"
    | "onMouseOut"
    | "onMouseOutCapture"
    | "onMouseOver"
    | "onMouseOverCapture"
    | "onMouseUp"
    | "onMouseUpCapture"
    | "onSelect"
    | "onSelectCapture"
    | "onTouchCancel"
    | "onTouchCancelCapture"
    | "onTouchEnd"
    | "onTouchEndCapture"
    | "onTouchMove"
    | "onTouchMoveCapture"
    | "onTouchStart"
    | "onTouchStartCapture"
    | "onPointerDown"
    | "onPointerDownCapture"
    | "onPointerMove"
    | "onPointerMoveCapture"
    | "onPointerUp"
    | "onPointerUpCapture"
    | "onPointerCancel"
    | "onPointerCancelCapture"
    | "onPointerEnter"
    | "onPointerEnterCapture"
    | "onPointerLeave"
    | "onPointerLeaveCapture"
    | "onPointerOver"
    | "onPointerOverCapture"
    | "onPointerOut"
    | "onPointerOutCapture"
    | "onGotPointerCapture"
    | "onGotPointerCaptureCapture"
    | "onLostPointerCapture"
    | "onLostPointerCaptureCapture"
    | "onScroll"
    | "onScrollCapture"
    | "onWheel"
    | "onWheelCapture"
    | "onAnimationStart"
    | "onAnimationStartCapture"
    | "onAnimationEnd"
    | "onAnimationEndCapture"
    | "onAnimationIteration"
    | "onAnimationIterationCapture"
    | "onTransitionEnd"
    | "onTransitionEndCapture"
    | "sx"
    | keyof import("@mui/material/OverridableComponent").CommonProps
    | "htmlColor"
    | "titleAccess"
  > &
    React.RefAttributes<SVGSVGElement>
>;
export interface TreeSelectProps<
  Node,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> extends UseTreeSelectProps<Node, Multiple, DisableClearable, FreeSolo>,
    Omit<
      AutocompleteProps<
        Node | TreeSelectFreeSoloValueMapping<Node, FreeSolo>,
        Multiple,
        DisableClearable,
        FreeSolo
      >,
      | keyof UseTreeSelectProps<Node, Multiple, DisableClearable, FreeSolo>
      | "loading"
      | "options"
      | "renderOption"
      | "renderTags"
    > {
  /**
   * Prefix option label for a adding freeSolo values.
   *
   * @default "Add: "
   *
   */
  addFreeSoloText?: string;
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
   * The icon to display in place of the default path icon.
   *
   * @remarks Only rendered when `multiple === false`.
   *
   * @default <PathIcon fontSize="small" />
   */
  pathIcon?: React.ReactNode;
  /**
   *  Render the option, use `getOptionLabel` by default.
   */
  renderOption?: RenderOption<Node, FreeSolo>;
}
export declare const TreeSelect: <
  Node_1,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(
  props: TreeSelectProps<Node_1, Multiple, DisableClearable, FreeSolo>
) => JSX.Element;
export default TreeSelect;
