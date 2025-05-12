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
    if (newFiles.length > 0) setSelectedFile(newFiles[0]);
  };

  const handleFileDelete = (fileToDelete) => {
    setFiles(prevFiles => {
      const updatedFiles = prevFiles.filter(file => file !== fileToDelete);
      if (selectedFile === fileToDelete) {
        setSelectedFile(updatedFiles.length > 0 ? updatedFiles[0] : null);
      }
      return updatedFiles;
    });
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setComparisonResult(''); 
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
          onComparisonResult={setComparisonResult}
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
