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

const getTokenHtmlID = (token: string) => `dte-token-${token}`;

export interface TokenRowProps  {
  designToken: DesignToken;
}

const TokenRow = ({designToken}: TokenRowProps): JSX.Element => {
  const { value, original, path } = designToken;
  const tokenPath = path.join('.');
  return (
    <tr>
      <td id={getTokenHtmlID(tokenPath)} style={{padding: '.5em'}}>
        <code>{tokenPath}</code>
      </td>
      <td style={{padding: '.5em'}}>
        <input name={tokenPath} type="text" placeholder={value} defaultValue="" />
      </td>
      <td style={{padding: '.5em'}}>
        <code>{original.value}</code>
      </td>
    </tr>
  );
};

export default TokenRow;
