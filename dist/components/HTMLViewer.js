"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const WebView_1 = __importDefault(require("./WebView"));
class HtmlViewer extends react_1.Component {
    constructor(props) {
        super(props);
        this.onMessage = (event) => {
            let height = Number(event.nativeEvent.data);
            if (!Number.isNaN(height)) {
                // height = height / PixelRatio.get();
                this.setState({
                    height,
                });
            }
        };
        this.createHtml = (html) => {
            const completedHtml = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <style>
                html, body {
                    font-size: 14pt;
                }
                #container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    margin: 0;
                    padding: 0;
                }
                p {
                    margin: 0;
                    padding: 0;
                }
            </style>
            <script>
                window.addEventListener("load", () => {
                    setTimeout(() => {
                        const container = document.getElementById('container');
                        window.ReactNativeWebView.postMessage(container.clientHeight);
                    }, 100);
                });
            </script>
        </head>
        <body>
            <div id="container">
                ${html}
            </div>
        </body>
        </html>`;
            return completedHtml;
        };
        this.state = {
            height: 200,
        };
    }
    render() {
        return (react_1.default.createElement(WebView_1.default, { source: { html: this.createHtml(this.props.html) }, style: { height: this.state.height }, onMessage: this.onMessage }));
    }
}
exports.HtmlViewer = HtmlViewer;
exports.default = HtmlViewer;
