# DataArrays.java

<https://shreemahor.github.io/data-arrays-java>

## A playground for Java logic

***This is my collection of Java demos on the website above. Break algorithms, sort data, save teacups, and deconstruct code through interaction. Explore every corner to sharpen your Java fundamentals.***
<img width="3916" height="2187" alt="java-final-cover" src="https://github.com/user-attachments/assets/e91633d2-59bd-42cf-a4b6-64575c1a96eb" />

## Concepts

12 demos total covering:

- Arrays
  - Hangman
  - 100 Lockers
  - Math Operations
  - Merge Arrays
  - Grades
  - Shift & Shuffle
- Text I/O
  - Files Demo
- Recursion
  - Call stack visualization
- Data Manipulation
  - Selection Sort
  - Insertion Sort
  - Merge Sort
- ArrayLists
  - ArrayList alive

### Arrays

Arrays in Java are used to store a collection of the same type. They are *immutable* meaning that you can't change their size after declaration, and they are indexed
\- accessed through *array[index]*. They are declared like **'Class[] myArray = new Class[int numberOfElements];'**. Arrays are useful for storing sequential data.<br>*Hangman:*
<img width="1013" height="611" alt="image" src="https://github.com/user-attachments/assets/5dbb9ac3-ec2b-42f9-8ccb-1b0bb60d6a70" />

### Data Manipulation

DataArrays.java has animations for each sorting algorithm. So you can visually see how each works, sorting an array, each their own methods.

1. Selection Sort \- usually slowest \- faster than insertion sort for fully random data \- On^2 time
2. Insertion Sort \- slow \- less stubborn as selection sort and goes quicker for party sorted data \- On^2 time
3. Merge Sort - fastest - divide and conquer, then build sorted array strategy - Onlog(n) time

### Text I/O

*Read* files in Java, by giving **Scanner** access to a file. *Write* files using **PrintWriter**. When going through files, be sure to use a while loop with
'scan.hasNext()' and then use methods in your Scanner class to get what you need. But beware of errors, and implement proper handling - one way is to use a
*try catch loop to catch IOException*.
<img width="1101" height="919" alt="image" src="https://github.com/user-attachments/assets/77d09446-7253-441e-83eb-ac7c1e850ec9" />

### ArrayLists

ArrayLists are another way to store a collection in Java, but they are way **more flexible than arrays**. They can have *multiple different types in them*, and
they can constantly *change size*, and have elements added and removed from them. Access their elements with *arrayList.get(int index)*. Play the module to see how easy they
really are to change.

### Recursion

Recursion is when a method calls itself with modified parameters. These go into the **call stack** where the *first in comes last out*. New values
keep getting put on the stack until a **base case** is reached, and then everything is released backwards. But to really understand recursion, you need to play
the demo, and look at the code and call stack itself!
<img width="1143" height="540" alt="image" src="https://github.com/user-attachments/assets/a7f4bedf-ddec-4cb2-85f1-1d3bb0fbc15a" />

## How does it work?

### Core

***JAVA*** I coded the main logic in Java by myself (15 hours). I did this in *Eclipse* and worked on putting the page together in *VS Code*.
Additionally, the all the demos of the CS topics are based around Java - every code snippet is Java (also all the teacups).

### HTML, Javascript, and CSS

Unfortunately, Java can't be displayed in the browser by itself, so **HTML, Javascript, and CSS** are reuquired. The js is linked to the HTML and it is a conversion of the Java I made. The html follows a simple teal & coral color palette and has a 'Back to Menu' button on each app and each app as a 'card' to pick.

### Converting

I converted the java to js using *an ai model that I programmatically called*. The model is gpt 5 mini. I made all of the java being converted myself (15h and majority of the time tracked), and I custom coded the converter logic in python, and I needed to organize the outputs and manually enter them and fix them when the ai messed up, so by no means was this gpt's project. I needed to spend time coding to call the model itself in python, then refine its outputs and do everything else and make it better myself

### Art

I used *Emojis* for most of it including most thumbnails and titles, and just in general they are everywhere. I used *Emoji Kitchen* for the many different emotional states
of the teacup in Hangman, for the teacup coding in the front page hero, and for the thumbnails of the featured modules (spiral recursion man juggling, save icon with printer for text I/O). I would copy these into a word document then save it as a picture from there by right clicking.

## Limitations & Future

There are way more topics in java like classes, object oriented programming, and more data structures that I would cover in the future. But, I did learn lots of Java (main coding language), a decent
amount of html, js, and css (for the website), and a little python (the converting model). But in conclusion, this project was very fun to make and I learned a lot!
