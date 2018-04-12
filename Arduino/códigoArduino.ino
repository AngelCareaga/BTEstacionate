/**
 * Archivo de código fuente en lenguaje C para Arduino.
 *
 * Aquí se especifica y se programa el uso del sensor.
 * - Imprime los datos recibidos del sensor ultrasónico Arduino (HC-SR04).
 * - Envia las impresiones vía Bluetooth con módulo HC-05.
 *
 * C
 *
 * LICENSE: Este archivo fuente está sujeto a la licencia MIT
 * que está disponible a través del siguiente URI:
 * https://github.com/AngelCareaga/BTEstacionate/blob/master/LICENSE
 *
 * @category   c
 * @file       códigoArduino.ino
 * @author     Ángel Careaga <dev.angelcareaga@gmail.com>
 * @copyright  2018
 * @license    MIT
 * @version    1.0
 */

int pinReceptor = A0; // Establecemos el PIN para leer.
int sensorVal; // Declaramos esta variable para almacenar el valor de la lectura.

/**
* Se establecen configuraciones
*/
void setup()
{
	Serial.begin(9600); // abre el Puerto serie y configurando la velocidad en 9600 bps.
}

/**
* Crea una función 'infinita', así que todo lo que va dentro se repite.
*/
void loop()
{
  sensorVal = analogRead(pinReceptor); // Recibimos el valor del sensor y lo almacenamos el valor.
  Serial.println.(sensorVal); // Se imprime esta lectura, la cual se esta enviando por Bluetooth.
  delay(500); // Hace una pausa de medio segundo antes de leer de nuevo otro valor
}
 