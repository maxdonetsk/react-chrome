export enum Sender {
    React = 'react',
    Content = 'content',
    Background = 'background'
}

export interface ChromeMessage {
    from: Sender,
    action: string,
    message?: string,
    isOpen?: boolean,
}
