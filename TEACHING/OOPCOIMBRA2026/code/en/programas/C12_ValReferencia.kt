class Livro(val id: String, var titulo: String)

fun main() {
    val livro = Livro("L1", "Mensagen")
    livro.titulo = "Mensagem"
    println(livro.titulo)
}
