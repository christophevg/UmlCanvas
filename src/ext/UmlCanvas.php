<?php

# Alert the user that this is not a valid entry point to MediaWiki 
# if they try to access the special pages file directly.
if (!defined('MEDIAWIKI')) {
  echo <<<EOT
  To install my extension, put the following line in LocalSettings.php:
  require_once( "\$IP/extensions/UmlCanvas/UmlCanvas.php" );
EOT;
        exit( 1 );
}

$wgExtensionFunctions[] = 'UmlCanvasInit';

// Extension credits that will show up on Special:Version    
$wgExtensionCredits['parserhook'][] = array(
	'name'         => 'UmlCanvas',
	'version'      => '0.1.0',
	'author'       => 'Christophe VG <xtof@thesoftwarefactory.be>', 
	'url'          => 'http://thesoftwarefactory.be/wiki/UmlCanvas',
	'description'  => 'Allows wiki editors to use a textual DSL, ' .
	                  'which gets rendered shapes using the HTML5 '.
	                  'canvas element.'
);

function UmlCanvasInit() {
  global $wgParser, $wgOut, $wgScriptPath;
  $path = "$wgScriptPath/extensions/UmlCanvas";

  $wgParser->setHook( 'umlcanvas', 'UmlCanvasRender' );

  if( !$wgOut->hasHeadItem("Canvas2D-JS") ) {
    $wgOut->addHeadItem('Canvas2D-JS', 
			"<script src=\"$path/Canvas2D.standalone.min.js\">".
			"</script>");
  }
  $wgOut->addHeadItem('UmlCanvas-JS', 
		      "<script src=\"$path/UmlCanvas.shared.min.js\">".
		      "</script>");

  $wgOut->addHeadItem('UmlCanvas-CSS', 
		      "<link href=\"$path/UmlCanvas.css\" ".
		      "rel=\"stylesheet\" type=\"text/css\" />");
  return true;
}

function UmlCanvasRender( $input, $args, $parser ) {
  static $diagramCount = 1;
  $name   = isset($args['name']) ? $args['name'] : "umldiagram".$diagramCount++;
  $width  = isset($args['width'] ) ? $args['width']  : 375;
  $height = isset($args['height']) ? $args['height'] : 200;
  $float  = isset($args['float'])  ? $args['float']  : "left";

  $showSource = isset( $args['show'] ) ? 
    (strpos( $args['show'], "source"  ) !== false ) : false;
  $showConsole = isset( $args['show'] ) ? 
    (strpos( $args['show'], "console" ) !== false ) : false;
  $showAbout = isset( $args['show'] ) ? 
    (strpos( $args['show'], "about"   ) !== false ) : false;

  $classes = "";
  if( $showSource || $showConsole || $showAbout ) {
    $classes = " Tabbed";
    $classes .= ( $showSource  ? " withSource"  : "" );
    $classes .= ( $showConsole ? " withConsole" : "" );
    $classes .= ( $showAbout   ? " withAbout"   : "" );
  }
    
  $canvas = '<div class="UmlCanvas-container" style="float:'.$float.'">' .
    '<canvas class="UmlCanvas'.$classes.'" id="' . $name . 
    '" width="'.$width.'" height="'.$height.'"></canvas></div>';
  $canvas .= '<pre id="'.$name.'Source" style="display:none">' . 
    str_replace( " :", ":", str_replace( ": ", ":", $input ) ) . '</pre>';

  return $canvas;
}

?>