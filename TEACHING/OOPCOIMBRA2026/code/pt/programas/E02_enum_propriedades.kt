enum class DiaChegada(val dias: Int, val rotulo: String) {
    MESMO(0, "mesmo dia"),
    SEGUINTE(1, "dia seguinte");

    fun minutosAdicionais(): Int = dias * 1440
}

fun main() {
    val dia = DiaChegada.SEGUINTE
    println(dia.rotulo)
    println(dia.minutosAdicionais())
}
