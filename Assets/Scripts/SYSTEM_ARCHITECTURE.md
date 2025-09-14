# Insult Detector System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    LENS STUDIO SCENE                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │ InsultDetector  │    │ MicrophoneSetup │                │
│  │ Controller      │◄──►│                 │                │
│  │                 │    │ MicrophoneRecorder               │
│  │ + Interactable  │    │ + ActivateMicrophoneRecorder     │
│  └─────────────────┘    └─────────────────┘                │
│           │                       │                        │
│           ▼                       ▼                        │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │ InsultDetector  │    │ ASR             │                │
│  │                 │◄──►│                 │                │
│  │ + LLM Integration│    │ SimpleASR       │                │
│  │ + 3D Model Display│   │                 │                │
│  └─────────────────┘    └─────────────────┘                │
│           │                                               │
│           ▼                                               │
│  ┌─────────────────┐                                      │
│  │ TestController  │                                      │
│  │                 │                                      │
│  │ + Interactable  │                                      │
│  │ + InsultDetectorTest│                                  │
│  └─────────────────┘                                      │
│                                                             │
│  ┌─────────────────┐                                      │
│  │ DebugText       │                                      │
│  │ (Text Component)│                                      │
│  └─────────────────┘                                      │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
1. USER SPEAKS
   ↓
2. MICROPHONE CAPTURES AUDIO
   ↓
3. MicrophoneRecorder processes audio
   ↓
4. SimpleASR converts audio to text
   ↓
5. InsultDetector analyzes text
   ↓
6. LLM determines if insult detected
   ↓
7. If insult: Display 3D model on face
   ↓
8. 3D model auto-removes after 5 seconds
```

## Component Responsibilities

### InsultDetectorController
- **Purpose**: Main system controller
- **Responsibilities**:
  - Start/stop insult detection
  - Manage system state
  - Handle user interactions
  - Coordinate other components

### MicrophoneRecorder
- **Purpose**: Audio capture and playback
- **Responsibilities**:
  - Record audio from microphone
  - Store audio frames
  - Provide audio data to other components

### SimpleASR
- **Purpose**: Speech recognition
- **Responsibilities**:
  - Convert audio to text
  - Process audio in intervals
  - Provide transcriptions

### InsultDetector
- **Purpose**: Core insult detection logic
- **Responsibilities**:
  - Analyze text for insults
  - Call LLM APIs
  - Create and manage 3D models
  - Handle face attachment points

### TestController
- **Purpose**: Testing and debugging
- **Responsibilities**:
  - Provide test phrases
  - Manual testing interface
  - Debug output

## File Structure

```
Assets/Scripts/
├── MicrophoneRecorder.ts          # Audio recording system
├── ActivateMicrophoneRecorder.ts  # Microphone control
├── PlaybackMicrophoneRecorder.ts  # Audio playback
├── SimpleASR.ts                   # Speech recognition
├── InsultDetector.ts              # Main insult detection
├── InsultDetectorController.ts    # System controller
├── InsultDetectorTest.ts          # Testing component
├── SETUP_GUIDE.md                 # Detailed setup guide
├── QUICK_START.md                 # Quick start guide
└── SYSTEM_ARCHITECTURE.md         # This file
```

## Configuration Matrix

| Component | Inputs | Outputs | Dependencies |
|-----------|--------|---------|--------------|
| InsultDetectorController | MicrophoneRecorder, InsultDetector, DebugText | System control | Interactable |
| MicrophoneRecorder | MicrophoneAsset, AudioOutput, DebugText | Audio frames | AudioComponent |
| SimpleASR | MicrophoneRecorder, DebugText | Text transcriptions | None |
| InsultDetector | MicrophoneRecorder, ASR, DebugText | 3D models | OpenAI API |
| TestController | DebugText | Test phrases | Interactable |

## API Integration

### Remote Service Gateway
- **OpenAI Chat Completions**: For insult detection
- **Snap3D**: For 3D model generation (optional)
- **Custom Tool**: `display_3d_model` for 3D responses

### LLM Tool Definition
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

## Face Attachment Points

| Point | Position | Use Case |
|-------|----------|----------|
| Left Eyeball | (-0.05, 0.1, 0.1) | Left eye responses |
| Right Eyeball | (0.05, 0.1, 0.1) | Right eye responses |
| Candide Center | (0, 0.05, 0.15) | Center face responses |
| Head Center | (0, 0.15, 0.1) | Top of head responses |

## Error Handling

### Common Error Scenarios
1. **Microphone not available**: Check permissions and audio setup
2. **LLM API errors**: Verify token and network connection
3. **3D model creation fails**: Check object creation and positioning
4. **TypeScript compilation errors**: Verify component connections

### Debug Information
- **Console output**: Check for error messages
- **Debug text**: Monitor system status
- **Component state**: Verify all inputs are connected
- **Audio levels**: Check microphone input

## Performance Considerations

### Optimization Tips
1. **Limit 3D models**: Don't create too many simultaneously
2. **Audio processing**: Use appropriate intervals
3. **LLM calls**: Implement rate limiting
4. **Memory management**: Clean up old 3D models

### Resource Usage
- **Audio**: Continuous microphone input
- **CPU**: Text processing and LLM calls
- **GPU**: 3D model rendering
- **Memory**: Audio buffers and 3D objects

## Security Considerations

### API Token Management
- **Keep tokens secure**: Don't commit to version control
- **Rotate regularly**: Update tokens periodically
- **Monitor usage**: Track API calls and costs

### Content Filtering
- **Enable filtering**: Use content filtering options
- **Custom rules**: Add your own filtering logic
- **User safety**: Ensure appropriate responses

## Future Enhancements

### Planned Features
1. **Real ASR**: Replace mock with actual speech recognition
2. **Custom 3D Models**: Use Snap3D for generated models
3. **More Attachment Points**: Add additional face positions
4. **Customizable Responses**: User-configurable 3D models
5. **Performance Optimization**: Better resource management

### Integration Options
1. **External ASR Services**: Google Speech, Azure Speech
2. **Custom LLM Models**: Fine-tuned models for specific use cases
3. **Advanced 3D Rendering**: Custom shaders and materials
4. **Multi-language Support**: International insult detection
