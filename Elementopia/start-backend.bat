@echo off
echo Starting Elementopia Backend...
set "JAVA_HOME=C:\Program Files\Java\jdk-21"
cd /d "%~dp0BACKEND"
call mvnw.cmd spring-boot:run