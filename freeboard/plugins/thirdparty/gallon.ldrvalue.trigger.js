'use strict';

(function() {
    freeboard.loadWidgetPlugin({
        type_name: 'ldrindicator-trigger',
        display_name: 'LDR Indicator Trigger',
        description: '',
        fill_size: false,
        settings: [
            {
                name: 'uniqueid',
                display_name: 'Unique Number',
                type: 'text',
                description: 'This value must be unique since it is used to identify the widget',
                default_value: '0',
            },
        ],

        newInstance: function newIns(settings, callback) {
            callback(new gallonTriggerPlugin(settings));
        },
    });

    var gallonTriggerPlugin = function(settings) {
        var currentSettings = settings;
        var jqSliderCurVal = 0;
        var jqSliderOptions = {
            min: 0,
            max: 100,
            step: 10,
            value: jqSliderCurVal,
            stop: function(event, ui) {
                jqSliderCurVal = ui.value;

                $(event.target)
                    .parents('.glx-trigger-wrapper')
                    .find('.glx-display-waterlevel')
                    .html(jqSliderCurVal);
            },
        };
        var jqSliderSelector = '.glx-trigger-slider';

        var mainRawHTML =
            '<div class="glx-trigger-wrapper tw-display" data-uniqueid="' + currentSettings.uniqueid + '" id="glx-trigger-waterlevel-' + currentSettings.uniqueid + '" style="">' +
                '<div class="glx-trigger tw-tr" style="margin-top: 15px; height: 80px; width: 100%; clear: both">' +
                    '<h5 class="glx-trigger-name">Water Level' +
                        '<span class="glx-display-waterlevel" style="float: right; position: relative">' + jqSliderCurVal + '</span>' +
                    '</h5>' +
                    '<div style="margin: 15px auto" class="' + jqSliderSelector.replace('.', '') + '"></div>' +
                '</div>' +

                '<div class="glx-action tw-tr" style="margin-top: 30px;">' +
                    '<h5 class="glx-action-name">Action' +
                        '<span class="btn btn-pos-right glx-add-action text-button" style="float: right; position: relative">' +
                            '+' +
                        '</span>' +
                    '</h5>' +

                    '<hr style="width: 100%; border: 1px solid white" />' +

                    '<div style="margin: 5px auto; padding: 5px 0; max-height: 120px; overflow-y: scroll; display: block" class="glx-trigger-action-list tw-display">'+
                    '</div>' +
                '</div>'+
            '</div>';

        var formRawHTML =
            '<form method="POST" id="glx-add-action-form" action="javascript: void(0);">' +
                '<div id="glx-waterlevel-action-' + currentSettings.uniqueid + '">' +
                    '<div class="form-row">' +
                        '<div class="form-label"><label class="control-label">Contact Name</label></div>' +
                        '<div class="form-value"><input type="text" name="contactName"></div>' +
                    '</div>' +

                    '<div class="form-row">' +
                        '<div class="form-label"></label class="control-label">Contact Type</label></div>' +
                        '<div class="form-value">' +
                            '<select name="alertType">' +
                                '<option value="">Choose Type</option>' +
                                '<option value="sms" selected="">SMS</option>' +
                                '<option value="email">Email</option>' +
                                '<option value="pushNotification">Push Notification</option>' +
                            '</select>' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-row">' +
                        '<div class="form-label"><label class="control-label">Contact info</label></div>' +
                        '<div class="form-value"><input type="text" name="contactInfo"></div>' +
                    '</div>' +

                    '<div class="form-row">' +
                        '<div class="form-label"><label class="control-label">Message</label></div>' +
                        '<div class="form-value"><input type="text" name="message"></div>' +
                    '</div>' +
                '</div>'+
            '</form>';

        var $mainElement = $($.parseHTML(mainRawHTML));
        var $formElement = $($.parseHTML(formRawHTML));
        var $jquiCss = $($.parseHTML('<link rel="stylesheet" id="jquiCssLink" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">'));

        function renderAction(parent, content) {
            $(parent).append(
                '<div class="glx-trigger-action tw-value-wrapper tw-tr" style="padding: 3px 0;">' +
                    '<div class="tw-value">' + content.action.type + ' to ' + content.action.to  +
                    '</div>' +
                    '<span class="btn btn-pos-right glx-del-action text-button" style="text-align: right">X</span>' +
                '</div>'
            );
        }

        function deleteParent(child, selector) {
            $(child).parents(selector).remove();
        }

        this.render = function render(containerElement) {
            if ($('#jquiCssLink').length < 1) {
                $('head').append($jquiCss);
            }

            $(containerElement).append($mainElement);

            // init slider
            $(jqSliderSelector).slider(jqSliderOptions);
            $('body').on('click', '#glx-trigger-waterlevel-' + currentSettings.uniqueid + ' .glx-add-action', function(event) {
                var $launcher = $(this);
                var $parent = $(event.target).parents('.glx-trigger-wrapper');
                var $actionList = $parent.find('.glx-trigger-action-list');
                var uniqueid = $parent.data('uniqueid');
                var payload = {
                    triggerNo: uniqueid,
                    threshold: parseInt($parent.find('.glx-display-waterlevel').text()),
                    triggerName: 'waterlevel',
                    action: {
                        to: '',
                        type: '',
                        message: '',
                    },
                };

                freeboard.showDialog($formElement, 'Add new Action', 'Save', 'Cancel', function() {
                    // make ajax request.
                    console.log('Saving....');
                    payload.action.to = $formElement.find('[name="contactInfo"]').val();
                    payload.action.type = $formElement.find('[name="alertType"]').val();
                    payload.action.message = $formElement.find('[name="message"]').val();

                    if (currentSettings.submitUrl) {
                        $.ajax({
                            type: 'POST',
                            url: currentSettings.submitUrl,
                            data: payload,
                            dataType: 'json',
                            success: function(response) {
                                renderAction($actionList, payload);
                            },
                            error: function(xhr, errorMessage, err) {

                            },
                        });
                    } else {
                        console.log(payload);
                        renderAction($actionList, payload);
                    }
                    $formElement.trigger('reset');
                });
            });

            $('body').on('click', '#glx-trigger-waterlevel-' + currentSettings.uniqueid + ' .glx-del-action', function(event) {
                var $launcher = $(this);
                var payload = {};

                if (currentSettings.deleteUrl) {
                    $.ajax({
                        type: 'POST',
                        url: currentSettings.deleteUrl,
                        data: payload,
                        dataType: 'json',
                        success: function(response) {
                            deleteParent($launcher, '.glx-trigger-action');
                        },
                        error: function(xhr, errorMessage, err) {

                        },
                    })
                } else {
                    console.log(payload);
                    deleteParent($launcher, '.glx-trigger-action');
                }
            });
        }

        this.getHeight = function getHeight() {
            return 4;
        }

        this.onSettingsChanged = function onSettingsChanged(newSettings) {
            currentSettings = newSettings;
        }

        this.onCalculatedValueChanged = function onCalculatedValueChanged(settingName, newValue) {

        }

        this.onDispose = function() {

        }
    }
}());
