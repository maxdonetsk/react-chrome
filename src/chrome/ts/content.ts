import { Dispatch, SetStateAction } from 'react';
import MessageSender = chrome.runtime.MessageSender;

import { ChromeMessage } from '../../types';

const extensionOrigin = `chrome-extension://${chrome.runtime.id}`;

const IFRAME_ID = 'extension-iframe';

export enum IframeClassName {
  Active = 'active',
  Inactive = 'inactive',
  In = 'in',
  Expanded = 'expanded',
}

const ADD = 'add';
const REMOVE = 'remove';

const getIframe = () => document.getElementById(IFRAME_ID);

const inIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

const toggleShowIframe = () => {
  const iframe = getIframe();

  console.log('iframe', iframe);

  if (!iframe) {
    return;
  }

  const isActive = iframe.classList.contains(IframeClassName.Active);

  const toggleActiveClass = isActive ? REMOVE : ADD;
  const toggleInactiveClass = isActive ? ADD : REMOVE;
  iframe.classList[toggleActiveClass](IframeClassName.Active);
  iframe.classList[toggleActiveClass](IframeClassName.In);
  iframe.classList[toggleInactiveClass](IframeClassName.Inactive);
};

const showIframe = () => {
  const iframe = getIframe();

  if (!iframe) {
    return;
  }

  if (!iframe.classList.contains(IframeClassName.Active)) {
    iframe.classList.add(IframeClassName.Active);
    iframe.classList.add(IframeClassName.In);
    iframe.classList.remove(IframeClassName.Inactive);
  }
};

const hideIframe = () => {
  const iframe = getIframe();

  if (!iframe) {
    return;
  }

  if (iframe.classList.contains(IframeClassName.Active)) {
    iframe.classList.remove(IframeClassName.Active);
    iframe.classList.remove(IframeClassName.In);
    iframe.classList.add(IframeClassName.Inactive);
  }
};

const toggleExpandIframeWidth = (isOpen: boolean) => {
  const iframe = getIframe();

  if (!iframe) {
    return;
  }

  const toggleExpandedClass = isOpen ? ADD : REMOVE;

  iframe.classList[toggleExpandedClass](IframeClassName.Expanded);
};

if (!window.location.ancestorOrigins.contains(extensionOrigin)) {
  const iframe = document.createElement('iframe');
  iframe.id = IFRAME_ID;
  // Must be declared at web_accessible_resources in manifest.json
  iframe.src = chrome.runtime.getURL('index.html');

  if (!inIframe()) {
    document.body.appendChild(iframe);
  }
}

const messageListener = (message: ChromeMessage, sender: MessageSender, callback: Dispatch<SetStateAction<string>>) => {
  console.log('msg', message);
  switch (message.action) {
    case 'toggle-show-iframe':
      toggleShowIframe();
      break;

    case 'show-iframe':
      showIframe();
      break;

    case 'hide-iframe':
      hideIframe();
      break;

    case 'toggle-expand-iframe-width':
      toggleExpandIframeWidth(!!message.isOpen);
      break;

    case 'hello-from-react':
      callback('Hello from content.js');
      break;

    case 'delete-logo':
      const logo = document.getElementsByClassName('lnXdpd');
      logo[0]?.remove();
      callback('Logo has to be deleted');
      break;

    default:
      break;
  }
};

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messageListener);

document.body.addEventListener('click', hideIframe);
