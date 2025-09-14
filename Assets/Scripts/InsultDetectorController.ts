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
    
    if (!this.interactable) {
      print('Error: Interactable component is required for InsultDetectorController. Please add the Interactable component to this object.');
      return;
    }

    // Set up SpectaclesInteractionKit events
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

    // Configure the insult detector
    if (this.insultDetector) {
      this.insultDetector.enableContentFiltering = this.enableContentFiltering;
      this.insultDetector.textFeedInterval = this.textFeedInterval;
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

}
