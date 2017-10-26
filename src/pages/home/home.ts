import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AlertController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MacBluetoothProvider, MacBluetooth, MacBluetoothList } from '../../providers/mac-bluetooth/mac-bluetooth';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

	macs: MacBluetoothList[];
	model: MacBluetooth = {
		name:"",
		mac:"",
		active:false
	};
	key: string = "1";

	unpairedDevices: any;
	pairedDevices: any;
	gettingDevices: Boolean;

	macObtenida: string = "";

	temperatura;



	constructor(private bluetoothSerial: BluetoothSerial, 
				private alertCtrl: AlertController, 
				public events: Events,
				public storage: Storage,
				private macBluetoothProvider: MacBluetoothProvider) 
	{
		bluetoothSerial.enable();
		
		//setInterval(() => { this.recibe(); }, 1000 );
		//alert("Es: " + this.compruebaPreferencias());
		/*if (this.compruebaPreferencias()!="") {
			// code...
		}*/
		this.consulta();
		
	}

	consulta()
	{
		this.macBluetoothProvider.getAll()
			.then((result) => {
				this.macs = result;
			});
		for (var i in this.macs) {
			if (this.macs[i].key == "BTSelect") {
				//alert("Nombre: " + this.macs[i].macBluetooth.name);
				//alert("MAC: " + this.macs[i].macBluetooth.mac);
				this.bluetoothSerial.connect(this.macs[i].macBluetooth.mac).subscribe(this.success, this.fail);
				this.macObtenida = this.macs[i].macBluetooth.mac;
			}
				
		}
		
	}

	guarda(texto:string)
	{
		alert("Txt: " + texto);
		this.model.name = "BTSelect";
		this.model.mac = texto;
		this.model.active = true;
		this.macBluetoothProvider.save("BTSelect", this.model);
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
			title: 'Connect',
			message: 'Do you want to connect with?',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				},
				{
					text: 'Connect',
					handler: () => {
						this.bluetoothSerial.connect(address).subscribe(this.success, this.fail);
					}
				}
			]
		});
		alert.present();

	}

	disconnect() {
		let alert = this.alertCtrl.create({
			title: 'Disconnect?',
			message: 'Do you want to Disconnect?',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				},
				{
					text: 'Disconnect',
					handler: () => {
						this.bluetoothSerial.disconnect();
					}
				}
			]
		});
		alert.present();
	}

	envia(cadEnviar)
	{
		try {
			this.bluetoothSerial.write(cadEnviar);
			//alert(cadEnviar);
		}catch(e)
		{
			alert("No enviado "+e);
		}
	}

	recibe()
	{
		this.temperatura = this.bluetoothSerial.read().then((success) => {
			this.temperatura = success;
			});
	}

	compruebaPreferencias() {
		var regresaMac = "";
		// Or to get a key/value pair
		this.storage.get('strBluetoothMac').then((val) => {
			regresaMac = val;
		});

		return regresaMac;
	}	
}
