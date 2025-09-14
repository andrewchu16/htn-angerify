# Simple Setup Guide - No SpectaclesInteractionKit Required

## 🚀 Quick Setup (5 minutes)

This version uses only standard Lens Studio events and doesn't require the SpectaclesInteractionKit.

### Step 1: Install Packages
1. **Asset Library** → **Spectacles** → Install:
   - ✅ Remote Service Gateway
   - ✅ Remote Service Gateway Token Generator

### Step 2: Generate Token
1. **Windows** → **Remote Service Gateway Token**
2. Click **"Generate Token"**
3. Copy the token (save it!)

### Step 3: Create Scene Objects
Create these empty objects in your scene:

```
Scene Hierarchy:
├── InsultDetectorSimple (Empty Object)
├── MicrophoneSetup (Empty Object)
├── ASR (Empty Object)
├── InsultDetector (Empty Object)
├── SimpleTest (Empty Object)
└── DebugText (Text Object)
```

### Step 4: Add Components
Add these components to each object:

| Object | Components to Add |
|--------|------------------|
| InsultDetectorSimple | **InsultDetectorSimple** script |
| MicrophoneSetup | MicrophoneRecorder + ActivateMicrophoneRecorder |
| ASR | SimpleASR |
| InsultDetector | InsultDetector |
| SimpleTest | **InsultDetectorSimpleTest** script |
| DebugText | Text (already has it) |

### Step 5: Connect References
In the Inspector, connect these references:

**InsultDetectorSimple:**
- Microphone Recorder → MicrophoneSetup
- Insult Detector → InsultDetector
- Debug Text → DebugText

**MicrophoneSetup:**
- **Microphone Recorder** → MicrophoneSetup (self-reference)
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
2. **Tap screen** to start/stop insult detection
3. **Say**: "You're so stupid!" (should trigger)
4. **Say**: "Hello there" (should not trigger)
5. **Tap SimpleTest** to cycle through test phrases

## 🎯 How It Works

### Touch Controls
- **Single Tap**: Toggle insult detection on/off
- **No hold required** - just tap to start, tap again to stop

### Test Phrases
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
| No 3D models | Check console for object creation messages |
| TypeScript errors | Verify all components are connected |
| API errors | Check your token is valid |

## 📱 Usage

1. **Start Detection**: Tap screen once
2. **Speak**: Say test phrases
3. **Watch**: Debug text shows responses
4. **Stop**: Tap screen again
5. **Test**: Tap SimpleTest to cycle through phrases

## 🎨 Customization

- **Change insult detection**: Edit `detectInsult()` method
- **Add 3D models**: Modify `createSimple3DObject()`
- **Adjust positions**: Edit `positionModelAtAttachmentPoint()`
- **Custom responses**: Modify the LLM prompts

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

**Ready to go!** 🎉 This simple version should work without any SpectaclesInteractionKit issues!
