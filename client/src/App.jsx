import { useState, useRef } from 'react';
import axios from 'axios';

export default function App() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a video file');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Create FormData object to send the file
      const formData = new FormData();
      formData.append('video', file);
      
      // Send the file to the backend
      const response = await axios.post('/api/video/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Set the result with the response data
      setResult(response.data);
    } catch (err) {
      console.error('Error uploading video:', err);
      setError(err.response?.data?.message || 'Error uploading or processing video');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Video Transcription & Summarization</h1>
          <p className="mt-2 text-lg text-gray-600">Upload a video to get its transcript and summary</p>
        </div>
        
        {!result ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video File
                </label>
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg 
                      className="mx-auto h-12 w-12 text-gray-400" 
                      stroke="currentColor" 
                      fill="none" 
                      viewBox="0 0 48 48" 
                      aria-hidden="true"
                    >
                      <path 
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label 
                        htmlFor="file-upload" 
                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a video</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          accept="video/*"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      MP4, MOV, AVI up to 100MB
                    </p>
                  </div>
                </div>
                {file && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected file: <span className="font-medium">{file.name}</span> ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || !file}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                    ${isLoading || !file ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Upload & Process'
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Results</h2>
              <div className="grid grid-cols-3 gap-2 mb-2 text-sm text-gray-600">
                <div>File ID:</div>
                <div className="col-span-2 font-medium">{result._id}</div>
                
                <div>Filename:</div>
                <div className="col-span-2 font-medium">{result.filename}</div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Summary</h3>
              <div className="p-4 bg-indigo-50 rounded-md">
                <p className="text-gray-800 whitespace-pre-wrap">{result.summary}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Transcript</h3>
              <div className="p-4 bg-gray-50 rounded-md max-h-64 overflow-y-auto">
                <p className="text-gray-800 whitespace-pre-wrap">{result.transcript}</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={resetForm}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Process Another Video
              </button>
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="mt-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Processing Your Video</h3>
                <div className="space-y-2 text-sm text-gray-500 text-center">
                  <p>This may take a few moments.</p>
                  <p>We're extracting audio, generating a transcript, and creating a summary.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}