/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
        //Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
//    //
//    // Bind any events that are required on startup. Common events are:
//    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
//    // deviceready Event Handler
//    //
//    // The scope of 'this' is the event. In order to call the 'receivedEvent'
//    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log("___onDeviceReady___");
        var push = PushNotification.init({
                "android": {
                    "senderID": "60224550722"
                },
                "browser": {
                    pushServiceURL: 'http://push.api.phonegap.com/v1/push'
                },
                "ios": {
                    "sound": true,
                    "vibration": true,
                    "badge": true
                },
                "windows": {}
            });

            push.on('registration', function (data) {
                device_gcm = data.registrationId;
                // LISTO! este dato es el que hay que mandar a la DB
                console.log("SERGIO LA TENES ADENTRO!");
                console.log(device_gcm);
                $("#textTurnero").text(device_gcm);
            });

            push.on('notification', function (data) {
                var llego = true;
            });
    }
}

function TimerStatusChange(objText) {
    var stringUri = "http://bahiatransporte.com.ar/turnos/index.php?id=" + $("#slcSucursal").val();
    $.getJSON(stringUri, function (data) {
        $.each(data, function (i, item) {
            if (i == 'turno') {
                //  setNewValueTurnero(item);
                objText.fadeOut(100, function () {
                    objText.text(item).fadeIn(100);
                   // CheckCurrentNumber($('#txtNumber'))
                    setTimeout(TimerStatusChange(objText), 5000);
                });

            }
        });

    });
}
function ChangeNumberTurn(objText)
{
    var stringUri = "http://bahiatransporte.com.ar/turnos/index.php?id=" + $("#slcSucursal").val();
    $.getJSON(stringUri, function (data) {
        $.each(data, function (i, item) {
            if (i == 'turno') {
                //  setNewValueTurnero(item);
                objText.fadeOut(100, function () {
                    objText.text(item).fadeIn(100);
                    setTimeout(TimerStatusChange(objText), 5000);
                });






            }
        });

    });
}
function CheckCurrentNumber(objText)
{
    var MyNumber = objText.text();
    var CurrentNumber = $('#textTurnero').text();
    var difNumber= MyNumber-CurrentNumber;
    if (difNumber <= 5)
        alert('te faltan 5 nros para el tuyo');
}
