interface Nomeado {
    val nome: String
}
class Leitor(override var nome: String) : Nomeado
fun main() {
    val leitor = Leitor("Ana")
    val consulta: Nomeado = leitor
    println(consulta.nome)
    leitor.nome = "Rita"
    println(consulta.nome)
    // consulta.nome = "Eva"  // Does not compile.
}
