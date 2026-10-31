enum class DiaChegada(val codigo: Int) {
    MESMO(10), SEGUINTE(20)
}

fun main() {
    val dia = DiaChegada.SEGUINTE
    println(dia.name)
    println(dia.ordinal)
    println(dia.codigo)
    println(DiaChegada.valueOf("SEGUINTE") == dia)
}
