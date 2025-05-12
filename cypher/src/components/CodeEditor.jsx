import React from 'react';
import './CodeEditor.css'; 

const CodeEditor = ({ content, searchResults }) => {
  const highlightCode = (code, results) => {
    if (!results || results.length === 0) {
      return code;
    }

    const lines = code.split('\n');
    const highlightedLines = lines.map((line, index) => {
      const lineNumber = index + 1;
      const lineResults = results.filter(result => result.lineNumber === lineNumber);

      if (lineResults.length > 0) {
        let highlightedLine = '';
        let lastIndex = 0;
        highlightedLine = <span className="highlight">{line}</span>;

        return highlightedLine;
      }

      return line;
    });

    return highlightedLines.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < highlightedLines.length - 1 && '\n'}
      </React.Fragment>
    ));
  };

  const displayedContent = highlightCode(content || '', searchResults);

  return (
    <div className="code-editor">
      <pre>
        <code className="code">
          {displayedContent}
        </code>
      </pre>
    </div>
  );
};

export default CodeEditor;