import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	unpairedDevices: any;
	pairedDevices: any;
	gettingDevices: Boolean;

	constructor(private bluetoothSerial: BluetoothSerial, private alertCtrl: AlertController) {
		bluetoothSerial.enable();
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

}
