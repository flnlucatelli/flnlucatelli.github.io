enum class DiaChegada { MESMO, SEGUINTE, DOIS_DIAS }

fun minutos(dia: DiaChegada): Int = when (dia) {
    DiaChegada.MESMO -> 0
    DiaChegada.SEGUINTE -> 1440
    DiaChegada.DOIS_DIAS -> 2880
}

fun main() {
    for (dia in DiaChegada.entries) {
        println(minutos(dia))
    }
}
