SRCS=src/Diagram.cs \
     src/Class.cs \
     src/Interface.cs \
     src/Enumeration.cs \
     src/Attribute.cs \
     src/Operation.cs \
     src/Relations.cs \
     src/Note.cs

all: build/UmlCanvasSharp.dll

test: t/test.exe
	@MONO_PATH=build:lib/ADL/src/cs/ mono $<

t/test.exe: t/test.cs build/UmlCanvasSharp.dll
	@MONO_PATH=lib/ADL/src/cs/ gmcs -r:build/UmlCanvasSharp.dll $<

build/UmlCanvasSharp.dll: ${SRCS} lib/ADL/src/cs/ADLSharp.dll
	@mkdir -p build	
	@gmcs -target:library -out:$@ -r:lib/ADL/src/cs/ADLSharp.dll ${SRCS}

lib/ADL/src/cs/ADLSharp.dll: lib/ADL
	@(cd lib/ADL/src/cs; make)

lib/ADL:
	@mkdir -p lib
	@(cd lib; git clone http://git.thesoftwarefactory.be/pub/ADL.git )

clean:
	@rm -f *.dll *.exe
	@rm -rf build

mrproper: clean
	@rm -rf lib
