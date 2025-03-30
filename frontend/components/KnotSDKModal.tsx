import React, { useEffect, useState } from 'react';
import { Modal, View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

interface KnotSDKModalProps {
  visible: boolean;
  onClose: () => void;
  totalAmount: number;
}

const KnotSDKModal: React.FC<KnotSDKModalProps> = ({ visible, onClose, totalAmount }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      initializeSession();
    }
  }, [visible]);

  const initializeSession = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/session');
      const data = await response.json();
      setSessionId(data.session);
      setLoading(false);
    } catch (error) {
      console.error('Error initializing Knot session:', error);
      setLoading(false);
      onClose();
    }
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>Knot SDK</title>
        <script src="https://unpkg.com/knotapi-js@next"></script>
        <style>
          body {
            margin: 0;
            padding: 0;
            background: #000000;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
          }
          #sdk-container {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div id="sdk-container"></div>
        <script>
          const KnotapiJS = window.KnotapiJS.default;
          const knotapi = new KnotapiJS();
          
          knotapi.open({
            sessionId: "${sessionId}",
            clientId: "${process.env.KNOT_CLIENT_ID}",
            environment: "development",
            product: "card_switcher",
            merchantIds: [13],
            entryPoint: "checkout",
            onSuccess: (product, details) => {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'success',
                data: details
              }));
            },
            onError: (product, errorCode, message) => {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'error',
                error: { code: errorCode, message }
              }));
            },
            onEvent: (product, event, merchant, payload, taskId) => {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'event',
                data: { product, event, merchant, payload, taskId }
              }));
            },
            onExit: (product) => {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'exit',
                data: { product }
              }));
            }
          });
        </script>
      </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      switch (data.type) {
        case 'success':
          console.log('Knot SDK Success:', data.data);
          onClose();
          break;
        case 'error':
          console.error('Knot SDK Error:', data.error);
          onClose();
          break;
        case 'exit':
          console.log('Knot SDK Exit:', data.data);
          onClose();
          break;
        case 'event':
          console.log('Knot SDK Event:', data.data);
          break;
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0A84FF" />
        ) : (
          <WebView
            source={{ html: htmlContent }}
            onMessage={handleMessage}
            style={styles.webview}
            originWhitelist={['*']}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            automaticallyAdjustContentInsets={false}
            bounces={false}
            scrollEnabled={false}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView HTTP error: ', nativeEvent);
            }}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

export default KnotSDKModal; 