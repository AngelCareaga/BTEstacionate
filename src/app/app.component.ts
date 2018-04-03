/**
 * Componentes nativos.
 */
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

/**
 * Componentes pantallas / interfaz.
 */
import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { ConfigPage } from '../pages/config/config';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // Asignación de titulos para componentes interfaz.
    this.pages = [
      { title: 'Inicio', component: HomePage },
      { title: 'Configuración', component: ConfigPage },
      { title: 'Acerca de', component: AboutPage }
    ];

  }

  /** 
   * Cuando se cargo la aplicación, se inicializan los plugins de 'statusBar' y 'splashScreen'.
  */
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  /**
   * Auxilia a la apertura de componentes de interfaz.
   * @param page Recibe la página.
   */
  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
