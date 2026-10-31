object ConversorHora {
    fun emMinutos(horas: Int, minutos: Int): Int {
        require(horas in 0..23)
        require(minutos in 0..59)
        return horas * 60 + minutos
    }
}
fun main() {
    println(ConversorHora.emMinutos(2, 15))
    println(ConversorHora.emMinutos(23, 59))
}
