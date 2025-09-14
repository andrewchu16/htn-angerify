# Insult Detector System for Spectacles

This system provides real-time insult detection and 3D model responses for Spectacles AR glasses. When insults are detected in speech, the system displays appropriate 3D models attached to the face.

## Components

### 1. InsultDetector.ts
The main component that:
- Feeds text to an LLM every few seconds
- Uses OpenAI's chat completions API with a custom `display_3d_model` tool
- Filters for inappropriate content (optional)
- Displays 3D models when insults are detected
- Supports multiple attachment points: Left Eyeball, Right Eyeball, Candide Center, Head Center

### 2. SimpleASR.ts
A simplified Automatic Speech Recognition component that:
- Processes audio from the microphone
- Converts audio to text (currently uses mock data for demo)
- Can be extended to use real ASR services

### 3. InsultDetectorController.ts
A controller component that:
- Manages the overall system state
- Handles start/stop functionality
- Provides configuration options
- Manages 3D model cleanup

### 4. InsultDetectorExample.ts
A complete example showing how to integrate all components.

## Setup Instructions

### 1. Install Remote Service Gateway Package
1. Open Lens Studio
2. Go to Asset Library > Spectacles section
3. Install the "Remote Service Gateway" package
4. Install the "Remote Service Gateway Token Generator" plugin

### 2. Generate API Token
1. In Lens Studio, go to Windows > Remote Service Gateway Token
2. Click "Generate Token" to create an API token
3. Copy the token for use in your project

### 3. Configure Components
1. Add the `InsultDetectorExample` component to a scene object
2. Connect the required inputs:
   - `microphoneRecorder`: Your existing MicrophoneRecorder component
   - `asrComponent`: A SimpleASR component
   - `insultDetector`: An InsultDetector component
   - `controller`: An InsultDetectorController component
   - `debugText`: A Text component for debugging

### 4. Set Up 3D Models
The system currently uses simple cube objects as placeholders. To use real 3D models:
1. Import your 3D models into the project
2. Modify the `createSimple3DObject` method in `InsultDetector.ts`
3. Replace the cube mesh with your custom models

## Usage

### Basic Usage
1. Start the application
2. The system will automatically begin processing audio
3. When insults are detected, 3D models will appear attached to the face
4. Models automatically disappear after 5 seconds

### Manual Testing
- Use the `testWithText()` method to test with specific text
- Toggle demo mode on/off for automatic testing
- Clear all 3D models with `clearAll3DModels()`

### Configuration Options
- `enableContentFiltering`: Enable/disable content filtering
- `textFeedInterval`: How often to process text (in seconds)
- `enableDemoMode`: Enable automatic demo mode
- `demoInterval`: How often to test with demo text

## LLM Tool Definition

The system uses a custom tool called `display_3d_model` that the LLM can call:

```typescript
{
  type: 'function',
  function: {
    name: 'display_3d_model',
    description: 'Display a 3D model attached to the face for 5 seconds',
    parameters: {
      type: 'object',
      properties: {
        model_prompt: {
          type: 'string',
          description: 'Description of the 3D model to display'
        },
        attachment_point: {
          type: 'string',
          enum: ['Left Eyeball', 'Right Eyeball', 'Candide Center', 'Head Center'],
          description: 'Where to attach the 3D model on the face'
        }
      },
      required: ['model_prompt', 'attachment_point']
    }
  }
}
```

## Supported Services

The system uses the Remote Service Gateway to access:
- **OpenAI**: Chat completions for insult detection
- **Snap3D**: 3D model generation (optional, currently using placeholders)

## Known Limitations

1. **ASR Integration**: Currently uses mock transcriptions. Real ASR integration requires additional setup.
2. **3D Model Generation**: Currently uses simple cube objects. Snap3D integration is available but not fully implemented.
3. **Face Tracking**: Attachment point positions are approximate and may need adjustment.
4. **Content Filtering**: Basic implementation, may need enhancement for production use.

## Troubleshooting

### Common Issues
1. **No 3D models appearing**: Check that the LLM is receiving text and making tool calls
2. **Models in wrong position**: Adjust the `positionModelAtAttachmentPoint` method
3. **API errors**: Verify your Remote Service Gateway token is valid
4. **No text processing**: Check that the microphone is recording and ASR is working

### Debug Information
- Use the `debugText` component to see system status
- Check the console for error messages
- Verify all component connections are properly set up

## Future Enhancements

1. **Real ASR Integration**: Connect to actual speech recognition services
2. **Advanced 3D Models**: Use Snap3D to generate custom 3D models
3. **Better Face Tracking**: Improve attachment point positioning
4. **More Attachment Points**: Add support for additional face attachment points
5. **Customizable Responses**: Allow users to customize 3D model responses
6. **Performance Optimization**: Optimize for better performance on Spectacles

## Example Scene Setup

1. Create a scene object with the `InsultDetectorExample` component
2. Add a `MicrophoneRecorder` component to the same or different object
3. Add a `SimpleASR` component
4. Add an `InsultDetector` component
5. Add an `InsultDetectorController` component
6. Connect all the inputs as shown in the example
7. Add a Text component for debugging
8. Test the system by speaking or using the demo mode
