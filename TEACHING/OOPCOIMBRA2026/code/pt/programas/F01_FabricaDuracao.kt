class Duracao private constructor(val minutos: Int) {
    companion object {
        fun criar(minutos: Int): Duracao {
            require(minutos in 0..1440)
            return Duracao(minutos)
        }
    }
}
fun main() {
    val viagem = Duracao.criar(50)
    println(viagem.minutos)
}
