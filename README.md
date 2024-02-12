<p align="center">

<img src="https://github.com/homebridge/branding/raw/latest/logos/homebridge-wordmark-logo-vertical.png" width="150">

</p>

<span align="center">

# Homebridge Node Red Platform Plugin

</span>

This plugin embeds a Node Red instance into your Homebridge system. Node Red is an excellent tool for adding automations to your Homebridge system.
Adding Node Red into Homebridge simplifies total management efforts compared to running Node Red separate.
 In order to ease the integration between Node Red flows and Homebridge accessories, the component *node-red-contrib-homebridge-automation* is preinstalled.
This makes it possible to have the accessory services turn up as nodes into the Node Red flows.

The plugin  automatically creates a hb-conf configuration node that represents the local Homebridge system, so you are ready to define nodes representing the local
Homebridge accessories.

The plugin requires no configuration, but if you would like to change the http port of the Node Red server (default port number 1956) you could easily change that
via the plugin's configuration UI in the Homebridge UI. 

The Node Red Editor is available at *http://homebridge_server_host:1956/red* , where 1956 must be changed in case you have configured another port number.

 
The Node Red system does not use a settings.js file, instead some primary settings are hardcoded into the plugin. Arbitrary settings (see a settings.js file) may be added
via the plugin's configuration. Each setting has a name, which corresponds to property names in settings.js. Each setting also has a value. These values are identical to the
values described in settings.js. These values are javascript values and the setting value to enter is a JSON representation of the value.
String values, must be enclosed in double-quote characters. Since object property names are represented as strings in JSON, these must also be enclosed in double-quotes.
The use of double-quote characters should be applied in case you enter the vales using the plugin's configuration UI. In case you edit the config.json directly, all JSON double-quote
characters have to be escaped (prepended) by a backslash ('\\') character. If you enter double-quotes in the plugin's UI, you could then have a look at the config.json and you should then
see that the double-quotes has been escaped.

```
        {
            "name": "Node Red Platform",
            "port": 1956,
            "settings": [
                {
                    "name": "credentialSecret",
                    "value": "\"hemligt\""
                }
            ],
            "platform": "NodeRedHomebridgePlugin"
        }

```
