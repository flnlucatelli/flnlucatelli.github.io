class Hora(val horas: Int, val minutos: Int) {
    init {
        require(horas >= 0 && horas <= 23) {
            "A hora deve estar entre 0 e 23."
        }
    }
}

fun main() {
    val partida = Hora(23, 40)
    println(partida.horas)
}
