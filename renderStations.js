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
	d3.dsv(";", "./data/estaciones_control_aire.csv", "text/plain; charset=UTF-8").then(function(data) {
		data.forEach(function(d) {
			var latitud = d.LATITUD;
			var longitud = d.LONGITUD;
			var estacion = d.CODIGO_CORTO;
			var nom_estacion = d.ESTACION

			// Cargarmos el fichero con los datos para el año seleccionado
			var file_name = "./data/datos" + fecha.getFullYear() + "12.csv";
			d3.dsv(";", file_name).then(function(data) {
				var filteredData = data.filter(function(row, i) {
					var myMonth = ("0" + (fecha.getMonth() + 1)).slice(-2);
					return row.MES == myMonth && row.ESTACION == estacion && (row.MAGNITUD == '1' || row.MAGNITUD == '8' || row.MAGNITUD == '9' || row.MAGNITUD == '10' || row.MAGNITUD == '14');
				});

				var indice_calidad = 0;
				var valor_so2 = "No disponible";
				var valor_no2 = "No disponible";
				var valor_pm25 = "No disponible";
				var valor_pm10 = "No disponible";
				var valor_o3 = "No disponible";

				// Para cada coponente, guardamos su valor y actualizamos el índice de calidad del aire
				filteredData.forEach(function(item) {
					var magnitud = item.MAGNITUD;
					var myDay = ("0" + fecha.getDate()).slice(-2);
					var valor = item['D' + myDay];

					// Dióxido de Azufre SO2
					if (magnitud == 1) {
						valor_so2 = parseInt(valor, 10) + '&nbsp;&#956;g/m<sup>3</sup>';
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
						valor_no2 = parseInt(valor, 10) + '&nbsp;&#956;g/m<sup>3</sup>';
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
						valor_pm25 = parseInt(valor, 10) + '&nbsp;&#956;g/m<sup>3</sup>';
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
						valor_pm10 = parseInt(valor, 10) + '&nbsp;&#956;g/m<sup>3</sup>';
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
						valor_o3 = parseInt(valor, 10) + '&nbsp;&#956;g/m<sup>3</sup>';
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

				// Añadimos el círculo correspondiente a la estación con los datos correspondientes
				var colorCircle = "#6f6f6f";
				var aqi_text = "";
				switch (indice_calidad) {
					case 0:
						colorCircle = "#50f0e6";
						aqi_text = "Muy bueno";
						break;
					case 1:
						colorCircle = "#50ccaa";
						aqi_text = "Bueno";
						break;
					case 2:
						colorCircle = "#f0e641";
						aqi_text = "Regular";
						break;
					case 3:
						colorCircle = "#ff5050";
						aqi_text = "Malo";
						break;
					case 4:
						colorCircle = "#7d2181";
						aqi_text = "Muy malo";
						break;
				} 
				var circle = L.circle([latitud, longitud], {radius: 200, color: colorCircle, opacity: 1, fillOpacity: 0.6}).addTo(map);

				circle.bindPopup(new L.popup().setContent('<div class="circlePopup"><span class="titulo_estacion">' + nom_estacion + '</span><br/><b>Indice de calidad:</b> ' + aqi_text + '<br/><b>Di&oacute;xido de Azufre (SO<sub>2</sub>):</b> ' + valor_so2 + '<br/><b>Di&oacute;xido de Nitr&oacute;geno (NO<sub>2</sub>):</b> ' + valor_no2 + '<br/><b>Part&iacute;culas &lt; 2.5 &#956;m (PM2.5):</b> ' + valor_pm25 + '<br/><b>Part&iacute;culas &lt; 10 &#956;m (PM10):</b> ' + valor_pm10 + '<br/><b>Ozono (O<sub>3</sub>):</b> ' + valor_o3 + '</div>'));

				circles.push(circle);
			});
		});
	});

	// Cargarmos el fichero con los datos meteorológicos para el año seleccionado
	var file_name = "./data/meteo" + fecha.getFullYear().toString().substr(-2) + ".csv";

	// Borramos los datos anteriores
	$("#meteo").empty();

	// Cargamos la información
	$("#meteo").append("<b>Datos meteorol&oacute;gicos del día:</b><br/><br/>");
	d3.dsv(";", file_name).then(function(data) {
		var myMonth = ("0" + (fecha.getMonth() + 1)).slice(-2);

		var filteredData = data.filter(function(row, i) {
			return row.MES == myMonth && row.ESTACION == '102' && (row.MAGNITUD == '81' || row.MAGNITUD == '83' || row.MAGNITUD == '89');
		});

		filteredData.forEach(function(item) {
			var magnitud = item.MAGNITUD;
			var myDay = ("0" + fecha.getDate()).slice(-2);
			var valor = item['D' + myDay];

			if (magnitud == '81')
				$("#meteo").append("<b>Velocidad del viento:</b> " + parseInt(valor, 10) + "<br/>");
			else if (magnitud == '83')
				$("#meteo").append("<b>Temperatura:</b> " + parseInt(valor, 10) + "<br/>");
			else if (magnitud == '89')
				$("#meteo").append("<b>Precipitación:</b> " + parseInt(valor, 10) + "<br/>");
		});

		// Dibujamos las gráficas de la preciptación y temperaturas mensual
		renderTempMonth(myMonth);

		$("#meteo").slideDown(1000);
	});
}

// La siguietne función se encarga de dibujar una gráfica que combina las precipiataciones y las
// temperaturas de un mes que se pasa por parámetro
function renderTempMonth(mes) {
	$("#meteo").append("<br/><br/><b>Temperatura y precipiationes a lo largo del mes:</b><br/><br/>");

	// Dimensiones del gráfico
	const margin = {top: 10, right: 60, bottom: 40, left: 20},
		  width = 340 - margin.left - margin.right,
		  height = 250 - margin.top - margin.bottom;

	// Añadimos el objeto svg a la página
	const svg = d3.select("#meteo")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

	// Cargamos el fichero con los datos meteorológicos
	d3.dsv(";", "./data/meteo21.csv").then(function(data) {

	var filteredData = data.filter(function(row, i) {
		return row.MES == mes && row.ESTACION == '102' && (row.MAGNITUD == '83' || row.MAGNITUD == '89');
	});

	// Guardamos los datos en un objeto en forma de tuplas clave, valor temperatura y valor precipitación
	// la calve será cada uno de los días del mes.
	var nestTemp = [];
	var nestPrec = [];
	var nest = [];
	var keys = ['D01','D02','D03','D04','D05','D06','D07','D08','D09','D10','D11','D11','D12','D13','D14','D15','D16','D17','D18','D19','D20','D21','D22','D23','D24','D25','D26','D27','D28','D29','D30','D31'];
	filteredData.forEach(function(d) {
		if (d.MAGNITUD == '83')
			keys.forEach(function (item) {
				var valor = d[item];
				var obj = {
					key: item,
					value: valor
				}
				nestTemp.push(obj);
			})
		else if (d.MAGNITUD == '89')
			keys.forEach(function (item) {
				var valor = d[item];
				var obj = {
					key: item,
					precipitacion: valor
				}
				nestPrec.push(obj);
			})
	});

	nest = nestTemp.map((item, i) => Object.assign({}, item, nestPrec[i]));

	// Creamos el eje x
	var x = d3.scaleBand()
	  .range([ 0, width ])
	  .domain(nest.map(function(d) { return d.key; }))
	  .padding(0.1);
	svg.append("g")
	  .attr("transform", "translate(0," + height + ")")
	  .call(d3.axisBottom(x).tickFormat(""))
	  .selectAll("text")
	  .style("text-anchor", "end");

	// Eje y de las temperaturas
	var y = d3.scaleLinear()
	  .domain([0, 35])
	  .range([ height, 0]);
	svg.append("g")
	  .call(d3.axisLeft(y));

	// Eje y para las precipitaciones
	var y2 = d3.scaleLinear()
	  .domain([0, 25])
	  .range([height, 0]);
	svg.append("g")
	  .attr("transform", "translate(" + width + " ,0)")
	  .call(d3.axisRight(y2));

	// Barras para las precipitaciones
	svg.selectAll("mybar")
	  .data(nest)
	  .enter()
	  .append("rect")
	    .attr("x", function(d) { return x(d.key); })
	    .attr("y", function(d) { return y2(d.precipitacion); })
	    .attr("width", x.bandwidth())
	    .attr("height", function(d) { return height - y2(d.precipitacion); })
	    .attr("fill", "#69b3a2")

    // Gráfico de líneas para la temperatura
    svg.append("path")
      .datum(nest)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.key) })
        .y(function(d) { return y(d.value) })
        )

	})
}