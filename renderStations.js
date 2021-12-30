// La función renderStations contiene la mayor parte de la lógida de la visualización.
// Se encarga de cargar la información necesaria dependiendo de la fecha seleccionada.
// Para ello, carga los datos de los ficheros csv de datos atmosféricos y de calidad del aire del año
// correspondiente.
// Con esos datos, va a dibujar los markers en el mapa y la información meteorológica necesaria.
function renderStations(fecha)
{
	for(i = 0; i < circles.length; i++) {
		map.removeLayer(circles[i]);
	}

	// Cargamos los datos de los ficheros csv. Lo primero es cargar la estaciones de control
	d3.dsv(";", "./data/estaciones_control_aire.csv").then(function(data) {
		data.forEach(function(d) {
			var latitud = d.LATITUD;
			var longitud = d.LONGITUD;
			var estacion = d.CODIGO_CORTO;
			var nom_estacion = d.ESTACION

			// Cargarmos el fichero con los datos para el año seleccionado
			var file_name = "./data/datos" + fecha.getFullYear() + "11.csv";
			d3.dsv(";", file_name).then(function(data) {
				var filteredData = data.filter(function(row, i) {
					var myMonth = ("0" + (fecha.getMonth() + 1)).slice(-2);
					return row.MES == myMonth && row.ESTACION == estacion && (row.MAGNITUD == '1' || row.MAGNITUD == '8' || row.MAGNITUD == '9' || row.MAGNITUD == '10' || row.MAGNITUD == '14');
				});

				var indice_calidad = 0;
				var valor_so2 = 0;
				var valor_no2 = 0;
				var valor_pm25 = 0;
				var valor_pm10 = 0;
				var valor_o3 = 0;

				filteredData.forEach(function(item) {
					var magnitud = item.MAGNITUD;
					var myDay = ("0" + fecha.getDate()).slice(-2);
					var valor = item['D' + myDay];

					// Dióxido de Azufre SO2
					if (magnitud == 1) {
						valor_so2 = valor;
						if (valor <= 100)
							indice_calidad = Math.max(indice_calidad, 0);
						else if (valor <= 200)
							indice_calidad = Math.max(indice_calidad, 1);
						else if (valor <= 350)
							indice_calidad = Math.max(indice_calidad, 2);
						else if (valor <= 500)
							indice_calidad = Math.max(indice_calidad, 3);
						else
							indice_calidad = 4;
					}

					// Dióxido de Nitrógeno NO2
					if (magnitud == 8) {
						valor_no2 = valor;
						if (valor <= 40)
							indice_calidad = Math.max(indice_calidad, 0);
						else if (valor <= 100)
							indice_calidad = Math.max(indice_calidad, 1);
						else if (valor <= 200)
							indice_calidad = Math.max(indice_calidad, 2);
						else if (valor <= 400)
							indice_calidad = Math.max(indice_calidad, 3);
						else
							indice_calidad = 4;
					}

					// Partículas < 2.5 µm PM2.5
					if (magnitud == 9) {
						valor_pm25 = valor;
						if (valor <= 10)
							indice_calidad = Math.max(indice_calidad, 0);
						else if (valor <= 20)
							indice_calidad = Math.max(indice_calidad, 1);
						else if (valor <= 25)
							indice_calidad = Math.max(indice_calidad, 2);
						else if (valor <= 50)
							indice_calidad = Math.max(indice_calidad, 3);
						else
							indice_calidad = 4;
					}

					// Partículas < 10 µm PM10
					if (magnitud == 10) {
						valor_pm10 = valor;
						if (valor <= 20)
							indice_calidad = Math.max(indice_calidad, 0);
						else if (valor <= 35)
							indice_calidad = Math.max(indice_calidad, 1);
						else if (valor <= 50)
							indice_calidad = Math.max(indice_calidad, 2);
						else if (valor <= 100)
							indice_calidad = Math.max(indice_calidad, 3);
						else
							indice_calidad = 4;
					}

					// Ozono O3
					if (magnitud == 14) {
						valor_o3 = valor;
						if (valor <= 100)
							indice_calidad = Math.max(indice_calidad, 0);
						else if (valor <= 200)
							indice_calidad = Math.max(indice_calidad, 1);
						else if (valor <= 350)
							indice_calidad = Math.max(indice_calidad, 2);
						else if (valor <= 500)
							indice_calidad = Math.max(indice_calidad, 3);
						else
							indice_calidad = 4;
					}

				});

				var colorCircle = "#6f6f6f";
				switch (indice_calidad) {
					case 0:
						colorCircle = "#50f0e6";
						break;
					case 1:
						colorCircle = "#50ccaa";
						break;
					case 2:
						colorCircle = "#f0e641";
						break;
					case 3:
						colorCircle = "#ff5050";
						break;
					case 4:
						colorCircle = "#7d2181";
						break;
				} 
				var circle = L.circle([latitud, longitud], {radius: 200, color: colorCircle, opacity: 1, fillOpacity: 0.6}).addTo(map);

				circle.bindPopup(new L.popup().setContent('<div>' + nom_estacion + '<br/>Indice de calidad: ' + indice_calidad + '<br/>SO2: ' + valor_so2 + '<br/>NO2: ' + valor_no2 + '<br/>PM2.5: ' + valor_pm25 + '<br/>PM10: ' + valor_pm10 + '<br/>O3: ' + valor_o3 + '</div>'));

				circles.push(circle);
			});
		});
	});

	// Cargarmos el fichero con los datos meteorológicos para el año seleccionado
	var file_name = "./data/meteo" + fecha.getFullYear().toString().substr(-2) + ".csv";
	$("#meteo").empty();
	d3.dsv(";", file_name).then(function(data) {
		var filteredData = data.filter(function(row, i) {
			var myMonth = ("0" + (fecha.getMonth() + 1)).slice(-2);
			return row.MES == myMonth && row.ESTACION == '102' && (row.MAGNITUD == '81' || row.MAGNITUD == '83' || row.MAGNITUD == '89');
		});

		filteredData.forEach(function(item) {
			var magnitud = item.MAGNITUD;
			var myDay = ("0" + fecha.getDate()).slice(-2);
			var valor = item['D' + myDay];

			if (magnitud == '81')
				$("#meteo").append("Velocidad del viento: " + valor + "<br/>");
			else if (magnitud == '83')
				$("#meteo").append("Temperatura: " + valor + "<br/>");
			else if (magnitud == '89')
				$("#meteo").append("Precipitación: " + valor + "<br/>");
		});

		$("#meteo").slideDown(1000);
	});
}