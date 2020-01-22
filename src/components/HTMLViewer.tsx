import React, { Component } from 'react';
import { NativeSyntheticEvent, WebView, WebViewMessageEventData } from 'react-native';


interface IProps {
    html: string;
}

interface IState {
    height: number;
}

export class HtmlViewer extends Component<IProps, IState> {
    public constructor(props: IProps) {
        super(props);
        this.state = {
            height: 200,
        };
    }
    public render() {
        return (
            <WebView
                source={{ html: this.createHtml(this.props.html) }}
                style={{ height: this.state.height }}
                onMessage={this.onMessage}
            />
        );
    }
    private onMessage = (event: NativeSyntheticEvent<WebViewMessageEventData>) => {
        let height = Number(event.nativeEvent.data);
        if (!Number.isNaN(height)) {
            // height = height / PixelRatio.get();
            this.setState({
                height,
            });
        }
    }
    private createHtml = (html: string) => {
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
    }
}

export default HtmlViewer
