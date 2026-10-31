interface Rotulavel {
    val nome: String
    val rotulo: String
        get() = "Name: $nome"
    fun apresentar() {
        println(rotulo)
    }
}
class Livro(override val nome: String) : Rotulavel
fun main() {
    val livro = Livro("Mensagem")
    livro.apresentar()
}
