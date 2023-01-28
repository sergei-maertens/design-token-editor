import React, {ChangeEvent, HTMLInputTypeAttribute} from 'react';

interface TokenValueInputProps {
  name: string;
  type?: HTMLInputTypeAttribute;
  defaultTokenValue?: string;
  size?: number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const TokenValueInput = ({
  name,
  type = 'text',
  defaultTokenValue = '',
  size = 8,
  onChange,
  ...props
}: TokenValueInputProps): JSX.Element => {
  return (
    <input
      className="dte-token-value-input"
      name={name}
      type={type}
      placeholder={defaultTokenValue}
      size={size}
      onChange={onChange}
      {...props}
    />
  );
};

export default TokenValueInput;
