class Livro(val id: String, val titulo: String) {
    fun descricao(): String = "$id: $titulo"
    fun mostrar() {
        println(descricao())
    }
}

fun main() {
    val livro = Livro("L1", "Mensagem")
    val texto = livro.descricao()
    println("Ficha: $texto")
    livro.mostrar()
}
