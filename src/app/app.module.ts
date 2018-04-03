import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

/**
 * Componente base a cargar páginas.
 */
import { MyApp } from './app.component';

/**
 * Componentes pantallas / interfaz.
 */
import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { ConfigPage } from '../pages/config/config';

/**
 * Plugins por defecto.
 */
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

/**
 * Plugins agregados.
 */
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { IonicStorageModule } from '@ionic/storage';
import { MacBluetoothProvider } from '../providers/mac-bluetooth/mac-bluetooth';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ConfigPage,
    AboutPage
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
    AboutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BluetoothSerial,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    MacBluetoothProvider
  ]
})
export class AppModule { }
