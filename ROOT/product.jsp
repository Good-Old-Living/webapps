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
PreparedStatement prepStatement = connection.prepareStatement("select id,tn_image from mdm_product_line_item where product_id=?" );
PreparedStatement updateProdStatement = connection.prepareStatement("update mdm_product set id=?,tn_image=? where id=?" );
PreparedStatement updateProdItemStatement = connection.prepareStatement("update mdm_product_line_item set id=?,product_id=?, tn_image=?, temp_id=? where id=?" );

ResultSet rs = statement.executeQuery("SELECT id, name,tn_image from mdm_product order by product_category_id");

int prodCount = 1;
int prodItemCount = 1;
File file = new File("/scratch/app/apache-tomcat-8.5.4/webapps");
while (rs.next()) {
  String id = rs.getString("id");
  String tn_Image = rs.getString("tn_image");
  
  if (tn_Image != null) {
    File pFile = new File(file, tn_Image);
    File paFile = pFile.getParentFile();
    int bucFile = (int) (Math.abs(String.valueOf(prodCount).hashCode()) % 100);
    File target = new File(paFile.getParentFile().getParentFile(),bucFile+"/"+String.valueOf(prodCount));
    target.mkdirs();
    
    //boolean result = paFile.renameTo(new File(paFile.getParentFile(),String.valueOf(prodCount)));
    Path path = Files.move(paFile.toPath(), target.toPath(),StandardCopyOption.ATOMIC_MOVE);
    tn_Image = "/img/product/"+bucFile+"/"+String.valueOf(prodCount)+"/"+pFile.getName();
    out.println(path);
    //tn_Image = tn_Image.replace(id, String.valueOf(prodCount));
    
  }
  out.println("<p>"+prodCount+" "+id+" "+rs.getString("name")+" "+tn_Image+"</p>");
  System.out.println("<p>"+prodCount+" "+id+" "+rs.getString("name")+"</p>");
  
  updateProdStatement.setString(1, String.valueOf(prodCount));
  updateProdStatement.setString(2, tn_Image);
  updateProdStatement.setString(3, id);
  updateProdStatement.executeUpdate();


prepStatement.setString(1, rs.getString("id"));
ResultSet rs1 = prepStatement.executeQuery();
int c = 1;
while (rs1.next()) {
  String tnImage = rs1.getString("tn_image");
  out.println("<div style='margin-left:20px'>"+prodItemCount+" "+rs1.getString(1)+" "+tnImage+"</div>");
  System.out.println("<div style='margin-left:20px'>"+prodItemCount+" "+rs1.getString(1)+"</div>");
  updateProdItemStatement.setString(1, String.valueOf(prodItemCount));
  updateProdItemStatement.setString(2, String.valueOf(prodCount));
  updateProdItemStatement.setString(3, tn_Image);
  updateProdItemStatement.setString(4, rs1.getString("id"));
  updateProdItemStatement.setString(5, rs1.getString("id"));
  updateProdItemStatement.executeUpdate();
  prodItemCount++;
}

prodCount++;
}
rs.close();
statement.close();
connection.close();
%>




