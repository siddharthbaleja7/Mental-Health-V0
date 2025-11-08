import React, { useState, useRef, useEffect } from 'react';
import { MicIcon, StopIcon } from './icons/Icons';
import LoadingSpinner from './LoadingSpinner';
import { analyzeSpeech } from '../api';

// 1. List of prompts
const prompts = [
  "What's on your mind today?",
  "Feel free to share your thoughts.",
  "What's a small victory you had today?",
  "Take a deep breath and speak freely.",
  "What are you looking forward to?",
];

// 2. Helper to get a random prompt
const getRandomPrompt = () => prompts[Math.floor(Math.random() * prompts.length)];

/**
 * The core component for recording audio and displaying analysis.
 */
const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState(''); // 3. State for the UI message
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // 4. Set a new prompt when the component first loads
  useEffect(() => {
    setPrompt(getRandomPrompt());
  }, []); // The empty array means this runs only once

  const startRecording = async () => {
    setResult(null);
    setError(null);
    try {
      // Get user permission for microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create the recorder
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = []; // Clear any old audio data

      // Store audio data as it's recorded
      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      // When recording stops, package and send the file
      recorder.onstop = async () => {
        setLoading(true);
        setError(null); // Clear previous errors
        setResult(null); // Clear previous results

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });

        try {
          // Call the API
          const analysisResult = await analyzeSpeech(audioFile);

          // ***** THIS IS THE BUG FIX *****
          // Check if the backend sent us an error message
          if (analysisResult.riskError) {
            setError(analysisResult.riskError); // Set the error state
            setResult(null); // Ensure no result is shown
          } else {
            // Success! No error reported from backend.
            setResult(analysisResult); // Set the successful result
            setError(null);
          }
          // ***************************

        } catch (err) {
          // This catches network-level errors (e.g., server is down)
          setError('Analysis failed. Could not connect to the server.');
        } finally {
          setLoading(false);
          // 5. Get a new prompt for the next session
          setPrompt(getRandomPrompt());
        }
      };

      // Start!
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone error:", err);
      setError('Microphone access was denied. Please enable it in your browser settings.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Helper to color-code the risk score
  const getRiskColor = (score) => {
    // Add a check for null/undefined score
    if (score === null || typeof score === 'undefined') {
      return 'text-gray-500';
    }
    if (score <= 0.3) return 'text-green-600 dark:text-green-400';
    if (score <= 0.7) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">

      {/* --- 6. YOUR NEW UI MESSAGE --- */}
      <div className="mb-6 text-center">
        <p className="text-xl font-medium text-gray-900 dark:text-white">
          {prompt}
        </p>
      </div>

      {/* --- RECORDING BUTTON --- */}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`w-full flex items-center justify-center p-6 rounded-full transition-all duration-300 ease-in-out ${isRecording
          ? 'bg-red-500 hover:bg-red-600'
          : 'bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200'
          } text-white dark:text-black`}
        disabled={loading}
      >
        {isRecording ? (
          <StopIcon className="w-10 h-10" />
        ) : (
          <MicIcon className="w-10 h-10" />
        )}
      </button>

      {/* --- STATUS TEXT --- */}
      <div className="mt-6 text-center">
        <p className="text-lg font-medium text-gray-900 dark:text-white">
          {isRecording ? 'Recording...' : 'Tap to start recording'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your session will be analyzed for mental health indicators.
        </p>
      </div>

      {/* --- LOADING SPINNER --- */}
      {loading && (
        <div className="mt-6 flex flex-col items-center">
          <LoadingSpinner />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Analyzing...
          </p>
        </div>
      )}

      {/* --- ERROR MESSAGE --- */}
      {error && (
        <p className="mt-4 text-center text-red-500">{error}</p>
      )}

      {/* --- RESULTS CARD --- */}
      {result && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
          <div className="text-center py-6">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-white mb-2">Great Job!</h3>
            <p className="text-gray-300">
              You've completed this week's check-in. You're doing great, champ!
              See you next week!
            </p>
            <p className="mt-4 text-sm text-gray-500 italic">
              "{result.transcript}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;