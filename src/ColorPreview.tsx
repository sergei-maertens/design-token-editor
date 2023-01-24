import React from 'react';

interface ColorPreviewProps {
  token: string;
  value: string;
}

// heuristic based on token name/scope and maybe even the format of the value
export const isColor = (token: string, value: string): boolean => {
  if (token.toLowerCase().indexOf('color') > 0) return true;

  // taken from https://stackoverflow.com/a/56266358/973537
  const s = new Option().style;
  s.color = value;
  return s.color !== '';
};

const ColorPreview = ({token, value}: ColorPreviewProps): JSX.Element | null => {
  if (!isColor(token, value)) return null;
  return (
    <div style={{
      display: 'flex',
      gap: '.5em',
      alignItems: 'center',
      flexGrow: '1',
    }}>
      <div style={{
        display: 'block',
        width: '1em',
        height: '1em',
        background: value,
        border: 'solid 1px grey',
        borderRadius: '50%',
      }} />
    </div>
  );
};


export default ColorPreview;
