var socketHost = "ws://localhost:8900/whatever";

var React = require('react');
var tickerActions = require('./actions/tickerActions');
var tickerStore = require('./stores/tickerStore');

// var dataUpdate = Reflux.createAction();


var Ticker = React.createClass({
    getInitialState: function() {
        return {
            count: 0
        };
    },
    onTickChange: function (ticks) {
        this.setState({
            count: ticks.count
        });
    },
    componentDidMount: function() {
        this.unsubscribe = tickerStore.listen(this.onTickChange);
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },
    render: function() {
        return (
            <div className="ticker">
                <p>Ticks: { this.state.count }</p>
            </div>
        );
    }
}); 

var MessageSender = React.createClass({
    click: function () {
        if (this.props.onClick)
            this.props.onClick(this);
    },
    render: function() {
        return (
            <button className="messageSender" onClick={ this.click }>Send Message</button>
        );
    }
});

var App = React.createClass({
    mainSocket: undefined,
    handleClick: function (button) {
        var data = {hello: 'Hello', data: [{data: 'lalala'}, {data: 'lalalala'}]};
        this._sendMessage(data);
    },
    componentDidMount: function() {
        try{
            this.mainSocket = new WebSocket(this.props.host);

            this.mainSocket.onopen = this._connectionOpened;
            this.mainSocket.onmessage = this._messageSwitch;
            this.mainSocket.onclose = this._connectionClosed;
        } catch(exception){
            console.log(exception);
        }
    },
    componentWillUnmount: function() {
        if (this.mainSocket)
            this.mainSocket.close();
    },
    render: function() {
        return (
            <div className="app">
                <Ticker />
                <MessageSender onClick={ this.handleClick } />
            </div>
        );
    },
    _connectionOpened: function () {
        console.log("Connected the socket");
    },
    _connectionClosed: function () {
        console.log("Disconnected the socket");
    },
    _sendMessage: function (msg) {
        if (this.mainSocket)
            this.mainSocket.send(JSON.stringify(msg));
            return true;
        return false;
    },
    _messageSwitch: function(msg) {
        if (msg.data == "tick")
            tickerActions.tick();
    }
});

React.render(<App host={ socketHost } />, document.getElementById('main'));