/*********************************    
Autor: Jesús Gamero Méndez  
Fecha creación: 01/03/2017    
Última modificación: 06/03/2017    
Versión: 1.00 
***********************************/ 

var carton = null; // Cartón del jugador
var apuesta = 0; // Variable donde almaceno la apuesta
var intervalo; // Intervalo de tiempo
var velocidad; // Velocidad del intervalo pasada en el select
var aciertos = 0; // Número de aciertos del cartón
var bombo = []; // Array del Bombo donde van a ir las bolas
var hanSalido = []; // Números que ya han salido del bombo
var numeros_carton = []; // Array que guarda los números del cartón sin los huecos

/**
 * Inicia el Bingo y todas las funciones realacionadas
 */
function comenzar() {
	
		// Inicializar arrays y variables
		hanSalido = [];
		aciertos = 0;
	
		//Guardo en variables los datos del formulario lateral
		apuesta = parseFloat(document.getElementById("apuesta").value);
	    velocidad = parseInt(document.getElementById("velo").value);
	
		// Validar valores
		if (isNaN(apuesta) || apuesta <= 0) {
			alert("La apuesta debe ser mayor que 0");
			return;
		}
	
		//Relleno array bombo con los numeros
		llenarBombo();
		
		//Genero el cartón del jugador
		carton = generaCarton();
		numeros_carton = leerCarton(carton);
		
		//Muestro el div de la bola.
		muestraBola();
		
		//Oculto el div de información
		$("#info").css("display", "none");
		
		//Deshabilito el botón de comenzar
		document.getElementById("biniciar").disabled = true;
		
		//Muestro el cartón
		dibujaCarton(carton);
		iniciar();
}

/**
 * Inicia intervalo que muestra las volas según la velocidad establecida.
 */
function iniciar() {
	intervalo = setInterval(peticionAJAX,velocidad);
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
 * Literalmente llena el bomo/array con los numeros de las bolas
 */
function llenarBombo() {
  bombo = []; // Asegurar que el bombo esté vacío antes de llenarlo
  for(var i = 1; i <= 90; i++) {
    bombo.push(i);
  }
}

/**
 * Realiza la peticion ajax al archivo "bolas.php"
 * MODIFICADO: Ahora funciona sin PHP, usando JavaScript puro para GitHub Pages
 */
function peticionAJAX() {
  // En lugar de usar PHP, generamos el índice aleatorio directamente en JavaScript
  if (bombo.length > 0) {
    var indice = Math.floor(Math.random() * bombo.length);
    sacaBola(indice);
  } else {
    resetear();
    alert("Se han sacado todos los números");
  }
}

function sacaBola(indice) {
      // Verificar que el índice sea válido y que el bombo tenga elementos
      if (bombo.length === 0 || indice < 0 || indice >= bombo.length) {
        console.error("Error: índice inválido o bombo vacío", indice, bombo.length);
        return;
      }
      
      var nbola = bombo[indice];
      
      // Verificar que el elemento de la bola existe antes de actualizarlo
      var elementoBola = document.getElementById("bola");
      if (!elementoBola) {
        console.error("Error: elemento 'bola' no encontrado en el DOM");
        return;
      }
	  
	  //Guardo en un array los números que han salido
	  hanSalido.push(nbola);
	  
	  if (hanSalido.length <= 90){
		//Quito la bola del array
		  bombo.splice(indice, 1);
		  
		  // Animación: primero mostrar números aleatorios rápidos
		  animarBola(elementoBola, nbola);
		  
		  // Marcar el número en el cartón si existe
		  marcarNumeroEnCarton(nbola);
	  }
	  else
	  {
		  resetear();
		  alert("Se han sacado todos los números");
	  }
}

/**
 * Anima la bola mostrando números aleatorios antes del número final
 */
function animarBola(elemento, numeroFinal) {
  var duracion = Math.min(velocidad * 0.8, 1000); // 80% de la velocidad o máximo 1 segundo
  var pasos = 10;
  var paso = duracion / pasos;
  var contador = 0;
  
  // Agregar clase de animación
  elemento.classList.add("bola-animando");
  
  var intervaloAnimacion = setInterval(function() {
    if (contador < pasos - 1) {
      // Mostrar número aleatorio entre 1 y 90
      elemento.innerHTML = Math.floor(Math.random() * 90) + 1;
      contador++;
    } else {
      // Mostrar el número final
      elemento.innerHTML = numeroFinal;
      elemento.classList.remove("bola-animando");
      clearInterval(intervaloAnimacion);
    }
  }, paso);
}

/**
 * Marca automáticamente el número en el cartón si existe
 */
function marcarNumeroEnCarton(numero) {
  if (!carton) return;
  
  for (var i = 0; i < carton.length; i++) {
    for (var j = 0; j < carton[i].length; j++) {
      if (carton[i][j].valor === numero && !carton[i][j].marca) {
        carton[i][j].marca = true;
        var celda = document.getElementById(i + "/" + j);
        if (celda) {
          celda.classList.add('marca');
        }
        break;
      }
    }
  }
}

/**
 * Genera el div donde se mostrará la bola
 */
function muestraBola() {
	$("#derecho").append("<br><div id='bola'>?</div>");
	$("#derecho").append("<br><br>");
}

/**
 * Genera el array multidimensional con los numeros aleatorios y los huecos
 * @returns {Array} Contiene un array con los numeros de las filas y columnas y huecos
 */
function generaCarton() {
	//Creo un array del carton donde voy a gardar las tres filas con sus columnas
	var carton=[[],[],[]];
		for (var j = 0; j < 9; j++) {
			var columna;
			if(j==0){
				columna = aleatorio(10*j+1, 10*(j+1)-1, 3);}
			else if(j==8){
				columna = aleatorio(10*j, 10*(j+1), 3);}
			else{
				columna = aleatorio(10*j, 10*(j+1)-1, 3);}

			columna.sort(function(a,b){return a-b;});
			
			for(var i = 0; i < 3; i++)
			{
				carton[i][j] = {
					'valor': columna[i],
					'marca' : false
				}
			}
		};

		for (var i = 0; i < 3; i++) {
			var huecos = aleatorio(0,8,4);
			while(huecos.length>0)
			{
				//Cogo el primer numero aleatorio generado y a esa columna le pongo el valor -1
				carton[i][huecos.shift()].valor = -1;
			}	
		};
	return carton;
	}

/**
 * Dibuja un cartón de un array pasado como parámetro
 * @param {Array} carton Contiene un array con los numeros de las filas y columnas y huecos
 */
function dibujaCarton(carton)
{
	//Generamos la tabla
	var tabla = document.createElement("table");
 	tabla.setAttribute("id", "carton");
 	tabla.setAttribute("border", "3");
	tabla.classList.add('carton');
	//Genero las filas
	for(var i=0;i<carton.length;i++){
		var fila = document.createElement("tr");
		//Genero las columnas
		for(var j=0;j<carton[i].length;j++){
			var celda = document.createElement("td");
			celda.setAttribute("id", i + "/" + j);
			
			//Si la celda es -1 es que está hueca
			if(carton[i][j].valor === -1){
				celda.classList.add('hueco'); //Le asociamos la clase .hueco que tiene la imagen del bombo
			}
			else{
				celda.innerHTML = carton[i][j].valor;
				// Crear una función closure para mantener el contexto correcto
				(function(row, col) {
					celda.addEventListener("click", function(){marcar(row + "/" + col, carton);}, false);
				})(i, j);
			}
			fila.appendChild(celda); //Añadimos la celda a la fila		
		}
		tabla.appendChild(fila); //Añadimos la fila al carton
	}
	//Agregamos la carton al div correspondiente
	var sitio = document.getElementById("derecho");
	sitio.appendChild(tabla);
	
	//Dibujo los botones del bingo
	$("#derecho").append("<br><br><div id='bbingo'><button class='btn btn-default btn-lg'><b>¡Bingo!</b></button></div>");
    $("#bbingo button").click(cantaBingo);
	$("#datos").append("<button id='reset' class='btn btn-default'><b>REINICIAR</b></button>");
    $("#reset").click(resetear);
}

/**
 * Marca o desmarca un número del cartón
 * @param {String} id id del elemento a marcar
 * @param {Array} carton carton selecionado
 */
function marcar(id, carton){
	var celda = document.getElementById(id);
 	var posicion = id.split('/');

 	if(carton[posicion[0]][posicion[1]].marca){
 		carton[posicion[0]][posicion[1]].marca = false;
 		celda.classList.remove('marca');
 	}
 	else{
 		carton[posicion[0]][posicion[1]].marca = true;
 		celda.classList.add('marca');
 	}
}

/**
 * Lee el carton que le pasa como parámetro y guarda en un array de manera ordenada los números de los cartones.
 * @param {Array} carton carton selecionado
 */
function leerCarton(carton){
	var lista=[];
		//Recorro las filas y las columnas
		for (var i = 0; i < carton.length; i++) {
			for (var j = 0; j < carton[i].length; j++) {
				//Si la celda no está vacia, guardo en el array
				if(carton[i][j].valor != -1){
					lista.push(carton[i][j].valor);
				}
			};
		};
		return lista.sort(function(a,b){return a-b;}); //Ordenamos el resultado
		//De esta forma guardo en un array la lista ordenada de numeros que tiene ese carton para que sea mas facil comprobarlo despues
}

/**
 * Comprueba nuestro carton y muestra la ventana emergente en cada caso.
 */
function cantaBingo(){
	//Paro el bingo
	parar();
	//Compruebo mi cartón
	if(compruebaBingo()==true){
		 var ventana = window.open("correcto.html", "_blank", "width=500,height=400");
		 //Calcula el premio
		 ventana.onload = function () {
            ventana.document.getElementById('premio').innerHTML = calcularPremio();
        };
	}
	else{
		var ventana = window.open("incorrecto.html", "_blank", "width=520,height=410");
		//Manda el número de aciertos
		 ventana.onload = function () {
            ventana.document.getElementById('nac').innerHTML = aciertos;
        };
	}
}

/**
 * Comprueba si los números del cartón han salido y si tiene los 15 aciertos devuelve que ha ganado.
 * @returns {boolean} correcto Devuelve si ha ganado o no.
 */
function compruebaBingo(){
	var numeros = numeros_carton;
	var correcto = false;
	aciertos = 0;
	
	for (var x = 0; x < numeros.length; x++){
		if(hanSalido.indexOf(numeros[x]) != -1){
			aciertos++;
		}
	}
	
	if (aciertos == 15){
		correcto = true;
	}
	return correcto;
}

// Función compruebaResto eliminada - ya no es necesaria con un solo jugador

/**
 * Calcula el premio según la apuesta
 * @returns {number} resultado Devuelve el resultado del premio
 */
function calcularPremio(){
	// Premio = apuesta * 10 (puedes ajustar esta fórmula)
	var resultado = apuesta * 10;
	return resultado.toFixed(2);
}


