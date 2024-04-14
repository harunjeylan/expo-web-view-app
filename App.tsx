import Constants from "expo-constants";
import React, { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";
import WebView from "react-native-webview";

const SOURCE_URI = "https://ozonetechnology.net";

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  const onAndroidBackPress = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener(
          "hardwareBackPress",
          onAndroidBackPress
        );
      };
    }
  }, []);

  function onRefresh() {
    setRefreshing(true);
    const webview = webViewRef.current;
    if (webview) {
      webview.reload();
      setRefreshing(false);
    }
  }

  function handleScroll(event: any) {
    const { contentOffset } = event.nativeEvent;
    const isScrolledToTop = contentOffset.y === 0;

    setScrollEnabled(isScrolledToTop);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          enabled={scrollEnabled}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <WebView
        ref={webViewRef}
        style={styles.webview}
        onScroll={handleScroll}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
        webviewDebuggingEnabled={true}
        thirdPartyCookiesEnabled={true}
        source={{ uri: SOURCE_URI! }}
        onShouldStartLoadWithRequest={(request) => {
          return request.url.startsWith(SOURCE_URI!);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  contentContainer: {
    flexGrow: 1,
  },
  webview: {
    flex: 1,
  },
});
