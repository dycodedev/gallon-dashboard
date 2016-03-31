'use strict';

(function () {
    freeboard.loadWidgetPlugin({
        type_name: 'state-trigger',
        display_name: 'State Trigger',
        description: '',
        fill_size: false,
        external_scripts: [
            'https://cdn.socket.io/socket.io-1.4.5.js',
        ],
        settings: [
            {
                name: 'deviceId',
                display_name: 'Device ID',
                type: 'text',
                description: 'Azure IoT Hub device identifier',
                default_value: '',
            },
            {
                name: 'wsUrl',
                display_name: 'Websocket URL',
                type: 'text',
                description: 'Websocket server URL',
            },
        ],

        newInstance: function newIns(settings, callback) {
            callback(new GallonStateTrigger(settings));
        },
    });

    var GallonStateTrigger = function (settings) {
        var currentSettings = settings;
        var element =
            '<div class="onoffswitch">' +
                '<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox glx-toggle-state" id="include_legend-onoff">' +
                '<label class="onoffswitch-label" for="include_legend-onoff">' +
                    '<div class="onoffswitch-inner">' +
                        '<span class="on">ON</span>' +
                        '<span class="off">OFF</span>' +
                    '</div>' +
                    '<div class="onoffswitch-switch"></div>' +
                '</label>' +
            '</div>';
        var socket = null;
        var currentState = 0;

        connect();

        $('body').on('click', '.glx-toggle-state', function onClick(event, faked) {
            var newState = (currentState === 0) ? 1 : 0;
            var faked = event.pageX === 0 && event.pageY === 0;

            if (event.hasOwnProperty('originalEvent')) {
                console.log('User triggered');
            } else {
                console.log('Programmatically');
            }

            if (!faked) {
                socket.emit('setState', JSON.stringify({
                    deviceId: currentSettings.deviceId,
                    state: newState,
                }));

                currentState = newState;
            }
        });

        this.render = function render(containerElement) {
            var $mainElement = $($.parseHTML(element));
            $(containerElement).append($mainElement);

            getDeviceState();
        };

        this.getHeight = function getHeight() {
            return 1;
        };

        this.onSettingsChanged = function onSettingsChanged(newSettings) {
            currentSettings = newSettings;
        };

        this.onCalculatedValueChanged = function onCalculatedValueChanged(settingName, newValue) {

        };

        this.onDispose = function () {

        };

        function disconnect() {
            if (socket) {
                socket.disconnect();
            }
        }

        function connect() {
            socket = io.connect(currentSettings.wsUrl, { forceNew: false });

            socket.on('connect_error', function () {
                console.error('Failed to connect to ' + currentSettings.wsUrl);
            });

            socket.on('reconnect_error', function () {
                console.error('Still can not re-establish connection to ' + currentSettings.wsUrl);
            });

            socket.on('reconnect_failed', function () {
                console.error('Another re-conencet failure to ' + currentSettings.wsUrl);
                disconnect();
            });

            socket.on('getState', function (data) {
                var recvd = data;

                console.log('Socket received: ', recvd);

                if (typeof data === 'string') {
                    try {
                        recvd = JSON.parse(data);
                    } catch (ex) {
                        console.error('Not a valid JSON');
                    }
                }

                if (recvd.state === 0 || recvd.state === 1) {
                    currentState = recvd.state;
                    $('.glx-toggle-state').trigger('click', [true]);
                }
            });
        }

        function getDeviceState() {
            $.ajax({
                url: '/devices/' + currentSettings.deviceId + '/state',
                type: 'GET',
                success: function (data) {
                    if (!data.data) {
                        console.error('Device with id ' + currentSettings.deviceId + ' is not found');

                        return false;
                    }

                    console.log('Response: ', data);

                    if (data.data.state) {
                        console.log('Current state:', data.data.state);

                        currentState = data.data.state;
                        $('.glx-toggle-state').trigger('click', [true]);
                    }
                },

                error: function () {
                    console.error('Failed to retrieve device state');
                },
            });
        }
    };
}());
