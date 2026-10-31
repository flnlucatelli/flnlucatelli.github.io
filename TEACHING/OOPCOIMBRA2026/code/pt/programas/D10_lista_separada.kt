data class Pasta(val nomes: MutableList<String>)

fun main() {
    val a = Pasta(mutableListOf("Ana"))
    val outros = a.nomes.toMutableList()
    val b = a.copy(nomes = outros)
    b.nomes.add("Rui")
    println(a.nomes)
    println(b.nomes)
    println(a.nomes === b.nomes)
}
