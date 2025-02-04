# React Native Camera-Based Image Uploader

This project is a **React Native** application that captures images using the device's camera at periodic intervals, compresses them, converts them to **Base64**, and uploads them to **Firebase Firestore**.

## Features
- **Automatic Image Capture**: Takes photos every 5 seconds.
- **Image Compression**: Reduces image size before uploading.
- **Base64 Conversion**: Converts images to Base64 format.
- **Firestore Integration**: Uploads images to Firebase Firestore.
- **Start & Stop Uploading**: Allows users to control the process.

## Technologies Used
- **React Native**
- **react-native-vision-camera** (For capturing images)
- **@react-native-firebase/firestore** (For Firebase integration)
- **react-native-compressor** (For image compression)

## Installation
### Prerequisites
Ensure you have **React Native CLI** and dependencies installed.

### Steps to Run
1. **Clone the repository**:
   ```sh
   git clone https://github.com/Nethzz/CaptureX.git
   cd CaptureX
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Setup Firebase**:
   - Create a Firebase project.
   - Enable **Firestore**.
   - Add Firebase to your React Native app.
   - Configure `google-services.json` (Android) or `GoogleService-Info.plist` (iOS).

4. **Run the project**:
   ```sh
   npx react-native run-android   # For Android
   npx react-native run-ios       # For iOS
   ```

## Usage
- **Start Upload**: Press the "Start Upload" button to begin capturing and uploading images.
- **Stop Upload**: Press "Stop Upload" to stop the process.
- **Exit**: Close the app to stop capturing images.

## Project Structure
```
├── App.js                  # Main application file
├── package.json            # Project dependencies
├── android/                # Android project files
├── ios/                    # iOS project files
└── README.md               # Documentation
```

## Future Improvements
- Add real-time preview of captured images.
- Implement cloud storage integration for full-size images.
- Optimize power consumption for long-running sessions.

## License
This project is licensed under the MIT License.

## Author
Neethu

