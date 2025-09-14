/**
 * Simple test component that uses only standard Lens Studio events
 * This version doesn't require the SpectaclesInteractionKit
 */
@component
export class InsultDetectorSimpleTest extends BaseScriptComponent {
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
    // Set up standard Lens Studio touch events
    this.setupTouchEvents();

    this.updateDebugText("Simple Test Ready - Tap to cycle through test phrases");
  }

  private setupTouchEvents() {
    // Use standard Lens Studio touch events
    const touchStartEvent = this.createEvent('TouchStartEvent');
    touchStartEvent.bind(() => {
      this.runNextTest();
    });

    print('InsultDetectorSimpleTest: Using standard Lens Studio touch events');
  }

  private runNextTest() {
    const testText = this.testTexts[this.currentTestIndex];
    this.currentTestIndex = (this.currentTestIndex + 1) % this.testTexts.length;
    
    this.updateDebugText(`Testing: "${testText}"`);
    
    // Simple insult detection
    const isInsult = this.detectInsult(testText);
    if (isInsult) {
      this.updateDebugText(`INSULT DETECTED: "${testText}"`);
    } else {
      this.updateDebugText(`No insult: "${testText}"`);
    }
    
    print(`Test text: ${testText} - ${isInsult ? 'INSULT' : 'OK'}`);
  }

  private detectInsult(text: string): boolean {
    // Simple insult detection
    const insultWords = ['stupid', 'hate', 'idiot', 'terrible', 'suck'];
    const lowerText = text.toLowerCase();
    
    return insultWords.some(word => lowerText.includes(word));
  }

  private updateDebugText(message: string) {
    if (this.debugText) {
      this.debugText.text = `Simple Test: ${message}`;
    }
  }

  // Public method to test with specific text
  public testWithText(text: string) {
    this.updateDebugText(`Manual test: "${text}"`);
    const isInsult = this.detectInsult(text);
    if (isInsult) {
      this.updateDebugText(`INSULT DETECTED: "${text}"`);
    } else {
      this.updateDebugText(`No insult: "${text}"`);
    }
    print(`Manual test text: ${text} - ${isInsult ? 'INSULT' : 'OK'}`);
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
