import React from 'react';

interface ColorPreviewProps {
  color: string;
}

const UNPARSABLE_COLOR_VALUES = ['inherit', 'initial', 'unset'];

// heuristic based on token name/scope and maybe even the format of the value
export const isColor = (value: string): boolean => {
  // taken from https://stackoverflow.com/a/56266358/973537
  const s = new Option().style;
  s.color = value;
  return s.color !== '' && !UNPARSABLE_COLOR_VALUES.includes(s.color);
};

const ColorPreview = ({color}: ColorPreviewProps): JSX.Element | null => {
  const style = {'--dte-color-preview-color': color} as React.CSSProperties;
  return (
    <div className="dte-color-preview" style={style} title={color}>
      {color}
    </div>
  );
};

export default ColorPreview;
