export type LessonSection = {
  id: string;
  type: "text" | "interactive";
  heading?: string;
  content: string;
  initialCode?: string;
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  sections: LessonSection[];
  linkedExerciseIds: string[];
};

export type CourseSection = {
  id: string;
  title: string;
  description: string;
  badgeToUnlock: string;
  badgeName: string;
  lessons: Lesson[];
};

export type Exercise = {
  id: string;
  title: string;
  instructions: string;
  initialCode: string;
  expectedOutput: string;
  points: number;
};

export const COURSE_SECTIONS: CourseSection[] = [
  {
    id: "sec_1",
    title: "Phase 1: Coding Basics",
    description: "Learn the fundamentals of Python to control your ship.",
    badgeToUnlock: "Navigator 🧭",
    badgeName: "Navigator 🧭",
    lessons: [
      {
        id: "l1",
        title: "1. Transmissions (Strings & Print)",
        description: "Learn how to send messages to the terminal.",
        linkedExerciseIds: ["e1_1", "e1_2"],
        sections: [
          {
            id: "l1_s1",
            type: "text",
            heading: "Hello, Universe!",
            content: "To communicate with the ship's computer, we use the `print()` command. In Python, text is called a **String**, and we wrap strings in quotation marks.",
          },
          {
            id: "l1_s2",
            type: "interactive",
            content: "Try running the code below. Then, change the text inside the quotes to your own name and run it again!",
            initialCode: 'print("Hello, Universe!")\nprint("Commencing launch sequence...")',
          }
        ],
      },
      {
        id: "l2",
        title: "2. Cargo Holds (Variables & Math)",
        description: "Store data and perform calculations.",
        linkedExerciseIds: ["e2_1", "e2_2"],
        sections: [
          {
            id: "l2_s1",
            type: "text",
            heading: "Storing Data",
            content: "Variables are like cargo crates. We give them a name, and we put data inside them using the equals sign (`=`). Variables can hold text (Strings) or numbers (Integers).",
          },
          {
            id: "l2_s2",
            type: "interactive",
            content: "Here we create a variable called `fuel` and print it. Try changing the fuel to 100.",
            initialCode: "fuel = 50\nprint(fuel)",
          },
          {
            id: "l2_s3",
            type: "text",
            heading: "Space Math",
            content: "Python can do math for us using standard symbols: `+` (add), `-` (subtract), `*` (multiply), and `/` (divide).",
          },
          {
            id: "l2_s4",
            type: "interactive",
            content: "Calculate the total cargo weight by adding food and water together.",
            initialCode: "food = 200\nwater = 150\ntotal_cargo = food + water\nprint(total_cargo)",
          }
        ],
      },
      {
        id: "l3",
        title: "3. Navigation Systems (Conditionals)",
        description: "Teach the computer how to make decisions.",
        linkedExerciseIds: ["e3_1", "e3_2"],
        sections: [
          {
            id: "l3_s1",
            type: "text",
            heading: "If / Else",
            content: "Sometimes we only want code to run *if* a certain condition is true. We use `if` and `else` statements for this. Notice that the code inside the 'if' block is **indented** (shifted to the right by pressing Tab).",
          },
          {
            id: "l3_s2",
            type: "interactive",
            content: "Change `shields_up` to False and see what happens when you run the code.",
            initialCode: "shields_up = True\n\nif shields_up == True:\n    print('Safe to enter asteroid field.')\nelse:\n    print('WARNING: Shields are offline!')",
          }
        ],
      },
      {
        id: "l4",
        title: "4. Orbital Mechanics (Loops)",
        description: "Repeat actions without repeating code.",
        linkedExerciseIds: ["e4_1", "e4_2"],
        sections: [
          {
            id: "l4_s1",
            type: "text",
            heading: "The For Loop",
            content: "A `for` loop lets us iterate over a sequence (like a list) or repeat an action a set number of times using `range()`.",
          },
          {
            id: "l4_s2",
            type: "interactive",
            content: "This loop will print 3 times. Try changing the range to 5.",
            initialCode: "for x in range(3):\n    print('Orbit complete!')",
          }
        ],
      },
      {
        id: "l5",
        title: "5. Automation Protocols (Functions)",
        description: "Create your own reusable commands.",
        linkedExerciseIds: ["e5_1", "e5_2"],
        sections: [
          {
            id: "l5_s1",
            type: "text",
            heading: "Defining Functions",
            content: "A function is a block of code you can reuse. You define it using `def`, give it a name, and then 'call' it later.",
          },
          {
            id: "l5_s2",
            type: "interactive",
            content: "Run this code to see the function execute. Then try calling `fire_thrusters()` a second time at the bottom!",
            initialCode: "def fire_thrusters():\n    print('Engaging engines...')\n    print('Whoosh!')\n\n# Calling the function:\nfire_thrusters()",
          }
        ],
      }
    ]
  },
  {
    id: "sec_2",
    title: "Phase 2: Object Oriented Programming",
    description: "Design complex systems using Classes and Objects.",
    badgeToUnlock: "Architect 🏗️",
    badgeName: "Architect 🏗️",
    lessons: [
      {
        id: "l6",
        title: "1. Ship Blueprints (Classes)",
        description: "Learn how to define custom blueprints for objects.",
        linkedExerciseIds: ["e6_1", "e6_2"],
        sections: [
          {
            id: "l6_s1",
            type: "text",
            heading: "What is a Class?",
            content: "A **Class** is like a blueprint. It defines what an object should look like and what it can do. We create a class using the `class` keyword.",
          },
          {
            id: "l6_s2",
            type: "interactive",
            content: "Here's a simple class for a Spaceship. Run it to see how we create an object from a class.",
            initialCode: "class Spaceship:\n    name = 'Explorer 1'\n\nmy_ship = Spaceship()\nprint(my_ship.name)",
          }
        ]
      },
      {
        id: "l7",
        title: "2. Initialization (__init__)",
        description: "Set up objects when they are created.",
        linkedExerciseIds: ["e7_1", "e7_2"],
        sections: [
          {
            id: "l7_s1",
            type: "text",
            heading: "The Constructor",
            content: "The `__init__` function is automatically called when a new object is created. We use it to set initial values. `self` refers to the object being created.",
          },
          {
            id: "l7_s2",
            type: "interactive",
            content: "Run this to see how we set different names for different ships.",
            initialCode: "class Spaceship:\n    def __init__(self, name):\n        self.name = name\n\nship1 = Spaceship('Apollo')\nship2 = Spaceship('Voyager')\nprint(ship1.name)\nprint(ship2.name)",
          }
        ]
      },
      {
        id: "l8",
        title: "3. Ship Capabilities (Methods)",
        description: "Give your objects actions they can perform.",
        linkedExerciseIds: ["e8_1", "e8_2"],
        sections: [
          {
            id: "l8_s1",
            type: "text",
            heading: "Methods",
            content: "Methods are functions inside a class. They define what an object can *do*.",
          },
          {
            id: "l8_s2",
            type: "interactive",
            content: "Let's give our ship the ability to scan.",
            initialCode: "class Spaceship:\n    def __init__(self, name):\n        self.name = name\n\n    def scan(self):\n        print(self.name + ' is scanning the area...')\n\nship = Spaceship('Discovery')\nship.scan()",
          }
        ]
      }
    ]
  },
  {
    id: "sec_3",
    title: "Phase 3: Data Structures",
    description: "Organize large amounts of data efficiently.",
    badgeToUnlock: "Data Master 💾",
    badgeName: "Data Master 💾",
    lessons: [
      {
        id: "l9",
        title: "1. Crew Manifests (Lists)",
        description: "Store multiple items in an ordered sequence.",
        linkedExerciseIds: ["e9_1", "e9_2"],
        sections: [
          {
            id: "l9_s1",
            type: "text",
            heading: "Creating Lists",
            content: "A List allows you to store multiple items in one place. We use square brackets `[]` to create a list, and separate items with commas.",
          },
          {
            id: "l9_s2",
            type: "interactive",
            content: "Here is a list of planets. We can use `.append()` to add a new one!",
            initialCode: "planets = ['Mars', 'Jupiter', 'Saturn']\nprint(planets)\n\nplanets.append('Neptune')\nprint('Updated:', planets)",
          }
        ],
      },
      {
        id: "l10",
        title: "2. Alien Logs (Dictionaries)",
        description: "Store data in key-value pairs.",
        linkedExerciseIds: ["e10_1", "e10_2"],
        sections: [
          {
            id: "l10_s1",
            type: "text",
            heading: "Key-Value Pairs",
            content: "A **Dictionary** stores data like a real dictionary: you look up a *key* to find a *value*. We use curly braces `{}`.",
          },
          {
            id: "l10_s2",
            type: "interactive",
            content: "Run this code to see how we look up the home planet of an alien.",
            initialCode: "alien_homes = {'Zorg': 'Mars', 'Glop': 'Venus'}\nprint(alien_homes['Zorg'])",
          }
        ]
      }
    ]
  },
  {
    id: "sec_4",
    title: "Phase 4: Algorithms",
    description: "Learn step-by-step problem solving methods.",
    badgeToUnlock: "Algorithm Ace ⚡",
    badgeName: "Algorithm Ace ⚡",
    lessons: [
      {
        id: "l11",
        title: "1. Asteroid Sorting (Sorting Arrays)",
        description: "How to organize data efficiently.",
        linkedExerciseIds: ["e11_1", "e11_2"],
        sections: [
          {
            id: "l11_s1",
            type: "text",
            heading: "Sorting",
            content: "Python has a built-in `sort()` method that can sort lists in ascending order. Under the hood, this uses an algorithm called Timsort!",
          },
          {
            id: "l11_s2",
            type: "interactive",
            content: "Sort these asteroids by size.",
            initialCode: "asteroids = [5, 2, 9, 1, 6]\nasteroids.sort()\nprint(asteroids)",
          }
        ]
      }
    ]
  }
];

export const EXERCISES: Exercise[] = [
  // Basics: Lesson 1
  {
    id: "e1_1",
    title: "Stadium Announcement",
    instructions: "We are hosting an intergalactic sports event at the Academy Stadium! Use the `print()` function to output: 'Welcome to the Games!'",
    initialCode: "# Write your print statement here:\n",
    expectedOutput: "Welcome to the Games!",
    points: 100,
  },
  {
    id: "e1_2",
    title: "System Status Check",
    instructions: "Print out the following system status: 'All systems green.'",
    initialCode: "# Print the status below:\n",
    expectedOutput: "All systems green.",
    points: 100,
  },
  // Basics: Lesson 2
  {
    id: "e2_1",
    title: "Light-speed Calculation",
    instructions: "Create a variable `distance` set to 50. Create a variable `speed` set to 10. Create a variable `time` that divides distance by speed. Print `time`.",
    initialCode: "# Create variables and calculate time:\n",
    expectedOutput: "5.0",
    points: 150,
  },
  {
    id: "e2_2",
    title: "Fuel Reserves",
    instructions: "You have 100 units of fuel. You consume 25 units. Create a variable `current_fuel` calculating the difference, then print it.",
    initialCode: "# Calculate and print remaining fuel:\n",
    expectedOutput: "75",
    points: 150,
  },
  // Basics: Lesson 3
  {
    id: "e3_1",
    title: "Alien Mushroom Classification",
    instructions: "We found a space-mushroom. The variable `color` is 'red'. Write an if/else statement: if color is 'red', print 'Toxic'. Else, print 'Safe'.",
    initialCode: "color = 'red'\n\n# Write your if/else statement below:\n",
    expectedOutput: "Toxic",
    points: 200,
  },
  {
    id: "e3_2",
    title: "Gravity Check",
    instructions: "Variable `gravity` is 9.8. If gravity is greater than 5.0, print 'Normal gravity'. Else, print 'Low gravity'.",
    initialCode: "gravity = 9.8\n\n# Write your logic here:\n",
    expectedOutput: "Normal gravity",
    points: 200,
  },
  // Basics: Lesson 4
  {
    id: "e4_1",
    title: "Launch Sequence",
    instructions: "Write a for loop using `range(3)` that prints the word 'Countdown'.",
    initialCode: "# Write your for loop here:\n",
    expectedOutput: "Countdown\nCountdown\nCountdown",
    points: 250,
  },
  {
    id: "e4_2",
    title: "Thruster Check",
    instructions: "Loop 2 times using `range(2)` and print 'Thruster OK'.",
    initialCode: "# Write your loop:\n",
    expectedOutput: "Thruster OK\nThruster OK",
    points: 250,
  },
  // Basics: Lesson 5
  {
    id: "e5_1",
    title: "FocusFlow Protocol",
    instructions: "Create a function called `study_mode()` that prints 'Focus active'. Then, call the function.",
    initialCode: "# Define the function:\n\n\n\n# Call the function:\n",
    expectedOutput: "Focus active",
    points: 300,
  },
  {
    id: "e5_2",
    title: "Shield Activator",
    instructions: "Define a function `activate_shields()` that prints 'Shields Up!'. Call it.",
    initialCode: "# Define and call function:\n",
    expectedOutput: "Shields Up!",
    points: 300,
  },
  // OOP: Lesson 6
  {
    id: "e6_1",
    title: "Droid Blueprint",
    instructions: "Create a class `Droid` with a variable `type` set to 'Astromech'. Create an instance called `my_droid` and print its type.",
    initialCode: "# Define class and instance:\n",
    expectedOutput: "Astromech",
    points: 300,
  },
  {
    id: "e6_2",
    title: "Station Class",
    instructions: "Create a class `Station` with `capacity` = 1000. Instantiate as `ds9` and print the capacity.",
    initialCode: "# Create class and instance:\n",
    expectedOutput: "1000",
    points: 300,
  },
  // OOP: Lesson 7
  {
    id: "e7_1",
    title: "Custom Droids",
    instructions: "Create a `Droid` class with an `__init__` that takes a `name`. Create a droid named 'R2-D2' and print its name.",
    initialCode: "# Define class with __init__:\n",
    expectedOutput: "R2-D2",
    points: 350,
  },
  {
    id: "e7_2",
    title: "Planet Registration",
    instructions: "Create a `Planet` class with `__init__` taking `name`. Create a planet 'Earth' and print it.",
    initialCode: "# Define Planet class:\n",
    expectedOutput: "Earth",
    points: 350,
  },
  // OOP: Lesson 8
  {
    id: "e8_1",
    title: "Beep Boop",
    instructions: "Add a method `speak()` to the `Droid` class that prints 'Beep boop!'. Call it on an instance.",
    initialCode: "class Droid:\n    def __init__(self, name):\n        self.name = name\n    \n    # Add speak method:\n\nmy_droid = Droid('BB-8')\n# Call speak:\n",
    expectedOutput: "Beep boop!",
    points: 400,
  },
  {
    id: "e8_2",
    title: "Ship Takeoff",
    instructions: "Add a method `launch()` to `Spaceship` that prints 'Liftoff!'. Call it.",
    initialCode: "class Spaceship:\n    # Add launch method:\n\nship = Spaceship()\n# Call launch:\n",
    expectedOutput: "Liftoff!",
    points: 400,
  },
  // Data Structures: Lesson 9
  {
    id: "e9_1",
    title: "Update the Roster",
    instructions: "You have a list of cadets. Use `.append()` to add 'Zorg' to the list. Then print the entire list.",
    initialCode: "cadets = ['Alice', 'Bob']\n\n# Append 'Zorg' and print:\n",
    expectedOutput: "['Alice', 'Bob', 'Zorg']",
    points: 200,
  },
  {
    id: "e9_2",
    title: "Accessing Data",
    instructions: "Print the first planet in the list.",
    initialCode: "planets = ['Mars', 'Venus', 'Earth']\n# Print index 0:\n",
    expectedOutput: "Mars",
    points: 200,
  },
  // Data Structures: Lesson 10
  {
    id: "e10_1",
    title: "Translation Matrix",
    instructions: "Create a dictionary `translation` with key 'hello' and value 'zorp'. Print the value for 'hello'.",
    initialCode: "# Create dictionary and print:\n",
    expectedOutput: "zorp",
    points: 250,
  },
  {
    id: "e10_2",
    title: "Crew Roles",
    instructions: "Dictionary `crew` has 'Alice': 'Captain'. Print Alice's role.",
    initialCode: "crew = {'Alice': 'Captain', 'Bob': 'Engineer'}\n# Print Alice's role:\n",
    expectedOutput: "Captain",
    points: 250,
  },
  // Algorithms: Lesson 11
  {
    id: "e11_1",
    title: "Sort the Coordinates",
    instructions: "Sort the list `coords` and print it.",
    initialCode: "coords = [8, 3, 5, 1, 9]\n# Sort and print:\n",
    expectedOutput: "[1, 3, 5, 8, 9]",
    points: 300,
  },
  {
    id: "e11_2",
    title: "Reverse Order",
    instructions: "Sort `numbers` in ascending order, then print it.",
    initialCode: "numbers = [10, 2, 7]\n# Sort and print:\n",
    expectedOutput: "[2, 7, 10]",
    points: 300,
  }
];