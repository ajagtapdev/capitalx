import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { AntDesign } from '@expo/vector-icons';

interface KnotSDKModalProps {
  visible: boolean;
  onClose: () => void;
}

const KnotSDKModal: React.FC<KnotSDKModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <AntDesign name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <WebView
          source={{
            uri: 'https://ad08-66-180-180-29.ngrok-free.app',
            headers: {
              'ngrok-skip-browser-warning': '1'
            }
          }}
          style={styles.webview}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          automaticallyAdjustContentInsets={false}
          bounces={false}
          scrollEnabled={true}
        />
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
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
});

export default KnotSDKModal;