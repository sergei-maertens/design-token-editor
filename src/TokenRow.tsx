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

interface GoToProps {
  token: string;
}

const getTokenHtmlID = (token: string) => `dte-token-${token}`;


const GoTo = ({ token }: GoToProps): JSX.Element | null => {
  const isReference = token.endsWith('}') && token.startsWith('{');
  if (!isReference) return null;
  const referencedToken = token.substring(1, token.length - 1);
  return (
    <a href={`#${getTokenHtmlID(referencedToken)}`}>goto</a>
  );
}


export interface TokenRowProps  {
  designToken: DesignToken;
}

const TokenRow = ({designToken}: TokenRowProps): JSX.Element => {
  const { value, original, path } = designToken;
  const tokenPath = path.join('.');
  return (
    <tr>
      <td id={getTokenHtmlID(tokenPath)}>
        <code>{tokenPath}</code>
      </td>
      <td>
        <input name={tokenPath} type="text" placeholder={value} defaultValue="" />
      </td>
      <td>
        <code>{original.value}</code>
        <GoTo token={original.value} />
      </td>
    </tr>
  );
};

export default TokenRow;
