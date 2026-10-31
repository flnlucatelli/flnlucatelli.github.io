abstract class Cartao(val nome: String) {
    abstract fun descricao(): String
}
class Leitor(nome: String) : Cartao(nome) {
    override fun descricao(): String = "Leitor: $nome"
}
fun main() {
    val cartao: Cartao = Leitor("Ana")
    println(cartao.descricao())
}
