class Hora(val horas: Int, val minutos: Int) {
    init {
        require(horas in 0..23 && minutos in 0..59) {
            "Hora inválida."
        }
    }
    fun totalMinutos(): Int = TODO("Calcular")
}
fun main() {
    val hora = Hora(2, 30)
    println(hora.totalMinutos())
}
