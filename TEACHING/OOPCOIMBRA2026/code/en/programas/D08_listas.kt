fun main() {
    val nomes: MutableList<String> =
        mutableListOf("Ana")
    val leitura: List<String> = nomes
    nomes.add("Rui")
    println(leitura)
    println(nomes === leitura)
}
