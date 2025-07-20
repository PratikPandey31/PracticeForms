import { useState } from 'react';
import { storage } from '../Firebase/firebase.ts';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import type { StorageReference } from 'firebase/storage';

interface FirebaseStorageTestProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FirebaseStorageTest({ isOpen, onClose }: FirebaseStorageTestProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [fileList, setFileList] = useState<StorageReference[]>([]);

  const handleFileUpload = async () => {
    if (!file) {
      setUploadStatus('Please select a file first');
      return;
    }

    try {
      setUploadStatus('Uploading...');
      const storageRef = ref(storage, `test-files/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setDownloadUrl(url);
      setUploadStatus('Upload successful!');
      setFile(null);
      // Refresh file list
      listFiles();
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const listFiles = async () => {
    try {
      const listRef = ref(storage, 'test-files/');
      const res = await listAll(listRef);
      setFileList(res.items);
    } catch (error) {
      console.error('List files error:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-40 p-4 pt-20"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">Firebase Storage Test</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-4 border border-slate-200 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-700 mb-3">Upload Test File</h3>
            <div className="flex flex-col gap-3">
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
              <button
                onClick={handleFileUpload}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition font-semibold"
              >
                Upload to Firebase Storage
              </button>
              {uploadStatus && (
                <p className={`text-sm ${uploadStatus.includes('successful') ? 'text-green-600' : uploadStatus.includes('failed') ? 'text-red-600' : 'text-blue-600'}`}>
                  {uploadStatus}
                </p>
              )}
            </div>
          </div>

          {downloadUrl && (
            <div className="p-4 border border-slate-200 rounded-lg">
              <h3 className="text-lg font-semibold text-slate-700 mb-3">Download URL</h3>
              <p className="text-sm text-slate-600 break-all bg-slate-50 p-2 rounded">{downloadUrl}</p>
            </div>
          )}

          <div className="p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-slate-700">Files in Storage</h3>
              <button
                onClick={listFiles}
                className="bg-slate-600 text-white px-3 py-1 rounded text-sm hover:bg-slate-700 transition"
              >
                Refresh List
              </button>
            </div>
            {fileList.length > 0 ? (
              <ul className="space-y-2">
                {fileList.map((item, index) => (
                  <li key={index} className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                    {item.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No files found. Upload a file to see it here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 