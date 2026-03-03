public class lockers {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		boolean[] lockers = new boolean[100];
		
		for (int student_number = 1; student_number <= lockers.length; student_number++) {
			for (int locker = student_number; locker <= lockers.length; locker += student_number) {
				lockers[locker - 1] = !lockers[locker -1];
			}
		}
		
		int index = 0;
		for (boolean e: lockers) {
			if (e) {
				System.out.println("Locker number " + (index + 1) + " is open.");
			}
			index++;
		}
	}

}