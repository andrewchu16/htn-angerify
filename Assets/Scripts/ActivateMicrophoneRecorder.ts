import { MicrophoneRecorder } from "./MicrophoneRecorder";

@component
export class ActivateMicrophoneRecorder extends BaseScriptComponent {
  @input
  microphoneRecorder: MicrophoneRecorder;

  @input
  @allowUndefined
  debugText: Text;

  private isRecording: boolean = false;

  onAwake() {
    // Check if microphoneRecorder is connected
    if (!this.microphoneRecorder) {
      print('Error: microphoneRecorder input not connected to ActivateMicrophoneRecorder component');
      if (this.debugText) {
        this.debugText.text = 'Error: MicrophoneRecorder not connected';
      }
      return;
    }

    // Set up standard Lens Studio touch events
    this.setupTouchEvents();
    
    print('ActivateMicrophoneRecorder: Component initialized');
  }

  private setupTouchEvents() {
    // Use standard Lens Studio touch events
    const touchStartEvent = this.createEvent('TouchStartEvent');
    touchStartEvent.bind(() => {
      this.startRecording();
    });

    const touchEndEvent = this.createEvent('TouchEndEvent');
    touchEndEvent.bind(() => {
      this.stopRecording();
    });

    print('ActivateMicrophoneRecorder: Using standard Lens Studio touch events');
  }

  private startRecording() {
    if (this.isRecording) return;
    
    this.isRecording = true;
    this.microphoneRecorder.recordMicrophoneAudio(true);
    
    if (this.debugText) {
      this.debugText.text = 'Recording started - hold to record';
    }
    print('ActivateMicrophoneRecorder: Recording started');
  }

  private stopRecording() {
    if (!this.isRecording) return;
    
    this.isRecording = false;
    this.microphoneRecorder.recordMicrophoneAudio(false);
    
    if (this.debugText) {
      this.debugText.text = 'Recording stopped';
    }
    print('ActivateMicrophoneRecorder: Recording stopped');
  }

  // Public method to manually start recording
  public startRecordingManually() {
    this.startRecording();
  }

  // Public method to manually stop recording
  public stopRecordingManually() {
    this.stopRecording();
  }

  // Public method to check recording status
  public isCurrentlyRecording(): boolean {
    return this.isRecording;
  }
}
