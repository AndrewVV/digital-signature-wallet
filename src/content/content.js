import WidgetManagerClass from './widget/class.widgetManager.js';

const WidgetManager = new WidgetManagerClass();

$(function () {
    WidgetManager.initWidget();
});