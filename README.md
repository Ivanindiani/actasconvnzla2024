# actasconvnzla2024
Obtención de actas electorales, elecciones presidenciales Venezuela 2024

# required
mysql8 ó mariadb (or change code to sqlite)
node 21.5


# steps

yarn install

node script.js

>> input range min and max (útil para abrir varios procesos, consolas y vaya ejecutando en paralelo diferentes rangos, se recomienda rangos de 100.000, 500.000 o 1.000.000)
>> confirmar si desea chequear actas existentes (esto consume mas ram y un poco mas lento).


# results
Luego obtendrá todos los link url de cada acta


# others

En otro script se subirá para guardar las imagenes en carpetas y comprimirlas para obtenerlas finalmente.