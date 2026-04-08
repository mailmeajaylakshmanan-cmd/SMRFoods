import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock';
jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);

jest.mock('react-native-webview', () => ({
  WebView: 'WebView',
}));

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
}));

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
