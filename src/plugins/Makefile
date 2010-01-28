all: 
	echo don't do this anymore, until .css loading issue is resolved
	echo inspector.css needs to be on static.tsf

inspector.css.min.js: inspector.css.js
	@java -jar ../../lib/yuicompressor-2.4.2/build/yuicompressor-2.4.2.jar --type js $< > $@

inspector.css.js: inspector.css css-header.js css-footer.js
	@cat css-header.js  > $@
	@./css2js.sh $<    >> $@
	@cat css-footer.js >> $@

clean:
	@rm inspector.css.min.js
