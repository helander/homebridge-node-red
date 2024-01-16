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

 
