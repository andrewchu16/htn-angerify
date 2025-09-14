import { MicrophoneRecorder } from "./MicrophoneRecorder";
import { InsultDetector } from "./InsultDetector";
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";

@component
export class InsultDetectorController extends BaseScriptComponent {
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

  private interactable: Interactable;
  private isActive: boolean = false;

  onAwake() {
    // Get the interactable component for start/stop control
    this.interactable = this.sceneObject.getComponent(Interactable.getTypeName());
    
    if (this.interactable) {
      // Try to use the SpectaclesInteractionKit events if available
      if (this.interactable.onTriggerStart) {
        this.interactable.onTriggerStart.add(() => {
          this.startInsultDetection();
        });
        
        this.interactable.onTriggerEnd.add(() => {
          this.stopInsultDetection();
        });
        
        this.interactable.onTriggerCanceled.add(() => {
          this.stopInsultDetection();
        });
        print('InsultDetectorController: Using SpectaclesInteractionKit events');
      } else {
        print('Warning: SpectaclesInteractionKit events not available. Using standard Lens Studio events.');
        this.setupStandardEvents();
      }
    } else {
      print('Warning: Interactable component not found on InsultDetectorController. Using standard Lens Studio events.');
      this.setupStandardEvents();
    }

    // Configure the insult detector
    if (this.insultDetector) {
      this.insultDetector.enableContentFiltering = this.enableContentFiltering;
      this.insultDetector.textFeedInterval = this.textFeedInterval;
    }
  }

  private setupStandardEvents() {
    // Use standard Lens Studio events as fallback
    const touchStartEvent = this.createEvent('TouchStartEvent');
    touchStartEvent.bind(() => {
      this.startInsultDetection();
    });

    const touchEndEvent = this.createEvent('TouchEndEvent');
    touchEndEvent.bind(() => {
      this.stopInsultDetection();
    });

    print('InsultDetectorController: Using standard Lens Studio touch events');
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
    
    this.updateDebugText("Insult detection stopped");
  }

  private updateDebugText(message: string) {
    if (this.debugText) {
      this.debugText.text = `Controller: ${message}`;
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

  // Public method to manually start insult detection (if no Interactable component)
  public startInsultDetectionManually() {
    this.startInsultDetection();
  }

  // Public method to manually stop insult detection (if no Interactable component)
  public stopInsultDetectionManually() {
    this.stopInsultDetection();
  }
}
