import { useNetInfo } from "@react-native-community/netinfo";

const useNetworkStatus = () => {
  const netInfo = useNetInfo();

  // Initially, before we have Network details, assume true so we don't flash offline states.
  if (netInfo.isConnected === null) {
    return { isOnline: true, isSlow: false, isCompletelyOffline: false };
  }

  const isCompletelyOffline = netInfo.isConnected === false;
  
  const isSlow = netInfo.type === 'cellular' && 
                 (netInfo.details?.cellularGeneration === '2g' || netInfo.details?.cellularGeneration === '3g');
                 
  // Online if not completely offline and not slow
  const isOnline = !isCompletelyOffline && !isSlow;

  return { isOnline, isSlow, isCompletelyOffline };
};

export default useNetworkStatus;
