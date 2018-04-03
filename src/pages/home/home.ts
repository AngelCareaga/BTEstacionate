import { Component, OnInit, OnDestroy } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { MacBluetoothProvider, MacBluetooth, MacBluetoothList } from '../../providers/mac-bluetooth/mac-bluetooth';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})

export class HomePage implements OnInit, OnDestroy {

	macs: MacBluetoothList[];
	model: MacBluetooth = {
		name: '',
		mac: '',
		active: false
	};
	key: string;
	macObtenida: string;
	alertMensajes: string;
	numDistancia: any;
	numDistanciaDos: number;
	msgEstado: string;
	styleFondo: any;

	/**
	 * Inicializa todas las variables a utilizar en home.
	 * @param _bluetoothSerial Variable para acceder al Bluetooth.
	 * @param _macBluetoothProvider Variable que guarda la dirección MAC obtenida.
	 */
	constructor(private _bluetoothSerial: BluetoothSerial,
		private _macBluetoothProvider: MacBluetoothProvider) {
		// Inicializa variables
		this.key = '1';
		this.macObtenida = '';
		this.alertMensajes = '';
		this.numDistancia = '';
		this.numDistanciaDos = 11;
		this.msgEstado = '';
		this.styleFondo = { 'background-color': 'white' };
	}

	/**
	 * Se ejecuta al iniciar.
	 */
	ngOnInit(): void {
		// Ejecuta funciones al inicio
		this._bluetoothSerial.enable();
		this.consulta();
		this.consulta();
	}

	/** 
	* Se ejecuta justo antes de terminar.
	*/
	ngOnDestroy(): void {
		this._bluetoothSerial.disconnect();
	}

	/**
	 * Mensajes a mostrar en caso de exito o error.
	 */
	msjExito = (data) => this.alertMensajes = 'Se ha conectado correctamente | ' + data;
	msjError = (data) => this.alertMensajes = 'Inténtelo de nuevo | ' + data;

	/** 
	 * Busca en la memoria de el plugin 'storage' con ayuda de un Provider, si es que ya hay alguna
	 * dirección MAC asociada, o guardada. Si es así se conecta a esta.
	*/
	consulta(): void {
		this._macBluetoothProvider.getAll()
			.then((result) => {
				this.macs = result;
			});

		for (var i in this.macs) {
			if (this.macs[i].key == 'BTSelect') {
				this._bluetoothSerial.connect(this.macs[i].macBluetooth.mac).subscribe(this.msjExito, this.msjError);
				this.macObtenida = this.macs[i].macBluetooth.mac;
				try {
					setInterval(() => { this.recibe(); }, 1000);
				} catch (e) {
					console.log('Error en: ' + e);
				}
				break;
			}
		}
	}

	/** 
	 * Recibe datos a través del dispositivo bluetooth, con ayuda del plugin 'bluetoothSerial',
	 * cambia los colores y textos, de acuerdo a los datos recibidos.
	*/
	recibe(): void {
		this.numDistancia = this._bluetoothSerial.read().then((success) => {
			this.numDistancia = 'Distancia: ' + success + ' cm';
			this.numDistanciaDos = success;
		});
		this.styleFondo = { 'background-color': 'white' };
		if (this.numDistanciaDos <= 10) {
			this.msgEstado = 'Estas muy cerca, cuidado.';
			this.styleFondo = { 'background-color': '#C62828' };
		} else if (this.numDistanciaDos >= 11 && this.numDistanciaDos <= 30) {
			this.msgEstado = 'La distancia es buena.'
			this.styleFondo = { 'background-color': '#FFD740' };
		} else if (this.numDistanciaDos >= 31) {
			this.msgEstado = 'Aún tienes bastante espacio.'
			this.styleFondo = { 'background-color': '#33691E' };
		}
	}
}
