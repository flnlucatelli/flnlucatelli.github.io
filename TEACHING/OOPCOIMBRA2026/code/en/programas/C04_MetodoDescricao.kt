class Livro(val id: String, val titulo: String) {
    fun descricao(): String {
        return "$id: $titulo"
    }
}

fun main() {
    val livro = Livro("L1", "Mensagem")
    val texto = livro.descricao()
    println(texto)
}
