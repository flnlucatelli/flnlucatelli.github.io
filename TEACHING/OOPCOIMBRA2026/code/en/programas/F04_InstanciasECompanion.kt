class Duracao private constructor(val minutos: Int) {
    companion object {
        fun criar(minutos: Int): Duracao {
            require(minutos in 0..1440)
            return Duracao(minutos)
        }
    }
}
fun main() {
    val a = Duracao.criar(50)
    val b = Duracao.criar(50)
    val fabrica = Duracao.Companion
    println(a === b)
    println(fabrica === Duracao.Companion)
    println(fabrica.criar(20).minutos)
}
