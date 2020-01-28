import { Platform, WebView } from "react-native";
import WKWebView from 'react-native-wkwebview-reborn';

export default Platform.OS === 'ios' ? WKWebView : WebView;