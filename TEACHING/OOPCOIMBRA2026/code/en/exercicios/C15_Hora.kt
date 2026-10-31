class Hora(val horas: Int, val minutos: Int) {
    init {
        require(horas in 0..23 && minutos in 0..59) {
            "Invalid time."
        }
    }
    fun totalMinutos(): Int = TODO("Calculate")
}
fun main() {
    val hora = Hora(2, 30)
    println(hora.totalMinutos())
}
