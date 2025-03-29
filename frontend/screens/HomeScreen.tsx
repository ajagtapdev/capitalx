import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import CreditCardList from '../components/CreditCardList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.userInfo}>
            <Image 
              source={{ uri: 'https://api.a0.dev/assets/image?text=professional%20headshot%20avatar&aspect=1:1' }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>Good evening, Alex</Text>
              <Text style={styles.subtitle}>Premium Member</Text>
            </View>
          </View>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        <CreditCardList />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
    backgroundColor: '#1A1A1A',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#0A84FF',
  },
  scrollView: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#0A84FF',
    fontWeight: '500',
  },
});