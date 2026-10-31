open class Documento(val titulo: String) {
    open fun resumo(): String = titulo
}
class Relatorio(titulo: String) : Documento(titulo) {
    override fun resumo(): String =
        "Relatório: ${super.resumo()}"
}
fun main() {
    val d: Documento = Relatorio("Biblioteca")
    println(d.resumo())
}
