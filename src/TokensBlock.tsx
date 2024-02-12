import React, {PropsWithChildren} from 'react';
import clsx from 'clsx';

import TokenRow from './TokenRow';
import {DesignToken, GroupExtensions, DesignTokenGroup} from './types';

interface TokensBlockHeaderProps {
  container: DesignTokenGroup;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const TokensBlockHeader = ({
  onClick,
  children,
}: PropsWithChildren<TokensBlockHeaderProps>): JSX.Element => {
  const className = clsx('dte-tokens-block__context-row', {
    'dte-tokens-block__context-row--with-click-handler': !!onClick,
  });
  return (
    <header
      className={className}
      title={onClick ? 'Click to toggle' : ''}
      onClick={onClick}
    >
      {children}
    </header>
  );
};

interface TokensBlockExtensionsProps {
  extensions: GroupExtensions;
}

const TokensBlockExtensionsDisplay: React.FC<TokensBlockExtensionsProps> = ({
  extensions,
}) => {
  const description = extensions['dte.metadata']?.groupDescription;
  if (!description) return null;
  return <div className="dte-tokens-block__description">{description}</div>;
};

interface TokensBlockTokenListProps {
  tokens: DesignToken[];
}

const TokensBlockTokenList = ({tokens}: TokensBlockTokenListProps): JSX.Element => {
  return (
    <div className="dte-tokens-block__tokens">
      <div className="dte-token-row dte-token-row--header">
        <div className="dte-token-row__token-name">Token</div>
        <div className="dte-token-row__token-value-container">Value</div>
        <div className="dte-token-row__token-source-container">Source</div>
      </div>
      {tokens.map(token => (
        <TokenRow key={token.path.join('.')} designToken={token} />
      ))}
    </div>
  );
};

export interface TokensBlockProps {
  path: string[];
  tokens: DesignToken[];
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  container: DesignTokenGroup;
}

const TokensBlock = ({
  path,
  tokens,
  onClick,
  container,
}: TokensBlockProps): JSX.Element => {
  return (
    <section className="dte-tokens-block">
      <TokensBlockHeader container={container} onClick={onClick}>
        <span>{path.join(' ➡️ ')}</span>
        <TokensBlockExtensionsDisplay extensions={container?.$extensions || {}} />
      </TokensBlockHeader>
      {tokens.length ? <TokensBlockTokenList tokens={tokens} /> : null}
    </section>
  );
};

export default TokensBlock;
