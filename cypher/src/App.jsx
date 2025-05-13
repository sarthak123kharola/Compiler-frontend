import React, { useState, useRef } from 'react';
import './App.css';
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/CodeEditor';
import ComparisonComponent from './components/ComparisonComponent.jsx';

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [comparisonResult, setComparisonResult] = useState('');
  const [comparisonResults, setComparisonResults] = useState([]);
  const [selectedComparison, setSelectedComparison] = useState(null);

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFilesInput = async (event) => {
    const files = event.target.files;
    const newFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.readAsText(file);
      await new Promise(resolve => {
        reader.onload = (e) => {
          newFiles.push({ name: file.name, content: e.target.result });
          resolve();
        };
      });
    }

    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    if (newFiles.length > 0) {
      setSelectedFile(newFiles[0]);
      setSelectedComparison(null);
      setComparisonResult('');
    }
  };

  const handleFileDelete = (fileToDelete) => {
    setFiles(prevFiles => {
      const updatedFiles = prevFiles.filter(file => file !== fileToDelete);
      if (selectedFile === fileToDelete) {
        setSelectedFile(updatedFiles.length > 0 ? updatedFiles[0] : null);
        setComparisonResult('');
        setSelectedComparison(null);
      }
      return updatedFiles;
    });
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setComparisonResult('');
    setSelectedComparison(null);
  };

  const runTerminalCommandPlaceholder = async (command) => {
    console.log(`Attempting to run terminal command: ${command}`);
    return '';
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!selectedFile || !searchQuery) {
      console.log("No file selected or search query is empty.");
      return;
    }

    const command = `echo "${selectedFile.content}" | grep "${searchQuery}"`;
    const simulatedTerminalOutput = await runTerminalCommandPlaceholder(command);
    const lines = simulatedTerminalOutput ? simulatedTerminalOutput.split('\n') : [];
    const parsedResults = lines.map(line => line).filter(line => line.length > 0);
    setSearchResults(parsedResults);
  };

  const handleComparisonResult = (result) => {
    const newEntry = {
      name: `comparison-${comparisonResults.length + 1}`,
      content: result
    };
    setComparisonResults(prev => [...prev, newEntry]);
    setSelectedComparison(newEntry);
    setComparisonResult(result);
    setSelectedFile(null);
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <FileExplorer
          files={files}
          onFileSelect={handleFileSelect}
          onFileDelete={handleFileDelete}
        />

        <ComparisonComponent
          filePaths={files.map(file => file.name)}
          onComparisonResult={handleComparisonResult}
        />

        <div className="file-input-area">
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFilesInput}
            style={{ display: 'none' }}
          />
          <button onClick={handleButtonClick} className="button">Load Files</button>
        </div>

        <div className="comparison-results">
          <h4>Comparisons</h4>
          {comparisonResults.map((result, index) => (
            <div
              key={index}
              className={`file-item ${selectedComparison === result ? 'selected' : ''}`}
              onClick={() => {
                setSelectedComparison(result);
                setComparisonResult(result.content);
                setSelectedFile(null);
              }}
              style={{
                cursor: 'pointer',
                padding: '4px 8px',
                backgroundColor: selectedComparison === result ? '#ddd' : 'transparent'
              }}
            >
              {result.name}
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        <CodeEditor
          content={comparisonResult || (selectedFile ? selectedFile.content : '')}
          searchResults={searchResults}
        />
      </div>
    </div>
  );
}

export default App;
