/*!
governify-render 1.0.0, built on: 2018-05-09
Copyright (C) 2018 ISA group
http://www.isa.us.es/
https://github.com/isa-group/governify-render#readme

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.*/
$scope.displayError = "none"

/*! Devuelve un payload a partir de unas jugadas
 *  @param jugadas un array de objetos cuyos atributos son 'jugador' un string que representa 
 *  el nombre del jugador,'cartas' un string que representa las cartas de la jugada del jugador y
 *  'apuesta' un string que representa la cantidad que apuesta el jugador.
 *  @return un array de objetos donde cada objeto tiene una propiedad 'jugador' un string,
 *  'apuesta' un numero y "cartas" un array de objetos con propiedades 'n' un entero y 't' un string
 */
var buildPayload = (jugadas) => {
    var mano = []
    var jugadasAuxiliar = []
    for(var i = 0;i<jugadas.length; i++){
        var cartas = jugadas[i].cartas.split(",")
        var cartasAuxiliar = []
        for(var j = 0;j<cartas.length;j++){
            cartasAuxiliar.push({valor: cartas[j].substring(0,1), palo: cartas[j].substring(1,2)})
        }
        jugadasAuxiliar.push({jugador : jugadas[i].jugador , apuesta: jugadas[i].apuesta, cartas: cartasAuxiliar})
    }
    mano.push({jugadas: jugadasAuxiliar, bote: 0})
    return mano
}

/*! Añade a la variable jugadas del scope una jugada a partir de las variables
 *  del scope 'jugador', 'cartas' y 'apuesta' siempre y cuando cumplan unas
 *  restricciones sintácticas y semánticas
 */
$scope.addJugada = function() {
	if (angular.isDefined($scope.jugador) && angular.isDefined($scope.cartas) &&
     angular.isDefined($scope.apuesta) && $scope.jugador != "" && $scope.cartas != "" &&
    $scope.apuesta != "" && $scope.cartas.length === 14) {
		var jugador = $scope.jugador
		var cartas = $scope.cartas
		var apuesta = Number($scope.apuesta)
		// Añadir jugada a jugadas.
		$scope.model.jugadas.push({
			jugador: jugador,
			cartas: cartas,
			apuesta: apuesta
		})

		// Clear fields.
		$scope.displayError = "none"
		$scope.jugador = "";
		$scope.cartas = "";
		$scope.apuesta = "";
		$scope.errorForm = ""
	} else {
		$scope.displayError = "block"
		$scope.errorForm = "Todos los campos deben estar rellenos y únicamente pueden haber 5 cartas en la jugada"
	}
}

/*! Determina el ganador de una serie de jugadas haciendo un POST a la API de Poker,
 *  de modo que se obtiene el ganador y este se le asigna a la variable ganador del
 *  scope
 */
$scope.getGanador = function() {
    if ($scope.model.jugadas.length != 0) {
        var jugadas = $scope.model.jugadas

        //Building payload
        var payload = buildPayload(jugadas)

        // Call Poker API.
        var url = "http://localhost:8086/api/v1/hands"

        $http.post(url, payload).then(response => {
            $scope.ganador = response.data.verdict[0]
        }).catch(err => {
            console.log(err)
        })

        // Clear fields.
        $scope.displayError = "none"
        $scope.model.jugadas = [];
        $scope.errorForm = ""
    } else {
        $scope.displayError = "block"
        $scope.errorForm = "Debe haber al menos una jugada"
    }
}