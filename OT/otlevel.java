package HiJell0.projects.ot;

public class OTLevel {
    public OTLevel() {

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
                    break;
                case 1:
                    level(2);
                    break;
                case 2:
                    level(3);
                    break;
                case 3:
                    level(5);
                    break;
                case 4:
                    level(5);
                    break;
                case 5:
                    level(6);
                    break;
                case 6:
                    level(13);
                    break;
                case 7:
                    level(8);
                    break;
                case 8:
                    level(10);
                    break;
                case 9:
                    level(13);
                    break;
                case 10:
                    level(0);
                    break;
                case 11:
                    level(13);
                    break;
                case 12:
                    level(13);
                    break;
                case 13:
                    level(14);
                    break;
            }
            buttonPressed();
        }
    
        private void buttonB() {
            switch (level){
                case 0:
                    level(1);
                    break;
                case 1:
                    level(2);
                    break;
            }
            buttonPressed();
        }
    
        private void buttonC(){}
        private void buttonD(){}
    
        private void buttonPressed(){
            buttonA.setVisible(false);
            buttonB.setVisible(false);
            buttonC.setVisible(false);
            buttonD.setVisible(false);
        }
    
        private void buttonsToFront() {
            buttonA.getParent().setComponentZOrder(buttonA, 0);
            buttonB.getParent().setComponentZOrder(buttonB, 0);
            buttonC.getParent().setComponentZOrder(buttonC, 0);
            buttonD.getParent().setComponentZOrder(buttonD, 0);
            repaint();
        }
}
