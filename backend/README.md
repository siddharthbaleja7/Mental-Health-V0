Transcription provider

This service supports two transcription providers for converting audio files to text:

1) gemini - send base64-encoded audio to a Gemini-compatible HTTP endpoint
2) google (default) - uses @google-cloud/speech

Environment variables

- TRANSCRIPTION_PROVIDER: "gemini" or "google" (default: google)
- GEMINI_API_URL: URL to POST JSON { filename, audio: <base64>, content_type }
- GEMINI_API_KEY: Bearer token for GEMINI_API_URL (optional)

Examples

To use Gemini provider, set in .env:

TRANSCRIPTION_PROVIDER=gemini
GEMINI_API_URL=https://example.com/api/transcribe
GEMINI_API_KEY=<token>

If using Google Cloud Speech, ensure you have set up credentials for @google-cloud/speech per their docs and leave TRANSCRIPTION_PROVIDER unset or set to "google".

Behavior

The transcription service exports transcribe(filePath) which returns the transcription string or throws an error on failure.