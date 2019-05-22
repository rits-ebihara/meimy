import { Component } from 'react';
interface IProps {
    html: string;
}
interface IState {
    height: number;
}
export declare class HtmlViewer extends Component<IProps, IState> {
    constructor(props: IProps);
    render(): JSX.Element;
    private onMessage;
    private createHtml;
}
export default HtmlViewer;
