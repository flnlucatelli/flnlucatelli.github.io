data class Pasta(val nomes: MutableList<String>)

fun main() {
    val a = Pasta(mutableListOf("Ana"))
    val b = a.copy()
    b.nomes.add("Rui")
    println(a.nomes)
    println(a === b)
    println(a.nomes === b.nomes)
}
