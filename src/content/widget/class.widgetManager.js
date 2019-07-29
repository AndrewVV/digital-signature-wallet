import Widget from './widget.svelte';
import LocationListenerClass from '../listener/class.locationListener.js'

const LocationListener = new LocationListenerClass();
const PROFILE_PAGE_PATH = 'www.linkedin.com/in';

export default class WidgetManager {
    initWidget () {
        let wrapper = $.parseHTML('<div style="z-index: 102; position: absolute" class="widget-prepend-block"></div>');

        if(window.location.href.includes(PROFILE_PAGE_PATH)) {
            this.appendWidget(wrapper);
        }

        LocationListener.onHrefChanged((locationHref) => {
           if (locationHref.includes(PROFILE_PAGE_PATH)) {
               this.appendWidget(wrapper);
           } else {
               $(wrapper).remove()
           }
        });
    }

    appendWidget (wrapper) {
        $(document.body).prepend(wrapper);

        const widget = new Widget({
            target: document.querySelector('.widget-prepend-block')
        });
    }
}