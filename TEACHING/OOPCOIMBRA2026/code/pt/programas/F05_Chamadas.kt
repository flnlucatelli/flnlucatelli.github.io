class Duracao private constructor(val minutos: Int) {
    companion object {
        fun criar(minutos: Int): Duracao {
            require(minutos in 0..1440)
            return Duracao(minutos)
        }
    }
}
fun main() {
    val d = Duracao.criar(50)
    println(d.minutos)
    // Duracao(50)       // construtor privado
    // Duracao.minutos   // falta uma instância
    // d.criar(50)       // criar está no companion
}
