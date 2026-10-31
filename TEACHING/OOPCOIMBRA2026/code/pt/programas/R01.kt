fun main() {
    val texto: String? = null
    val tamanho: Int? = texto?.length
    val seguro: Int = tamanho ?: 0
    println(tamanho)
    println(seguro)
}
