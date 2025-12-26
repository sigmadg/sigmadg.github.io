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
		
		//Genero la tarjeta de lotería del jugador
		tarjeta = generaTarjeta();
		numeros_tarjeta = leerTarjeta(tarjeta);
		
		//Muestro el div del número ganador.
		muestraNumero();
		
		//Muestro la tarjeta
		dibujaTarjeta(tarjeta);
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
	$("#derecho").append("<h2 style='color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); font-size: 2em; margin-bottom: 20px;'>🎰 Número Ganador 🎰</h2>");
	$("#derecho").append("<div id='contador-sorteos' style='color: white; font-size: 1.2em; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);'>Sorteos: 0 / " + sorteosTotales + "</div>");
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
	
	//Agregar botón de reiniciar
	$("#datos").append("<button id='reset' class='btn btn-default'><b>REINICIAR</b></button>");
    $("#reset").click(resetear);
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
		"🎉 ¡FELICIDADES! ¡GANASTE! 🎉<br>¡Eres el campeón de la suerte! 🍀",
		"🎊 ¡BINGO! ¡ACERTASTE! 🎊<br>¡La fortuna está de tu lado! 💰",
		"🏆 ¡GANADOR! ¡GANADOR! 🏆<br>¡Tienes más suerte que un gato con 7 vidas! 🐱",
		"🎰 ¡JACKPOT! ¡LO LOGASTE! 🎰<br>¡Eres más afortunado que un trébol de 4 hojas! ☘️",
		"💎 ¡FELICIDADES! ¡TRIUNFASTE! 💎<br>¡Tienes la suerte de un leprechaun! 🍀",
		"🌟 ¡ÉXITO TOTAL! ¡GANASTE! 🌟<br>¡Tu suerte brilla más que las estrellas! ⭐",
		"🎁 ¡PREMIO GANADO! ¡FELICIDADES! 🎁<br>¡Eres el rey/la reina de la suerte! 👑",
		"🎯 ¡BULLSEYE! ¡ACERTASTE! 🎯<br>¡Tienes puntería de francotirador! 🎪"
	];
	
	var mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)];
	var premio = calcularPremio();
	
	// Crear mensaje en la página
	var mensajeDiv = document.createElement("div");
	mensajeDiv.id = "mensaje-ganador";
	mensajeDiv.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); " +
		"background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); " +
		"padding: 40px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); " +
		"z-index: 10000; text-align: center; color: #1a1a1a; font-size: 1.5em; " +
		"font-weight: bold; border: 4px solid #ffd700; max-width: 500px; animation: aparecerMensaje 0.5s ease-out;";
	mensajeDiv.innerHTML = "<div style='font-size: 2em; margin-bottom: 20px;'>" + mensajeAleatorio + "</div>" +
		"<div style='font-size: 1.2em; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.3); border-radius: 10px;'>" +
		"💰 Premio: " + premio + " 💰</div>" +
		"<button onclick='document.getElementById(\"mensaje-ganador\").remove(); resetear();' " +
		"style='margin-top: 20px; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); " +
		"color: white; border: none; border-radius: 25px; font-size: 1em; font-weight: bold; cursor: pointer;'>Jugar de Nuevo</button>";
	
	document.body.appendChild(mensajeDiv);
}

/**
 * Muestra mensaje cuando terminan los sorteos sin ganar
 */
function mostrarFinJuego() {
	if (haGanado) return; // Si ya ganó, no mostrar este mensaje
	
	var mensajeDiv = document.createElement("div");
	mensajeDiv.id = "mensaje-fin";
	mensajeDiv.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); " +
		"background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); " +
		"padding: 40px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); " +
		"z-index: 10000; text-align: center; color: white; font-size: 1.3em; " +
		"font-weight: bold; border: 4px solid rgba(255,255,255,0.3); max-width: 500px; animation: aparecerMensaje 0.5s ease-out;";
	mensajeDiv.innerHTML = "<div style='font-size: 1.8em; margin-bottom: 20px;'>😔 Se acabaron los sorteos</div>" +
		"<div style='font-size: 1em; margin-top: 20px; opacity: 0.9;'>No te desanimes, ¡la próxima vez será! 🍀</div>" +
		"<button onclick='document.getElementById(\"mensaje-fin\").remove(); resetear();' " +
		"style='margin-top: 20px; padding: 12px 30px; background: rgba(255,255,255,0.2); " +
		"color: white; border: 2px solid white; border-radius: 25px; font-size: 1em; font-weight: bold; cursor: pointer;'>Intentar de Nuevo</button>";
	
	document.body.appendChild(mensajeDiv);
}

/**
 * Calcula el premio según la apuesta
 * @returns {number} resultado Devuelve el resultado del premio
 */
function calcularPremio(){
	// Premio = apuesta * 10 (puedes ajustar esta fórmula)
	var resultado = apuesta * 10;
	return resultado.toFixed(2);
}


