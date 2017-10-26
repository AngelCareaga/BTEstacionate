import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ConfigPage } from '../pages/config/config';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

import { IonicStorageModule } from '@ionic/storage';
import { MacBluetoothProvider } from '../providers/mac-bluetooth/mac-bluetooth';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ConfigPage,
    ListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ConfigPage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BluetoothSerial,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MacBluetoothProvider
  ]
})
export class AppModule {}
