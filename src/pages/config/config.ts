import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AlertController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MacBluetoothProvider, MacBluetooth } from '../../providers/mac-bluetooth/mac-bluetooth';

@Component({
	selector: 'page-config',
	templateUrl: 'config.html'
})


export class ConfigPage {

	unpairedDevices: any;
	pairedDevices: any;
	gettingDevices: Boolean;
	model: MacBluetooth = {
		name: "",
		mac: "",
		active: false
	};

	temperatura;

	constructor(private bluetoothSerial: BluetoothSerial, 
				private alertCtrl: AlertController, 
				public events: Events, 
				public storage: Storage,
				private macBluetoothProvider: MacBluetoothProvider) 
	{
		bluetoothSerial.enable();
		//setInterval(() => { this.recibe(); }, 1000 );
	}

	startScanning() {
		this.pairedDevices = null;
		this.unpairedDevices = null;
		this.gettingDevices = true;
		this.bluetoothSerial.discoverUnpaired().then((success) => {
			this.unpairedDevices = success;
			this.gettingDevices = false;
			success.forEach(element => {
				// alert(element.name);
			});
		},
			(err) => {
				console.log(err);
			})

		this.bluetoothSerial.list().then((success) => {
			this.pairedDevices = success;
		},
			(err) => {

			})
	}
	success = (data) => alert(data);
	fail = (error) => alert(error);

	selectDevice(address: any) {

		let alert = this.alertCtrl.create({
			title: 'Conectar',
			message: '¿Quieres conectarte?',
			buttons: [
				{
					text: 'Cancelar',
					role: 'cancel',
					handler: () => {
						console.log('Cancelar clic');
					}
				},
				{
					text: 'Connectar a: ' + address,
					handler: () => {
						this.bluetoothSerial.connect(address).subscribe(this.success, this.fail);
						try {
							this.macBluetoothProvider.remove("BTSelect");
							this.guardaPreferencias(address);
						} catch (e)
						{
							console.log("Error en: " + e);
						}
					}
				}
			]
		});
		alert.present();

	}

	disconnect() {
		let alert = this.alertCtrl.create({
			title: 'Desconectar',
			message: '¿Quiere desconectarse?',
			buttons: [
				{
					text: 'Cancelar',
					role: 'cancel',
					handler: () => {
						console.log('Cancelar clic');
					}
				},
				{
					text: 'Desconectar',
					handler: () => {
						this.bluetoothSerial.disconnect();
					}
				}
			]
		});
		alert.present();
	}


	guardaPreferencias(strBluetoothMac)
	{
		this.storage.ready().then(() => {
		
			this.model.name = "BTSelect";
			this.model.mac = strBluetoothMac;
			this.model.active = true;
			this.macBluetoothProvider.save("BTSelect", this.model);
		});
	}

	compruebaPreferencias()
	{
		var regresaMac = "";
		// Or to get a key/value pair
		this.storage.ready().then(() => {
			this.storage.get('strBluetoothMac').then((val) => {
				regresaMac = val;
			});
		});

		return regresaMac;
	}

}
