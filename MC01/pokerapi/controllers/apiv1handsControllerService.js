'use strict'

/*! Determina si se hace trampa en función de si una carta está ya en un conjunto de cartas
 *  @param carta una carta
 *  @param cartasJugadores un array de cartas
 *  @return true si se hace trampa, false en otro caso
 */
var seHaceTrampa = (carta, cartasJugadores) => {
	if (cartasJugadores.has(String(carta.valor) + carta.palo)) {
		return true
	}
	return false
}

/*! Devuelve las manos de los jugadores a partir de una serie de jugadas
 *  @param jugadas un array de jugadas
 *  @param diccionarioCarta un mapa que indexa los distintos valores de las cartas
 *  @return undefined si se hace trampa y las manos de los jugadores en otro caso
 */
var getManosJugadores = (jugadas, diccionarioCarta) => {
	var cartasJugadores = new Set()
	var manosJugadores = new Map()
	var exit = false
	for (var i = 0; i < jugadas.length && !exit; i++) {
		exit = getManoJugador(jugadas[i], cartasJugadores, manosJugadores, diccionarioCarta)
	}
	if (exit) {
		return undefined
	}
	return manosJugadores
}

/*! Determina si unas cartas forman una escalera o una escalera de color
 *  @param cartasJugada un array de cartas
 *  @return "Escalera de color" si las cartas forman una escalera de color
 *          "Escalera" si las cartas forman una escalera
 *          "noEscalera" si en otro caso
 */
var esEscalera = (cartasJugada) => {
	var escaleraColor = true;
	var escaleraConAsPrimeraCarta = cartasJugada[0].valor + cartasJugada[1].valor +
		cartasJugada[2].valor + cartasJugada[3].valor +
		cartasJugada[4].valor === "234513" //Escalera con As como primera carta
	for (var i = 0; i < cartasJugada.length - 1; i++) {
		if (Number(cartasJugada[i].valor) + 1 !== Number(cartasJugada[i + 1].valor)) {
			if (!escaleraConAsPrimeraCarta) {
				return "noEscalera"
			}
		} else if (cartasJugada[i].palo !== cartasJugada[i + 1].palo) {
			escaleraColor = false
		}
	}

	if (escaleraColor) {
		return "Escalera de color"
	}
	return "Escalera"
}

/*! Determina si unas cartas forman un poker
 *  @param cartasJugada un array de cartas
 *  @return true si forman un poker, false en otro caso
 */
var esPoker = (cartasJugada) => {
	for (var i = 0; i <= 1; i++) {
		if (cartasJugada[i].valor === cartasJugada[i + 1].valor &&
			cartasJugada[i].valor === cartasJugada[i + 2].valor &&
			cartasJugada[i].valor === cartasJugada[i + 3].valor) {
			return true
		}
	}
	return false
}

/*! Determina si unas cartas forman un full
 *  @param cartasJugada un array de cartas
 *  @return true si forman un full, false en otro caso
 */
var esFull = (cartasJugada) => {
	if ((cartasJugada[0].valor === cartasJugada[1].valor && cartasJugada[0].valor === cartasJugada[2].valor &&
			cartasJugada[3].valor === cartasJugada[4].valor) || (cartasJugada[0].valor === cartasJugada[1].valor &&
			cartasJugada[2].valor === cartasJugada[3].valor && cartasJugada[2].valor === cartasJugada[4].valor)) {
		return true
	}
	return false
}

/*! Determina si unas cartas forman un color
 *  @param cartasJugada un array de cartas
 *  @return true si forman un color, false en otro caso
 */
var esColor = (cartasJugada) => {
	var palo = cartasJugada[0].palo
	if (palo === cartasJugada[1].palo && palo === cartasJugada[2].valor &&
		palo === cartasJugada[3].valor && palo === cartasJugada[4].valor) {
		return true
	}
	return false
}

/*! Determina si unas cartas forman un trio
 *  @param cartasJugada un array de cartas
 *  @return true si forman un trio, false en otro caso
 */
var esTrio = (cartasJugada) => {
	var valorCartaDelMedio = cartasJugada[2].valor
	if ((valorCartaDelMedio === cartasJugada[0].valor && valorCartaDelMedio === cartasJugada[1].valor) ||
		(valorCartaDelMedio === cartasJugada[3].valor && valorCartaDelMedio === cartasJugada[4].valor)) {
		return true
	}
	return false
}

/*! Determina si unas cartas forman una doble pareja
 *  @param cartasJugada un array de cartas
 *  @return true si forman una doble pareja, false en otro caso
 */
var esDoblePareja = (cartasJugada) => {
	var primera = cartasJugada[0].valor
	var segunda = cartasJugada[1].valor
	var tercera = cartasJugada[2].valor
	var cuarta = cartasJugada[3].valor
	var quinta = cartasJugada[4].valor
	if (primera === segunda && tercera === cuarta || primera === segunda && cuarta === quinta || segunda === tercera && cuarta === quinta) {
		return true
	}
	return false
}

/*! Determina si unas cartas forman una pareja
 *  @param cartasJugada un array de cartas
 *  @return objeto cuyo nombre es "Pareja" y su valor el valor de la pareja
 *          si las cartas forman una pareja. objeto cuyo nombre es "NoPareja"
 *          y su valor 0 si las cartas no forman una pareja
 */
var esPareja = (cartasJugada) => {
	for (var i = 0; i < cartasJugada.length - 1; i++) {
		if (cartasJugada[i].valor === cartasJugada[i + 1].valor) {
			return {
				nombre: "Pareja",
				valor: cartasJugada[i].valor
			}
		}
	}
	return {
		nombre: "NoPareja",
		valor: 0
	}
}

/*! Actualiza el parámetro manosJugadores añadiendo la mano del jugador
 *  Actualiza el parámetro cartasJugadores añadiendo las cartas del jugador
 *  @param jugada un objeto con cartas y apuesta
 *  @param cartasJugadores un conjunto con las cartas de los jugadores
 *  @param manosJugadores un mapa cuyas claves son los jugadores y los valores sus manos
 *  @param diccionarioCarta un mapa que indexa los distintos valores de las cartas
 *  @return true si se hace trampa, false en otro caso
 */
var getManoJugador = (jugada, cartasJugadores, manosJugadores, diccionarioCarta) => {
	var cartasJugada = []
	for (var i = 0; i < jugada.cartas.length; i++) {
		var carta = jugada.cartas[i]
		if (seHaceTrampa(carta, cartasJugadores)) {
			return true
		} else {
			cartasJugadores.add(String(carta.valor) + carta.palo)
			cartasJugada.push({
				valor: diccionarioCarta[carta.valor],
				palo: carta.palo
			})
		}
	}
	cartasJugada.sort((a, b) => a - b); //Ordena ascendentemente
	const escaleras = new Set(["Escalera", "Escalera de color"])
	const escalera = esEscalera(cartasJugada)
	const pareja = esPareja(cartasJugada)
	if (escaleras.has(escalera)) {
		manosJugadores.set(jugada.jugador, {
			nombre: escalera,
			valor: cartasJugada[cartasJugada.length - 1].valor
		})
	} else if (esPoker(cartasJugada)) {
		manosJugadores.set(jugada.jugador, {
			nombre: "Poker",
			valor: cartasJugada[2].valor
		}) //Si es poker, la carta del medio es parte de él, pues están ordenadas
	} else if (esFull(cartasJugada)) {
		manosJugadores.set(jugada.jugador, {
			nombre: "Full",
			valor: cartasJugada[2].valor
		}) //Si es full, la carta del medio es parte de el trio
	} else if (esColor(cartasJugada)) {
		manosJugadores.set(jugada.jugador, {
			nombre: "Color",
			valor: cartasJugada[cartasJugada.length - 1].valor
		})
	} else if (esTrio(cartasJugada)) {
		manosJugadores.set(jugada.jugador, {
			nombre: "Trio",
			valor: cartasJugada[2].valor
		}) //Si es trio, la carta del medio es parte de el trio
	} else if (esDoblePareja(cartasJugada)) {
		manosJugadores.set(jugada.jugador, {
			nombre: "Doble Pareja",
			valor: cartasJugada[3].valor
		}) //Si es doble pareja, la penultima carta siempre pertenece a la pareja más alta
	} else if (pareja.nombre === "Pareja") {
		manosJugadores.set(jugada.jugador, {
			nombre: "Pareja",
			valor: pareja.valor
		})
	} else {
		manosJugadores.set(jugada.jugador, {
			nombre: "Carta mas alta",
			valor: cartasJugada[cartasJugada.length - 1].valor
		})
	}
	return false
}

/*! Determina el ganador de la jugada a partir de las manos de los jugadores
 *  @param manosJugadores un mapa cuyas claves son los jugadores y los valores sus manos
 *  @param diccionarioJugadas un mapa que indexa las distintas manos
 *  @return "Empate" en caso de un empate entre jugadores y otro string en caso de que
 *          haya un ganador
 */
var getGanador = (manosJugadores, diccionarioJugadas) => {
	var ganador = "";
	var mejorMano = 0;
	var valorMejorMano = 0;
	for (var key of manosJugadores.keys()) {
		var traduccionMano = diccionarioJugadas[manosJugadores.get(key).nombre]
		if (traduccionMano > mejorMano || traduccionMano === mejorMano && valorMejorMano < manosJugadores.get(key).valor) {
			mejorMano = traduccionMano
			ganador = key
			valorMejorMano = manosJugadores.get(key).valor
		} else if (traduccionMano === mejorMano && valorMejorMano === manosJugadores.get(key).valor) {
			ganador = "Empate"
		}
	}
	return ganador
}

/*! Determina el premio de la jugada
 *  @param bote un entero que representa el bote
 *  @param jugadas un array con las distintas jugadas
 *  @return un entero que representa el premio
 */
var getPremio = (bote, jugadas) => {
	var premio = bote;
	jugadas.forEach(jugada => premio += jugada.apuesta)
	return premio
}

/*! Determina el veredicto de una jugada
 *  @param manosJugadores un mapa cuyas claves son los jugadores y los valores sus manos
 *  @param diccionarioJugadas un mapa que indexa las distintas manos
 *  @param mano objeto formado por jugadas y un bote
 *  @return un entero que representa el premio
 */
var getVeredicto = (manosJugadores, diccionarioJugadas, mano) => {
	var veredicto
	if (manosJugadores === undefined) {
		veredicto = "Partida Amañada"
	} else {
		var ganador = getGanador(manosJugadores, diccionarioJugadas)
		if (ganador !== "Empate" && ganador !== "Trampa") {
			var bote = mano.bote
			var premio = getPremio(bote, mano.jugadas)
			veredicto = ganador + " gana " + premio
		} else if (ganador === "Empate") {
			veredicto = "Iguales"
		}
	}
	return veredicto
}



module.exports.obtainVerdict = function obtainVerdict(req, res, next) {
	var manos = req.Game.value
	var veredictos = []
	var diccionarioCarta = { //Diccionario cuyas claves son los distintos valores de las cartas
		"1": "1", // y sus valores son una indexación de los mismos, de modo que todos
		"2": "2", // los valores estén en notación numérica
		"3": "3",
		"4": "4",
		"5": "5",
		"6": "6",
		"7": "7",
		"8": "8",
		"9": "9",
		"J": "10",
		"Q": "11",
		"K": "12",
		"A": "13",
	};
	var diccionarioJugadas = { //Diccionario cuyas claves son las distintas manos posibles y sus
		"Carta mas alta": 1, // valores son una indexación de los mismos.
		"Pareja": 2,
		"Doble Pareja": 3,
		"Trio": 4,
		"Escalera": 5,
		"Color": 6,
		"Full": 7,
		"Poker": 8,
		"Escalera de color": 9,
	};
	manos.forEach(mano => {
		var jugadas = mano.jugadas
		var manosJugadores = getManosJugadores(jugadas, diccionarioCarta)
		var veredicto = getVeredicto(manosJugadores, diccionarioJugadas, mano);
		veredictos.push(veredicto)
	});
	res.header("Access-Control-Allow-Origin", "*") //Cabecera para permitir el acceso desde otros puertos (CORS)
	res.send({
		verdict: veredictos,
	});
};

module.exports.corsSupport = function corsSupport(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "content-type");
	res.send({});
};