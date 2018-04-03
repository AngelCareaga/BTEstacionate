import { Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AlertController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MacBluetoothProvider, MacBluetooth } from '../../providers/mac-bluetooth/mac-bluetooth';

@Component({
	selector: 'page-config',
	templateUrl: 'config.html'
})


export class ConfigPage implements OnInit {

	unpairedDevices: any;
	pairedDevices: any;
	gettingDevices: boolean;
	model: MacBluetooth = {
		name: '',
		mac: '',
		active: false
	};
	alertMensajes: string;

	/**
	 * Inicializa todas las variables a utilizar en config.
	 * @param _bluetoothSerial Variable para acceder al Bluetooth.
	 * @param _alertCtrl Variable para enviar alertas.
	 * @param _events Variable para registrar los eventos.
	 * @param _storage Variable para guardar en memoria.
	 * @param _macBluetoothProvider Variable que guarda la dirección MAC obtenida.
	 */
	constructor(private _bluetoothSerial: BluetoothSerial,
		private _alertCtrl: AlertController,
		public _events: Events,
		public _storage: Storage,
		private _macBluetoothProvider: MacBluetoothProvider) {
		// Inicializa variables
		this.alertMensajes = '';
	}

	/**
	 * Se ejecuta al iniciar.
	 */
	ngOnInit(): void {
		this._bluetoothSerial.enable();
	}

	/** 
	 * Se ejecuta justo antes de terminar.
	*/
	ngOnDestroy(): void {
		this._bluetoothSerial.disconnect();
	}

	/**
	 * Mensajes a mostrar en caso de éxito o error.
	 */
	msjExito = (data) => this.alertMensajes = 'Se ha conectado correctamente | ' + data;
	msjError = (data) => this.alertMensajes = 'Inténtelo de nuevo | ' + data;

	success = (data) => alert(data);
	fail = (error) => alert(error);

	/**
	 * Hace la búsqueda de nuevos dispositivos Bluetooth, además de mostrar los dispositivos ya emparejados.
	 */
	startScanning(): void {
		this.pairedDevices = null;
		this.unpairedDevices = null;
		this.gettingDevices = true;
		this._bluetoothSerial.discoverUnpaired().then((success) => {
			this.unpairedDevices = success;
			this.gettingDevices = false;
			success.forEach(element => {
				// alert(element.name);
			});
		},
			(err) => {
				console.log(err);
			})

		this._bluetoothSerial.list().then((success) => {
			this.pairedDevices = success;
		},
			(err) => {
				console.log('No se ha podido obtener dispositivos: ' + err);
			})
	}

	/**
	 * Hace la conexión al dispositivo seleccionado en la lista de dispositivos encontrados.
	 * @param address Recibe la dirección MAC, e intenta conectar a esta.
	 */
	selectDevice(address: any): void {
		let alert = this._alertCtrl.create({
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
					text: 'Conectar a: ' + address,
					handler: () => {
						this._bluetoothSerial.connect(address).subscribe(this.success, this.fail);
						try {
							this._macBluetoothProvider.remove('BTSelect');
							this.guardaPreferencias(address);
						} catch (e) {
							console.log('Error en: ' + e);
						}
					}
				}
			]
		});
		alert.present();
	}

	/** 
	 * Desconecta del dispositivo Bluetooth.
	*/
	disconnect(): void {
		let alert = this._alertCtrl.create({
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
						this._bluetoothSerial.disconnect();
					}
				}
			]
		});
		alert.present();
	}

	/**
	 * Guarda el dispositivo Bluetooth en la memoria, con ayuda del plugin 'storage', 
	 * que se encuentra en el MacBluetoothProvider.
	 * @param strBluetoothMac 
	 */
	guardaPreferencias(strBluetoothMac): void {
		this._storage.ready().then(() => {

			this.model.name = 'BTSelect';
			this.model.mac = strBluetoothMac;
			this.model.active = true;
			this._macBluetoothProvider.save('BTSelect', this.model);
		});
	}

	/** 
	 * Comprueba las preferencias guardadas.
	*/
	compruebaPreferencias(): string {
		let regresaMac = '';
		this._storage.ready().then(() => {
			this._storage.get('strBluetoothMac').then((val) => {
				regresaMac = val;
			});
		});
		return regresaMac;
	}

}
