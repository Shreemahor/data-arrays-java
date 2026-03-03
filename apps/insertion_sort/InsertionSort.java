
public class InsertionSort {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		int[] array = {5, 4, 3, 2, 3, 1, 6};
		insertion_sort(array);
		for (int e: array) {
			System.out.print(e + " ");
		}
	}

	public static void insertion_sort(int[] a) {
		for (int i = 1; i < a.length; i++) {
			int key = a[i];
			int index = i;
			while (index > 0 && key < a[index - 1]) {
				a[index] = a[index - 1];  // shift to right
				index--;
			}
			a[index] = key;  // insert key
		}
	}
}
