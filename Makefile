COMPRESSOR-VERSION=2.4.2

MAKE=make
FETCH=wget -q
GIT-PULL=git pull -q
GIT-CLONE=git clone -q
ZIP=zip -qr
UNZIP=unzip -q
COMPRESS=java -jar ${COMPRESS-JAR} --type js

APP=UmlCanvas
TARGETS=build/${APP}.shared.min.js build/${APP}.standalone.min.js \
        build/${APP}.css 
VERSION=$(shell git describe --tags | cut -d'-' -f1,2)
SRCS=src/DepCheck.js \
     src/UmlCanvas.js \
     src/Common.js \
     src/Manager.js \
     src/Model.js \
     src/Diagram.js \
     src/Class.js src/Attribute.js src/Operation.js src/Parameter.js \
     src/ConnectorHeads.js \
     src/Association.js src/Role.js \
     src/Dependency.js src/ClientSupplier.js \
     src/Interface.js \
     src/Inheritance.js \
     src/Realization.js \
     src/KickStart.js \
     src/Defaults.js
CSSSRCS=src/${APP}.css lib/Canvas2D/build/Canvas2D.css
LIBS=lib/Canvas2D/build/Canvas2D.standalone.js

COMPRESSOR-DIST=yuicompressor-${COMPRESSOR-VERSION}.zip
COMPRESS-JAR=lib/yuicompressor-${COMPRESSOR-VERSION}/build/yuicompressor-${COMPRESSOR-VERSION}.jar
COMPRESSOR-URL=http://www.julienlecomte.net/yuicompressor/${COMPRESSOR-DIST}
CANVAS2D-URL=http://git.thesoftwarefactory.be/pub/Canvas2D.git

DIST=${APP}-${VERSION}.zip
DISTSRCS=${TARGETS} examples/*.html LICENSE README

DIST-SRC=${APP}-${VERSION}-src.zip
DIST-SRCSRCS=LICENSE README examples Makefile doc src

DIST-EXT=${APP}-${VERSION}-ext.zip
DIST-EXTSRCS=LICENSE \
             lib/Canvas2D/build/Canvas2D.standalone.min.js \
             build/${APP}.shared.min.js \
             build/${APP}.css \
             src/ext/${APP}.php

PUB=moonbase:~/dist/

all: build

build: .check-deps ${TARGETS}

update-libs:
	@(cd lib/Canvas2D; ${GIT-PULL}; ${MAKE} clean; ${MAKE} update-libs; ${MAKE})

.check-deps:
	@echo "*** checking dependencies"
	@echo "    (if you get errors in this section the cmd right before"
	@echo "     the error, is not found in your PATH)"
	@echo "    - zip"; which unzip >/dev/null
	@echo "    - touch"; which touch >/dev/null
	@echo "    - unzip"; which zip >/dev/null
	@echo "    - wget";  which wget >/dev/null
	@echo "    - git";  which git >/dev/null
	@echo "    - java";  which java >/dev/null
	@echo "*** FOUND all required commands on your system"
	@touch $@

dist: dist/${DIST} dist/${DIST-SRC} dist/${DIST-EXT}

lib/Canvas2D/build/Canvas2D.standalone.js: lib/Canvas2D
lib/Canvas2D/build/Canvas2D.css: lib/Canvas2D

lib/Canvas2D:
	@echo "*** importing $@"
	@${GIT-CLONE} ${CANVAS2D-URL} lib/Canvas2D
	@(cd lib/Canvas2D; ${MAKE})

${COMPRESS-JAR}:
	@echo "*** importing yuicompressor"
	@mkdir -p lib
	@(cd lib; ${FETCH} ${COMPRESSOR-URL}; ${UNZIP} ${COMPRESSOR-DIST})
	@(cd lib/yuicompressor-${COMPRESSOR-VERSION}; ant > /dev/null)

build/${APP}.shared.js: ${SRCS}
	@echo "*** building $@"
	@mkdir -p build
	@echo "var UMLCANVAS_VERSION = \"${VERSION}\";\n" > $@;
	@cat ${SRCS} >> $@

build/${APP}.standalone.js: build/${APP}.shared.js ${LIBS}
	@echo "*** building $@"
	@mkdir -p build
	@cat ${LIBS} build/${APP}.shared.js > $@

build/${APP}.shared.min.js: build/${APP}.shared.js ${COMPRESS-JAR}
	@echo "*** building $@"
	@${COMPRESS} build/${APP}.shared.js > $@

build/${APP}.standalone.min.js: build/${APP}.standalone.js ${COMPRESS-JAR}
	@echo "*** building $@"
	@${COMPRESS} build/${APP}.standalone.js > $@

build/${APP}.css: ${CSSSRCS}
	@echo "*** building $@"
	@mkdir -p build
	@cat ${CSSSRCS} > $@

publish: dist/${DIST} dist/${DIST-SRC} dist/${DIST-EXT}
	@echo "*** publishing distributions to ${PUB}"
	@scp dist/${DIST} dist/${DIST-SRC} dist/${DIST-EXT} ${PUB}

dist/${DIST}: ${DISTSRCS}
	@echo "*** packaging ${APP} distribution"
	@mkdir -p dist/js/${APP}/{examples,build}
	@for f in ${DISTSRCS}; do \
	    cat $$f | sed -e 's/\.\.\/build/../' > dist/js/${APP}/$$f; done
	@mv dist/js/${APP}/build/* dist/js/${APP}/; rm -rf dist/js/${APP}/build
	@(cd dist/js; ${ZIP} ../${DIST} ${APP})

dist/${DIST-SRC}: ${DIST-SRCSRCS}
	@echo "*** packaging ${APP} src distribution"
	@mkdir -p dist/src/${APP}
	@cp -r ${DIST-SRCSRCS} dist/src/${APP}
	@(cd dist/src; ${ZIP} ../${DIST-SRC} ${APP})

dist/${DIST-EXT}: ${DIST-EXTSRCS}
	@echo "*** packaging ${APP} Mediawiki extenstion"
	@mkdir -p dist/ext/${APP}
	@cp -r ${DIST-EXTSRCS} dist/ext/${APP}
	@(cd dist/ext; ${ZIP} ../${DIST-EXT} ${APP})

clean:
	@find . | grep "~$$" | xargs rm -f
	@rm -rf build dist

mrproper: clean
	@rm -rf lib .check-deps
