Si no tienes Maven instalado globalmente en Windows, puedes usar el script `scripts/run-maven.ps1` que descarga una copia local de Apache Maven y la utiliza para ejecutar comandos.

Ejemplos (PowerShell):

# Ejecutar la app
```powershell
# Desde la raíz del proyecto
.\scripts\run-maven.ps1 -Args 'spring-boot:run -DskipTests'
```

# Empaquetar
```powershell
.\scripts\run-maven.ps1 -Args 'package -DskipTests'
```

# Nota
El script descarga Maven 3.9.5 en `\.maven\apache-maven-3.9.5` la primera vez que se ejecuta. Puedes cambiar la versión editando el script.

Alternativa: instalar Maven globalmente y usar `mvn` directamente.
