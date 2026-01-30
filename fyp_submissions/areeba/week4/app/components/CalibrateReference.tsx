'use client';
import { useRef, useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

export default function CalibrateReference() {
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [status, setStatus] = useState('Loading model...');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      console.log('Loading model...');
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
      setStatus('Ready! Upload your art print image to create reference');
      console.log('✓ Model loaded');
    } catch (error) {
      setStatus('Error loading model');
      console.error(error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatus('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setUploadedImage(imageUrl);
      setStatus('Image loaded. Click "Generate Reference" to create the reference file.');
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const captureReference = async () => {
    if (!model || !uploadedImage || !imageRef.current) {
      setStatus('Please upload an image first');
      return;
    }

    setStatus('Generating reference...');
    console.log('Generating reference embedding...');

    try {
      // Wait for image to load
      await new Promise<void>((resolve, reject) => {
        if (!imageRef.current) return reject();
        
        if (imageRef.current.complete) {
          resolve();
        } else {
          imageRef.current.onload = () => resolve();
          imageRef.current.onerror = () => reject();
        }
      });

      // Extract features from image
      const img = tf.browser.fromPixels(imageRef.current);
      const embedding = model.infer(img, true) as tf.Tensor;
      const data = await embedding.data();
      
      const referenceData = {
        embedding: Array.from(data),
        generated: new Date().toISOString(),
        note: "Generated from calibration tool"
      };
      
      // Create downloadable file
      const blob = new Blob([JSON.stringify(referenceData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reference-embedding.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setStatus('✅ Reference file downloaded! Now replace public/reference-embedding.json with this file, then refresh your app.');
      
      img.dispose();
      embedding.dispose();
      
      console.log('✓ Reference generated successfully!');
      console.log('Features extracted:', data.length);
    } catch (error) {
      setStatus('Error generating reference');
      console.error(error);
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setStatus('Ready! Upload your art print image to create reference');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 bg-gray-900">
      <div className="max-w-2xl w-full bg-gray-800 rounded-3xl p-6 border-2 border-yellow-400">
        <h1 className="text-white text-3xl font-bold text-center mb-4">
          🔧 Reference Calibration Tool
        </h1>
        <p className="text-yellow-300 text-center mb-6">
          Upload your art print image to create the reference file
        </p>
        
        {/* Image Preview */}
        <div className="relative bg-black rounded-2xl overflow-hidden mb-6 aspect-video">
          {uploadedImage ? (
            <img
              ref={imageRef}
              src={uploadedImage}
              alt="Art print for reference"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <svg 
                className="w-24 h-24 text-white/40 mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              <p className="text-white/60 text-lg">Upload your art print</p>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="bg-black/60 rounded-xl p-4 mb-6">
          <p className="text-center text-white text-lg">{status}</p>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Buttons */}
        <div className="flex gap-4 mb-6">
          {!uploadedImage ? (
            <button
              onClick={handleUploadClick}
              disabled={!model}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white text-lg font-semibold py-4 rounded-full"
            >
              {model ? '📤 Upload Art Print' : 'Loading...'}
            </button>
          ) : (
            <>
              <button
                onClick={captureReference}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold py-4 rounded-full"
              >
                ✨ Generate Reference
              </button>
              <button
                onClick={handleReset}
                className="bg-red-500 hover:bg-red-600 text-white text-lg font-semibold py-4 px-6 rounded-full"
              >
                Reset
              </button>
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-yellow-900/50 border border-yellow-600 rounded-xl p-4">
          <h3 className="text-yellow-300 font-bold mb-2">📋 Instructions:</h3>
          <ol className="text-white text-sm space-y-2 list-decimal list-inside">
            <li>Click <strong>"Upload Art Print"</strong></li>
            <li>Select your art print image file</li>
            <li>Click <strong>"Generate Reference"</strong></li>
            <li>A file named <code className="bg-black/50 px-1 rounded">reference-embedding.json</code> will download</li>
            <li>Go to your project folder: <code className="bg-black/50 px-1 rounded">public/</code></li>
            <li><strong>Replace</strong> the existing <code className="bg-black/50 px-1 rounded">reference-embedding.json</code> with the downloaded file</li>
            <li>Refresh your main app at <code className="bg-black/50 px-1 rounded">localhost:3000</code></li>
            <li>Now test by uploading the same art print - it should verify! ✅</li>
          </ol>
          
          <div className="mt-4 pt-4 border-t border-yellow-600/30">
            <p className="text-yellow-200 text-sm">
              💡 <strong>Tip:</strong> Use a clear, well-lit photo of your art print for best results.
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <a 
            href="/"
            className="text-cyan-400 hover:text-cyan-300 underline"
          >
            ← Back to main app
          </a>
        </div>
      </div>
    </div>
  );
}