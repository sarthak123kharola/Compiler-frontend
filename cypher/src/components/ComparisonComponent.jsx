import React from 'react';

const ComparisonComponent = ({ filePaths, onComparisonResult }) => {
    const handleCompareClick = () => {
        console.log(filePaths);
        fetch('https://compiler-render.onrender.com/compare-files', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileNames: filePaths }),
        })
        .then(response => response.text())
        .then(data => {
            console.log('Comparison result:', data);
            onComparisonResult(data); 
        })
        .catch(error => {
            console.error('Error comparing files:', error);
        });
    };

    return (
        <div>
            <button onClick={handleCompareClick} className="button">Compare</button>
        </div>
    );
};

export default ComparisonComponent;
