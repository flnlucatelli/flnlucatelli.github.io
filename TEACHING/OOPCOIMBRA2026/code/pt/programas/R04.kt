interface Mensagem {
    fun texto(): String
}
fun criar(): Mensagem = object : Mensagem {
    override fun texto(): String = "Olá"
}
fun main() {
    val a = criar()
    val b = criar()
    println(a.texto())
    println(a === b)
}
