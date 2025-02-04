import React, { useEffect, useState, useRef } from 'react';
import
  {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    Alert,
  } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import firestore from '@react-native-firebase/firestore';
import { Image as ImageCompressor } from 'react-native-compressor';

function App()
{
  const [cameraPosition, setCameraPosition] = useState('back');
  const [showCamera, setShowCamera] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const devices = useCameraDevice(cameraPosition);
  const camera = useRef(null);

  useEffect(() =>
  {
    async function getPermission()
    {
      const newCameraPermission = await Camera.requestCameraPermission();
      if (newCameraPermission === 'denied')
      {
        Alert.alert(
          'Camera Permission Denied',
          'Please enable camera permissions in the app settings.'
        );
      }
    }
    getPermission();
  }, []);

  const startPeriodicUpload = () =>
  {
    if (uploading)
    {
      Alert.alert('Already Running', 'Periodic upload is already in progress.');
      return;
    }

    setUploading(true);

    const id = setInterval(async () =>
    {
      if (camera.current !== null)
      {
        try
        {
          const photo = await camera.current.takePhoto({});
          console.log('Captured Image:', photo.path);

          const compressedBase64 = await compressAndConvertToBase64(photo.path);
          if (compressedBase64)
          {
            await uploadImageToFirestore(compressedBase64);
          } else
          {
            console.error('Failed to compress and convert image to Base64');
          }
        } catch (error)
        {
          console.error('Error capturing image:', error);
        }
      }
    }, 5000); // Capture and upload every 5 seconds

    setIntervalId(id);
    Alert.alert('Started', 'Periodic uploads have started.');
  };

  const stopPeriodicUpload = () =>
  {
    if (intervalId)
    {
      clearInterval(intervalId);
      setIntervalId(null);
      setUploading(false);
      Alert.alert('Stopped', 'Periodic uploads have stopped.');
    }
  };

  const compressAndConvertToBase64 = async (path) =>
  {
    try
    {
      const compressedPath = await ImageCompressor.compress(path, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.6,
      });

      const response = await fetch(compressedPath);
      const blob = await response.blob();
      const reader = new FileReader();

      return new Promise((resolve, reject) =>
      {
        reader.onloadend = () => resolve(reader.result.split(',')[1]); // Extract Base64
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error)
    {
      console.error('Error compressing and converting image to Base64:', error);
      return null;
    }
  };

  const uploadImageToFirestore = async (base64) =>
  {
    try
    {
      await firestore().collection('images').add({
        image_base: base64,
        uploaded_at: firestore.FieldValue.serverTimestamp(),
      });
      console.log('Image uploaded successfully');
    } catch (error)
    {
      console.error('Error uploading image to Firestore:', error);
    }
  };

  if (!devices)
  {
    return <Text>Camera not available</Text>;
  }

  return (
    <View style={styles.container}>
      {showCamera ? (
        <>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={devices}
            isActive={showCamera}
            photo={true}
          />
          <View style={styles.buttonContainer}>
            {!uploading ? (
              <TouchableOpacity
                style={styles.startButton}
                onPress={startPeriodicUpload}>
                <Text style={styles.buttonText}>Start Upload</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.stopButton}
                onPress={stopPeriodicUpload}>
                <Text style={styles.buttonText}>Stop Upload</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : (
        <Text>Camera Stopped</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  stopButton: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default App;
