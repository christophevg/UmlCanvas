<?php
/*
Copyright (c) 2009, Christophe VG <xtof@thesoftwarefactory.be>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

Redistributions of source code must retain the above copyright notice,
this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.

Neither the name of TheSoftwareFactory nor the names of its
contributors may be used to endorse or promote products derived from
this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

# Alert the user that this is not a valid entry point to MediaWiki 
# if they try to access the special pages file directly.
if (!defined('MEDIAWIKI')) {
  echo <<<EOT
  To install my extension, put the following line in LocalSettings.php:
  require_once( "\$IP/extensions/umlcanvas/umlcanvas.php" );
EOT;
        exit( 1 );
}

$wgExtensionFunctions[] = 'UMLCanvasInit';

// Extension credits that will show up on Special:Version    
$wgExtensionCredits['parserhook'][] = array(
	'name'         => 'UMLCanvas',
	'version'      => '1.0',
	'author'       => 'Christophe VG <xtof@thesoftwarefactory.be>', 
	'url'          => 'http://thesoftwarefactory.be/wiki/UMLCanvas',
	'description'  => 'Allows wiki editors to use a textual UML DSL, ' .
	                  'which gets rendered into a visual UML ' .
	                  'representation using the HTML5 canvas element.'
);

function UMLCanvasInit() {
  global $wgParser, $wgOut, $IP;
  $path = "../extensions/umlcanvas";

  $wgParser->setHook( 'umlcanvas', 'UMLCanvasRender' );

  $wgOut->addHeadItem('UMLCanvas-JS', 
		      "<script src=\"$path/umlcanvas.js\"></script>");  
  $wgOut->addHeadItem('UMLCanvas-CSS', 
		      "<link href=\"$path/umlcanvas.css\" ".
		      "rel=\"stylesheet\" type=\"text/css\" />");
  $wgOut->addHeadItem('UMLCanvas-Tabber-JS', 
		      "<script src=\"$path/tabber.js\"></script>");  
  $wgOut->addHeadItem('UMLCanvas-Tabber-CSS', 
		      "<link href=\"$path/tabber.css\" ".
		      "rel=\"stylesheet\" type=\"text/css\" />");
  return true;
}

function UMLCanvasRender( $input, $args, $parser ) {
  static $diagramCount = 1;
  $name   = isset($args['name']) ? $args['name'] : "diagram" . $diagramCount++;
  $width  = isset($args['width'] ) ? $args['width']  : 375;
  $height = isset($args['height']) ? $args['height'] : 200;
  $float  = isset($args['float'])  ? $args['float']  : "left";
  $showSource = isset( $args['show'] ) ? 
    (strpos( $args['show'], "source"  ) !== false ) : true;
  $showConsole = isset( $args['show'] ) ? 
    (strpos( $args['show'], "console" ) !== false ) : true;
  $showAbout = isset( $args['show'] ) ? 
    (strpos( $args['show'], "about"   ) !== false ) : true;
  
  $tabberWidth   = $width  + 20;
  $tabberHeight  = $height + 55;
  $sourceHeight  = $height - 27;
  $consoleHeight = $height;
  $aboutHeight   = $height;

  $canvas = <<<EOT
<div class="umlcanvas-tabcontainer" style="float:{$float}">
<div class="tabber" style="height:${tabberHeight}px;width:${tabberWidth}px;">
<div class="tabbertab">
<h2>Diagram</h2>
<div><canvas id="${name}" class="umlcanvas" width="${width}" height="${height}"></canvas></div>
</div>
EOT;

  if( $showSource ) {
    $canvas .= <<<EOT
<div class="tabbertab">
<h2>Source</h2>
<pre id="${name}Source" style="height:${sourceHeight}px;overflow:auto;">${input}</pre><script>UmlCanvas.registerDiagram( "${name}" );</script>
</div>

EOT;
  }

  if($showConsole) {
    $canvas .= <<<EOT
<div class="tabbertab">
<h2>Console</h2>
<textarea id="${name}Console" style="height:${consoleHeight}px;width:${width}px"></textarea>
</div>
EOT;
  }
  if($showAbout) {
    $canvas .= <<<EOT
<div class="tabbertab">
<h2>About</h2>
<textarea id="${name}About" style="height:${aboutHeight}px;width:${width}px">UMLCanvas, by Christophe VG & TheSoftwareFactory
Copyright 2009
http://thesoftwarefactory.be/wiki/UmlCanvas</textarea>
</div>
EOT;
  }

  $canvas .= "</div></div>\n\n";

  if( !$showSource ) {
      $canvas .= <<<EOT
<pre id="${name}Source" style="display:none;">${input}</pre>
<script>UmlCanvas.registerDiagram( "${name}" );</script>
EOT;

    }
  return $canvas;
}

?>