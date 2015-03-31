var Reflux = require('reflux');
var tickerActions = require('../actions/tickerActions');

var tickerStore = Reflux.createStore({
    count: 0,
    init: function () {
        this.listenTo(tickerActions.tick, 'output');
    },
    output: function () {
        this.count += 1;
        this.trigger({count: this.count});
    }
});

module.exports = tickerStore;