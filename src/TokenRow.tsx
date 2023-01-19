import React from 'react';

export type DesignToken = {
  name: string;
  value: string;
  original: {
    value: string;
  }
  path: string[];
  attributes: {
    [key: string]: string;
  }
}

export type TokenRowProps =  {
  designToken: DesignToken;
}

const TokenRow = ({designToken}: TokenRowProps): JSX.Element => {
  const { value, original, path } = designToken;
  const tokenPath = path.join('.');
  return (
    <tr>
      <td><code>{tokenPath}</code></td>
      <td>
        <input name={tokenPath} type="text" placeholder={value} defaultValue="" />
      </td>
      <td>
        <code>{original.value}</code>
      </td>
    </tr>
  );
};

export default TokenRow;
