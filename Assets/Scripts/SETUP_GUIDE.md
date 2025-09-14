# Insult Detector Setup Guide for Lens Studio

## Prerequisites

1. **Lens Studio v5.10.1 or later**
2. **Spectacles OS v5.062 or later**
3. **Remote Service Gateway Package** (for LLM integration)

## Step 1: Install Required Packages

### Install Remote Service Gateway Package
1. Open Lens Studio
2. Go to **Asset Library** (Window → Asset Library)
3. Navigate to **Spectacles** section
4. Find and install **"Remote Service Gateway"** package
5. Also install **"Remote Service Gateway Token Generator"** plugin

### Install Spectacles Interaction Kit (if not already installed)
1. In Asset Library → Spectacles section
2. Install **"SpectaclesInteractionKit"** package

## Step 2: Generate API Token

1. In Lens Studio, go to **Windows** → **Remote Service Gateway Token**
2. Click **"Generate Token"** to create an API token
3. Copy the generated token (you'll need this later)
4. **Important**: Keep this token secure and don't share it

## Step 3: Set Up the Scene

### Create Scene Objects

1. **Create a main controller object:**
   - Right-click in Scene Hierarchy → Create Empty
   - Rename it to "InsultDetectorController"
   - Add the `InsultDetectorController` component

2. **Create microphone setup:**
   - Create another empty object named "MicrophoneSetup"
   - Add the `MicrophoneRecorder` component
   - Add the `ActivateMicrophoneRecorder` component

3. **Create ASR object:**
   - Create empty object named "ASR"
   - Add the `SimpleASR` component

4. **Create insult detector:**
   - Create empty object named "InsultDetector"
   - Add the `InsultDetector` component

5. **Create test object:**
   - Create empty object named "TestController"
   - Add the `InsultDetectorTest` component

## Step 4: Configure Components

### Configure MicrophoneRecorder
1. Select the MicrophoneSetup object
2. In the Inspector, find the MicrophoneRecorder component
3. Set up the audio assets:
   - **Microphone Asset**: Create a new Audio Track Asset for microphone input
   - **Audio Output**: Create a new Audio Track Asset for audio output
   - **Debug Text**: Create a Text component and assign it

### Configure InsultDetectorController
1. Select the InsultDetectorController object
2. **IMPORTANT**: Make sure the **Interactable** component is added to this object
3. In the Inspector, configure:
   - **Microphone Recorder**: Drag the MicrophoneSetup object here
   - **Insult Detector**: Drag the InsultDetector object here
   - **Debug Text**: Assign your debug text component
   - **Enable Insult Detection**: Check this box
   - **Enable Content Filtering**: Check this box
   - **Text Feed Interval**: Set to 3.0 seconds

### Configure InsultDetector
1. Select the InsultDetector object
2. In the Inspector, configure:
   - **Microphone Recorder**: Drag the MicrophoneSetup object here
   - **ASR Component**: Drag the ASR object here
   - **Debug Text**: Assign your debug text component
   - **Enable Content Filtering**: Check this box
   - **Text Feed Interval**: Set to 3.0 seconds

### Configure SimpleASR
1. Select the ASR object
2. In the Inspector, configure:
   - **Microphone Recorder**: Drag the MicrophoneSetup object here
   - **Debug Text**: Assign your debug text component
   - **Processing Interval**: Set to 2.0 seconds

## Step 5: Set Up Interaction

### Add Interactable Components
1. Select the InsultDetectorController object
2. Add an **Interactable** component
3. Configure the interaction:
   - **Interaction Type**: Tap
   - **Trigger Start**: Will start insult detection
   - **Trigger End**: Will stop insult detection

### Add Test Interaction
1. Select the TestController object
2. **Add an Interactable component** (if not already added)
3. This will allow you to test with predefined text
4. **IMPORTANT**: The Interactable component is required for touch controls

## Step 6: Configure Audio Assets

### Create Audio Track Assets
1. **Open Project Panel** (if not visible, go to Window → Project)
2. **Right-click** in the Project panel → **Create** → **Audio Track Asset**
3. **Name the first asset**: "MicrophoneInput"
4. **Right-click** again → **Create** → **Audio Track Asset**
5. **Name the second asset**: "AudioOutput"

### Configure Audio Tracks
1. **Select the MicrophoneInput asset** in the Project panel
2. **In the Inspector panel** (right side), find the Audio Track Asset properties:
   - **Audio Type**: Change from "Audio" to **"Microphone"**
   - **Sample Rate**: Set to **44100**
   - **Channels**: Leave as **Mono**
3. **Select the AudioOutput asset** in the Project panel
4. **In the Inspector panel**, configure:
   - **Audio Type**: Change from "Audio" to **"Audio Output"**
   - **Sample Rate**: Set to **44100**
   - **Channels**: Leave as **Mono**

### Connect Audio Assets to Components
1. **Select the MicrophoneSetup object** in the Scene Hierarchy
2. **In the Inspector**, find the MicrophoneRecorder component
3. **Drag the MicrophoneInput asset** from Project panel to the **"Microphone Asset"** field
4. **Drag the AudioOutput asset** from Project panel to the **"Audio Output"** field
5. **Verify the connections** are showing the asset names in the fields

## Step 7: Set Up Debug Text

### Create Text Component
1. Create a Text object in the scene
2. Position it where you can see it during testing
3. Configure the text:
   - **Text**: "Insult Detector Ready"
   - **Font Size**: 24
   - **Color**: White or any visible color

## Step 8: Test the System

### Basic Testing
1. **Build and Deploy** to your Spectacles device
2. **Tap and hold** the screen to start insult detection
3. **Speak** some test phrases:
   - Try: "You're so stupid!" (should trigger insult detection)
   - Try: "Hello there" (should not trigger)
4. **Release** to stop detection

### Manual Testing
1. Use the TestController object
2. **Tap** to cycle through test phrases
3. Watch the debug text for responses

## Step 9: Customize 3D Models (Optional)

### Add 3D Models
1. Import your 3D models into the project
2. Modify the `createSimple3DObject` method in `InsultDetector.ts`
3. Replace the placeholder code with actual 3D model loading

### Configure Face Attachment
1. The system supports these attachment points:
   - Left Eyeball
   - Right Eyeball
   - Candide Center
   - Head Center
2. Adjust positions in the `positionModelAtAttachmentPoint` method

## Step 10: Advanced Configuration

### Enable LLM Integration
1. In `InsultDetector.ts`, uncomment the OpenAI integration code
2. Add your API token to the Remote Service Gateway configuration
3. Test with real LLM responses

### Customize Insult Detection
1. Modify the `detectInsult` method in `InsultDetector.ts`
2. Add your own insult detection logic
3. Customize the 3D model responses

## Troubleshooting

### Common Issues
1. **No audio input**: Check microphone permissions and audio asset configuration
2. **No 3D models appearing**: Check that objects are being created and positioned correctly
3. **TypeScript errors**: Ensure all components are properly connected
4. **API errors**: Verify your Remote Service Gateway token is valid

### Debug Tips
1. Use the debug text to monitor system status
2. Check the console for error messages
3. Test each component individually
4. Verify all object references are correct

## Next Steps

1. **Test thoroughly** with various phrases
2. **Customize** the 3D models and responses
3. **Integrate** with real ASR services
4. **Deploy** to production

## File Structure

```
Assets/Scripts/
├── MicrophoneRecorder.ts          # Audio recording
├── ActivateMicrophoneRecorder.ts  # Microphone control
├── SimpleASR.ts                   # Speech recognition
├── InsultDetector.ts              # Main insult detection
├── InsultDetectorController.ts    # System controller
├── InsultDetectorTest.ts          # Testing component
└── SETUP_GUIDE.md                 # This guide
```

## Support

If you encounter issues:
1. Check the Lens Studio documentation
2. Review the console for error messages
3. Verify all component connections
4. Test with the minimal version first
