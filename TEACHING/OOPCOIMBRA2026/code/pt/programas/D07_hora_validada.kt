data class Hora(val horas: Int, val minutos: Int) {
    init {
        require(horas in 0..23)
        require(minutos in 0..59)
    }
    fun totalMinutos(): Int = horas * 60 + minutos
}

fun main() {
    val hora = Hora(8, 5)
    println(hora.totalMinutos())
    println(hora.copy(minutos = 6).totalMinutos())
    // hora.copy(horas = 24)
}
