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
			var file_name = "./data/datos" + fecha.getFullYear() + "12.csv";
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

				circle.bindPopup(new L.popup().setContent('<div class="circlePopup"><b>' + nom_estacion + '</b><br/><b>Indice de calidad:</b> ' + aqi_text + '<br/><b>Di&oacute;xido de Azufre (SO<sub>2</sub>):</b> ' + valor_so2 + '&nbsp;&#956;g/m<sup>3</sup><br/><b>Di&oacute;xido de Nitr&oacute;geno (NO<sub>2</sub>):</b> ' + valor_no2 + '&nbsp;&#956;g/m<sup>3</sup><br/><b>Part&iacute;culas &lt; 2.5 &#956;m (PM2.5):</b> ' + valor_pm25 + '&nbsp;&#956;g/m<sup>3</sup><br/><b>Part&iacute;culas &lt; 10 &#956;m (PM10):</b> ' + valor_pm10 + '&nbsp;&#956;g/m<sup>3</sup><br/><b>Ozono (O<sub>3</sub>):</b> ' + valor_o3 + '&nbsp;&#956;g/m<sup>3</sup></div>'));

				circles.push(circle);
			});
		});
	});

	// Cargarmos el fichero con los datos meteorológicos para el año seleccionado
	var file_name = "./data/meteo" + fecha.getFullYear().toString().substr(-2) + ".csv";
	$("#meteo").empty();
	$("#meteo").append("<b>Datos meteorol&oacute;gicos</b><br/><br/>");
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
				$("#meteo").append("<b>Velocidad del viento:</b> " + valor + "<br/>");
			else if (magnitud == '83')
				$("#meteo").append("<b>Temperatura:</b> " + valor + "<br/>");
			else if (magnitud == '89')
				$("#meteo").append("<b>Precipitación:</b> " + valor + "<br/>");
		});

		renderTempMonth(myMonth);

		$("#meteo").slideDown(1000);
	});
}


function renderTempMonth(mes) {
	$("#meteo").append("<br/><br/><b>Temperatura a lo largo del mes:</b><br/><br/>");

	// set the dimensions and margins of the graph
	const margin = {top: 10, right: 40, bottom: 90, left: 20},
	    width = 340 - margin.left - margin.right,
	    height = 250 - margin.top - margin.bottom;

	// append the svg object to the body of the page
/*	const svg = d3.select("#meteo")
	  .append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", `translate(${margin.left},${margin.top})`);*/

	// Parse the Data
	//d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv").then( function(data) {
	d3.dsv(";", "./data/meteo21.csv").then(function(data) {

	var filteredData = data.filter(function(row, i) {
		return row.MES == mes && row.ESTACION == '102' && (row.MAGNITUD == '83' || row.MAGNITUD == '89');
	});

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





chart = {
  const svg = d3.select("#meteo").append("svg")
      .attr("viewBox", [0, 0, width, height]);

  svg.append("g")
      .attr("fill", "steelblue")
      .attr("fill-opacity", 0.8)
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("x", d => x(d.year))
      .attr("width", x.bandwidth())
      .attr("y", d => y1(d.sales))
      .attr("height", d => y1(0) - y1(d.sales));

  svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "currentColor")
      .attr("stroke-miterlimit", 1)
      .attr("stroke-width", 3)
      .attr("d", line(data));

  svg.append("g")
      .attr("fill", "none")
      .attr("pointer-events", "all")
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("x", d => x(d.year))
      .attr("width", x.bandwidth())
      .attr("y", 0)
      .attr("height", height)
    .append("title")
      .text(d => `${d.year}
${d.sales.toLocaleString("en")} new cars sold
${d.efficiency.toLocaleString("en")} mpg average fuel efficiency`);

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(y1Axis);

  svg.append("g")
      .call(y2Axis);

  return svg.node();
}


line = d3.line()
    .x(d => x(d.key) + x.bandwidth() / 2)
    .y(d => y2(d.value))

x = d3.scaleBand()
    .domain(data.map(d => d.key))
    .rangeRound([margin.left, width - margin.right])
    .padding(0.1)

y1 = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.precipitacion)])
    .rangeRound([height - margin.bottom, margin.top])

y2 = d3.scaleLinear()
    .domain(d3.extent(data, d => d.value))
    .rangeRound([height - margin.bottom, margin.top])

xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x)
        .tickValues(d3.ticks(...d3.extent(x.domain()), width / 40).filter(v => x(v) !== undefined))
        .tickSizeOuter(0))

y1Axis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .style("color", "steelblue")
    .call(d3.axisLeft(y1).ticks(null, "s"))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(data.y1))

y2Axis = g => g
    .attr("transform", `translate(${width - margin.right},0)`)
    .call(d3.axisRight(y2))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", margin.right)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .text(data.y2))






/*	var x = d3.scaleBand()
	  .range([ 0, width ])
	  .domain(nest.map(function(d) { return d.key; }))
	  .padding(0.1);
	svg.append("g")
	  .attr("transform", "translate(0," + height + ")")
	  .call(d3.axisBottom(x).tickFormat(""))
	  .selectAll("text")
	    //.attr("transform", "translate(-10,0)rotate(-45)")
	    .style("text-anchor", "end");

	// Add Y axis
	var y = d3.scaleLinear()
	  .domain([0, 35])
	  .range([ height, 0]);
	svg.append("g")
	  .call(d3.axisLeft(y));

	// Bars
	svg.selectAll("mybar")
	  .data(nest)
	  .enter()
	  .append("rect")
	    .attr("x", function(d) { return x(d.key); })
	    .attr("y", function(d) { return y(d.value); })
	    .attr("width", x.bandwidth())
	    .attr("height", function(d) { return height - y(d.value); })
	    .attr("fill", "#69b3a2")
*/
	}) 
}