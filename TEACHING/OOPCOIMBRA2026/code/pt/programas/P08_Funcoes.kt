fun totalMinutos(h: Int, m: Int): Int {
    return h * 60 + m
}

fun main() {
    val total = totalMinutos(1, 35)
    println(total)
}
