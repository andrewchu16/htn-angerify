# Quick Start Guide - Insult Detector in Lens Studio

## 🚀 5-Minute Setup

### Step 1: Install Packages
1. **Asset Library** → **Spectacles** → Install:
   - ✅ Remote Service Gateway
   - ✅ Remote Service Gateway Token Generator
   - ✅ SpectaclesInteractionKit

### Step 2: Generate Token
1. **Windows** → **Remote Service Gateway Token**
2. Click **"Generate Token"**
3. Copy the token (save it!)

### Step 3: Create Scene Objects
Create these empty objects in your scene:

```
Scene Hierarchy:
├── InsultDetectorController (Empty Object)
├── MicrophoneSetup (Empty Object)
├── ASR (Empty Object)
├── InsultDetector (Empty Object)
├── TestController (Empty Object)
└── DebugText (Text Object)
```

### Step 4: Add Components
Add these components to each object:

| Object | Components to Add |
|--------|------------------|
| InsultDetectorController | **InsultDetectorController + Interactable** ⚠️ |
| MicrophoneSetup | MicrophoneRecorder + ActivateMicrophoneRecorder |
| ASR | SimpleASR |
| InsultDetector | InsultDetector |
| TestController | **InsultDetectorTest + Interactable** ⚠️ |
| DebugText | Text (already has it) |

⚠️ **CRITICAL**: Interactable component is required for touch controls!

### Step 5: Connect References
In the Inspector, connect these references:

**InsultDetectorController:**
- Microphone Recorder → MicrophoneSetup
- Insult Detector → InsultDetector
- Debug Text → DebugText

**MicrophoneSetup:**
- Microphone Asset → (Create Audio Track Asset)
- Audio Output → (Create Audio Track Asset)
- Debug Text → DebugText

**InsultDetector:**
- Microphone Recorder → MicrophoneSetup
- ASR Component → ASR
- Debug Text → DebugText

**ASR:**
- Microphone Recorder → MicrophoneSetup
- Debug Text → DebugText

### Step 6: Create Audio Assets
1. **Project Panel** → Right-click → **Create** → **Audio Track Asset**
2. **Name it**: `MicrophoneInput`
3. **Select the asset** → Inspector → **Audio Type**: `Microphone`
4. **Right-click again** → **Create** → **Audio Track Asset**
5. **Name it**: `AudioOutput`
6. **Select the asset** → Inspector → **Audio Type**: `Audio Output`
7. **Connect to MicrophoneSetup**:
   - Select `MicrophoneSetup` object
   - Drag `MicrophoneInput` to "Microphone Asset" field
   - Drag `AudioOutput` to "Audio Output" field

### Step 7: Test!
1. **Build** → **Send to Device**
2. **Tap and hold** screen to start
3. **Say**: "You're so stupid!" (should trigger)
4. **Say**: "Hello there" (should not trigger)
5. **Release** to stop

## 🎯 Quick Test Phrases

**Should Trigger Insult Detection:**
- "You're so stupid!"
- "I hate you!"
- "You're an idiot!"
- "That's terrible!"
- "You suck!"

**Should NOT Trigger:**
- "Hello there"
- "How are you?"
- "Nice weather today"
- "What's going on?"

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| No audio | Check microphone permissions |
| No 3D models | Check object creation in console |
| TypeScript errors | Verify all components are connected |
| API errors | Check your token is valid |

## 📱 How to Use

1. **Start Detection**: Tap and hold screen
2. **Speak**: Say test phrases
3. **Watch**: Debug text shows responses
4. **Stop**: Release screen
5. **Test**: Tap TestController to cycle through phrases

## 🎨 Customization

- **Change 3D Models**: Edit `createSimple3DObject()` in InsultDetector.ts
- **Add More Insults**: Edit `detectInsult()` method
- **Change Positions**: Edit `positionModelAtAttachmentPoint()`
- **Custom Responses**: Modify the LLM prompts

## 📋 Checklist

- [ ] Packages installed
- [ ] Token generated
- [ ] Objects created
- [ ] Components added
- [ ] References connected
- [ ] Audio assets created
- [ ] Tested on device
- [ ] Working correctly

## 🆘 Need Help?

1. Check the console for errors
2. Verify all connections in Inspector
3. Test with simple phrases first
4. Make sure microphone is working
5. Check that all components are enabled

---

**Ready to go!** 🎉 Your insult detector should now be working in Lens Studio!
