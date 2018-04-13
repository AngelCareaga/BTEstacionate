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

/*Aqui se configuran los pines donde debemos conectar el sensor*/
#define TRIGGER_PIN  9
#define ECHO_PIN     8
#define MAX_DISTANCE 200
 
/*Crear el objeto de la clase NewPing
Libreria utilizada: http://playground.arduino.cc/Code/NewPing
*/
NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);
 
void setup() {
  Serial.begin(9600);
}
 
void loop() {
  // Esperar 1 segundo entre mediciones
  delay(1000);
  // Obtener medicion de tiempo de viaje del sonido y guardar en variable uS
  int uS = sonar.ping_median();
  // Calcular la distancia con base en una constante
  Serial.print(uS / US_ROUNDTRIP_CM);
}