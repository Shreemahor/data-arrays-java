public class ShiftShuffle {

	public static void main(String[] args) {
		// TODO Auto-generated method stub

		int[] arr3 = {1, 2, 3, 4, 5};
		print_array(reverse_array(arr3));
	}

	public static int[] shift_left(int[] a ) {
		int[] result = new int[a.length];
		int temp = a[0];
		for (int i = 0; i < a.length - 1; i++) {
			result[i] = a[i + 1];
		}
		result[a.length - 1] = temp;
		return result;
	}
	
	// changes the original array
	public static void shift_left_2(int[] a) {
		int temp = a[0];
		for (int i = 0; i < a.length - 1; i++) {
			a[i] = a[i + 1];
		}
		a[a.length - 1] = temp;
	}
	
	public static int[] shift_right(int[] a ) {
		int[] result = new int[a.length];
		int temp = a[a.length - 1];
		for (int i = a.length - 1; i > 0; i--) {
			result[i] = a[i - 1];
		}
		result[0] = temp;
		return result;
	}
	
	// changes
	public static void shift_right_2(int[] a ) {
		int temp = a[a.length - 1];
		for (int i = a.length - 1; i > 0; i--) {
			a[i] = a[i - 1];
		}
		a[0] = temp;
	}
	

	
	public static int[] reverse_array(int[] a) {
		int[] result = new int[a.length];
		for (int i = 0; i < a.length; i++) {
			result[i] = a[a.length - 1 - i];
		}
		return result;
	}
	
	public static void print_array(int[] a) {
		for (int e: a) {
			System.out.print(e + " ");
		}
		System.out.println();
	}
}
