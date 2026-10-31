data class Group(val names: MutableList<String>)

fun main() {
    val original = Group(mutableListOf("Ana"))
    val shared = original.copy()
    val separate = original.copy(names = original.names.toMutableList())
    shared.names.add("Rui")
    separate.names.add("Eva")
    println(original.names)
    println(shared.names)
    println(separate.names)
    println(original === shared)
    println(original.names === shared.names)
}
