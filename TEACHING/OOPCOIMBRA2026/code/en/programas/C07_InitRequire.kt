class Hora(val horas: Int, val minutos: Int) {
    init {
        require(horas >= 0 && horas <= 23) {
            "The hour must be between 0 and 23."
        }
    }
}

fun main() {
    val partida = Hora(23, 40)
    println(partida.horas)
}
