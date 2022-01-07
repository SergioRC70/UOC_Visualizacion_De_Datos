# Visualización de datos - Práctica

## Descripción del proyecto

Esta visualización muestra los datos de calidad del aire recogidos en las estaciones de control de la ciudad de Madrid desde el año 2001 hasta el 31 de diciembre de 2021.

Los datos que se muestran has sido obtenidos del portal de datos abiertos del Ayuntamiento de Madrid. En concreto, la visualización muestra información de los siguiente juegos de datos:

Calidad del aire. Datos diarios. Este conjunto de datos nos da la información de los valores de calidad del aire obtenidos por las 24 estaciones remotas automáticas que recogen la información básica para la vigilancia atmosférica. Los valores diarios se obtienen como una media aritmética de los 24 valores horarios de cada día.

Datos meteorológicos. Datos diarios. Este conjunto de datos nos da la información de las estaciones de control pertenecientes a la red meteorológica municipal.
El hecho de mostrar también información meteorológia recogida durante esos días nos permite estudiar la relación que tiene la calidad del aire con algunos aspectos atmosféricos como la lluvia, la temperatura o la velocidad del viento.

El índice de calidad del aire (ICA) creado por la Agencia Europea de Medio Ambiente (AEMA) se basa en cinco contaminantes clave que son perjudiciales para la salud de las personas y el medio ambiente: partículas en suspensión (PM2,5 y PM10), ozono troposférico (O3), dióxido de nitrógeno (NO2) y dióxido de azufre (SO2). Los detalles sobre el ICA se pueden encontrar en la página web de la AEMA.

## Ficheros contenidos en el repositorio

<ul>
  <li><b>mapa.html</b> - este fichero es la visualización desarrollada. Se puede ver en https://sergiorc70.github.io/UOC_Visualizacion_De_Datos/mapa.html</li>
  <li><b>mapstyle.css</b> - hoja de estilo para la página html</li>
  <li><b>renderstations.js</b> - fichero javascript que contiene la lógica necesaria para el mapa. En concreto, dos funciones están implementadas aquí:
    <ul>
      <li><b>renderstations</b> es la función principal que se encarga de cargar los datos necesarios según la fecha seleccionada y dibujar toda la información en el mapa</li>
      <li><b>renderTempMonth</b> es la función que dibuja las gráfica de temperatura y precipitaciones mensuales</li>
    </ul>
  </li>
</ul>

## Carpetas del repositorio

<ul>
  <li><b>d3</b> - carpeta con los ficheros de la librería d3</li>
  <li><b>data</b> - carpeta con los ficheros de datos necesarios en la visualiazación. En concreto:
    <ul>
      <li>Ficheros con información de datos diarios de calidad del aire</li>
      <li>Ficheros con información de datos diarios meteorológicos</li>
      <li>Ficheros con información de las estaciones de control</li>
    </ul>
  </li>
  <li><b>img</b> - carpeta que contiene las imágenes utilizada en la visualización</li>
  <li><b>jquery-ui</b> - carpeta con los ficheros de la librería jquery UI</li>
  <li><b>jquery</b> - carpeta con los ficheros de la librería jquery</li>
  <li><b>leaflet</b> - carpeta con los ficheros de la librería leaflet</li>
</ul>
