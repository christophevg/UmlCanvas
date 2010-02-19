@echo off
echo *** registering assemby addin.dll
call %WINDIR%\Microsoft.NET\Framework\v2.0.50727\regasm UmlCanvas.EA.Addin.dll /codebase
echo *** registering addin with EA
call regedit /s addin.reg
pause
