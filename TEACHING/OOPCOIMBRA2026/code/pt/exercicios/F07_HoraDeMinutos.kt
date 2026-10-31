class Hora private constructor(
    val horas: Int, val minutos: Int
) {
    companion object {
        fun deMinutos(total: Int): Hora {
            TODO("Validar e construir")
        }
    }
}
fun main() {
    val h = Hora.deMinutos(95)
    println(h.horas)
    println(h.minutos)
}
