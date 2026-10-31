enum class DiaChegada { MESMO, SEGUINTE }

fun descricao(dia: DiaChegada): String = when (dia) {
    DiaChegada.MESMO -> "same day"
    DiaChegada.SEGUINTE -> "next day"
}

fun main() {
    println(descricao(DiaChegada.MESMO))
    println(descricao(DiaChegada.SEGUINTE))
}
