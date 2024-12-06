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

            // Regex pattern to extract data, including website, email, and Instagram
            Pattern rowPattern = Pattern.compile(
                "<tr>\\s*<td.*?>(.*?)</td>\\s*" +
                "<td.*?>Location: (.*?)<br>\\s*Products: (.*?)</td>\\s*" +
                "<td.*?>(.*?)</td>\\s*</tr>",
                Pattern.DOTALL);

            // Sub-patterns for extracting links (website, email, Instagram) from the third column
            Pattern websitePattern = Pattern.compile("<a href=\"(https?://[^\"]+)\".*?title=\"Open.*?Website\".*?>");
            Pattern emailPattern = Pattern.compile("<a href=\"(mailto:[^\"]+)\".*?>");
            Pattern instagramPattern = Pattern.compile("<a href=\"(https?://www\\.instagram\\.com/[^\"]+)\".*?>");

            Matcher matcher = rowPattern.matcher(content);

            // Writing to CSV file
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputFilePath))) {
                // Write header
                writer.write("Name,Location,Products,Website,Email,Instagram");
                writer.newLine();

                // Parse and write each row
                while (matcher.find()) {
                    String name = matcher.group(1).trim();
                    String location = matcher.group(2).trim();
                    String products = matcher.group(3).trim().replace(",", ";"); // Avoid commas in CSV
                    String thirdColumn = matcher.group(4);

                    // Extract links from the third column
                    String website = extractLink(websitePattern, thirdColumn);
                    String email = extractLink(emailPattern, thirdColumn);
                    String instagram = extractLink(instagramPattern, thirdColumn);

                    // Write CSV row
                    writer.write(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"",
                            name, location, products, website, email, instagram));
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

    /**
     * Helper method to extract a link using a regex pattern.
     *
     * @param pattern   The regex pattern to search for.
     * @param input     The input string to search within.
     * @return          The first matching link, or an empty string if no match is found.
     */
    private static String extractLink(Pattern pattern, String input) {
        Matcher linkMatcher = pattern.matcher(input);
        return linkMatcher.find() ? linkMatcher.group(1).trim() : "";
    }
}
