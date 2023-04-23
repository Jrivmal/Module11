Client Code:
package application;
import java.io.*;
import java.net.*;
import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;
public class Client extends Application {
  // IO streams
  DataOutputStream toServer = null;
  DataInputStream fromServer = null;
  @Override // Override the start method in the Application class
  public void start(Stage primaryStage) {
    // Panel p to hold the label and text field
    BorderPane paneForTextField = new BorderPane();
    paneForTextField.setPadding(new Insets(5, 5, 5, 5)); 
    paneForTextField.setStyle("-fx-border-color: blue");
    paneForTextField.setLeft(new Label("Enter a number: "));
        TextField tf = new TextField();
    tf.setAlignment(Pos.BOTTOM_RIGHT);
    paneForTextField.setCenter(tf);
    
    BorderPane mainPane = new BorderPane();
     //Text area to display contents
    TextArea ta = new TextArea();
   mainPane.setCenter(new ScrollPane(ta));
    mainPane.setTop(paneForTextField);
        // Create a scene and place it in the stage
    Scene scene = new Scene(mainPane, 450, 200);
    primaryStage.setTitle("Client"); // Set the stage title
    primaryStage.setScene(scene); // Place the scene in the stage
    primaryStage.show(); // Display the stage
      tf.setOnAction(e -> {
      try {
        // Get the radius from the text field
        double number = Double.parseDouble(tf.getText().trim());
          // Send the radius to the server
        toServer.writeDouble(number);
        toServer.flush();
          // Get area from the server
        double area = fromServer.readDouble();
              //Display to the text area
      ta.appendText("Number is " + number +'\n');
      ta.appendText(number + " is prime" + '\n');
             
      }
      catch (IOException ex) {
        System.err.println(ex);
      }
    });
      try {
      // Create a socket to connect to the server
      Socket socket = new Socket("localhost", 8000);
      // Socket socket = new Socket("130.254.204.36", 8000);
      // Socket socket = new Socket("drake.Armstrong.edu", 8000);
      // Create an input stream to receive data from the server
      fromServer = new DataInputStream(socket.getInputStream());
      // Create an output stream to send data to the server
      toServer = new DataOutputStream(socket.getOutputStream());
    }
    catch (IOException ex) {
      ta.appendText(ex.toString() + '\n');
    }
  }

  /**
   * The main method is only needed for the IDE with limited
   * JavaFX support. Not needed for running from the command line.
   */
  public static void main(String[] args) {
    launch(args);
  }
}

Server Code:
package application;
import java.io.*;
import java.net.*;
import java.util.Date;
import javafx.application.Application;
import javafx.application.Platform;
import javafx.scene.Scene;
import javafx.scene.control.ScrollPane;
import javafx.scene.control.TextArea;
import javafx.stage.Stage;
public class Sever extends Application {
  @Override // Override the start method in the Application class
  public void start(Stage primaryStage) {
    // Text area for displaying contents
    TextArea ta = new TextArea();
    // Create a scene and place it in the stage
    Scene scene = new Scene(new ScrollPane(ta), 450, 200);
    primaryStage.setTitle("Server"); // Set the stage title
    primaryStage.setScene(scene); // Place the scene in the stage
    primaryStage.show(); // Display the stage
        new Thread( () -> {
      try {
        // Create a server socket
        ServerSocket serverSocket = new ServerSocket(8000);
        Platform.runLater(() ->
          ta.appendText("Server started at " + new Date() + '\n'));
  
        // Listen for a connection request
        Socket socket = serverSocket.accept();
          // Create data input and output streams
        DataInputStream inputFromClient = new DataInputStream(
          socket.getInputStream());
        DataOutputStream outputToClient = new DataOutputStream(
          socket.getOutputStream());
          while (true) {
          // Receive radius from the client
          double number = inputFromClient.readDouble();
  
          // Compute area
          //double area = radius * radius * Math.PI;
            int i, m=0,flag=0;
          		int n=3;
            m=n/2;
            if(n==0||n==1)
            	//System.out.println(n+" is prime number");	
            for(i=2;i<m;i++)
            	if(n%i==0)
            		flag=1;
            if(flag==0)
            	//System.out.println(n+" is not prime number");
  
          // Send area back to the client
          outputToClient.writeDouble(n);
            Platform.runLater(() -> {
            ta.appendText("Enter number to check prime number: " 
              + number + '\n');
            //ta.appendText("Area is: " + area + '\n'); 
          });
        }
      }
      catch(IOException ex) {
        ex.printStackTrace();
      }
    }).start();
  }

  /**
   * The main method is only needed for the IDE with limited
   * JavaFX support. Not needed for running from the command line.
   */
  public static void main(String[] args) {
    launch(args);
  }
}


