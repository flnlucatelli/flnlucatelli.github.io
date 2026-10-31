class Leitor(
    val nome: String,
    val ativo: Boolean = true
)

fun main() {
    val ana = Leitor("Ana")
    val rui = Leitor(ativo = false, nome = "Rui")
    println("${ana.nome}: ${ana.ativo}")
    println("${rui.nome}: ${rui.ativo}")
}
