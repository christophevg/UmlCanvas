SRCS=Diagram.cs Class.cs Interface.cs Enumeration.cs Attribute.cs Operation.cs Relations.cs Note.cs

all: UmlCanvasSharp.dll

test: test.exe
	mono $<

test.exe: test.cs UmlCanvasSharp.dll
	gmcs -r:UmlCanvasSharp.dll test.cs

UmlCanvasSharp.dll: ${SRCS} ADLSharp.dll
	gmcs -target:library -out:$@ -r:ADLSharp.dll ${SRCS}

ADLSharp.dll: ADL/src/cs/ADLSharp.dll
	ln -s ADL/src/cs/ADLSharp.dll .
	
ADL/src/cs/ADLSharp.dll: ADL
	(cd ADL/src/cs; make)

ADL:
	git clone http://git.thesoftwarefactory.be/pub/ADL.git

clean:
	@rm -f *.dll *.exe

mrproper: clean
	@rm -rf ADL
