SRCS=src/*.cs src/Hosted/*.cs
UTF_SRCS=src/UTF/*.cs

ADL_GIT=http://git.thesoftwarefactory.be/pub/ADL.git

UTF_GIT=http://git.thesoftwarefactory.be/pub/UmlToolingFramework.git
UTF_LIBS=lib/UmlToolingFramework/build/UmlToolingFramework.dll \
         lib/ADL/src/cs/ADLSharp.dll \
         build/UmlCanvasSharp.dll
UTF_REFS=-r:lib/UmlToolingFramework/build/UmlToolingFramework.dll \
         -r:lib/ADL/src/cs/ADLSharp.dll \
         -r:build/UmlCanvasSharp.dll

all: build/UmlCanvasSharp.dll build/UmlCanvasSharp.UTF.dll

test: t/test.exe
	@MONO_PATH=build:lib/ADL/src/cs/ mono $<

t/test.exe: t/test.cs build/UmlCanvasSharp.dll
	@MONO_PATH=lib/ADL/src/cs/ gmcs -r:build/UmlCanvasSharp.dll $<

build/UmlCanvasSharp.dll: ${SRCS} lib/ADL/src/cs/ADLSharp.dll
	@mkdir -p build	
	@gmcs -target:library -out:$@ -r:lib/ADL/src/cs/ADLSharp.dll -r:System.Web ${SRCS}

lib/ADL/src/cs/ADLSharp.dll: lib/ADL
	@(cd lib/ADL/src/cs; make)

lib/ADL:
	@mkdir -p lib
	@(cd lib; git clone ${ADL_GIT})

build/UmlCanvasSharp.UTF.dll: ${UTF_SRCS}  ${UTF_LIBS}
	@mkdir -p build
	gmcs -target:library -out:$@ ${UTF_REFS} ${UTF_SRCS}

lib/UmlToolingFramework/build/UmlToolingFramework.dll: lib/UmlToolingFramework
	@(cd $<; make )

lib/UmlToolingFramework:
	@mkdir -p lib
	@(cd lib; git clone ${UTF_GIT})

clean:
	@rm -f *.dll *.exe
	@rm -rf build

mrproper: clean
	@rm -rf lib
