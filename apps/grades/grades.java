import java.util.*;

public class grades {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Scanner input = new Scanner(System.in);
		
		System.out.print("Enter number of students: ");
		double[] grade_list = new double[input.nextInt()];
		System.out.print("Enter scores: ");
		for (int i = 0; i < grade_list.length; i++) {
			grade_list[i] = input.nextDouble();
		}
		
		double max = find_max(grade_list);
		int index = -1;
		for (double e: grade_list) {
			index += 1;
			System.out.print("Student " + (index) + " score: " + e + " grade: ");
			if (e >= max - 10) {
				System.out.println("A");
				}
			else if (e >= max - 20) {
				System.out.println("B");
				}
			else if (e >= max - 30) {
				System.out.println("C");
				}
			else if (e >= max - 40) {
				System.out.println("D");
				}
			else {
				System.out.println("F");
				}
		}
	}
	
	public static double find_max(double[] a) {
		double max = a[0];
		for (double e: a) {
			if (e > max) {
				max = e;
			}
		}
		return max;
	}
}
