@echo off
PATH=C:\PROGRA~1\MONO-2.2\bin;%PATH%
echo building Addin...
call gmcs -target:library -out:addin.dll -r:System.Windows.Forms.dll -r:Interop.EA.dll addin.cs
echo done
pause