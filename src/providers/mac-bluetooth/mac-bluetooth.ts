import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

/*
  Generated class for the MacBluetoothProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class MacBluetoothProvider {

	constructor(private storage: Storage) {
    
  }

  public insert(key: string, mac: MacBluetooth) {
	  return this.save(key, mac);
  }

  public update(key: string, mac: MacBluetooth) {
	  return this.save(key, mac);
  }

  public save(key: string, mac: MacBluetooth) {
	  return this.storage.set(key, mac);
  }

  public remove(key: string) {
	  return this.storage.remove(key);
  }

  public getAll() {

	  let macsBluetooth: MacBluetoothList[] = [];

	  return this.storage.forEach((value: MacBluetooth, key: string, iterationNumber: Number) => {
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

export class MacBluetooth {
	name: string;
	mac: string	;
	active: boolean;
}

export class MacBluetoothList {
	key: string;
	macBluetooth: MacBluetooth;
}

