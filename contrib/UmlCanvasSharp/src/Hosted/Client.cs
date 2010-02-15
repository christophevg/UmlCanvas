using System;
using System.IO;
using System.Net;
using System.Text;
using System.Web;

namespace TSF.UmlCanvas.Hosted {
  public class Diagram {
    public String id;
    public String name;
    public String descr  { 
      get { return this.descr; }
      set { this.descr = value.Replace( "\r", String.Empty ); } 
    }
    public int    width  { get; set; }
    public int    height { get; set; }
    public String src    { get; set; }
  } 

  public class Client {
    public static String save( Diagram diagram, 
                               String userId, String password )
    {
      try {
        String url ="http://hosted.umlcanvas.org/";
        String passwordHash = md5(password);

        String msg = userId + passwordHash + diagram.id 
                   + diagram.name + diagram.descr
                   + diagram.width.ToString() + diagram.height.ToString()
                   + diagram.src;

        String signature = md5(msg);

        String postData = 
          "name="       + System.Web.HttpUtility.UrlEncode(diagram.name) + 
          "&descr="     + System.Web.HttpUtility.UrlEncode(diagram.descr) +  
          "&author="    + System.Web.HttpUtility.UrlEncode(userId) +
          "&signature=" + signature + 
          "&width="     + diagram.width.ToString() + 
          "&height="    + diagram.height.ToString() + 
          "&src="       + System.Web.HttpUtility.UrlEncode(diagram.src);

        byte[] byteArray = Encoding.UTF8.GetBytes(postData);
        WebRequest request = WebRequest.Create( url + diagram.id );
        request.Method = "POST";
        request.ContentType = "application/x-www-form-urlencoded";
        request.ContentLength = byteArray.Length;
        Stream dataStream = request.GetRequestStream ();
        dataStream.Write (byteArray, 0, byteArray.Length);
        dataStream.Close ();

        WebResponse response = request.GetResponse ();
        dataStream = response.GetResponseStream ();
        StreamReader reader = new StreamReader(dataStream);
        reader.Close();
        dataStream.Close();
        response.Close();
        return url + diagram.id;
      } catch( Exception e ) {
        Console.WriteLine( e );
        return null;
      }
    }  
    
    public static string md5(string input) {
      System.Security.Cryptography.MD5CryptoServiceProvider x = 
        new System.Security.Cryptography.MD5CryptoServiceProvider();
      byte[] bs = System.Text.Encoding.UTF8.GetBytes(input);
      bs = x.ComputeHash(bs);
      System.Text.StringBuilder s = new System.Text.StringBuilder();
      foreach (byte b in bs) {
        s.Append(b.ToString("x2").ToLower());
      }
      return s.ToString();
    }
  }
}