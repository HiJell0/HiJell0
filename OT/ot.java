package OT;

import java.awt.*;
import javax.swing.*;
import java.awt.event.*;
import javax.swing.border.LineBorder;

public class OT extends JPanel implements ActionListener {
    static final Dimension SCREEN_SIZE = new Dimension(1280, 720);
    private Image backgroundImage;
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
        buttonA = createButton(800, 550, 200, 50, Color.white, "Choice A");
        buttonB = createButton(800, 500, 200, 50, Color.white, "Choice B");
        buttonC = createButton(800, 450, 200, 50, Color.white, "Choice C");
        buttonD = createButton(800, 400, 200, 50, Color.white, "Choice D");
        textBox = createButton(100, 550, 800, 150, Color.lightGray, "TextBox");
        // Giving them unique ID's
        buttonA.setActionCommand("buttonA");
        buttonB.setActionCommand("buttonB");
        buttonC.setActionCommand("buttonC");
        buttonD.setActionCommand("buttonD");
        textBox.setActionCommand("textBox");
        // Add buttons to the panel
        add(buttonA);
        add(buttonB);
        add(buttonC);
        add(buttonD);
        add(textBox);
        setComponentZOrder(textBox, 1); // Ensure textBox is at the back
        setComponentZOrder(buttonA, 0);
        setComponentZOrder(buttonB, 0);
        setComponentZOrder(buttonC, 0);
        setComponentZOrder(buttonD, 0);
    }

    // What happens when a button is pressed
    @Override
    public void actionPerformed(ActionEvent e) {
        switch (e.getActionCommand()) {
            case "textBox":
                OTLevel.textBox();
                break;
            case "buttonA":
                buttonA();
                break;
            case "buttonB":
                buttonB();
                break;
            case "buttonC":
                buttonC();
                break;
            case "buttonD":
                buttonD();
                break;
        }
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
        String stats = "Resources: " + resources + "   Men: " + men + "   Days Lost At Sea: " + time + " for testing purposes: " + level;
        g.drawString(stats, 10, 20);
    }

    public void setBackgroundImage(String imagePath) {
        backgroundImage = new ImageIcon(imagePath).getImage();
        repaint();
    }
/*
    // Decides what is shown and written
    private void level(int newLevel) {
        time++;
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
    */
}
