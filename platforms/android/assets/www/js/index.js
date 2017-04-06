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
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
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
                $("#gcm_id").text(device_gcm);
                
            });

       
            push.on('notification', function (data) {
                console.log('notification event');
                navigator.notification.alert(
                        data.message,         // message
                        null,                 // callback
                        data.title,           // title
                        'Ok'                  // buttonName
                );
            });
    }
}

function LoadData()
{
    var turno = localStorage.getItem('turno') || '<empty>';
    var sucursal = localStorage.getItem('sucursal') || '<empty>';
    $("#slcSucursal").val(sucursal);
    $("#txtNumber").val(turno);
    ChangeNumberTurn($("#textTurnero"));
}
function setButtonClick()
{
    $("#slcSucursal").change(function () {
        ChangeNumberTurn($("#textTurnero"));


    });

    $("#btnSetNumber").click(function () {
        var deviceID = device.uuid;
        var stringUri = "  http://bahiatransporte.com.ar/turnos/usuarios.php?gcm_id=" + $("#gcm_id").text() + "&id_punto_de_venta=" + $("#slcSucursal").val() + "&turno=" + $("#txtNumber").val() + "&deviceID=" + deviceID;
        console.log('enviando solicitud...');
        console.log(stringUri);
        $("#btnSetNumber").text("Enviando turno...");
        $.getJSON(stringUri, function (data) {
            $.each(data, function (i, item) {

                if (item == '-1') {
                    $("#btnSetNumber").text("Turno guardado.");
                }
            })

        })
        .fail(function (jqXHR, textStatus, errorThrown) { console.log(errorThrown); })
        .always(function () {
            localStorage.setItem("turno", $("#txtNumber").val());
            localStorage.setItem("sucursal", $("#slcSucursal").val());


        });
    });
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
                    setInterval(function () {
                        var stringUri = "http://bahiatransporte.com.ar/turnos/index.php?id=" + $("#slcSucursal").val();
                        $.getJSON(stringUri, function (data) {
                            $.each(data, function (i, item) {
                                if (i == 'turno') {
                                    //  setNewValueTurnero(item);
                                    $("#textTurnero").fadeOut(100, function () {
                                        $("#textTurnero").text(item).fadeIn(100);
                                        // CheckCurrentNumber($('#txtNumber'))
                                    });

                                }
                            });

                        });
                    }
                     , 5000);
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
