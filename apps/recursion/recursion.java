
public class recursion {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		int n1 = 3120;
		int n2 = 456;
		int gcd = euclidean_gcd(n1, n2);
		System.out.println(gcd);
		gcd = recursive_gcd(n1, n2);
		System.out.println(gcd);
		gcd = euclidean_gcd2(n1, n2);
		System.out.println(gcd);
        int number = 5; 
		System.out.println(number + " in binary is " + recursive_binary(number));
		
		String word = "noon";
		System.out.println(is_palindrome(word));

        Scanner input = new Scanner(System.in);
		System.out.print("Enter a number: ");
		int number = input.nextInt();
		System.out.println("Sum of squares is " + square_sum(number));

        Scanner input = new Scanner(System.in);
		System.out.print("Enter a number: ");
		int number = input.nextInt();
		System.out.println("Sum of consecutive numbers is " + consecutive_sum(number));
	}

	public static int euclidean_gcd(int n1, int n2) {
		n1 = Math.abs(n1);
		n2 = Math.abs(n2);
		if (n2 == 0) return n1;
		while (n1 % n2 != 0) {
			int rem = n1 % n2;
			n1 = n2;
			n2 = rem;
		}
		return n2;
	}
	
	public static int recursive_gcd(int n1, int n2) {
		n1 = Math.abs(n1);
		n2 = Math.abs(n2);
		if (n2 == 0) return n1;
		return recursive_gcd(n2, n1 % n2);
	}
	
	public static int euclidean_gcd2(int n1, int n2) {
		n1 = Math.abs(n1);
		n2 = Math.abs(n2);
		if (n1 == 0) return n2;
		if (n2 == 0) return n1;
		while (n1 != n2) {
			if (n1 > n2) n1 -= n2;
			else n2 -= n1;
		}
		return n1;
	}
	
	public static boolean is_palindrome(String w) {
		if (w.length() <= 1) return true;
		if (w.substring(w.length() - 1, w.length()).equals(w.substring(0, 1))) {
			w = w.substring(1, w.length() - 1);
		}
		else return false;
		return is_palindrome(w);
	}

    public static String recursive_binary(int n) {
		if (n == 0 || n == 1) return "" + n;
		return recursive_binary(n / 2) + n % 2;
	}

    public static int square_sum(int n) {
		if (n < 1) return n;
		return n * n + square_sum(n - 1);
	}

    public static int consecutive_sum(int n) {
		if (n < 1) return n;
		return n + consecutive_sum(n - 1);
	}
}
