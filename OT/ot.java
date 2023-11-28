package OT;

import java.awt.*;
import javax.swing.*;
import java.awt.event.*;
import javax.swing.border.LineBorder;

public class OT extends JPanel implements ActionListener {
    static final Dimension SCREEN_SIZE = new Dimension(1280, 720);
    private Image backgroundImage;
    JButton buttonA;
    JButton buttonB;
    JButton textBox;
    int resources;
    int level;
    int time;
    int men;

    public static void main(String[] args) {
        JFrame frame = new JFrame("OT Game");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setResizable(false);
        frame.add(new OT());
        frame.pack();
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }

    public OT() {
        time = 0;
        men = 10;
        resources = 0;
        setLayout();
        initializeButtons();
        level(0);
    }

    public void setLayout() {
        setLayout(null);
        setBackground(Color.black);
        setFocusable(true);
        setPreferredSize(SCREEN_SIZE);
    }

    private JButton createButton(int x, int y, int width, int height, Color color, String text) {
        JButton button = new JButton(text);
        button.setBounds(x, y, width, height);
        button.setBorder(new LineBorder(color));
        button.setBackground(color);
        button.setOpaque(true);
        button.setVisible(text.equals("TextBox"));
        button.addActionListener(this);
        button.setFocusable(false);
        return button;
    }

    private void initializeButtons() {
        // Making the buttons
        buttonA = createButton(800, 500, 200, 50, Color.white, "Choice A");
        buttonB = createButton(800, 550, 200, 50, Color.white, "Choice B");
        textBox = createButton(100, 550, 800, 150, Color.lightGray, "TextBox");
        // Giving them unique ID's
        buttonA.setActionCommand("buttonA");
        buttonB.setActionCommand("buttonB");
        textBox.setActionCommand("textBox");
        // Add buttons to the panel
        add(buttonA);
        add(buttonB);
        add(textBox);
        setComponentZOrder(textBox, 1); // Ensure textBox is at the back
        setComponentZOrder(buttonB, 0);
        setComponentZOrder(buttonA, 0);
    }

    // What happens when a button is pressed
    @Override
    public void actionPerformed(ActionEvent e) {
        switch (e.getActionCommand()) {
            case "textBox":
                textBox();
                break;
            case "buttonA":
                buttonA();
                break;
            case "buttonB":
                buttonB();
                break;
        }
    }

    // What happens when a button is pressed
    private void textBox() {
        buttonsToFront();
        buttonA.setVisible(true);
        buttonB.setVisible(true);
    }

    private void buttonA() {
        switch (level){
            case 0:
                level(1);
                time++;
                break;
            case 1:
                level(2);
                break;
            case 2:
                level(4);
                break;
            case 3:
                level(5);
                break;
            case 4:
                level(5);
                break;
            case 5:
                level(6);
                time++;
                break;
            case 6:
                level(13);
                break;
            case 7:
                level(8);
                break;
            case 8:
                level(5);
                break;
            case 9:
                level(1);
                time++;
                break;
            case 10:
                level(2);
                break;
            case 11:
                level(4);
                break;
            case 12:
                level(5);
                break;
            
        }
        buttonPressed();
    }

    private void buttonB() {
        switch (level){
            case 0:
                level(1);
                time++;
                break;
            case 1:
                level(2);
                break;
            case 2:
                level(4);
                break;
            case 3:
                level(3);
                break;
            case 4:
                level(5);
                break;
            case 5:
                level(1);
                time++;
                break;
            case 6:
                level(2);
                break;
            case 7:
                level(4);
                break;
            case 8:
                level(5);
                break;
            case 9:
                level(1);
                time++;
                break;
            case 10:
                level(2);
                break;
            case 11:
                level(4);
                break;
            case 12:
                level(5);
                break;
            
        }
        buttonPressed();
    }

    private void buttonPressed(){
        buttonA.setVisible(false);
        buttonB.setVisible(false);
    }

    private void buttonsToFront() {
        buttonA.getParent().setComponentZOrder(buttonA, 0);
        buttonB.getParent().setComponentZOrder(buttonB, 0);
        repaint();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        g.drawImage(backgroundImage, 0, 0, this.getWidth(), this.getHeight(), this);
        // Make the stats in the top left of the screen
        g.setColor(Color.black);
        g.fillRect(0, 0, 300, 30);
        g.setColor(new Color(102, 0, 204));
        g.drawRect(0, 0, 300, 30);
        g.setColor(Color.white);
        String stats = "Resources: " + resources + "   Men: " + men + "   Days Lost At Sea: " + time;
        g.drawString(stats, 10, 20);
    }

    public void setBackgroundImage(String imagePath) {
        backgroundImage = new ImageIcon(imagePath).getImage();
        repaint();
    }

    // Decides what is shown and written
    private void level(int newLevel) {
        level = newLevel;
        String image = null;
        String text = null;
        switch (level) {
            case 0:
                image = "/Applications/Games/OT/Images/ship.png";
                text = "starting text";
                break;
            case 10:
                image = "/Applications/Games/OT/Images/zoom.gif";
                text = "ZOOOOOOOMMMMMMMMMMM";
                break;
            case 1:
                image = "/Applications/Games/OT/Images/kitchen.jpg";
                text = "you see circe doing something with animals?";
                break;
            case 2:
                image = "/Applications/Games/OT/Images/sailing.jpg";
                text = "you r out of there";
                break;
            default:
                image = "/Applications/Games/OT/Images/city.jpg";
                text = "something did not work";
        }
        setBackgroundImage(image);
        textBox.setText(text);
    }
}
