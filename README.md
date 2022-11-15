
 # Visitantes recurrentes

## Instrucciones

- Para instalar dependencias: ```npm install ``` o  ```npm i ```
- Luego, arrancar la aplicación: ```npm run start ```
- Ingresa query-param ```/?name= ``` como en este ejemplo:  \
[http://localhost:3000/?name=juan](http://localhost:3000/?name=juan)  \
Donde ```Juan``` es el valor del query-string y debe guardarse en una colección en mongoDB llamada ```Visitors```

Si no se escribe el query-param ```/?name= ```, el usuario se guarda como ```Anónimo ```.
El nombre ya existe, debe visualizarse la cantidad de repeticiones (visitas) de este, si es anónimo, siempre será uno.

- Para apagar servidor, presionar la combinación de teclas ```Ctrl + C``` o en ```Command + C``` en Mac

Reto: Visitantes - [Make It Real Bootcamp](http://makeitreal.camp)
