# Troubleshooting Guide - Insult Detector

## Common Errors and Solutions

### ❌ Error: "Cannot read property 'add' of undefined"

**Error Message:**
```
TypeError: cannot read property 'add' of undefined
Stack trace:
onAwake@Assets/Scripts/InsultDetectorController.ts:34
```

**Cause:** The Interactable component is missing from the scene object.

**Solution:**
1. **Select the InsultDetectorController object** in Scene Hierarchy
2. **In the Inspector**, click **"Add Component"**
3. **Search for "Interactable"** and add it
4. **Repeat for TestController object** if you're getting the same error there

**Verification:**
- The object should have both `InsultDetectorController` and `Interactable` components
- Check the console - you should see "Warning: Interactable component not found" if it's missing

### ❌ Error: "Component is not yet awake"

**Error Message:**
```
Component is not yet awake.
```

**Cause:** Trying to access a component before it's fully initialized.

**Solution:**
1. **Check all component connections** in the Inspector
2. **Make sure all required objects exist** in the scene
3. **Verify audio assets are properly connected**

### ❌ Error: "Cannot find name 'component'"

**Error Message:**
```
Cannot find name 'component'.
```

**Cause:** TypeScript definitions not loaded properly.

**Solution:**
1. **Restart Lens Studio**
2. **Check TypeScript compilation** in the Logger panel
3. **Verify all script files are in the correct location**

### ❌ Error: "Microphone not working"

**Symptoms:**
- No audio input detected
- Debug text shows "No audio has been recorded"

**Solution:**
1. **Check microphone permissions** on the device
2. **Verify audio assets are connected**:
   - MicrophoneInput asset → MicrophoneRecorder component
   - AudioOutput asset → MicrophoneRecorder component
3. **Check audio asset settings**:
   - MicrophoneInput: Audio Type = "Microphone"
   - AudioOutput: Audio Type = "Audio Output"
   - Sample Rate = 44100

### ❌ Error: "No 3D models appearing"

**Symptoms:**
- Insults detected but no 3D objects show up
- Debug text shows "Displaying 3D model" but nothing visible

**Solution:**
1. **Check console output** for object creation messages
2. **Verify face tracking is working** on the device
3. **Check object positioning** in the `positionModelAtAttachmentPoint` method
4. **Test with simple objects first** before complex 3D models

### ❌ Error: "API errors"

**Symptoms:**
- LLM calls failing
- Network errors in console

**Solution:**
1. **Verify your Remote Service Gateway token** is valid
2. **Check internet connection** on the device
3. **Test API calls** with simple prompts first
4. **Check API rate limits** and usage

## Step-by-Step Debugging

### 1. Check Component Setup
```
✅ InsultDetectorController has Interactable component
✅ TestController has Interactable component
✅ All objects have their required components
✅ All references are connected in Inspector
```

### 2. Check Audio Setup
```
✅ MicrophoneInput asset created and configured
✅ AudioOutput asset created and configured
✅ Audio assets connected to MicrophoneRecorder
✅ Microphone permissions granted on device
```

### 3. Check Script Connections
```
✅ InsultDetectorController → MicrophoneRecorder
✅ InsultDetectorController → InsultDetector
✅ InsultDetector → MicrophoneRecorder
✅ InsultDetector → ASR
✅ All Debug Text references connected
```

### 4. Test Each Component
1. **Test MicrophoneRecorder**: Check if audio is being recorded
2. **Test SimpleASR**: Check if text is being generated
3. **Test InsultDetector**: Check if insults are being detected
4. **Test 3D Display**: Check if objects are being created

## Debug Console Commands

### Check Component Status
```typescript
// Add this to any component's onAwake method
print('Component initialized: ' + this.sceneObject.name);
```

### Check Audio Status
```typescript
// Add this to MicrophoneRecorder
print('Audio recording: ' + this.microphoneControl.isRecording);
```

### Check Insult Detection
```typescript
// Add this to InsultDetector
print('Insult detected: ' + text);
```

## Manual Testing

### Test Without Touch Controls
If Interactable components are not working, you can test manually:

1. **Select InsultDetectorController object**
2. **In Inspector**, find the InsultDetectorController component
3. **Use the public methods**:
   - `startInsultDetectionManually()`
   - `stopInsultDetectionManually()`
   - `testWithText("You're so stupid!")`

### Test Individual Components
1. **Test MicrophoneRecorder**: Check if audio is being recorded
2. **Test SimpleASR**: Check if text is being generated
3. **Test InsultDetector**: Check if insults are being detected

## Common Setup Mistakes

### ❌ Missing Interactable Component
- **Symptom**: "Cannot read property 'add' of undefined"
- **Fix**: Add Interactable component to the object

### ❌ Wrong Audio Asset Types
- **Symptom**: No audio input
- **Fix**: Set MicrophoneInput to "Microphone", AudioOutput to "Audio Output"

### ❌ Missing Component References
- **Symptom**: Components not working together
- **Fix**: Connect all references in the Inspector

### ❌ Wrong Object Names
- **Symptom**: References not connecting
- **Fix**: Use exact object names as specified in the guide

## Getting Help

### Check These First
1. **Console output** for error messages
2. **Inspector** for missing components
3. **Project panel** for missing assets
4. **Scene hierarchy** for missing objects

### Debug Information
- **Debug text** shows system status
- **Console** shows error messages
- **Inspector** shows component connections
- **Logger panel** shows TypeScript compilation status

### Still Having Issues?
1. **Check the setup guide** step by step
2. **Verify all components** are properly connected
3. **Test with minimal setup** first
4. **Check device permissions** and settings
5. **Restart Lens Studio** and try again

## Quick Fixes

### Fix Interactable Error
```typescript
// Add this check in onAwake methods
if (!this.interactable) {
  print('Warning: Interactable component missing!');
  return;
}
```

### Fix Audio Issues
```typescript
// Check if audio assets are connected
if (!this.microphoneAsset || !this.audioOutput) {
  print('Warning: Audio assets not connected!');
  return;
}
```

### Fix Component References
```typescript
// Check if required components are connected
if (!this.microphoneRecorder || !this.insultDetector) {
  print('Warning: Required components not connected!');
  return;
}
```

Remember: **Always check the console output first** - it will tell you exactly what's wrong!
