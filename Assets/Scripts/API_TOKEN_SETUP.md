# API Token Setup Guide

## 🔑 How to Set Up Your Remote Service Gateway API Token

### Step 1: Generate the Token

1. **Open Lens Studio**
2. **Go to Windows** → **Remote Service Gateway Token**
3. **Click "Generate Token"**
4. **Copy the generated token** (save it somewhere safe!)
5. **Click "Copy Token"** to copy it to your clipboard

### Step 2: Configure the Token in Your Project

The API token needs to be configured in the **Remote Service Gateway Credentials** component. Here's how:

#### Option A: Using Remote Service Gateway Credentials Component

1. **Create a new empty object** in your scene
2. **Name it**: `RemoteServiceCredentials`
3. **Add the Remote Service Gateway Credentials component**:
   - In Inspector, click **"Add Component"**
   - Search for **"Remote Service Gateway Credentials"**
   - Add it to the object
4. **Paste your token** into the **"Token"** field
5. **Save your project**

#### Option B: Using the Token in Scripts

If you need to use the token directly in your scripts, you can access it like this:

```typescript
// In your InsultDetector.ts or other scripts
import { RemoteServiceGatewayCredentials } from 'Remote Service Gateway.lspkg/Core/RemoteServiceGatewayCredentials';

@component
export class YourComponent extends BaseScriptComponent {
  onAwake() {
    // Get the credentials component
    const credentials = global.scene.findFirstObject('RemoteServiceCredentials')
      ?.getComponent('RemoteServiceGatewayCredentials');
    
    if (credentials) {
      const token = credentials.token;
      print('Token loaded: ' + token.substring(0, 10) + '...');
    } else {
      print('Error: Remote Service Gateway Credentials not found');
    }
  }
}
```

### Step 3: Verify the Setup

1. **Check the console** for any token-related errors
2. **Look for messages** like "Token loaded: ..." or "Error: Token not found"
3. **Test your API calls** to make sure they work

### Step 4: Test the Integration

1. **Build and deploy** your lens to Spectacles
2. **Check the console** for API call results
3. **Test with simple phrases** first
4. **Verify that insults are detected** and 3D models appear

## 🔧 Troubleshooting

### ❌ Error: "Token not found"
**Solution:**
- Make sure you created the RemoteServiceCredentials object
- Verify the Remote Service Gateway Credentials component is added
- Check that the token is pasted correctly

### ❌ Error: "API call failed"
**Solution:**
- Verify your token is valid and not expired
- Check your internet connection
- Make sure the Remote Service Gateway package is installed

### ❌ Error: "Credentials component not found"
**Solution:**
- Make sure you're using the correct component name
- Check that the Remote Service Gateway package is installed
- Verify the object name is exactly "RemoteServiceCredentials"

## 📋 Quick Setup Checklist

- [ ] Token generated from Lens Studio
- [ ] RemoteServiceCredentials object created
- [ ] Remote Service Gateway Credentials component added
- [ ] Token pasted into the Token field
- [ ] Project saved
- [ ] Console shows "Token loaded" message
- [ ] API calls working in testing

## 🎯 Alternative: Hardcode Token (Not Recommended)

If you're having trouble with the credentials component, you can temporarily hardcode the token:

```typescript
// In your InsultDetector.ts
const API_TOKEN = 'your-token-here';

// Use it in your API calls
const response = await OpenAI.chatCompletions({
  // ... your API call
});
```

**⚠️ Warning:** Don't commit hardcoded tokens to version control!

## 🔒 Security Best Practices

1. **Keep your token secure** - don't share it
2. **Don't commit tokens** to version control
3. **Use the credentials component** instead of hardcoding
4. **Rotate your token** periodically
5. **Revoke old tokens** when no longer needed

## 📱 Testing on Device

1. **Deploy to Spectacles**
2. **Open the lens**
3. **Check console output** for token status
4. **Test with simple phrases**
5. **Verify API calls are working**

## 🆘 Still Having Issues?

### Check These First:
1. **Token is valid** and not expired
2. **Remote Service Gateway package** is installed
3. **Credentials component** is properly configured
4. **Internet connection** is working
5. **Console shows** no token-related errors

### Debug Steps:
1. **Check console** for error messages
2. **Verify component setup** in Inspector
3. **Test with simple API calls** first
4. **Check network connectivity**
5. **Verify token format** is correct

---

**Ready to go!** 🎉 Once your token is set up, your insult detection system should work with real LLM API calls!

