MAKE=make
GIT-PULL=git pull -q
GIT-CLONE=git clone -q
ZIP=zip -qr
CC=gmcs

ADL_GIT=http://git.thesoftwarefactory.be/pub/ADL.git
UTF_GIT=http://git.thesoftwarefactory.be/pub/UmlToolingFramework.git

SRCS=src/*.cs

DIST_LIBS=lib/ADL/src/cs/ADLSharp.dll \
     ../../UmlCanvasSharp/build/UmlCanvasSharp.dll \
     lib/UmlToolingFramework/build/UmlToolingFramework.dll \
     ../../UmlCanvasSharp/build/UmlCanvasSharp.UTF.dll \
     lib/UmlToolingFramework/build/UmlToolingFramework.EA.dll

LIBS=lib/Interop.EA.dll ${DIST_LIBS}

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
	@MONO_PATH=lib/UmlToolingFramework/build/ \
	  ${CC} -target:library ${REFS} -out:$@ ${SRCS}

lib/Interop.EA.dll:
	@echo "obtain a copy of Interop.EA.dll and put it in the lib/ dir"

lib/UmlToolingFramework/build/UmlToolingFramework.dll: UmlToolingFramework
	@(cd lib/UmlToolingFramework; ${MAKE} build/UmlToolingFramework.dll)

lib/UmlToolingFramework/build/UmlToolingFramework.EA.dll: UmlToolingFramework
	@(cd lib/UmlToolingFramework; ${MAKE} build/UmlToolingFramework.EA.dll)

UmlToolingFramework: lib/UmlToolingFramework
	@(cd lib/UmlToolingFramework; \
	  ${GIT-PULL}; \
	  mkdir -p lib; \
	  cd lib; \
	  rm -f Interop.EA.dll; \
	  ln -s ../../Interop.EA.dll . )

lib/UmlToolingFramework:
	@(cd lib; ${GIT-CLONE} ${UTF_GIT})

lib/ADL/src/cs/ADLSharp.dll: lib/ADL
	@(cd lib/ADL/src/cs; ${MAKE})

lib/ADL:
	@mkdir -p lib
	@(cd lib; ${GIT-CLONE} ${ADL_GIT})

../../UmlCanvasSharp/build/UmlCanvasSharp.dll:
	@(cd ../../UmlCanvasSharp; ${MAKE} build/UmlCanvasSharp.dll)

../../UmlCanvasSharp/build/UmlCanvasSharp.UTF.dll:
	@(cd ../../UmlCanvasSharp; ${MAKE} build/UmlCanvasSharp.UTF.dll)

dist: clean-dist build/UmlCanvas.EA.Addin.dll
	@mkdir -p dist/UmlCanvas.EA.Addin
	@cp ${DIST_LIBS} dist/UmlCanvas.EA.Addin
	@cp build/UmlCanvas.EA.Addin.dll dist/UmlCanvas.EA.Addin
	@cp reg.bat addin.reg dist/UmlCanvas.EA.Addin
	@(cd dist/; ZIP UmlCanvas.EA.Addin.zip UmlCanvas.EA.Addin/* )

.PHONY:
clean:
	@rm -rf build

clean-dist:
	@rm -rf dist

mrproper: clean
	@rm -rf dist
	@rm -rf lib/ADL lib/UmlToolingFramework


