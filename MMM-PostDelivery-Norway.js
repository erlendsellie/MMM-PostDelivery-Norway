/*
 * Magic Mirror module for displaying the next post delivery day for your zip code in Norway
 * By Reidar W https://github.com/reidarw/MMM-PostDelivery-Norway
 * MIT Licensed
 */

Module.register("MMM-PostDelivery-Norway", {
    defaults: {
        zipCode: 7033,
        header: 'Leveringsdag for post'
    },

    start: function() {
        this.deliveryPlan = [];
        this.loaded = false;
        this.getDeliveryPlan();
        this.scheduleUpdate();
    },

    getDeliveryPlan: function() {
        this.sendSocketNotification("GET_POST_PLAN", {
            config: this.config
        });
    },

    scheduleUpdate: function(delay) {
        let nextLoad = 5 * 60 * 60 * 1000; // 5 hours
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }
        const self = this;
        setInterval(function() {
            self.getDeliveryPlan();
        }, nextLoad);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "POST_PLAN") {
            this.deliveryPlan = payload;
            this.loaded = true;
            this.updateDom(1000);
        }
    },

    getDom: function() {
        let wrapper = document.createElement("div");

        if (this.loaded === false) {
            wrapper.innerHTML = 'Laster...';
            wrapper.className = "dimmed light small";

            return wrapper;
        }

        if (this.config.header) {
            let headerContainer = document.createElement('div');
            headerContainer.innerHTML = this.config.header;
            headerContainer.className = 'light small';
            wrapper.appendChild(headerContainer);
        }
        let deliveryContainer = document.createElement("div");
        deliveryContainer.className = 'small';
        deliveryContainer.innerHTML = this.deliveryPlan.nextDeliveryDays[0];
        wrapper.appendChild(deliveryContainer);

        return wrapper;
    }
});
