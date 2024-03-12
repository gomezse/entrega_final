
# **Entrega final del proyecto.**
>[!IMPORTANT]
>* Ejecutar "npm i"
>* Ejecutar "npm start" para correr la aplicación.(corre con nodemon)

>[!TIP]
>* Se recomienda crear al menos un usuario de tipo ADMIN para poder gestionar el resto de users, ya que este tiene acceso a la vista de Usuarios.
>* El usuario de tipo ADMIN tambien puede cambiar los roles de otros usuarios.
>* Prestar atención al mail que se setea a cada usuario ya que se utilizará para el envio de mail.

## *Rutas Principales*

* https://entregafinal-production-7f74.up.railway.app/signup
*  https://entregafinal-production-7f74.up.railway.app/login
*  https://entregafinal-production-7f74.up.railway.app/profile

## *Flujo Natural de prueba de aplicación.*
- Ingresar al "signup" y generar un nuevo usuario con el rol que se desee (ADMIN tiene acceso a la mayoría de las vistas y acciones).
- Una vez creado el usuario ingresar al "login" para autenticarse.

- Tendremos acceso a la vista de "profile" en donde se encuentran bloques que engloban algunos de los módulos trabajados en el curso y con los cuales podemos operar.

- Las subvistas principales cuentan con un botón de redirección al "perfil" para volver a gestionar las tareas.

## *Observaciones*

* Se utilizó patrón MVC como base del proyecto.
* Se utilizó el patrón DTO  para la vista de usuarios (con el fin de cuidar datos sensibles).
* Se utilizó el patrón DAO.
* Se crearon otras carpetas con el fin de tener un mejor "ordenamiento" del proyecto (utils,middlewares,public,etc...)
