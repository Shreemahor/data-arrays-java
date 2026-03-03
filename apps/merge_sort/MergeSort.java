
public class MergeSort {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		int[] array = {5, 4, 3, 2, 3, 1, 6};
		merge_sort(array);
		for (int e: array) {
			System.out.print(e + " ");
		}
	}

	public static void merge_sort(int[] a) {
		if (a.length > 1) {
			// Dividing left side
			int mid = a.length / 2;
			int[] left = new int[mid];
			for (int i = 0; i < mid; i++) {
				left[i] = a[i];
			}
			merge_sort(left);
			
			// Dividing right side
			int right_length = a.length - mid;
			int[] right = new int[right_length];
			for (int i = 0; i < right_length; i++) {
				right[i] = a[mid + i];
			}
			merge_sort(right);
			
			merge(left, right, a);
		}
	}
	
	public static void merge(int[] a, int[] b, int[] temp) {
		int index_a = 0, index_b = 0, index_temp = 0;
		while (index_a < a.length && index_b < b.length) {
			if (a[index_a] < b[index_b]) {
				temp[index_temp] = a[index_a];
				index_temp++;
				index_a++;
			}
			else {
				temp[index_temp] = b[index_b];
				index_temp++;
				index_b++;
			}
		}
		// Copy any remaining elements from a
		while (index_a < a.length) {
			temp[index_temp] = a[index_a];
			index_temp++;
			index_a++;
		}
		// Copy any remaining elements from b
		while (index_b < b.length) {
			temp[index_temp] = b[index_b];
			index_temp++;
			index_b++;
		}
	}
}
