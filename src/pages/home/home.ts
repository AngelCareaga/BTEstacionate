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
	alertMensajes: string = "";
	numDistancia;
	numDistanciaDos: number =11;
	msgEstado: string = "";



	constructor(private bluetoothSerial: BluetoothSerial, 
				private alertCtrl: AlertController, 
				public events: Events,
				public storage: Storage,
				private macBluetoothProvider: MacBluetoothProvider) 
	{
		bluetoothSerial.enable();
		
		//alert("Es: " + this.compruebaPreferencias());
		/*if (this.compruebaPreferencias()!="") {
			// code...
		}*/
		this.consulta();
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
				this.bluetoothSerial.connect(this.macs[i].macBluetooth.mac).subscribe(this.success, this.fail);
				this.macObtenida = this.macs[i].macBluetooth.mac;
				try {
					setInterval(() => { this.recibe(); }, 1000);
				} catch (e) {
					console.log("Error en: " + e);
				}
			}
				
		}
		
	}

	guarda(texto:string)
	{
		alert("Txt: " + texto);
		this.model.name = "BTSelect";
		this.model.mac = texto;
		this.model.active = true;
		this.macBluetoothProvider.remove("BTSelect");
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
						try {
							setInterval(() => { this.recibe(); }, 1000);
						} catch (e) {
							console.log("Error en: " + e);
						}
					}
				}
			]
		});
		alert.present();

	}

	msjExito = (data) => this.alertMensajes = "Se ha conectado correctamente.";
	msjError = (data) => this.alertMensajes = "Intentelo de nuevo.";

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
	recibe()
	{
		
		this.numDistancia = this.bluetoothSerial.read().then((success) => {
			this.numDistancia = "Distancia: " + success + " cm";
			this.numDistanciaDos = success;
			});

		
		//alert("Recibe: " + this.numDistancia + " parse: " + recNum);
		this.styleFondo = { 'background-color': 'white' };
		if (this.numDistanciaDos <= 10) {
			this.msgEstado = "Estas muy cerca, cuidado.";
			this.styleFondo = { 'background-color': '#C62828' };
		} else if (this.numDistanciaDos >= 11 && this.numDistanciaDos <= 30) {
			this.msgEstado = "La distancia es buena."
			this.styleFondo = { 'background-color': '#FFD740' };
		} else if (this.numDistanciaDos >= 31) {
			this.msgEstado = "Aún tienes bastante espacio."
			this.styleFondo = { 'background-color': '#33691E' };
		}
	}

	styleFondo = {'background-color': 'white'};
}
