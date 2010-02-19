ADL_GIT=http://git.thesoftwarefactory.be/pub/ADL.git
UTF_GIT=http://git.thesoftwarefactory.be/pub/UmlToolingFramework.git

SRCS=src/*.cs

LIBS=lib/Interop.EA.dll \
	 lib/ADL/src/cs/ADLSharp.dll \
	 ../../UmlCanvasSharp/build/UmlCanvasSharp.dll \
     lib/UmlToolingFramework/build/UmlToolingFramework.dll \
     ../../UmlCanvasSharp/build/UmlCanvasSharp.UTF.dll \
     lib/UmlToolingFramework/build/UmlToolingFramework.EA.dll \

REFS=-r:System.Windows.Forms.dll \
     -r:System.Drawing.dll \
     -r:lib/Interop.EA.dll \
	 -r:lib/ADL/src/cs/ADLSharp.dll \
	 -r:../../UmlCanvasSharp/build/UmlCanvasSharp.dll \
     -r:lib/UmlToolingFramework/build/UmlToolingFramework.dll \
     -r:lib/UmlToolingFramework/build/UmlToolingFramework.EA.dll \
     -r:../../UmlCanvasSharp/build/UmlCanvasSharp.UTF.dll

all: build/UmlCanvas.EA.Addin.dll

build/UmlCanvas.EA.Addin.dll: ${SRCS} ${LIBS}
	@mkdir -p build
	MONO_PATH=lib/UmlToolingFramework/build/ \
	  gmcs -target:library ${REFS} -out:$@ ${SRCS}

lib/Interop.EA.dll:
	@echo "obtain a copy of Interop.EA.dll and put it in the lib/ dir"

lib/UmlToolingFramework/build/UmlToolingFramework.dll: UmlToolingFramework
	@(cd lib/UmlToolingFramework; make build/UmlToolingFramework.dll)

lib/UmlToolingFramework/build/UmlToolingFramework.EA.dll: UmlToolingFramework
	@(cd lib/UmlToolingFramework; make build/UmlToolingFramework.EA.dll)

UmlToolingFramework: lib/UmlToolingFramework
	@(cd lib/UmlToolingFramework; \
	  git pull; \
	  mkdir -p lib; \
	  cd lib; \
	  rm -f Interop.EA.dll; \
	  ln -s ../../Interop.EA.dll . )

lib/UmlToolingFramework:
	@(cd lib; git clone ${UTF_GIT})

lib/ADL/src/cs/ADLSharp.dll: lib/ADL
	@(cd lib/ADL/src/cs; make)

lib/ADL:
	@mkdir -p lib
	@(cd lib; git clone ${ADL_GIT})

../../UmlCanvasSharp/build/UmlCanvasSharp.dll:
	@(cd ../../UmlCanvasSharp; make build/UmlCanvasSharp.dll)

../../UmlCanvasSharp/build/UmlCanvasSharp.UTF.dll:
	@(cd ../../UmlCanvasSharp; make build/UmlCanvasSharp.UTF.dll)

dist: mrproper build/UmlCanvas.EA.Addin.dll
	@mkdir -p dist/
	@cp ${LIBS} dist/
	@cp build/UmlCanvas.EA.Addin.dll dist/
	@cp reg.bat addin.reg dist/

.PHONY:
clean:
	@rm -rf build

mrproper: clean
	@rm -rf dist
	@rm -rf lib/ADL lib/UmlToolingFramework


