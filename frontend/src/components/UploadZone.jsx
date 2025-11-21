import React, { useState, useCallback } from 'react';
import API_BASE_URL from '../config';

const UploadZone = ({ onUploadComplete }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback(async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = [...e.dataTransfer.files];
        if (files.length > 0) {
            await uploadFile(files[0]);
        }
    }, []);

    const handleFileInput = async (e) => {
        const files = [...e.target.files];
        if (files.length > 0) {
            await uploadFile(files[0]);
        }
    };

    const uploadFile = async (file) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('${API_BASE_URL}/api/documents/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Upload successful:', data);
                if (onUploadComplete) onUploadComplete();
            } else {
                console.error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div
            className={`w-full p-8 border-2 border-dashed rounded-xl transition-colors cursor-pointer text-center ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-blue-300 bg-blue-50 hover:bg-blue-100'
                }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput').click()}
        >
            <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFileInput}
                accept=".pdf,.pptx,.docx,.txt"
            />
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-white rounded-full shadow-sm">
                    {isUploading ? (
                        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    )}
                </div>
                <div>
                    <p className="text-lg font-medium text-blue-900">
                        {isUploading ? 'Uploading...' : 'Upload Study Materials'}
                    </p>
                    <p className="text-sm text-blue-600">Drag & drop PDF, PPTX, or DOCX files here</p>
                </div>
            </div>
        </div>
    );
};

export default UploadZone;
