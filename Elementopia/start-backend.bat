@echo off
echo Starting Elementopia Backend...
if exist "C:\Program Files\Java\jdk-22" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-22"
) else if exist "C:\Program Files\Java\jdk-21" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-21"
)
cd /d "%~dp0BACKEND"
call mvnw.cmd spring-boot:run