import React, {useState} from 'react';
import TokensTable, {DesignTokenContainer} from './TokensTable';


interface TokenEditorProps {
  tokens: DesignTokenContainer;
  initialValues?: {
    [key: string]: string;
  }
}


const TokenEditor = ({tokens, initialValues={}}: TokenEditorProps): JSX.Element => {
  const [values, setValues] = useState(initialValues);
  const [searchValue, setSearchValue] = useState('');
  return (
    <div style={{
      display: 'flex',
      gap: '2em',
      fontFamily: 'calibri, sans-serif',
    }}>

      <div style={{width: '50%'}}>
        <h2>Available tokens</h2>
        <div>
          <input
            type="text"
            name="search"
            value={searchValue}
            onChange={ e => setSearchValue(e.target.value || '') }
            placeholder="Filter... e.g. 'of.button'"
            style={{
              padding: '.5em',
              width: 'calc(100% - 1em)',
              marginBottom: '1em',
            }}
          />
        </div>

        <TokensTable
          container={tokens}
          limitTo={searchValue ? [searchValue] : null}
          autoExpand
        />
      </div>

      <div style={{width: '50%'}}>
        <h2>Theme values</h2>
        <div style={{padding: '1em'}}>
          <pre><code>{JSON.stringify(values, null, 2)}</code></pre>
        </div>
      </div>

    </div>
  );
};


export default TokenEditor;
