#!/usr/bin/sed -f
s/"/'/g
s/^\([ ]*\)\([^: ]*\)[ ]*:[ ]*\([^;]*\);/\1\2:"\3",/g
s/^\([^{]*\) {/"\1": {/g

s/}/  "":"" },/g

# change CSS naming to JS variables
s/-color/Color/g
s/-top/Top/g
s/-bottom/Bottom/g
s/-left/Left/g
s/-right/Right/g
s/-align/Align/g
s/-decoration/Decoration/g
s/-size/Size/g
s/float/"float"/g

# make URL's configurable
s/'http:\/\/static.thesoftwarefactory.be\/images\/inspector\/\([^.]*\).png'/"+UmlCanvas.Config.Inspector.Icons.\1+"/g