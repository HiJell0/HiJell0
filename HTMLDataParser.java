import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.regex.*;
import java.nio.charset.StandardCharsets;

public class HTMLDataParser {
    public static void main(String[] args) {
        // Input and output file paths
        String inputFileName = "data.txt";
        String outputFileName = "parsed_data.csv";

        // Read the HTML content from the input file
        String htmlData = readFile(inputFileName);

        // Parse the data using regex
        List<String[]> parsedData = parseHTMLData(htmlData);

        // Write the parsed data to a CSV file
        writeCSV(parsedData, outputFileName);

        System.out.println("Data successfully exported to " + outputFileName);
    }

    private static String readFile(String fileName) {
        try {
            return Files.readString(Paths.get(fileName), StandardCharsets.UTF_8);
        } catch (IOException e) {
            System.err.println("Error reading file: " + fileName);
            e.printStackTrace();
            return "";
        }
    }

    private static List<String[]> parseHTMLData(String htmlData) {
        List<String[]> parsedData = new ArrayList<>();
        String rowRegex = "<tr>.*?</tr>";
        String nameRegex = "<td.*?>(.+?)</td>";
        String locationRegex = "Location: (.+?)<br>";
        String productsRegex = "Products: (.+?)(?:<|</td>)";
        String emailRegex = "href=\"mailto:(.+?)\"";

        Pattern rowPattern = Pattern.compile(rowRegex, Pattern.DOTALL);
        Matcher rowMatcher = rowPattern.matcher(htmlData);

        while (rowMatcher.find()) {
            String row = rowMatcher.group();
            try {
                String name = extractData(row, nameRegex);
                String location = extractData(row, locationRegex);
                String products = extractData(row, productsRegex);
                String email = extractData(row, emailRegex);

                parsedData.add(new String[] { name, location, products, email });
            } catch (Exception e) {
                System.err.println("Error parsing row: " + row);
            }
        }

        return parsedData;
    }

    private static String extractData(String text, String regex) {
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        throw new IllegalArgumentException("Data not found for regex: " + regex);
    }

    private static void writeCSV(List<String[]> data, String outputFileName) {
        try (PrintWriter writer = new PrintWriter(new File(outputFileName))) {
            // Write the header
            writer.println("Name,Location,Products,Email");

            // Write the data rows
            for (String[] row : data) {
                writer.println(String.join(",", row));
            }
        } catch (IOException e) {
            System.err.println("Error writing to file: " + outputFileName);
            e.printStackTrace();
        }
    }
}
