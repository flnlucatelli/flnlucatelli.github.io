enum class DiaChegada { MESMO, SEGUINTE }

fun descricao(dia: DiaChegada): String = when (dia) {
    DiaChegada.MESMO -> "mesmo dia"
    DiaChegada.SEGUINTE -> "dia seguinte"
}

fun main() {
    println(descricao(DiaChegada.MESMO))
    println(descricao(DiaChegada.SEGUINTE))
}
