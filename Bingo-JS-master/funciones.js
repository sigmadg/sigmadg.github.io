/*********************************    
Autor: Jesús Gamero Méndez  
Fecha creación: 01/03/2017    
Última modificación: 06/03/2017    
Versión: 1.00 
***********************************/ 

var tarjeta = null; // Tarjeta de lotería del jugador
var apuesta = 0; // Variable donde almaceno la apuesta (también indica número de sorteos)
var intervalo; // Intervalo de tiempo
var velocidad; // Velocidad del intervalo pasada en el select
var numeros_tarjeta = []; // Array que guarda los números de la tarjeta
var haGanado = false; // Indica si el jugador ha ganado
var sorteosRealizados = 0; // Contador de sorteos realizados
var sorteosTotales = 0; // Total de sorteos a realizar

/**
 * Inicia la Lotería y todas las funciones relacionadas
 */
function comenzar() {
	
		// Inicializar variables
		haGanado = false;
		sorteosRealizados = 0;
	
		//Guardo en variables los datos del formulario lateral
		apuesta = parseFloat(document.getElementById("apuesta").value);
	    velocidad = parseInt(document.getElementById("velo").value);
	
		// Validar valores
		if (isNaN(apuesta) || apuesta <= 0) {
			alert("La apuesta debe ser mayor que 0");
			return;
		}
		
		// El número de apuestas también indica cuántos sorteos se realizarán
		sorteosTotales = Math.floor(apuesta);
		
		// Limpiar contenido anterior si existe
		$("#derecho").empty();
		
		//Genero la tarjeta de lotería del jugador
		tarjeta = generaTarjeta();
		numeros_tarjeta = leerTarjeta(tarjeta);
		
		//Muestro el div del número ganador.
		muestraNumero();
		
		//Muestro la tarjeta
		dibujaTarjeta(tarjeta);
		
		// Cambiar texto del botón a "REINICIAR" si ya existe
		var btnReset = document.getElementById("reset");
		if (btnReset) {
			btnReset.innerHTML = "<b>REINICIAR</b>";
		}
		
		iniciar();
}

/**
 * Inicia intervalo que muestra números aleatorios según la velocidad establecida.
 */
function iniciar() {
	intervalo = setInterval(sacarNumeroAleatorio, velocidad);
}

/**
 * Para el intervalo y las bolas dejan de salir
 */
function parar() {
	//Para las bolas
	clearInterval(intervalo);
}
/**
 * Recarga la página
 */
function resetear(){
	window.location.reload();  
}

/**
* Devuelve numeros aleatorios de un intervalo
* @param {integer} inicio numero de incio
* @param {integer} fin fin del intervalo
* @param {integer} numero cantidad de numeros aleatorios a generar
* @returns {integer} array de numeros aleatorios
*/
function aleatorio(inicio, fin, numero)
{
	var numeros = [];
	var i = 0;
	if(!numero || numero<=0)
	{
		return Math.floor(Math.random()*(fin-inicio+1)) + inicio;
	}
	else
	{
		while(numeros.length < numero)
		{
			var aleatorios = Math.floor(Math.random()*(fin-inicio+1)) + inicio;
			if(numeros.indexOf(aleatorios) == -1)
			{
				numeros.push(aleatorios);
			}
		}
		return numeros.sort(function(a,b){return a-b;}); //Ordeno los numeros aleatorios que me han dado como resultados
	}
}

/**
 * Genera un número aleatorio de lotería (1-99) y lo muestra
 */
function sacarNumeroAleatorio() {
  // Verificar si ya se alcanzó el número máximo de sorteos
  if (sorteosRealizados >= sorteosTotales) {
    parar();
    mostrarFinJuego();
    return;
  }
  
  // Incrementar contador de sorteos
  sorteosRealizados++;
  
  // Actualizar contador visual
  actualizarContador();
  
  // Generar número aleatorio entre 1 y 99
  var numeroAleatorio = Math.floor(Math.random() * 99) + 1;
  
  // Verificar que el elemento del número existe antes de actualizarlo
  var elementoNumero = document.getElementById("numero-ganador");
  if (!elementoNumero) {
    console.error("Error: elemento 'numero-ganador' no encontrado en el DOM");
    return;
  }
  
  // Animación: primero mostrar números aleatorios rápidos
  animarNumero(elementoNumero, numeroAleatorio);
  
  // Verificar si el número está en la tarjeta
  verificarGanador(numeroAleatorio);
}

/**
 * Anima el número mostrando números aleatorios antes del número final
 */
function animarNumero(elemento, numeroFinal) {
  var duracion = Math.min(velocidad * 0.8, 1000); // 80% de la velocidad o máximo 1 segundo
  var pasos = 10;
  var paso = duracion / pasos;
  var contador = 0;
  
  // Agregar clase de animación
  elemento.classList.add("numero-animando");
  
  var intervaloAnimacion = setInterval(function() {
    if (contador < pasos - 1) {
      // Mostrar número aleatorio entre 1 y 99
      elemento.innerHTML = Math.floor(Math.random() * 99) + 1;
      contador++;
    } else {
      // Mostrar el número final
      elemento.innerHTML = numeroFinal;
      elemento.classList.remove("numero-animando");
      clearInterval(intervaloAnimacion);
    }
  }, paso);
}

/**
 * Verifica si el número está en la tarjeta y marca si existe
 */
function verificarGanador(numero) {
  if (!tarjeta || haGanado) return;
  
  var encontrado = false;
  
  for (var i = 0; i < tarjeta.length; i++) {
    for (var j = 0; j < tarjeta[i].length; j++) {
      if (tarjeta[i][j].valor === numero) {
        encontrado = true;
        tarjeta[i][j].marca = true;
        var celda = document.getElementById(i + "/" + j);
        if (celda) {
          celda.classList.add('marca');
          celda.classList.add('ganador');
        }
        // ¡Ganaste!
        haGanado = true;
        parar();
        mostrarGanador();
        break;
      }
    }
    if (encontrado) break;
  }
}

/**
 * Genera el div donde se mostrará el número ganador
 */
function muestraNumero() {
	$("#derecho").append("<div style='text-align: center; margin-top: 20px;'>");
	$("#derecho").append("<h2 style='font-size: 2em; margin-bottom: 20px; background: linear-gradient(90deg, #ff014f 0%, #23f0ec 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-shadow: 0 0 20px rgba(255, 1, 79, 0.5);'>🎰 Número Ganador 🎰</h2>");
	$("#derecho").append("<div id='contador-sorteos' style='color: #c4cfde; font-size: 1.2em; margin-bottom: 10px;'>Sorteos: 0 / " + sorteosTotales + "</div>");
	$("#derecho").append("<div id='numero-ganador'>?</div>");
	$("#derecho").append("</div>");
}

/**
 * Actualiza el contador de sorteos
 */
function actualizarContador() {
	var contador = document.getElementById("contador-sorteos");
	if (contador) {
		contador.innerHTML = "Sorteos: " + sorteosRealizados + " / " + sorteosTotales;
	}
}

/**
 * Genera una tarjeta de lotería 5x5 con números aleatorios del 1 al 99
 * @returns {Array} Contiene un array con los numeros de la tarjeta
 */
function generaTarjeta() {
	// Creo una tarjeta 5x5
	var tarjeta = [[],[],[],[],[]];
	var numerosUsados = [];
	
	// Generar 25 números únicos entre 1 y 99
	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < 5; j++) {
			var numero;
			do {
				numero = Math.floor(Math.random() * 99) + 1;
			} while (numerosUsados.indexOf(numero) !== -1);
			
			numerosUsados.push(numero);
			tarjeta[i][j] = {
				'valor': numero,
				'marca': false
			};
		}
	}
	
	return tarjeta;
}

/**
 * Dibuja una tarjeta de lotería de un array pasado como parámetro
 * @param {Array} tarjeta Contiene un array con los numeros de la tarjeta
 */
function dibujaTarjeta(tarjeta)
{
	//Generamos la tabla
	var tabla = document.createElement("table");
 	tabla.setAttribute("id", "tarjeta");
 	tabla.setAttribute("border", "3");
	tabla.classList.add('carton');
	//Genero las filas
	for(var i=0;i<tarjeta.length;i++){
		var fila = document.createElement("tr");
		//Genero las columnas
		for(var j=0;j<tarjeta[i].length;j++){
			var celda = document.createElement("td");
			celda.setAttribute("id", i + "/" + j);
			celda.innerHTML = tarjeta[i][j].valor;
			fila.appendChild(celda); //Añadimos la celda a la fila		
		}
		tabla.appendChild(fila); //Añadimos la fila a la tarjeta
	}
	//Agregamos la tarjeta al div correspondiente
	var sitio = document.getElementById("derecho");
	sitio.appendChild(tabla);
	
	//Agregar botón de iniciar/reiniciar (solo si no existe)
	if (document.getElementById("reset") === null) {
		$("#datos").append("<hr><button id='reset' class='btn btn-default'><b>INICIAR</b></button>");
		$("#reset").click(function() {
			if (intervalo) {
				// Si ya hay un intervalo, reiniciar
				resetear();
			} else {
				// Si no hay intervalo, iniciar el juego
				comenzar();
			}
		});
	}
}

// Función marcar eliminada - ya no es necesaria, se marca automáticamente

/**
 * Lee la tarjeta y guarda en un array los números de la tarjeta
 * @param {Array} tarjeta tarjeta seleccionada
 */
function leerTarjeta(tarjeta){
	var lista=[];
	//Recorro las filas y las columnas
	for (var i = 0; i < tarjeta.length; i++) {
		for (var j = 0; j < tarjeta[i].length; j++) {
			lista.push(tarjeta[i][j].valor);
		}
	}
	return lista.sort(function(a,b){return a-b;}); //Ordenamos el resultado
}

/**
 * Muestra el mensaje de ganador cuando se encuentra el número en la tarjeta
 */
function mostrarGanador(){
	parar();
	
	// Mensajes chuscos aleatorios
	var mensajes = [
		"🎉 ¡FELICIDADES! ¡GANASTE! 🎉",
		"🎊 ¡BINGO! ¡ACERTASTE! 🎊",
		"🏆 ¡GANADOR! ¡GANADOR! 🏆",
		"🎰 ¡JACKPOT! ¡LO LOGASTE! 🎰",
		"💎 ¡FELICIDADES! ¡TRIUNFASTE! 💎",
		"🌟 ¡ÉXITO TOTAL! ¡GANASTE! 🌟",
		"🎁 ¡PREMIO GANADO! ¡FELICIDADES! 🎁",
		"🎯 ¡BULLSEYE! ¡ACERTASTE! 🎯"
	];
	
	// Premios profesionales (saludos, abrazos, etc.)
	var premios = [
		"🤗 Un cálido abrazo virtual",
		"👋 Un cordial saludo",
		"🙏 Un sincero agradecimiento",
		"💝 Un gesto de aprecio",
		"🤝 Un apretón de manos amistoso",
		"😊 Una sonrisa genuina",
		"❤️ Un mensaje de cariño",
		"✨ Un deseo de éxito",
		"🌹 Un reconocimiento especial",
		"🎖️ Una mención de honor",
		"🏅 Un reconocimiento a tu suerte",
		"💐 Un gesto de felicitación",
		"🙌 Un reconocimiento a tu logro",
		"👏 Una ovación por tu éxito",
		"🌟 Un reconocimiento a tu brillantez"
	];
	
	var mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)];
	var premioAleatorio = premios[Math.floor(Math.random() * premios.length)];
	
	// Crear overlay oscuro de fondo
	var overlay = document.createElement("div");
	overlay.id = "overlay-ganador";
	overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; " +
		"background: rgba(0,0,0,0.7); z-index: 9999; backdrop-filter: blur(5px);";
	overlay.onclick = function() {
		document.getElementById("mensaje-ganador").remove();
		overlay.remove();
		resetear();
	};
	document.body.appendChild(overlay);
	
	// Crear mensaje en la página con mejor UI
	var mensajeDiv = document.createElement("div");
	mensajeDiv.id = "mensaje-ganador";
	mensajeDiv.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); " +
		"background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); " +
		"padding: 30px 40px; border-radius: 25px; box-shadow: 0 15px 50px rgba(0,0,0,0.6), 0 0 0 3px rgba(255,255,255,0.3); " +
		"z-index: 10000; text-align: center; color: #1a1a1a; " +
		"max-width: 450px; min-width: 350px; animation: aparecerMensaje 0.5s ease-out;";
	
	mensajeDiv.innerHTML = 
		"<div style='font-size: 1.3em; margin-bottom: 15px; font-weight: bold; line-height: 1.4;'>" + mensajeAleatorio + "</div>" +
		"<div style='font-size: 0.95em; margin: 15px 0; padding: 12px 20px; background: rgba(255,255,255,0.4); " +
		"border-radius: 12px; border: 2px solid rgba(255,255,255,0.6); line-height: 1.5;'>" +
		"<div style='font-size: 0.9em; margin-bottom: 8px; opacity: 0.9;'>Tu premio:</div>" +
		"<div style='font-size: 1.1em; font-weight: 600;'>" + premioAleatorio + "</div></div>" +
		"<button onclick='document.getElementById(\"mensaje-ganador\").remove(); document.getElementById(\"overlay-ganador\").remove(); resetear();' " +
		"style='margin-top: 20px; padding: 10px 25px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); " +
		"color: white; border: none; border-radius: 20px; font-size: 0.9em; font-weight: 600; cursor: pointer; " +
		"transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(102, 126, 234, 0.4);' " +
		"onmouseover='this.style.transform=\"scale(1.05)\"; this.style.boxShadow=\"0 6px 15px rgba(102, 126, 234, 0.6)\";' " +
		"onmouseout='this.style.transform=\"scale(1)\"; this.style.boxShadow=\"0 4px 10px rgba(102, 126, 234, 0.4)\";'>Jugar de Nuevo</button>";
	
	document.body.appendChild(mensajeDiv);
}

/**
 * Muestra mensaje cuando terminan los sorteos sin ganar
 */
function mostrarFinJuego() {
	if (haGanado) return; // Si ya ganó, no mostrar este mensaje
	
	// Crear overlay oscuro de fondo
	var overlay = document.createElement("div");
	overlay.id = "overlay-fin";
	overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; " +
		"background: rgba(0,0,0,0.7); z-index: 9999; backdrop-filter: blur(5px);";
	overlay.onclick = function() {
		document.getElementById("mensaje-fin").remove();
		overlay.remove();
		resetear();
	};
	document.body.appendChild(overlay);
	
	var mensajeDiv = document.createElement("div");
	mensajeDiv.id = "mensaje-fin";
	mensajeDiv.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); " +
		"background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); " +
		"padding: 30px 40px; border-radius: 25px; box-shadow: 0 15px 50px rgba(0,0,0,0.6), 0 0 0 3px rgba(255,255,255,0.3); " +
		"z-index: 10000; text-align: center; color: white; " +
		"max-width: 450px; min-width: 350px; animation: aparecerMensaje 0.5s ease-out;";
	mensajeDiv.innerHTML = 
		"<div style='font-size: 1.2em; margin-bottom: 15px; font-weight: 600; line-height: 1.4;'>😔 Se acabaron los sorteos</div>" +
		"<div style='font-size: 0.9em; margin-top: 15px; opacity: 0.95; line-height: 1.5;'>No te desanimes, ¡la próxima vez será! 🍀</div>" +
		"<button onclick='document.getElementById(\"mensaje-fin\").remove(); document.getElementById(\"overlay-fin\").remove(); resetear();' " +
		"style='margin-top: 20px; padding: 10px 25px; background: rgba(255,255,255,0.2); " +
		"color: white; border: 2px solid rgba(255,255,255,0.5); border-radius: 20px; font-size: 0.9em; font-weight: 600; cursor: pointer; " +
		"transition: all 0.3s ease;' " +
		"onmouseover='this.style.background=\"rgba(255,255,255,0.3)\"; this.style.transform=\"scale(1.05)\";' " +
		"onmouseout='this.style.background=\"rgba(255,255,255,0.2)\"; this.style.transform=\"scale(1)\";'>Intentar de Nuevo</button>";
	
	document.body.appendChild(mensajeDiv);
}

// Función calcularPremio eliminada - ya no se usa dinero, solo saludos profesionales


