abstract class Cartao(val nome: String) {
    abstract fun descricao(): String
}
class Leitor(nome: String) : Cartao(nome) {
    override fun descricao(): String = "Reader: $nome"
}
fun main() {
    val cartao: Cartao = Leitor("Ana")
    println(cartao.descricao())
}
