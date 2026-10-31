open class Documento(val titulo: String) {
    open fun resumo(): String = titulo
}
class Relatorio(titulo: String) : Documento(titulo) {
    override fun resumo(): String =
        "Report: ${super.resumo()}"
}
fun main() {
    val d: Documento = Relatorio("Library")
    println(d.resumo())
}
