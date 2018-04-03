import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Injectable()
export class MacBluetoothProvider {

	/**
	 * Inicializa todas las variables a utilizar en el provider.
	 * @param _storage Variable para guardar en memoria.
	 */
	constructor(private _storage: Storage) {
	}

	/**
	 * Guarda en memoria, invocando al método local 'save'.
	 * @param key Recibe el identificador.
	 * @param _mac Recibe el valor.
	 */
	public insert(key: string, _mac: MacBluetooth): Promise<any> {
		return this.save(key, _mac);
	}

	/**
	 * Actualiza valor en memoria, invocando al método local 'save'.
	 * @param key Recibe el identificador.
	 * @param _mac Recibe el valor.
	 */
	public update(key: string, _mac: MacBluetooth): Promise<any> {
		return this.save(key, _mac);
	}

	/**
	 * Asigna valores en memoria, con ayuda del plugin 'storage'.
	 * @param key Recibe el identificador.
	 * @param _mac Recibe el valor.
	 */
	public save(key: string, _mac: MacBluetooth): Promise<any> {
		return this._storage.set(key, _mac);
	}

	/**
	 * Elimina el valor en memoria, con ayuda del plugin 'storage'.
	 * @param key Recibe el identificador.
	 */
	public remove(key: string): Promise<any> {
		return this._storage.remove(key);
	}

	/** 
	 * Genera una lista de direcciones MAC, consultando en la memoria, y estructurando los valores en
	 * la clase MacBluetooth, almacenándolas en MacBluetoothList.
	*/
	public getAll(): Promise<any> {

		let macsBluetooth: MacBluetoothList[] = [];

		return this._storage.forEach((value: MacBluetooth, key: string, iterationNumber: number) => {
			let macBluetooth = new MacBluetoothList();
			macBluetooth.key = key;
			macBluetooth.macBluetooth = value;
			macsBluetooth.push(macBluetooth);
		})
			.then(() => {
				return Promise.resolve(macsBluetooth);
			})
			.catch((error) => {
				return Promise.reject(error);
			});
	}
}

/** 
 * Clase auxiliar para el método local getAll.
*/
export class MacBluetooth {
	name: string;
	mac: string;
	active: boolean;
}

/** 
 * Clase auxiliar para el método local getAll.
*/
export class MacBluetoothList {
	key: string;
	macBluetooth: MacBluetooth;
}

