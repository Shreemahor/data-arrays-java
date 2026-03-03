import java.util.*;

public class SortsComparison {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		int size = 100000;
		int[] arr = new int[size];
		Random r = new Random(3);  // The seed is 3 for same sequence of random numbers
		for (int i = 0; i < arr.length; i++) {
			arr[i] = r.nextInt(1000);
		}
				
		Stopwatch sw = new Stopwatch();
		sw.start();
		System.out.println("Selection Sort has begun");
		selection_sort(arr);
//		System.out.println("Insertion Sort has begun");
//		insertion_sort(arr);
//		System.out.println("Merge sort has begun");
//		merge_sort(arr);
		
		sw.stop();
		System.out.println("That took " + sw.get_elapsed() + "ms");
	}
	
	// Selection Sort - faster than insertion sort for fully random 
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
	
	// Insertion Sort - faster than selection sort for half-sorted 
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
	
	// Merge Sort - fastest out of all and best for big data
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
	}
}
