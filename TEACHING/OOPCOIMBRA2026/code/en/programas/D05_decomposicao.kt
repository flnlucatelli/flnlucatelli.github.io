data class Hora(val horas: Int, val minutos: Int)

fun main() {
    val hora = Hora(8, 5)
    val (h, m) = hora
    println(h)
    println(m)
    println(hora.component1())
}
