class Hora private constructor(
    val horas: Int, val minutos: Int
) {
    companion object {
        fun deMinutos(total: Int): Hora {
            require(total in 0..1439)
            return Hora(total / 60, total % 60)
        }
    }
}
fun main() {
    val h = Hora.deMinutos(95)
    println(h.horas)
    println(h.minutos)
}
