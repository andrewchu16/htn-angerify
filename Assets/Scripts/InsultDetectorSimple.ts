import { MicrophoneRecorder } from "./MicrophoneRecorder";
import { InsultDetector } from "./InsultDetector";

/**
 * Simple version of InsultDetectorController that uses only standard Lens Studio events
 * This version doesn't require the SpectaclesInteractionKit
 */
@component
export class InsultDetectorSimple extends BaseScriptComponent {
  @input
  microphoneRecorder: MicrophoneRecorder;

  @input
  insultDetector: InsultDetector;

  @input
  @allowUndefined
  debugText: Text;

  @input
  enableInsultDetection: boolean = true;

  @input
  enableContentFiltering: boolean = true;

  @input
  textFeedInterval: number = 3.0; // seconds

  private isActive: boolean = false;

  onAwake() {
    // Set up standard Lens Studio touch events
    this.setupTouchEvents();

    // Configure the insult detector
    if (this.insultDetector) {
      this.insultDetector.enableContentFiltering = this.enableContentFiltering;
      this.insultDetector.textFeedInterval = this.textFeedInterval;
    }

    this.updateDebugText("Insult Detector Simple Ready - Tap to start/stop");
  }

  private setupTouchEvents() {
    // Use standard Lens Studio touch events
    const touchStartEvent = this.createEvent('TouchStartEvent');
    touchStartEvent.bind(() => {
      this.toggleInsultDetection();
    });

    print('InsultDetectorSimple: Using standard Lens Studio touch events');
  }

  private toggleInsultDetection() {
    if (this.isActive) {
      this.stopInsultDetection();
    } else {
      this.startInsultDetection();
    }
  }

  private startInsultDetection() {
    if (this.isActive) return;
    
    this.isActive = true;
    
    // Start microphone recording
    if (this.microphoneRecorder) {
      this.microphoneRecorder.recordMicrophoneAudio(true);
    }
    
    this.updateDebugText("Insult detection started - speak to test!");
  }

  private stopInsultDetection() {
    if (!this.isActive) return;
    
    this.isActive = false;
    
    // Stop microphone recording
    if (this.microphoneRecorder) {
      this.microphoneRecorder.recordMicrophoneAudio(false);
    }
    
    // Clear any active 3D models
    if (this.insultDetector) {
      this.insultDetector.clearAll3DModels();
    }
    
    this.updateDebugText("Insult detection stopped - tap to start again");
  }

  private updateDebugText(message: string) {
    if (this.debugText) {
      this.debugText.text = `Simple Controller: ${message}`;
    }
  }

  // Public method to manually test with specific text
  public testWithText(text: string) {
    if (this.insultDetector) {
      this.insultDetector.processText(text);
    }
  }

  // Public method to toggle content filtering
  public toggleContentFiltering() {
    this.enableContentFiltering = !this.enableContentFiltering;
    if (this.insultDetector) {
      this.insultDetector.enableContentFiltering = this.enableContentFiltering;
    }
    this.updateDebugText(`Content filtering: ${this.enableContentFiltering ? 'ON' : 'OFF'}`);
  }

  // Public method to change text feed interval
  public setTextFeedInterval(interval: number) {
    this.textFeedInterval = interval;
    if (this.insultDetector) {
      this.insultDetector.textFeedInterval = interval;
    }
    this.updateDebugText(`Text feed interval: ${interval}s`);
  }

  // Public method to manually start insult detection
  public startInsultDetectionManually() {
    this.startInsultDetection();
  }

  // Public method to manually stop insult detection
  public stopInsultDetectionManually() {
    this.stopInsultDetection();
  }
}
