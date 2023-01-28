import React, {PropsWithChildren} from 'react';
import clsx from 'clsx';

import TokenRow, {DesignToken} from './TokenRow';

interface TokensBlockHeaderProps {
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

interface TokensBlockTokenListProps {
  tokens: DesignToken[];
}

const TokensBlockTokenList = ({tokens}: TokensBlockTokenListProps): JSX.Element => {
  return (
    <div className="dte-tokens-block__tokens">
      <div className="dte-token-row dte-token-row--header">
        <div className="dte-token-row__token-name">Token</div>
        <div className="dte-token-row__token-value">Value</div>
        <div className="dte-token-row__token-source">Source / default</div>
      </div>
      {tokens.map(token => (
        <TokenRow key={token.path.join('.')} designToken={token} />
      ))}
    </div>
  );
};

interface TokensBlockProps {
  path: string[];
  tokens: DesignToken[];
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const TokensBlock = ({path, tokens, onClick}: TokensBlockProps): JSX.Element => {
  return (
    <section className="dte-tokens-block">
      <TokensBlockHeader onClick={onClick}>{path.join(' ➡️ ')}</TokensBlockHeader>
      {tokens.length ? <TokensBlockTokenList tokens={tokens} /> : null}
    </section>
  );
};

export default TokensBlock;
