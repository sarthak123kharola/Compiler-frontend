import React, { useState } from 'react';
import './FileExplorer.css';

function FileExplorer({ files, onFileSelect, onFileDelete }) {
  // State to track the currently selected file
  const [selectedFile, setSelectedFile] = useState(null);

  // Handler for selecting a file
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    onFileSelect(file);
  };

  return (
    <div className='file-explorer'>
      <h2>Files</h2>
      <ul>
        {files.map((file, index) => (
          <li
            key={index}
            className={`file-item ${index === 0 ? 'first-item' : ''} ${selectedFile === file ? 'selected' : ''}`}
            onClick={() => handleFileSelect(file)}
          >
            <span className='file-name'>
              {file.name}
            </span>
            <>   </><button
              onClick={(e) => {
                e.stopPropagation(); // Prevent selecting the file when deleting
                onFileDelete(file);
              }}
              className='delete-button'
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileExplorer;
