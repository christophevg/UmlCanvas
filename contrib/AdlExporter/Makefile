NAME=AdlExporter
VERSION=0.0.1
CC=gmcs
CFLAGS=-target:library
SRCS=addin.cs
LIBS=-r:System.Windows.Forms.dll -r:Interop.EA.dll
TRG=addin.dll
BUILD-DIR=../../build/ext/${NAME}
DIST-DIR=../../dist/ext/${NAME}
DIST-SRCS=${BUILD-DIR}/${TRG} reg.bat addin.reg README ../../LICENSE
DIST=${NAME}-${VERSION}

all: build

dist: ${DIST-SRCS}
	@mkdir -p ${DIST-DIR}
	@cp ${DIST-SRCS} ${DIST-DIR}
	@(cd ${DIST-DIR}; cd ..; tar -zcf ../${DIST}.tar.gz ${NAME})

${DIST-SRCS}: build

build: ${TRG}
	@mkdir -p ${BUILD-DIR}
	@cp $< ${BUILD-DIR}

%.dll: %.cs
	@${CC} ${CFLAGS} ${LIBS} -out:$@ $<

.PHONY:
clean:
	@find . | grep "~$$" | xargs rm
	@rm -f ${TRG}
	@rm -rf ${BUILD-DIR} ${DIST-DIR} ../../dist/${DIST}.tar.gz

mrproper: clean
