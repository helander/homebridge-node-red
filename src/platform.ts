import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';

import fs from 'fs';
import http from 'http';
import express from 'express';
import RED from 'node-red';

type Setting = {
  name: string;
  value: string;
};

/**
 * NodeRedHomebridgePlatform
 */
export class NodeRedHomebridgePlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;
  private port: number;
  private settings: Setting[];
  private storagePath: string;
  private hapPin: string|null;
  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.log = log;
    this.log.info('Finished initializing platform:', config.name);
    this.port = config.port;
    this.settings = config.settings;
    if (this.settings === undefined) {
      this.settings = [];
    }
    this.storagePath = api.user.storagePath();
    this.hapPin = null;
    try {
      const data = fs.readFileSync(api.user.configPath(), 'utf8');
      const homebridgeConfig = JSON.parse(data);
      this.hapPin = homebridgeConfig.bridge.pin;
    } catch (err) {
      this.log.error('Could not read main config file.', err);
    }
    this.api.on('didFinishLaunching', () => {
      this.nodeRed();
    });
  }

  /**
   * This function is invoked when homebridge restores cached accessories from disk at startup.
   * It should be used to setup event handlers for characteristics and update respective values.
   *
   *      !!! Since this platform does not produce any accessories, this function is not used.
   */
  configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading accessory from cache:', accessory.displayName);
  }

  /**
   * Start Node Red.
   */
  nodeRed() {
    // Create an Express app
    const app = express();

    // Add a simple route for static content served from 'public'
    //app.use("/",express.static("public"));

    // Create a server
    const server = http.createServer(app);

    // Create the settings object - see default settings.js file for other options
    const settings = {
      flowFile: 'flows.json',
      httpAdminRoot:'/red',
      httpNodeRoot: '/api',
      userDir:`${this.storagePath}/nodered-${this.port}`,
      functionGlobalContext: { },    // enables global context
    };




    for(let i=0;i < this.settings.length; i+=1) {
      const setting: Setting = this.settings[i];
      const setting_value = setting.value.replaceAll(String.fromCharCode(8220), '"').replaceAll(String.fromCharCode(8221), '"');
      let jvalue;
      try {
        jvalue = JSON.parse(setting_value);
      } catch (err) {
        this.log.error(`Illegal JSON @ ${setting.name} value ${setting_value}`);
      }
      settings[setting.name] = jvalue;
    }

    this.log.info('settings', settings);



    // setup userDir and manage migration from old userDir naming
    const oldUserDir = `${this.storagePath}/nodered`;
    if (!fs.existsSync(settings.userDir)) {
      if (!fs.existsSync(oldUserDir)) {
        fs.mkdirSync(settings.userDir);
        this.log.info(`User directory created at ${settings.userDir}`);
      } else {
        fs.renameSync(oldUserDir, settings.userDir);
        this.log.info(`User directory moved from ${oldUserDir} to ${settings.userDir}`);
      }
    }

    // On first startup, create a hb-conf node representing the local homebridge.
    const flowFilePath = `${settings.userDir}/${settings.flowFile}`;
    if (!fs.existsSync(flowFilePath)) {
      this.log.info('Flows file did not exist => create one with a hb-config included');
      const hbConfig = {
        id: '60e46680800dce61',
        type: 'hb-conf',
        username: this.hapPin,
        macAddress: '',
      };
      try {
        fs.writeFileSync(flowFilePath, JSON.stringify([hbConfig]));
      } catch (err) {
        this.log.error('Problem writing to flows file: ', err);
      }
    } else {
      this.log.info('Flows file existed.');
    }

    // Initialise the runtime with a server and settings
    RED.init(server, settings);

    // Serve the editor UI from /red
    app.use(settings.httpAdminRoot, RED.httpAdmin);

    // Serve the http nodes UI from /api
    app.use(settings.httpNodeRoot, RED.httpNode);

    server.listen(this.port);

    // Start the runtime
    RED.start();

  }
}
