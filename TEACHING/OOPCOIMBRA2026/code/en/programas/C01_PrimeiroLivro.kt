class Livro(val id: String, val titulo: String)

fun main() {
    val livro = Livro("L1", "Mensagem")
    println(livro.id)
    println(livro.titulo)
}
