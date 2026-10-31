fun totalMinutos(h: Int, m: Int): Int = h * 60 + m

fun mostrar(total: Int): Unit {
    println(total)
}

fun main() {
    mostrar(totalMinutos(1, 35))
}
