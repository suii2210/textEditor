import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
            { list: 'order' },
            { list: 'bullet' },
            { indent: '+1' },
            { indent: '-1' },
        ],
        ['link', 'image', 'video'],
    ],
};

const Editor = () => {
    const [value, setValue] = useState('');
    const quillRef = useRef(null);
    const [historyStack, setHistoryStack] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const handleChange = (content) => {
        setValue(content);
        
        // Update history stack
        if (currentIndex < historyStack.length - 1) {
            setHistoryStack(historyStack.slice(0, currentIndex + 1));
        }
        setHistoryStack([...historyStack, content]);
        setCurrentIndex(currentIndex + 1);
    };

    const handleUndo = () => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            setValue(historyStack[newIndex]);
            setCurrentIndex(newIndex);
        }
    };

    const handleRedo = () => {
        if (currentIndex < historyStack.length - 1) {
            const newIndex = currentIndex + 1;
            setValue(historyStack[newIndex]);
            setCurrentIndex(newIndex);
        }
    };

    // Drag and drop handlers
    const handleDragStart = (event) => {
        event.dataTransfer.setData('text/plain', event.target.innerText);
        event.dataTransfer.effectAllowed = "move";
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const text = event.dataTransfer.getData('text/plain');
        
        // Insert text at the drop position
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        
        if (range) {
            quill.insertText(range.index, text);
            quill.setSelection(range.index + text.length); // Move cursor after inserted text
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    return (
        <div className='relative h-full w-full flex flex-col items-center justify-center'>
            <div className="flex mb-2">
                <button onClick={handleUndo} disabled={currentIndex <= 0} className='border-2 border-blue-900 rounded-xl p-2 w-20 hover:bg-blue-900 hover:text-white transition'>Undo</button>
                <button onClick={handleRedo} disabled={currentIndex >= historyStack.length - 1} className='border-2 border-blue-900 rounded-xl p-2 w-20 ml-5 hover:bg-blue-900 hover:text-white transition'>Redo</button>
            </div>
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={handleChange}
                className='h-full w-full'
                modules={modules}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            />
            {/* Make text elements draggable */}
            <style>
                {`
                    .ql-editor * {
                        cursor: move;
                    }
                `}
            </style>
        </div>
    );
};

export default Editor;