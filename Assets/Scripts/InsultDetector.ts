import { MicrophoneRecorder } from "./MicrophoneRecorder";
import { SimpleASR } from "./SimpleASR";
import { OpenAI } from "Remote Service Gateway.lspkg/HostedExternal/OpenAI";
import { Snap3D } from "Remote Service Gateway.lspkg/HostedSnap/Snap3D";

type AttachmentPoint =
  | "Left Eyeball"
  | "Right Eyeball"
  | "Candide Center"
  | "Head Center";

interface Display3DModelTool {
  type: "function";
  function: {
    name: "display_3d_model";
    description: "Display a 3D model attached to the face for 5 seconds";
    parameters: {
      type: "object";
      properties: {
        model_prompt: {
          type: "string";
          description: 'Description of the 3D model to display (e.g., "angry face", "fire emoji", "middle finger")';
        };
        attachment_point: {
          type: "string";
          enum: [
            "Left Eyeball",
            "Right Eyeball",
            "Candide Center",
            "Head Center"
          ];
          description: "Where to attach the 3D model on the face";
        };
      };
      required: ["model_prompt", "attachment_point"];
    };
  };
}

@component
export class InsultDetector extends BaseScriptComponent {
  @input
  microphoneRecorder: MicrophoneRecorder;

  @input
  asrComponent: SimpleASR;

  @input
  @allowUndefined
  debugText: Text;

  @input
  enableContentFiltering: boolean = true;

  @input
  textFeedInterval: number = 3.0; // seconds

  private textFeedTimer: number = 0;
  private isProcessing: boolean = false;
  private current3DModels: Map<string, SceneObject> = new Map();

  // LLM tool definition
  private display3DTool: Display3DModelTool = {
    type: "function",
    function: {
      name: "display_3d_model",
      description: "Display a 3D model attached to the face for 5 seconds",
      parameters: {
        type: "object",
        properties: {
          model_prompt: {
            type: "string",
            description:
              'Description of the 3D model to display (e.g., "angry face", "fire emoji", "middle finger")',
          },
          attachment_point: {
            type: "string",
            enum: [
              "Left Eyeball",
              "Right Eyeball",
              "Candide Center",
              "Head Center",
            ],
            description: "Where to attach the 3D model on the face",
          },
        },
        required: ["model_prompt", "attachment_point"],
      },
    },
  };

  onAwake() {
    // Start the text feeding timer
    this.createEvent("UpdateEvent").bind(() => {
      this.updateTextFeeding();
    });
  }

  private updateTextFeeding() {
    if (!this.microphoneRecorder || this.isProcessing) {
      return;
    }

    this.textFeedTimer += getDeltaTime();

    if (this.textFeedTimer >= this.textFeedInterval) {
      this.textFeedTimer = 0;
      this.feedTextToLLM();
    }
  }

  private async feedTextToLLM() {
    if (this.isProcessing) return;

    this.isProcessing = true;

    try {
      // Get recent audio data and convert to text (simplified for demo)
      // In a real implementation, you'd use ASR (Automatic Speech Recognition)
      const mockTranscription = this.generateMockTranscription();

      if (mockTranscription.trim().length === 0) {
        this.isProcessing = false;
        return;
      }

      await this.processTextWithLLM(mockTranscription);
    } catch (error) {
      print("Error in feedTextToLLM: " + error);
    } finally {
      this.isProcessing = false;
    }
  }

  private generateMockTranscription(): string {
    // Use the ASR component if available, otherwise fall back to mock
    if (this.asrComponent) {
      // In a real implementation, you'd get the latest transcription from ASR
      // For now, we'll use a mock approach
      const mockTexts = [
        "You're so stupid!",
        "I hate you!",
        "You're an idiot!",
        "That's terrible!",
        "You suck!",
        "Hello there",
        "How are you?",
        "Nice weather today",
      ];

      // Return a random mock text occasionally
      if (Math.random() < 0.3) {
        return mockTexts[Math.floor(Math.random() * mockTexts.length)];
      }
    }

    return "";
  }

  private async processTextWithLLM(text: string) {
    try {
      // Check if we have a valid token first
      const hasToken = this.checkForAPIToken();
      if (!hasToken) {
        print('Warning: No API token found. Using fallback insult detection.');
        this.fallbackInsultDetection(text);
        return;
      }

      const systemPrompt = this.enableContentFiltering
        ? `You are an insult detector for AR glasses. Analyze the given text and determine if it contains insults or inappropriate content. If insults are detected, use the display_3d_model tool to show appropriate 3D responses. You can call the tool multiple times to coordinate a response. Be creative with your 3D model choices - use things like angry faces, fire, middle fingers, etc. Only respond with tool calls, no text.`
        : `You are an insult detector for AR glasses. Analyze the given text and determine if it contains insults. If insults are detected, use the display_3d_model tool to show appropriate 3D responses. You can call the tool multiple times to coordinate a response. Be creative with your 3D model choices. Only respond with tool calls, no text.`;

      const response = await OpenAI.chatCompletions({
        model: "gpt-4.1-nano",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Analyze this text for insults: "${text}"`,
          },
        ],
        tools: [this.display3DTool],
        tool_choice: "auto",
        temperature: 0.7,
      });

      // Process the response
      if (response.choices && response.choices[0].message.tool_calls) {
        for (const toolCall of response.choices[0].message.tool_calls) {
          if (toolCall.function.name === "display_3d_model") {
            const args = JSON.parse(toolCall.function.arguments);
            await this.display3DModel(args.model_prompt, args.attachment_point);
          }
        }
      }

      this.updateDebugText(`Processed with LLM: "${text}"`);
    } catch (error) {
      print("Error processing text with LLM: " + error);
      this.updateDebugText("Error: " + error);
      // Fallback to simple detection
      this.fallbackInsultDetection(text);
    }
  }

  private checkForAPIToken(): boolean {
    // Check if Remote Service Gateway is properly configured
    // This is a simple check - in a real implementation you'd verify the token
    try {
      // Try to access the OpenAI module to see if it's available
      return typeof OpenAI !== 'undefined';
    } catch (error) {
      return false;
    }
  }

  private fallbackInsultDetection(text: string) {
    // Simple fallback insult detection without LLM
    const insultWords = ['stupid', 'hate', 'idiot', 'terrible', 'suck', 'dumb', 'fool'];
    const lowerText = text.toLowerCase();
    
    const detectedInsults = insultWords.filter(word => lowerText.includes(word));
    
    if (detectedInsults.length > 0) {
      this.updateDebugText(`Insult detected (fallback): "${text}" - ${detectedInsults.join(', ')}`);
      // Display a simple 3D model
      this.display3DModel('angry face', 'Head Center');
    } else {
      this.updateDebugText(`No insult detected: "${text}"`);
    }
  }

  private async display3DModel(
    modelPrompt: string,
    attachmentPoint: AttachmentPoint
  ) {
    try {
      // For now, create a simple 3D object as a placeholder
      // In a full implementation, you would use Snap3D to generate the actual model
      const modelId = this.createUniqueModelId();
      const modelObject = this.createSimple3DObject(
        modelPrompt,
        attachmentPoint
      );

      if (modelObject) {
        this.current3DModels.set(modelId, modelObject);

        // Remove the model after 5 seconds
        const delayedEvent = this.createEvent("DelayedCallbackEvent");
        delayedEvent.reset(5.0);
        delayedEvent.bind(() => {
          this.remove3DModel(modelId);
        });

        this.updateDebugText(
          `Displaying 3D model: ${modelPrompt} at ${attachmentPoint}`
        );
      }
    } catch (error) {
      print("Error displaying 3D model: " + error);
    }
  }

  private createSimple3DObject(
    modelPrompt: string,
    attachmentPoint: AttachmentPoint
  ): SceneObject | null {
    try {
      // Create a simple scene object as a placeholder
      const modelObject = global.scene.createSceneObject(
        "3DModel_" + Date.now()
      );

      // For now, just create a basic object without complex rendering
      // In a full implementation, you would add proper 3D rendering components
      print(`Created 3D object for: ${modelPrompt} at ${attachmentPoint}`);

      // Position the model at the appropriate face attachment point
      this.positionModelAtAttachmentPoint(modelObject, attachmentPoint);

      // Scale the object appropriately
      const transform = modelObject.getTransform();
      transform.setWorldScale(new vec3(0.1, 0.1, 0.1));

      return modelObject;
    } catch (error) {
      print("Error creating 3D model object: " + error);
      return null;
    }
  }

  private getMaterialForPrompt(prompt: string): Material | null {
    // Return different materials based on the prompt
    // This is a simplified version - you can expand this
    // For now, return null since we're not using complex rendering
    return null;
  }

  private positionModelAtAttachmentPoint(
    modelObject: SceneObject,
    attachmentPoint: AttachmentPoint
  ) {
    // Position the model based on the attachment point
    // These are approximate positions - you may need to adjust based on your face tracking setup
    const transform = modelObject.getTransform();
    let pos = transform.getWorldPosition();
    switch (attachmentPoint) {
      case "Left Eyeball":
        pos = new vec3(-0.05, 0.1, 0.1);
        break;
      case "Right Eyeball":
        pos = new vec3(0.05, 0.1, 0.1);
        break;
      case "Candide Center":
        pos = new vec3(0, 0.05, 0.15);
        break;
      case "Head Center":
        pos = new vec3(0, 0.15, 0.1);
        break;
    }
    transform.setWorldPosition(pos);
  }

  private createUniqueModelId(): string {
    return (
      "model_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }

  private remove3DModel(modelId: string) {
    const modelObject = this.current3DModels.get(modelId);
    if (modelObject) {
      modelObject.destroy();
      this.current3DModels.delete(modelId);
      this.updateDebugText("3D model removed");
    }
  }

  private updateDebugText(message: string) {
    if (this.debugText) {
      this.debugText.text = `Insult Detector: ${message}`;
    }
  }

  // Public method to manually trigger text processing (for testing)
  public processText(text: string) {
    this.processTextWithLLM(text);
  }

  // Public method to clear all current 3D models
  public clearAll3DModels() {
    for (const [modelId, modelObject] of this.current3DModels) {
      modelObject.destroy();
    }
    this.current3DModels.clear();
  }
}
