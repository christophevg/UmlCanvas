APP=UmlCanvas
VERSION=0.0.1
SRCS=src/${APP}.js
LIBS=lib/Canvas2D.js

FETCH=wget -q
GIT-FETCH=git clone -q
UNZIP=unzip -q
COMPRESS=java -jar lib/yuicompressor.jar --type js

TABBER-DIST=tabber.zip
TABBER-URL=http://www.barelyfitz.com/projects/tabber/${TABBER-DIST}

CANVAS2D-URL=http://git.thesoftwarefactory.be/pub/canvas2d.git

EXTLIBS=lib/tabber.css lib/tabber.js
EXTSRCS=src/${APP}.php src/${APP}.css build/${APP}.js ${EXTLIBS} LICENSE

COMPRESSOR=yuicompressor-2.4.2
COMPRESSOR-DIST=${COMPRESSOR}.zip
COMPRESSOR-URL=http://www.julienlecomte.net/yuicompressor/${COMPRESSOR-DIST}

DIST=${APP}-${VERSION}.tar.gz
DISTSRCS=build/${APP}.js examples doc LICENSE

DIST-EXT=${APP}-${VERSION}-ext.tar.gz

DIST-SRC=${APP}-${VERSION}-src.tar.gz
DIST-SRCSRCS=LICENSE README examples Makefile doc lib src

PUB=moonbase:~/dist/

all: ext

ext: dist/${DIST-EXT}

build: build/${APP}.js

dist: dist/${DIST} dist/${DIST-SRC} dist/${DIST-EXT}

lib/Canvas2D.js: lib/canvas2d
	@echo "*** importing canvas2d.js"
	@cp lib/canvas2d/build/Canvas2D.js $@

lib/canvas2d:
	@echo "*** cloning canvas2d repository"
	@${GIT-FETCH} ${CANVAS2D-URL} $@
	@echo "*** building canvas2d"
	@(cd $@; make)

lib/tabber.js: lib/tabber
	@echo "*** importing $@"
	@cp lib/tabber/tabber.js $@

lib/tabber.css: lib/tabber
	@echo "*** importing $@"
	@cp lib/tabber/example.css $@

lib/tabber: lib/${TABBER-DIST}
	@echo "*** unpacking tabber dist"
	@(cd lib; mkdir tabber; cd tabber; ${UNZIP} ../${TABBER-DIST})

lib/${TABBER-DIST}:
	@echo "*** fetching tabber dist"
	@mkdir -p lib
	@(cd lib; ${FETCH} ${TABBER-URL})

lib/yuicompressor.jar: lib/yuicompressor
	@echo "*** importing yuicompressor"
	@cp lib/yuicompressor/build/${COMPRESSOR}.jar $@

lib/yuicompressor: lib/${COMPRESSOR-DIST}
	@echo "*** unpacking compressor dist"
	@(cd lib; ${UNZIP} ${COMPRESSOR-DIST})
	@mv lib/${COMPRESSOR} $@
	@(cd lib/yuicompressor; ant)

lib/${COMPRESSOR-DIST}:
	@echo "*** fetching yuicompressor dist"
	@mkdir -p lib
	@(cd lib; ${FETCH} ${COMPRESSOR-URL})

build/${APP}.min.js: build/${APP}.js lib/yuicompressor.jar
	@${COMPRESS} $< >> $@

build/${APP}.js: ${SRCS} ${LIBS}
	@echo "*** assembling ${APP}"
	@mkdir -p build
	@echo "/*" > $@
	@cat LICENSE >> $@
	@echo "*/" >> $@
	@cat ${LIBS} ${SRCS} >> $@

publish: dist/${DIST} dist/${DIST-SRC} dist/${DIST-EXT}
	@echo "*** publishing distributions to ${PUB}"
	@scp dist/${DIST} dist/${DIST-SRC} dist/${DIST-EXT} ${PUB}

dist/${DIST}: ${DISTSRCS}
	@echo "*** packaging ${APP}"
	@mkdir -p dist/js/${APP}
	@cp -r ${DISTSRCS} dist/js/${APP}
	@(cd dist/js; tar -zcf ../${DIST} ${APP})

dist/${DIST-EXT}: ${EXTSRCS}
	@echo "*** assembling ${APP} extension"
	@mkdir -p dist/ext/${APP}
	@cp ${EXTSRCS} dist/ext/${APP}/
	@(cd dist/ext; tar -zcf ../${DIST-EXT} ${APP})

dist/${DIST-SRC}: 
	@echo "*** packaging src distribution"
	@mkdir -p dist/src/${APP}
	@cp -r ${DIST-SRCSRCS} dist/src/${APP}
	@(cd dist/src; tar -zcf ../${DIST-SRC} ${APP})

clean:
	@find . | grep "~$$" | xargs rm
	@rm -rf build dist

mrproper: clean
	@rm -rf lib
