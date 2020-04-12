<%@ page import="java.sql.*" %>
<%@ page import="java.io.*" %>
<%@ page import="java.nio.file.*" %>
<%@ page import="javax.sql.*" %>
<%@ page import="javax.naming.*" %>

<% 



InitialContext cxt = new InitialContext();
if ( cxt == null ) {
   throw new Exception("Uh oh -- no context!");
}

DataSource ds = (DataSource) cxt.lookup( "java:/comp/env/jdbc/ecomDB" );

if ( ds == null ) {
   throw new Exception("Data source not found!");
}

System.out.println("$$$$$$$ "+ds);

Class.forName("com.mysql.jdbc.Driver");
//Connection connection = DriverManager.getConnection("jdbc:mysql://localhost/i2par?autoReconnect=true","i2par","i2par123");
Connection connection = ds.getConnection();
Statement statement = connection.createStatement();
PreparedStatement prepStatement = connection.prepareStatement("update mdm_product_line_item set tn_image=? where id=?" );
ResultSet rs = statement.executeQuery("select id, tn_image from mdm_product_line_item");

while (rs.next()) {
  
  String id = rs.getString("id");
  String tnImage = rs.getString("tn_image");
  if (tnImage != null) {
    int index = tnImage.lastIndexOf('/') + 1;
    tnImage = tnImage.substring(0,
                                    index)
            + "150x150/" + tnImage.substring(index);
  }
  out.println("<p>"+id+" "+tnImage+"</p>");
  prepStatement.setString(1, String.valueOf(tnImage));
  prepStatement.setString(2, id);
  prepStatement.executeUpdate();

}
rs.close();
statement.close();
connection.close();
%>




