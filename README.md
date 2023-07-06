# [DEMOQA.COM](https://demoqa.com) JMETER PERFORMANCE TESTING

[![JMETER](https://github.com/dj-luis198/JMeter_Test/actions/workflows/jmeter_run_report_html.yml/badge.svg)](https://github.com/dj-luis198/JMeter_Test/actions/workflows/jmeter_run_report_html.yml)

Link a reporte de pruebas https://dj-luis198.github.io/JMeter_Test/

----------------------------

[demoqa.com](https://demoqa.com) es una página provista por toolsqa.com para realizar practicas con Selenium. La misma posee módulos como botones, menús, formularios, etc. En estas pruebas automatizadas de ejemplo con JMeter se trabaja con el modulo "Book Store Application" que cuenta con los procesos de registro, login, seleccion, eliminacion de libros y eliminacion de cuenta de usuario.

## Pre requisitos
Se requiere tener descargado java, JMeter y configurada la variable de entorno tanto de java como de JMeter . 
> Usé versiones `20.0.1` y `5.5` de java y JMeter, respectivamente. Le sugiero que use la misma versión o versiones posteriores.

## Instalación
JMeter no necesita instalacion, debe ejecutar el archivo `jmeter.bat` que se encuentra dentro de la carpeta `bin`.

## Pruebas

> **Nota:** Antes de ejecutar las pruebas, añadir el plugin `jpgc-casutg`.
>

Ejecutar `jmeter -n -t DemoQA_Performance.jmx -l jmeter_log.log -e -f -o reports/` para correr las pruebas y generar el reporte HTML.
