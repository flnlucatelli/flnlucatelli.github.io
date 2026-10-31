data class Hora(val horas: Int, val minutos: Int)

fun main() {
    val original = Hora(8, 5)
    val seguinte = original.copy(minutos = 6)
    println(original)
    println(seguinte)
    println(original === seguinte)
}
