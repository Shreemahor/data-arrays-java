import java.util.Scanner;

public class Hangman {

	public static Scanner input = new Scanner(System.in);
	
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		do {play_hangman(get_word());} while (!input.nextLine().equals("n"));
		System.out.print("\nThank you for playing HANGMAN\nGoodbye!");
	}
	
	public static String get_word() {
		String[] word_bank = {"treehouse", "kingdom", "werewolf", "firefighter", "sunset", "magician", "hangman",
				"hotspot", "kangaroo", "plugin", "ambulance", "eraser", "array", "information", "quarantine"};
		int index = (int)(Math.random() * 15);
		return word_bank[index];
	}

	public static void play_hangman(String word) {
		System.out.println("Play Hangman!\n");
		int guess_number = 0;
		
		String[] word_array = new String[word.length()];
		for (int i = 0; i < word_array.length; i++) {
			word_array[i] = word.substring(i, i + 1);
		}
		
		String[] display_word = new String[word.length()];
		for (int i = 0; i < display_word.length; i++) {
			display_word[i] = "*";
		}
		
		while (guess_number < 7) {
			for (String e: display_word) {
				System.out.print(e);
			}
			
			System.out.print("\nEnter a letter in word: ");
			String guess = input.nextLine();

			boolean guess_in_word = false;
			for (int i = 0; i < word_array.length; i++) {
				if (display_word[i].equals(guess)) {
 					System.out.println(guess + " is already in the word");
 					hangman_picture(guess_number);
  					guess_in_word = true;
  					break;
				}
				if (word_array[i].equals(guess)) {
					display_word[i] = guess;
					guess_in_word = true;
				}
			}
			if (!guess_in_word) {
				guess_number++;
				System.out.println(guess + " is not in the word");	
				hangman_picture(guess_number);
			}
			
			boolean word_guessed_right = true;
			for (int i = 0; i < display_word.length; i++) {
				if (!display_word[i].equals(word_array[i])) {
					word_guessed_right = false;
				}
			}
			if (word_guessed_right) {
				System.out.println("The word is: " + word + " - You missed " + guess_number + " times"
						+ "\nBut you got it!");
				break;
			}
		}
		
		if (guess_number >= 7) {
			System.out.println("The word is " + word + " - you missed 7 times"
					+ "\nYou used up all chances");
		}
		
		System.out.print("Do you want to play hangman? y/n: ");
	}
	
	public static void hangman_picture(int guess_number) {
		if (guess_number == 1) {
			System.out.println("          &&|\r\n"
					+ "          &&|\r\n"
					+ "          &&|\r\n"
					+ "          &&|\r\n"
					+ "          CL \r\n"
					);
		}
		if (guess_number == 2) {
			System.out.println("          &&||&&\r\n"
					+ "          &&||&&\r\n"
					+ "          &&||&&\r\n"
					+ "          &&||&&\r\n"
					+ "          CL  LC\r\n"
					);
		}
		if (guess_number == 3) {
			System.out.println(" 	  NNNNNN  \r\n"
					+ "	  NNNNNN  \r\n"
					+ "          NNNNNN    \r\n"
					+ "          NNNNNN     \r\n"
					+ "          &&||&&     \r\n"
					+ "          &&||&&\r\n"
					+ "          &&||&&\r\n"
					+ "          &&||&&\r\n"
					+ "          CL  LC\r\n"
					);
		}
		if (guess_number == 4) {
			System.out.println(" 	  NNNNNN  \r\n"
					+ "	--NNNNNN  \r\n"
					+ "       /  NNNNNN    \r\n"
					+ "      /   NNNNNN     \r\n"
					+ "     O    &&||&&     \r\n"
					+ "          &&||&&\r\n"
					+ "          &&||&&\r\n"
					+ "          &&||&&\r\n"
					+ "          CL  LC"
					);
		}
		if (guess_number == 5) {
			System.out.println(" 	  NNNNNN  \r\n"
					+ "	--NNNNNN--  \r\n"
					+ "       /  NNNNNN  \\  \r\n"
					+ "      /   NNNNNN   \\  \r\n"
					+ "     O    &&||&&    O  \r\n"
					+ "          &&||&&\r\n"
					+ "          &&||&&\r\n"
					+ "          &&||&&\r\n"
					+ "          CL  LC\r\n"
					);
		}
		if (guess_number == 6) {
			System.out.println("          {[|]}\r\n"
					+ "          [{|}]\r\n"
					+ "          {[|]}\r\n"
					+ "          [{|}]\r\n"
					+ "          {[|]}\r\n"
					+ "           \\!/\r\n"
					+ "          /   \\\r\n"
					+ "          \\___/\r\n"
					+ "\r\n"
					+ "\r\n"
					+ "           ___\r\n"
					+ "          (❁◡❁)\r\n"
					+ "	  __|___\r\n"
					+ "	  NNNNNN  \r\n"
					+ "	--N^NN^N--\r\n"
					+ "       /  N\\__/N  \\\r\n"
					+ "      /   NNNNNN   \\\r\n"
					+ "     O    &&||&&    O\r\n"
					+ "          &&||&&\r\n"
					+ "          &&||&&\r\n"
					+ "          &&||&&\r\n"
					+ "          CL  LC\r\n"
					);
			System.out.println("Only one chance left!");
		}
		if (guess_number == 7) {
			System.out.println("	  {[|]}\r\n"
					+ "          [{|}]\r\n"
					+ "          {[|]}\r\n"
					+ "          [{|}]\r\n"
					+ "          {[|]}\r\n"
					+ "           \\!/\r\n"
					+ "         //____\\\\\r\n"
					+ "         \\(X﹏X)/\r\n"
					+ "          {{!}}\r\n"
					+ "	  __|___\r\n"
					+ "	  NNNNNN  \r\n"
					+ "	--NಥNNಥN--\r\n"
					+ "       /  NN__NN  \\\r\n"
					+ "      /   NNNNNN   \\\r\n"
					+ "     O    &&||&&    O\r\n"
					+ "          &&||&&\r\n"
					+ "          &&||&&\r\n"
					+ "          &&||&&\r\n"
					+ "          CL  LC\r\n"
					);
			System.out.println("|  |   /\\   |\\  |  /   |\\    /|   /\\   |\\  | | | |\r\n"
					+ "|__|  /__\\  | \\ | / __ | \\  / |  /__\\  | \\ | | | |\r\n"
					+ "|  | /    \\ |  \\| \\__/ |  \\/  | /    \\ |  \\| o o o ");
		}
	}
}