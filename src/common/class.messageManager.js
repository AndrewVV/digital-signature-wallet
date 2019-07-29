import chromep from 'chrome-promise';

export default class MessageManager {

    sendMessageToContent (sender, action, data) {
        chrome.tabs.sendMessage(
            sender.tab.id,
            this.getRequestDataFormat(action, data)
        );
    }

    async sendMessageToBackgroundWithResponse (action, data) {
        return chromep.runtime.sendMessage(
            this.getRequestDataFormat(action, data)
        );
    }

    sendMessageToBackground (action, data) {
        chrome.runtime.sendMessage(
            this.getRequestDataFormat(action, data)
        );
    }

    sendMessageToPopup (action, data) {
        chrome.runtime.sendMessage(
            this.getRequestDataFormat(action, data)
        );
    }

    getRequestDataFormat (action, data = {}) {
        return {
            action: action,
            data: data
        };
    }
}