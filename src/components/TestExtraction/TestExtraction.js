import React, { useState } from 'react';
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import './TestExtraction.css';

const TestExtraction = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedImage, setExtractedImage] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(`Extract ONLY the kart/vehicle from this SmashKarts screenshot. Remove EVERYTHING else - no background, no checkerboard, no transparent patterns, no shadows, no effects. Just the pure kart floating in completely empty space. The result should be ONLY the kart with absolutely nothing around it. No background color, no transparency patterns, just the kart in empty void.`);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog = {
      id: Date.now(),
      message,
      type,
      timestamp
    };
    setLogs(prevLogs => [newLog, ...prevLogs]);
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('All logs cleared', 'success');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        addLog(`Image uploaded: ${file.name}`, 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtractImage = async () => {
    if (!uploadedImage) return;
    
    setIsProcessing(true);
    addLog('Starting image extraction...', 'info');
    
    try {
      // Extract base64 from data URL
      const base64Data = uploadedImage.split(',')[1];
      addLog('Base64 data extracted from image', 'info');
      
      // Create Google AI instance with your API key
      const google = createGoogleGenerativeAI({
        apiKey: 'AIzaSyCmyzKt2vIHawx7qupiO1D01kTrbSmtgIk',
      });

      // Extract cart image using AI SDK with custom prompt
      let extractedImageBase64 = "";
      try {
        addLog('Extracting image with AI SDK using custom prompt...', 'info');
        addLog(`Custom prompt: ${customPrompt}`, 'info');
        
        const result = await generateText({
          model: google('gemini-2.0-flash-exp'),
          providerOptions: {
            google: { responseModalities: ['TEXT', 'IMAGE'] },
          },
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: customPrompt,
                },
                {
                  type: "image",
                  image: base64Data,
                },
              ],
            },
          ],
        });

        addLog('AI SDK Response received', 'info');
        
        // Check for image in result.files
        if (result.files && result.files.length > 0) {
          for (const file of result.files) {
            if (file.mediaType.startsWith('image/')) {
              extractedImageBase64 = file.base64;
              addLog('Image extracted successfully!', 'success');
              break;
            }
          }
        }
        
        if (extractedImageBase64) {
          addLog(`Extracted image base64 length: ${extractedImageBase64.length}`, 'info');
          const extractedImageData = `data:image/png;base64,${extractedImageBase64}`;
          setExtractedImage(extractedImageData);
          addLog('Image processing completed successfully', 'success');
        } else {
          addLog('No image found in AI response', 'warning');
          addLog('Try adjusting your custom prompt', 'info');
        }
        
      } catch (extractionError) {
        addLog(`Image extraction failed: ${extractionError.message}`, 'error');
        console.error('Image extraction failed:', extractionError);
      }
    } catch (error) {
      addLog(`Error processing image: ${error.message}`, 'error');
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setIsProcessing(false);
      addLog('Image processing completed', 'info');
    }
  };

  const resetAll = () => {
    setExtractedImage(null);
    setUploadedImage(null);
    addLog('All data reset', 'info');
  };

  const resetToDefaultPrompt = () => {
    setCustomPrompt(`Extract ONLY the kart/vehicle from this SmashKarts screenshot. Remove EVERYTHING else - no background, no checkerboard, no transparent patterns, no shadows, no effects. Just the pure kart floating in completely empty space. The result should be ONLY the kart with absolutely nothing around it. No background color, no transparency patterns, just the kart in empty void.`);
    addLog('Prompt reset to default', 'info');
  };

  return (
    <div className="extraction-page">
      <div className="page-header">
        <h1>SmashKarts Image Extraction</h1>
        <p>Upload your screenshot and extract custom images using AI</p>
      </div>

      <div className="main-content">
        {/* Left Panel - Upload, Prompt Editor, and Logs */}
        <div className="left-panel">
          <div className="upload-section">
            <h2>Image Upload</h2>
            {!uploadedImage ? (
              <div className="file-upload-area">
                <div className="file-upload-content">
                  <ion-icon name="cloud-upload-outline" className="upload-icon"></ion-icon>
                  <p className="upload-text">Upload SmashKarts Screenshot</p>
                  <p className="upload-hint">Click to browse or drag and drop</p>
          <input
            type="file"
                    id="stats-screenshot"
            accept="image/*"
                    required
                    className="file-input"
            onChange={handleImageUpload}
                  />
                  <label htmlFor="stats-screenshot" className="file-label">
                    Choose File
          </label>
        </div>
              </div>
            ) : (
              <div className="image-preview-section">
                <div className="image-preview">
                  <img src={uploadedImage} alt="Uploaded Screenshot" className="uploaded-image" />
                  <button 
                    onClick={() => setUploadedImage(null)}
                    className="remove-image-btn"
                    title="Remove image"
                  >
                    <ion-icon name="close-outline"></ion-icon>
                  </button>
                </div>
                
                <div className="action-buttons">
                  <button 
                    onClick={handleExtractImage}
                    disabled={isProcessing}
                    className="extract-btn"
                  >
                    {isProcessing ? (
                      <>
                        <ion-icon name="hourglass-outline"></ion-icon>
                        Processing...
                      </>
                    ) : (
                      <>
                        <ion-icon name="image-outline"></ion-icon>
                        EXTRACT IMAGE
                      </>
                    )}
                  </button>
                  
                  <button 
                    onClick={resetAll}
                    className="reset-btn"
                  >
                    <ion-icon name="refresh-outline"></ion-icon>
                    Reset All
                  </button>
                </div>
          </div>
        )}
      </div>

          {/* Custom Prompt Editor */}
          <div className="prompt-editor-section">
            <div className="prompt-header">
              <h2>Custom Prompt Editor</h2>
              <div className="prompt-controls">
                <button 
                  onClick={() => setShowPromptEditor(!showPromptEditor)}
                  className="toggle-prompt-btn"
                >
                  {showPromptEditor ? 'Hide Editor' : 'Show Editor'}
                </button>
                <button 
                  onClick={resetToDefaultPrompt}
                  className="reset-prompt-btn"
                >
                  <ion-icon name="refresh-outline"></ion-icon>
                  Reset Prompt
                </button>
              </div>
            </div>
            
            {showPromptEditor && (
              <div className="prompt-container">
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Enter your custom prompt here..."
                  className="prompt-textarea"
                  rows="6"
                />
                <div className="prompt-info">
                  <p><strong>Tip:</strong> Customize the prompt to extract different elements or change the output style.</p>
                  <p><strong>Current prompt:</strong> {customPrompt.length} characters</p>
                  
                  <div className="prompt-suggestions">
                    <p><strong>Quick Prompts for Empty Backgrounds:</strong></p>
                    <div className="suggestion-buttons">
                      <button 
                        onClick={() => setCustomPrompt("Extract ONLY the kart. Remove ALL background elements including checkerboard patterns, transparency, shadows, and effects. Just the kart in empty space.")}
                        className="suggestion-btn"
                      >
                        Pure Kart Only
                      </button>
                      <button 
                        onClick={() => setCustomPrompt("Remove everything except the kart. No background, no patterns, no transparency effects. Just the kart floating in nothingness.")}
                        className="suggestion-btn"
                      >
                        Empty Void
                      </button>
                      <button 
                        onClick={() => setCustomPrompt("Extract the kart and place it in completely empty space. Remove all backgrounds, patterns, shadows, and transparency effects. Only the kart should exist.")}
                        className="suggestion-btn"
                      >
                        Complete Isolation
                      </button>
        <button 
                        onClick={() => setCustomPrompt("Cut out the kart and place it in absolute nothingness. No background colors, no transparency patterns, no shadows, no effects. Just the kart in empty space.")}
                        className="suggestion-btn"
        >
                        Cut & Isolate
        </button>
      </div>

                    <div className="alternative-approaches">
                      <p><strong>Alternative Approaches (AI Limitations):</strong></p>
                      <div className="suggestion-buttons">
                        <button 
                          onClick={() => setCustomPrompt("Extract the kart and place it on a pure black background. Make the background completely black, no white, no gray, just pure black.")}
                          className="suggestion-btn alternative"
                        >
                          Black Background
                        </button>
                        <button 
                          onClick={() => setCustomPrompt("Extract the kart and place it on a dark blue background. Use a very dark blue color, almost black, but definitely not white.")}
                          className="suggestion-btn alternative"
                        >
                          Dark Blue Background
                        </button>
                        <button 
                          onClick={() => setCustomPrompt("Extract the kart and place it on a gradient background from dark purple to black. No white backgrounds allowed.")}
                          className="suggestion-btn alternative"
                        >
                          Gradient Background
                        </button>
                        <button 
                          onClick={() => setCustomPrompt("Extract the kart and place it on a very dark gray background. Use a color that's almost black but not pure black.")}
                          className="suggestion-btn alternative"
                        >
                          Dark Gray Background
                        </button>
                      </div>
                    </div>
                    
                    <div className="ai-limitation-note">
                      <p><strong>⚠️ AI Limitation Note:</strong></p>
                      <p>Most AI models struggle to create truly transparent/empty backgrounds. They often default to white, black, or solid colors. For completely transparent backgrounds, you might need to use image editing software like Photoshop, GIMP, or online tools like remove.bg after extraction.</p>
                    </div>
                  </div>
                </div>
        </div>
      )}
          </div>

          {/* Logs Section */}
          <div className="logs-section">
            <div className="logs-header">
              <h2>Processing Logs</h2>
              <div className="logs-controls">
                <button 
                  onClick={() => setShowLogs(!showLogs)}
                  className="toggle-logs-btn"
                >
                  {showLogs ? 'Hide Logs' : 'Show Logs'}
                </button>
                <button 
                  onClick={clearLogs}
                  className="clear-logs-btn"
                >
                  <ion-icon name="trash-outline"></ion-icon>
                  Clear Logs
                </button>
              </div>
            </div>
            
            {showLogs && (
        <div className="logs-container">
                {logs.length === 0 ? (
                  <p className="no-logs">No logs yet. Start processing to see logs.</p>
                ) : (
                  <div className="logs-list">
                    {logs.map((log) => (
                      <div key={log.id} className={`log-item ${log.type}`}>
                        <span className="log-timestamp">[{log.timestamp}]</span>
                        <span className="log-message">{log.message}</span>
            </div>
          ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="right-panel">
          {extractedImage ? (
            <div className="results-section">
              <h2>Extracted Image</h2>
              <div className="extracted-image-container">
                <img 
                  src={extractedImage} 
                  alt="Extracted Image" 
                  className="extracted-image"
                />
                <div className="image-actions">
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = extractedImage;
                      link.download = 'extracted-image.png';
                      link.click();
                    }}
                    className="download-btn"
                  >
                    <ion-icon name="download-outline"></ion-icon>
                    Download Image
                  </button>
                  <button
                    onClick={resetAll}
                    className="extract-another-btn"
                  >
                    <ion-icon name="add-outline"></ion-icon>
                    Extract Another
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-results">
              <h2>No Results Yet</h2>
              <p>Upload an image and click "Extract Image" to see results here.</p>
              <div className="placeholder-card">
                <ion-icon name="image-outline"></ion-icon>
                <p>Extracted image will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestExtraction;
