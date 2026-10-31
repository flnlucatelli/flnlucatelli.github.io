enum class DiaChegada { MESMO, SEGUINTE }

fun anunciar(dia: DiaChegada) {
    println(dia)
}

fun main() {
    val dia: DiaChegada = DiaChegada.SEGUINTE
    anunciar(dia)
    println(dia == DiaChegada.MESMO)
}
