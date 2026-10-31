fun limparNome(texto: String?): String? {
    val recebido = texto ?: return null
    val limpo = recebido.trim()
    if (limpo.isBlank()) return null
    return limpo
}
fun main() {
    println(limparNome(" Ana "))
    println(limparNome("   "))
    println(limparNome(null))
}
