
import React, { useState, useRef } from 'react';
import { editImage } from '../geminiService';
import { PRESET_EDIT_COMMANDS } from '../constants';
import { GeneratedMedia } from '../types';

interface ImageEditorProps {
  onImageEdited: (media: GeneratedMedia) => void;
  onLoadingStateChange?: (loading: boolean) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ onImageEdited, onLoadingStateChange }) => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSourceImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!sourceImage || !prompt.trim()) return;
    setLoading(true);
    if (onLoadingStateChange) onLoadingStateChange(true);
    setError(null);
    try {
      const editedUrl = await editImage(sourceImage, prompt);
      // Constructing GeneratedMedia object with required fields
      const newMedia: GeneratedMedia = {
        id: crypto.randomUUID(),
        url: editedUrl,
        type: 'image',
        prompt: prompt,
        aspectRatio: '1:1', // Default for edited images
        timestamp: Date.now(),
      };
      onImageEdited(newMedia);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to edit image.';
      setError(message);
      // Fix: Reset key selection state and prompt user to select a key again via openSelectKey() if Requested entity was not found
      if (message.includes("Requested entity was not found")) {
        window.aistudio.openSelectKey();
      }
    } finally {
      setLoading(false);
      if (onLoadingStateChange) onLoadingStateChange(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="p-1.5 bg-red-100 text-red-600 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
          </span>
          Edit Background
        </h2>

        {!sourceImage ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center cursor-pointer hover:border-red-300 hover:bg-red-50 transition-all group"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white group-hover:text-red-500 transition-colors shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            </div>
            <p className="text-gray-600 font-medium">Click to upload background</p>
            <p className="text-sm text-gray-400 mt-1">PNG, JPG or WebP (Max 10MB)</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative group rounded-xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50">
              <img src={sourceImage} alt="Source" className="w-full h-auto max-h-[400px] object-contain mx-auto" />
              <button 
                onClick={() => setSourceImage(null)}
                className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all backdrop-blur-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Modification Request</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {PRESET_EDIT_COMMANDS.map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => setPrompt(cmd)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded-full transition-colors"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Add a subtle red grid to the floor' or 'Make the lighting colder'..."
                className="w-full h-24 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none text-gray-700"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button
              onClick={handleEdit}
              disabled={loading || !prompt.trim()}
              className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                loading 
                  ? 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 text-gray-400 cursor-not-allowed animate-pulse shadow-sm' 
                  : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200 active:scale-95'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  ОБРАБОТКА ИЗОБРАЖЕНИЯ...
                </>
              ) : (
                <>
                  Применить изменения
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageEditor;
