class Livro(val id: String, val titulo: String)

fun main() {
    val primeiro = Livro("L1", "Mensagem")
    val segundo = Livro("L2", "Mensagem")
    println("${primeiro.id}: ${primeiro.titulo}")
    println("${segundo.id}: ${segundo.titulo}")
}
