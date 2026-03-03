
public class merge {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		int[] arr1 = {1, 2, 3, 4, 5};
		int[] arr2 = {3, 4, 5, 6, 7, 8, 9, 10};
		int[] my_sample_output_arr1 = {9, 10, 11};
		int[] my_sample_output_arr2 = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
		int[] result = new int[arr1.length + arr2.length];
		
		System.out.println("List1:");
		for (int e: arr1) {
			System.out.print(e + " ");
		}
		System.out.println("\nList2:");
		for (int e: arr2) {
			System.out.print(e + " ");
		}
		System.out.println("\nList1 and List2 merged: ");
		merge(arr1, arr2, result);
	}
	
	public static void merge(int[] a1, int[] a2, int[] result) {
		int i1 = 0; int i2 = 0; int i = 0;
		while (i1 < a1.length && i2 < a2.length) {
			if (a1[i1] < a2[i2]) {
				result[i] = a1[i1];
				i1++;
			}
			else if (a2[i2] < a1[i1]) {
				result[i] = a2[i2];
				i2++;
			}
			i++;
		}
		while (i1 < a1.length) {
			result[i] = a1[i1];
			i1++;
			i++;
		}
		while (i2 < a2.length) {
			result[i] = a2[i2];
			i2++;
			i++;
		}
		for (int e: result) {
			System.out.print(e + " ");
		}
	}

}
