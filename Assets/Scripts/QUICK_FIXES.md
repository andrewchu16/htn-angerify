# Quick Fixes for Common Errors

## ❌ Error: "Input microphoneRecorder was not provided"

**Error Message:**
```
Script Exception: Error: Input microphoneRecorder was not provided for the object MicrophoneSetup
```

**Cause:** The `microphoneRecorder` input is not connected in the Inspector.

**Solution:**
1. **Select the MicrophoneSetup object** in Scene Hierarchy
2. **In the Inspector**, find the `ActivateMicrophoneRecorder` component
3. **Drag the MicrophoneSetup object** to the **"Microphone Recorder"** field
4. **This creates a self-reference** (the component references itself)

**Visual Guide:**
```
MicrophoneSetup Object
├── MicrophoneRecorder component
│   ├── Microphone Asset → MicrophoneInput
│   ├── Audio Output → AudioOutput
│   └── Debug Text → DebugText
└── ActivateMicrophoneRecorder component
    └── Microphone Recorder → MicrophoneSetup (self-reference)
```

## ❌ Error: "Cannot read property 'add' of undefined"

**Error Message:**
```
TypeError: cannot read property 'add' of undefined
```

**Cause:** SpectaclesInteractionKit events don't exist or Interactable component missing.

**Solution:**
- **Use the Simple versions** instead:
  - `InsultDetectorSimple` instead of `InsultDetectorController`
  - `InsultDetectorSimpleTest` instead of `InsultDetectorTest`
- **No Interactable components needed**

## ❌ Error: "Component is not yet awake"

**Error Message:**
```
Component is not yet awake.
```

**Cause:** Trying to access a component before it's initialized.

**Solution:**
1. **Check all component connections** in Inspector
2. **Make sure all required objects exist**
3. **Verify audio assets are connected**

## ❌ Error: "Microphone not working"

**Symptoms:**
- No audio input detected
- Debug text shows "No audio has been recorded"

**Solution:**
1. **Check microphone permissions** on device
2. **Verify audio assets**:
   - MicrophoneInput: Audio Type = "Microphone"
   - AudioOutput: Audio Type = "Audio Output"
3. **Check connections** in MicrophoneRecorder component

## 🔧 Step-by-Step Fix for microphoneRecorder Error

### Step 1: Check Object Setup
```
Scene Hierarchy should have:
├── MicrophoneSetup (with MicrophoneRecorder + ActivateMicrophoneRecorder)
├── InsultDetectorSimple (with InsultDetectorSimple script)
├── SimpleTest (with InsultDetectorSimpleTest script)
└── DebugText (Text object)
```

### Step 2: Connect MicrophoneRecorder Input
1. **Select MicrophoneSetup object**
2. **In Inspector**, find `ActivateMicrophoneRecorder` component
3. **Drag MicrophoneSetup object** to "Microphone Recorder" field
4. **Should show**: `MicrophoneSetup` in the field

### Step 3: Connect Other References
**MicrophoneRecorder component:**
- Microphone Asset → MicrophoneInput
- Audio Output → AudioOutput
- Debug Text → DebugText

**InsultDetectorSimple component:**
- Microphone Recorder → MicrophoneSetup
- Insult Detector → InsultDetector
- Debug Text → DebugText

### Step 4: Test
1. **Build and deploy**
2. **Check console** for initialization messages
3. **Tap screen** to test recording
4. **Watch debug text** for status updates

## 🎯 Quick Verification Checklist

- [ ] MicrophoneSetup has both MicrophoneRecorder and ActivateMicrophoneRecorder components
- [ ] ActivateMicrophoneRecorder's "Microphone Recorder" field points to MicrophoneSetup
- [ ] MicrophoneRecorder's audio assets are connected
- [ ] All debug text references are connected
- [ ] Console shows "Component initialized" messages
- [ ] No error messages in console

## 🆘 Still Having Issues?

### Check Console Output
Look for these messages:
- ✅ "ActivateMicrophoneRecorder: Component initialized"
- ✅ "Using standard Lens Studio touch events"
- ❌ "Error: microphoneRecorder input not connected"

### Manual Testing
If touch events don't work, you can test manually:
1. **Select MicrophoneSetup object**
2. **In Inspector**, find ActivateMicrophoneRecorder component
3. **Use public methods**:
   - `startRecordingManually()`
   - `stopRecordingManually()`

### Debug Information
- **Debug text** shows component status
- **Console** shows error messages
- **Inspector** shows component connections
- **Logger panel** shows TypeScript compilation status

## 📱 Alternative: Use Simple Version

If you're still having issues, use the simple version:

1. **Replace InsultDetectorController** with **InsultDetectorSimple**
2. **Replace InsultDetectorTest** with **InsultDetectorSimpleTest**
3. **No Interactable components needed**
4. **Just tap screen** to start/stop

The simple version is more reliable and doesn't require SpectaclesInteractionKit!
