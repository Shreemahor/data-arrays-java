import java.io.*;
import java.util.*;

public class cerealData {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		System.out.println("The cereal data in the cereal array list is:");
		// For prettier formatting
		for (Cereal c: create_cereal_list()) {
			System.out.println(c);
		}
	}

	public static ArrayList<Cereal> create_cereal_list() {
		ArrayList<Cereal> cereal_list = new ArrayList<Cereal>();
		try (Scanner scan = new Scanner(new File("cerealData.txt"))) {
			while (scan.hasNext()) {
				String cereal_data = scan.nextLine();
				String[] one_cereal = cereal_data.split(",");
				
				String name = one_cereal[0];
				int calories = Integer.parseInt(one_cereal[1]);
				double fiber = Double.parseDouble(one_cereal[2]);
				double carbs = Double.parseDouble(one_cereal[3]);
				double serving_size = Double.parseDouble(one_cereal[4]);
				Cereal cereal_object = new Cereal(name, calories, fiber, carbs, serving_size);
				cereal_list.add(cereal_object);
			}
		}
		catch (IOException ex) {
			ex.printStackTrace();
		}
		return cereal_list;
	 }
}
 