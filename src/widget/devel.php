<?php

$widget = join(file('widget.html'));

function insertWidget( $id ) {
  global $widget;
  echo str_replace( 'id="test"', 'id="'.$id.'"', 
       str_replace( 'id="testGenerated"', 'id="'.$id.'Generated"', 
       str_replace( 'id="testConsole"', 'id="'.$id.'Console"',        
       str_replace( '_for_test', '_for_'.$id, $widget ) ) ) );
}

?><html>
  <head>
    <link href="widget.css" rel="stylesheet" type="text/css"/>
    <script src="../../build/UmlCanvas.standalone.js"></script>
    <script src="widget.js"></script>  
    <style>
    PRE.code { 
      border-left: 5px solid #fa0;
      background-color: #ffe;
      padding: 5px;
      padding-left: 10px;      
    }
    </style>
  </head>
  <body>
    <h1>OldSkool</h1>
    <p>
      This is how it's been done up to now: insert a canvas tag in you HTML
      code, add a (hidden) element with ADL code in it and link the two
      based on their id's.<br/>
      Off course, this still works ;-)
    </p>
    <pre class="code">
&lt;canvas id="myOldSkoolCanvas" class="UmlCanvas">&lt;/canvas>
&lt;pre id="myOldSkoolCanvasSource" style="display:none;">
+dynamic diagram myDiagram {
  [@10,10] class myClass;
}
&lt;/pre></pre>
    <canvas id="myOldSkoolCanvas" class="UmlCanvas"></canvas>
    <pre id="myOldSkoolCanvasSource" style="display:none;">
      +dynamic diagram myDiagram {
        [@10,10] class myClass;
      }
    </pre>
    
    <h1>Version 0.3</h1>
    <p>
      As of version 0.3, UmlCanvas has a new interface to include your
      diagrams in HTML pages. The new interface allows far greater control and
      other ways to deal with the underlying data of the diagrams.
    </p>
    <h2>Local</h2>
    <p>
      Although the OldSkool style still is available, the new interface also
      offers a way to insert a UML diagram in your HTML documents which looks
      pretty much the same as before....
    </p>
    <pre class="code">
<b>&lt;script>  UmlCanvas.Widget.insert("local"); &lt;/script></b>
&lt;pre id="localSource" style="display:none;">
  +dynamic diagram myDiagram {
  [@10,10] class myClass;
}
&lt;/pre></pre>
    <?php insertWidget("local") ?>
    <script>  UmlCanvas.Widget.insert("local"); </script> 
    <pre id="localSource" style="display:none;">
      +dynamic diagram myDiagram {
        [@10,10] class myClass;
      }
    </pre>
    <p>
      But, off course, there is more than meets the eye ... It might seem that
      the <code>UmlCanvas.Widget.insert("local");</code> API call simply
      inserts the same <code>&lt;canvas></code> tags into the HTML stream. But
      that is not entirely true. The new API offers some new ways to interact
      with the UmlCanvas Widget.
    </p>

    <pre class="code">
&lt;script>  
  <b>var widget =</b> UmlCanvas.Widget.insert("localEditor"); 
  <b>widget.makeEditable();</b>
  <b>widget.showAsEditor();</b>
&lt;/script> 
&lt;pre id="localEditorSource" style="display:none;">
  +dynamic diagram myDiagram {
    [@10,10] class myClass;
  }
&lt;/pre></pre>
    
    <?php insertWidget("localEditor") ?>
    <script>  
      var widget = UmlCanvas.Widget.insert("localEditor"); 
      widget.makeEditable();
      widget.showAsEditor();
    </script> 
    <pre id="localEditorSource" style="display:none;">
      +dynamic diagram myDiagram {
        [@10,10] class myClass;
      }
    </pre>

    <p>
      By making the UmlCanvas Widget editable, we can now toggle between the 
      OldSkool view-only style and an editor, that enables interactive editing
      of the diagram and all properties. We can also choose which mode is
      shown.
    </p>
    
    <p>
      Also notice the resize handle on the bottom right of the editor. This
      allows you to resize your UmlCanvas interactively.
    </p>
    
    <p>
      Now, suddenly we also have access to some properties that previously
      weren't available. We see these for example in the new header that is
      show right above the diagram itself. Up to now, we just passed the id
      of the canvas element. But the <code>insert</code> method is in fact an
      overloaded method, which takes an <code>id</code> or a 
      <code>diagram hash</code>, which then is used to initialize the diagram
      object. Take a look at the following example to see how it works:
    </p>

<pre class="code">
&lt;script>  
  var widget = UmlCanvas.Widget.insert( <b>{ 
      id     : "localEditorWithInit",
      name   : "Demo Diagram",
      author : { username: "xtof" }
  }</b> ); 
  widget.makeEditable();
&lt;/script> 
&lt;pre id="localEditorWithInitSource" style="display:none;">
  +dynamic diagram myDiagram {
    [@10,10] class myClass;
  }
&lt;/pre></pre>
    
    <?php insertWidget("localEditorWithInit") ?>
    <script>  
      var widget = UmlCanvas.Widget.insert( { 
          id     : "localEditorWithInit",
          name   : "Demo Diagram",
          author : { username: "xtof" }
      } ); 
      widget.makeEditable();
    </script> 
    <pre id="localEditorWithInitSource" style="display:none;">
      +dynamic diagram myDiagram {
        [@10,10] class myClass;
      }
    </pre>   
    
    <p> 
      Now, if you know that the source of the diagram is loaded from
      the <code>Source</code> element, you might already guess that with this
      <code>diagram hash</code> can also take the source directly:
    </p>

    <pre class="code">
&lt;script>  
  var widget = UmlCanvas.Widget.insert( { 
    id     : "localEditorWithSource",
    name   : "Demo Diagram",
    author : { username: "xtof" },
    <b>src    : "+dynamic diagram myDiagram {\n" +
             "  [@10,10] class myClass;\n" +
             "}"</b>
    } ); 
  widget.makeEditable();
&lt;/script></pre>
    
    <?php insertWidget("localEditorWithSource") ?>
    <script>  
      var widget = UmlCanvas.Widget.insert( { 
          id     : "localEditorWithSource",
          name   : "Demo Diagram",
          author : { username: "xtof" },
          src    : "+dynamic diagram myDiagram {\n" +
                   "  [@10,10] class myClass;\n" +
                   "}"
      } ); 
      widget.makeEditable();
    </script> 
    
    <p>
      This way, you can include an editable version of UmlCanvas, compose your
      diagram and then import the source in your HTML-based document, and
      offer a static viewer for your visitors.
    </p>
    
    <p>
      With some server-side scripting, you could automate this nicely,
      offering an editor to only you and a viewer to your visitors. But
      wouldn't it be nice if UmlCanvas could offer this to you ?
    </p>
    
    <h2>Hosted UmlCanvas</h2>
    <p>
      Introducing the hosting service of UmlCanvas: Hosted UmlCanvas. Now you
      can design a diagram wherever you like, store it in a central location
      and include that very diagram everywhere you want.
    </p>
    
    <p>
      If you provide a diagram id, for which you don't supply some form of
      source - as an HTML element or in code - UmlCanvas will try to load that
      diagram from the Hosted UmlCanvas repository.
    </p>
    
    <p>
      There are basically two major possible scenario's here: you either have
      a Hosted UmlCanvas account and are logged in, or you're not. In case of
      the former, there are two minor sub-scenario's possible: you are the
      original author of the diagram (called the owner), or you're not, which
      makes you "just" an author. Let's take look at how the Widget behaves in
      all three scenario's:
    </p>
    
    <h3>Owner</h3>
    <p>
      As an owner, you basically get the same interface as when you make the
      Widget editable, but now you also get a <code>save</code> action, which
      off course enables you to update the diagram in the central UmlCanvas
      Repository.
    </p>
    <pre class="code">
&lt;script>  
  UmlCanvas.Widget.insert("SMpm2Xt8BZ");
&lt;/script></pre>
    <?php insertWidget("SMpm2Xt8BZ") ?>
    <script>  
      UmlCanvas.Widget.insert({ id: "SMpm2Xt8BZ", role: "owner" });
    </script>
    <p>
      "Euhm, mr developer... Isn't that pretty stupid. What stops me from
      adding additional API calls to enable editing?". True, but we don't
      care. The only things that gets "compromised" is that very instance, in
      that very browser. When submitting new data to the central repository,
      the server will check off course the permissions. The view in the
      browser, is nothing more that a simple viewer. There are not big secrets
      to be found here, not even passwords, since it is not the javascript in
      you page that authenticates with the central site. This is accomplished
      by the browser and requires you to log in separately. This creates in
      fact a kind of single-sign on, which identifies you as an author. But
      let's not get ahead of ourselves.
    </p>
    <p>
      For owners, we make the editor view the default, so you can start
      improving that diagram right away. O yeah, and if you're using our
      Hosted UmlCanvas service, we add a little advertising - sorry for that
      ;-) 
    </p>
    <h3>Author</h3>
    <p>
      Every user of the Hosted UmlCanvas service that is logged in, is
      considered an author and therefore is presented with editor, but without
      saving capabilities. This way, other authors can take a look at you're
      sources, and in the near future propose changes to you, leave comments,
      etc. And all this from any instance on any HTML-based document that
      includes a Hosted UmlCanvas.
    </p>
    <?php insertWidget("Proxy_Example") ?>
    <script>  
      UmlCanvas.Widget.insert({ id: "Proxy_Example", role: "author" });
    </script>

    <h3>Anonymous</h3>
    <p>
      Finally, there are also your visitors, who maybe don't have a Hosted
      UmlCanvas account, or are not logged in. To them, the viewer shows the
      diagram with a header and a footer and no controls to edit (or save) the
      diagram.
    </p>
    <?php insertWidget("anon") ?>
    <script>  
      UmlCanvas.Widget.insert("anon");
    </script>
    
    <h2>Custom Editor Designs</h2>
    <p>
      Don't like our design ? Make your own...
    </p>

    <p>
      The <tt>insertWidget()</tt> method inserts the different tabs with all 
      different forms to edit all aspects of the UmlCanvas. But ... if you 
      already created an element with an id that fits the naming conventions,
      then the <tt>insertWidget()</tt> method will use these elements and not
      insert new ones. This way, you can create your own editor.
    </p>

    <p>
      Below are all possible elements laid out in a simple tabular way. The 
      allowed element and the id of that element is also shown to illustrate 
      the naming scheme.
    </p>
    
    <div id="UC_container_for_myUmlCanvas" class="UC_container">
      <table width="100%" border="1">
        <tr>
          <td width="350" valign="top">
            <h3>canvas: myUmlCanvas</h3>
            <canvas id="myUmlCanvas" width="350" height="200" 
                    class="UmlCanvas UC_diagram"></canvas>
          </td>
          <td valign="top">
            <h3>textarea: UC_editor_for_myUmlCanvas</h3>
            <div style="height:200px">
              <textarea id="UC_editor_for_myUmlCanvas"
                        class="UC_editor"></textarea>
            </div>
          </td>
        </tr>
        <tr>
          <td width="350" valign="top">
            <h3>pre/textarea: myUmlCanvasSource</h3>
            <pre id="myUmlCanvasSource" class="UC_source">
 +dynamic diagram myDiagram {
   [@10,10] class myClass;
 }
            </pre>   
            <h3>textarea: myUmlCanvasGenerated</h3>
            <div style="height:100px">
              <textarea id="myUmlCanvasGenerated"
                        class="UC_generated"></textarea>
            </div>
          </td>
          <td valign="top">
            <h3>textarea: UC_errors_for_myUmlCanvas</h3>
            <div style="height:200px">
              <textarea id="UC_errors_for_myUmlCanvas"
                        class="UC_errors"></textarea>
            </div>            
          </td>
        </tr>
        <tr>
          <td width="350" valign="top">
            <h3>div: UC_info_for_myUmlCanvas</h3>
            <div id="UC_info_for_myUmlCanvas" class="UC_info"></div>
          </td>
          <td valign="top">
            <h3>textarea: UC_notes_for_myUmlCanvas</h3>
            <div style="height:200px">
              <textarea id="UC_notes_for_myUmlCanvas" 
                        class="UC_notes"></textarea>
            </div>
          </td>
        </tr>
        <tr>
          <td width="350" valign="top">
            <h3>div: UC_about_for_myUmlCanvas</h3>
            <div id="UC_about_for_myUmlCanvas" class="UC_about"></div>
          </td>
          <td valign="top">
            <h3>textarea: myUmlCanvasConsole</h3>
            <div style="height:200px">
              <textarea id="myUmlCanvasConsole"
                        class="UC_console"></textarea>
            </div>
          </td>
        </tr>
      </table>
    </div>
    
    <script>
      UmlCanvas.Widget.insert("myUmlCanvas");
    </script>

    <h1>TODO</h1>
    <ul>
      <li>clean up info form</li>
      <li>set entire header and footer from code</li>
      <li>implement links to HuC (or provided URL)</li>
      <li>resizing should only be available on diagram tab?</li>
      <li>notes are only visible if there is data or on Hosted</li>
      <li>activate saving of form</li>
      
      <li>create Makefile + perl script to turn widget.html into js</li>
      <li>compress, optimize,...</li>
      <li>move up to src/ of UmlCanvas</li>
      <li>test IE</li>
    </ul>
  </body>
</html>
