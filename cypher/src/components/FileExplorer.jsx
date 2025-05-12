import React from 'react';
import './FileExplorer.css';

function FileExplorer({ files, onFileSelect, onFileDelete }) {
  return (
    <div className='file-explorer'>
      <h2>Files</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index} className={ `${index===0 ? 'first-item' : 'file-item'}`} > 
            <span onClick={() => onFileSelect(file)} className='file-name'>
              {file.name}
            </span>
            <> </> <button onClick={() => onFileDelete(file)} className='delete-button'>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileExplorer;