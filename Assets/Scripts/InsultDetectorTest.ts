import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";

/**
 * Simple test component for the Insult Detector system
 * This component provides buttons to test different scenarios
 */
@component
export class InsultDetectorTest extends BaseScriptComponent {
  @input
  @allowUndefined
  debugText: Text;

  private testTexts: string[] = [
    "You're so stupid!",
    "I hate you!",
    "You're an idiot!",
    "That's terrible!",
    "You suck!",
    "Hello there",
    "How are you?",
    "Nice weather today"
  ];

  private currentTestIndex: number = 0;

  onAwake() {
    // Set up interaction for testing
    const interactable = this.sceneObject.getComponent(Interactable.getTypeName());
    if (interactable) {
      // Try to use the SpectaclesInteractionKit events if available
      if (interactable.onTriggerStart) {
        interactable.onTriggerStart.add(() => {
          this.runNextTest();
        });
        print('TestController: Using SpectaclesInteractionKit events');
      } else {
        print('Warning: SpectaclesInteractionKit events not available. Using standard Lens Studio events.');
        this.setupStandardEvents();
      }
    } else {
      print('Warning: Interactable component not found on TestController. Using standard Lens Studio events.');
      this.setupStandardEvents();
    }

    this.updateDebugText("Insult Detector Test Ready - Tap to test");
  }

  private setupStandardEvents() {
    // Use standard Lens Studio events as fallback
    const touchStartEvent = this.createEvent('TouchStartEvent');
    touchStartEvent.bind(() => {
      this.runNextTest();
    });

    print('TestController: Using standard Lens Studio touch events');
  }

  private runNextTest() {
    const testText = this.testTexts[this.currentTestIndex];
    this.currentTestIndex = (this.currentTestIndex + 1) % this.testTexts.length;
    
    this.updateDebugText(`Testing: "${testText}"`);
    
    // In a real implementation, you would call the insult detector here
    // For now, we'll just show the text
    print(`Test text: ${testText}`);
  }

  private updateDebugText(message: string) {
    if (this.debugText) {
      this.debugText.text = `Test: ${message}`;
    }
  }

  // Public method to test with specific text
  public testWithText(text: string) {
    this.updateDebugText(`Manual test: "${text}"`);
    print(`Manual test text: ${text}`);
  }

  // Public method to get current test text
  public getCurrentTestText(): string {
    return this.testTexts[this.currentTestIndex];
  }

  // Public method to get all test texts
  public getAllTestTexts(): string[] {
    return [...this.testTexts];
  }
}
