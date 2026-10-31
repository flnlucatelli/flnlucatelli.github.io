enum class DiaChegada(val dias: Int, val rotulo: String) {
    MESMO(0, "same day"),
    SEGUINTE(1, "next day");

    fun minutosAdicionais(): Int = dias * 1440
}

fun main() {
    val dia = DiaChegada.SEGUINTE
    println(dia.rotulo)
    println(dia.minutosAdicionais())
}
