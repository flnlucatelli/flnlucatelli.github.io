class Hora(val horas: Int, val minutos: Int) {
    init {
        require(horas in 0..23 && minutos in 0..59) {
            "Invalid time."
        }
    }
}

fun main() {
    val partida = Hora(23, 40)
    println("${partida.horas}:${partida.minutos}")
}
