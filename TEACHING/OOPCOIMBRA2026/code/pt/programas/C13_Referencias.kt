class Livro(val id: String, var titulo: String)

fun main() {
    val primeiro = Livro("L1", "Mensagen")
    val outroNome = primeiro
    outroNome.titulo = "Mensagem"
    println(primeiro.titulo)
    println(outroNome.titulo)
}
