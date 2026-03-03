
public class SelectionSort {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		int[] array = {5, 4, 3, 2, 3, 1, 6};
		selection_sort(array);
		for (int e: array) {
			System.out.print(e + " ");
		}
	}

	public static void selection_sort(int[] a) {
		for (int i = 0; i < a.length; i++) {
			int min = a[i];
			int index_min = i;
			for (int j = i + 1; j < a.length; j++) {
				if (a[j] < min) {
					min = a[j];
					index_min = j;
				}
			}
			a[index_min] = a[i];
			a[i] = min;
		}
	}
}
