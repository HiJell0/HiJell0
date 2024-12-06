import java.io.*;
import java.util.regex.*;
import java.nio.file.*;

public class HTMLDataParser {
    public static void main(String[] args) {
        String inputFilePath = "Data.txt";
        String outputFilePath = "parsed_data.csv";
        
        try {
            // Read the entire HTML content from the file
            String content = new String(Files.readAllBytes(Paths.get(inputFilePath)));
            
            // Regex pattern to extract data
            Pattern rowPattern = Pattern.compile(
                "<tr>\\s*<td.*?>(.*?)</td>\\s*" +
                "<td.*?>Location: (.*?)<br>\\s*Products: (.*?)</td>\\s*" +
                "<td.*?><a href=\"(.*?)\".*?</td>\\s*</tr>",
                Pattern.DOTALL);
            
            Matcher matcher = rowPattern.matcher(content);
            
            // Writing to CSV file
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputFilePath))) {
                // Write header
                writer.write("Name,Location,Products,Email");
                writer.newLine();
                
                // Parse and write each row
                while (matcher.find()) {
                    String name = matcher.group(1).trim();
                    String location = matcher.group(2).trim();
                    String products = matcher.group(3).trim().replace(",", ";"); // Avoid commas in CSV
                    String email = matcher.group(4).trim();
                    
                    // Write CSV row
                    writer.write(String.format("\"%s\",\"%s\",\"%s\",\"%s\"", name, location, products, email));
                    writer.newLine();
                }
            }
            
            System.out.println("Parsing complete. Data saved to " + outputFilePath);
        } catch (IOException e) {
            System.err.println("Error reading or writing file: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error parsing HTML: " + e.getMessage());
        }
    }
}
