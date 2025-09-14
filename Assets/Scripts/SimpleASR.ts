import { MicrophoneRecorder } from "./MicrophoneRecorder";

@component
export class SimpleASR extends BaseScriptComponent {
  @input
  microphoneRecorder: MicrophoneRecorder;

  @input
  @allowUndefined
  debugText: Text;

  @input
  processingInterval: number = 2.0; // seconds

  private processingTimer: number = 0;
  private isProcessing: boolean = false;
  private audioBuffer: Float32Array[] = [];
  private maxBufferSize: number = 10; // Keep last 10 audio frames

  onAwake() {
    // Create update event for processing audio
    this.createEvent('UpdateEvent').bind(() => {
      this.updateASR();
    });
  }

  private updateASR() {
    if (!this.microphoneRecorder || this.isProcessing) {
      return;
    }

    this.processingTimer += getDeltaTime();
    
    if (this.processingTimer >= this.processingInterval) {
      this.processingTimer = 0;
      this.processAudioBuffer();
    }
  }

  private processAudioBuffer() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    
    try {
      // Get recent audio data from the microphone recorder
      const recentAudio = this.getRecentAudioData();
      
      if (recentAudio && recentAudio.length > 0) {
        // Convert audio to text (simplified mock implementation)
        const transcription = this.audioToText(recentAudio);
        
        if (transcription && transcription.trim().length > 0) {
          this.onTranscriptionReady(transcription);
        }
      }
    } catch (error) {
      print('Error in ASR processing: ' + error);
    } finally {
      this.isProcessing = false;
    }
  }

  private getRecentAudioData(): Float32Array[] {
    // This is a simplified version - in reality you'd access the microphone recorder's audio data
    // For now, we'll return a mock array
    return [];
  }

  private audioToText(audioData: Float32Array[]): string {
    // This is a mock implementation
    // In a real implementation, you would:
    // 1. Send audio data to a speech recognition service
    // 2. Use the Remote Service Gateway to call an ASR API
    // 3. Return the transcribed text
    
    // For demo purposes, return mock transcriptions occasionally
    if (Math.random() < 0.2) { // 20% chance of mock transcription
      const mockTexts = [
        "You're so stupid!",
        "I hate you!",
        "You're an idiot!",
        "That's terrible!",
        "You suck!",
        "Hello there",
        "How are you?",
        "Nice weather today",
        "What's going on?",
        "That's amazing!"
      ];
      
      return mockTexts[Math.floor(Math.random() * mockTexts.length)];
    }
    
    return "";
  }

  private onTranscriptionReady(transcription: string) {
    this.updateDebugText(`Transcribed: "${transcription}"`);
    
    // For now, just print the transcription instead of using custom events
    print(`ASR Transcription: ${transcription}`);
  }

  private updateDebugText(message: string) {
    if (this.debugText) {
      this.debugText.text = `ASR: ${message}`;
    }
  }

  // Public method to manually set transcription (for testing)
  public setMockTranscription(text: string) {
    this.onTranscriptionReady(text);
  }
}