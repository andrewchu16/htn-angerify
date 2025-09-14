import { MicrophoneRecorder } from "./MicrophoneRecorder";
import { SimpleASR } from "./SimpleASR";
import { InsultDetector } from "./InsultDetector";
import { InsultDetectorController } from "./InsultDetectorController";
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";

/**
 * Complete example demonstrating the insult detection system
 * This component shows how to set up and use all the pieces together
 */
@component
export class InsultDetectorExample extends BaseScriptComponent {
  @input
  microphoneRecorder: MicrophoneRecorder;

  @input
  asrComponent: SimpleASR;

  @input
  insultDetector: InsultDetector;

  @input
  controller: InsultDetectorController;

  @input
  @allowUndefined
  debugText: Text;

  @input
  enableDemoMode: boolean = true;

  private demoTexts: string[] = [
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

  private demoIndex: number = 0;
  private demoTimer: number = 0;
  private demoInterval: number = 5.0; // seconds

  onAwake() {
    // Set up the components
    this.setupComponents();
    
    // Create demo mode if enabled
    if (this.enableDemoMode) {
      this.createEvent('UpdateEvent').bind(() => {
        this.updateDemoMode();
      });
    }

    // Set up interaction for manual testing
    this.setupInteraction();
  }

  private setupComponents() {
    // Configure the ASR component
    if (this.asrComponent) {
      this.asrComponent.processingInterval = 2.0;
      this.asrComponent.debugText = this.debugText;
    }

    // Configure the insult detector
    if (this.insultDetector) {
      this.insultDetector.enableContentFiltering = true;
      this.insultDetector.textFeedInterval = 3.0;
      this.insultDetector.debugText = this.debugText;
    }

    // Configure the controller
    if (this.controller) {
      this.controller.enableInsultDetection = true;
      this.controller.enableContentFiltering = true;
      this.controller.textFeedInterval = 3.0;
      this.controller.debugText = this.debugText;
    }
  }

  private setupInteraction() {
    // Add interaction for manual testing
    const interactable = this.sceneObject.getComponent(Interactable.getTypeName());
    if (interactable) {
      interactable.onTriggerStart.add(() => {
        this.testWithRandomText();
      });
    }
  }

  private updateDemoMode() {
    if (!this.enableDemoMode) return;

    this.demoTimer += getDeltaTime();
    
    if (this.demoTimer >= this.demoInterval) {
      this.demoTimer = 0;
      this.testWithRandomText();
    }
  }

  private testWithRandomText() {
    const text = this.demoTexts[this.demoIndex];
    this.demoIndex = (this.demoIndex + 1) % this.demoTexts.length;
    
    this.updateDebugText(`Testing with: "${text}"`);
    
    // Test the insult detector directly
    if (this.insultDetector) {
      this.insultDetector.processText(text);
    }
  }

  private updateDebugText(message: string) {
    if (this.debugText) {
      this.debugText.text = `Example: ${message}`;
    }
  }

  // Public methods for external control
  public testWithText(text: string) {
    this.updateDebugText(`Manual test: "${text}"`);
    if (this.insultDetector) {
      this.insultDetector.processText(text);
    }
  }

  public toggleDemoMode() {
    this.enableDemoMode = !this.enableDemoMode;
    this.updateDebugText(`Demo mode: ${this.enableDemoMode ? 'ON' : 'OFF'}`);
  }

  public setDemoInterval(interval: number) {
    this.demoInterval = interval;
    this.updateDebugText(`Demo interval: ${interval}s`);
  }

  public clearAll3DModels() {
    if (this.insultDetector) {
      this.insultDetector.clearAll3DModels();
    }
    this.updateDebugText("All 3D models cleared");
  }
}
