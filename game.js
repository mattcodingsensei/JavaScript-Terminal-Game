class Game {
    constructor() {
      this.playerHP = 15;
      this.playerGold = 1000;
      this.silverRing = 0;
      this.choice = 0;
      this.monsterHP = 15;
      this.monsterDamage = 0;
      this.playerWeapon = "Knife";
      this.playerName = "";
      this.playerPotions = ["Red Potion", ""];
    }


  
    // Helper function to get input from the user
    async getInput(question) {
      const readline = require("readline");
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
  
      return new Promise((resolve) => rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      }));
    }
  
    // Player Setup / Introduction
    async playerSetup() {
      console.log("---------------------------");
      console.log(
        "Welcome to the game. In a simpler world, you have been placed into a time to battle with your wits. Move up the rankings of your town, defeat the dragon, return the ring to the town's people, and break the curse. Your reward? Riches beyond measure and glory that rivals the ages."
      );
      console.log("---------------------------\n");
      console.log(`Your Health: ${this.playerHP}`);
      console.log(`Your Weapon: ${this.playerWeapon} [damage 5]`);
      console.log(`Your Gold: ${this.playerGold}`);
      console.log(`Your Potions: ${this.playerPotions[0]}\n`);
      console.log("---------------------------\n");
  
      const name = await this.getInput("What's your name, traveler? ");
      if (name.length < 1 || !/^[a-zA-Z]+$/.test(name)) {
        console.log("Please enter your name correctly...");
        return this.playerSetup();
      } else {
        this.playerName = name;
        console.log(`\nPleased to meet you, ${this.playerName}.`);
        return this.townGate();
      }
    }
  
    // Town Gate
    async townGate() {
      console.log("\nWelcome to the Town Gate.");
      console.log("There is a guard at the gate...");
      console.log("\nWhat do you want to do?");
      console.log("1. Talk to the guard");
      console.log("2. Attack the guard");
      console.log("3. Leave");
  
      const choice = parseInt(await this.getInput("> "));
      if (isNaN(choice)) {
        console.log("Please enter a valid number.");
        return this.townGate();
      }
  
      if (choice === 1) {
        if (this.silverRing === 1) {
          console.log("GAME WIN! You have defeated the dragon and returned the cursed ring. The town celebrates your victory!");
        } else {
          console.log(`Guard: Hello there, stranger. Your name was ${this.playerName}? Sorry, but we can't let a stranger into our town.`);
          console.log("Maybe if you defeated the dragon that's been terrifying our town and had the cursed ring to prove it...");
          return this.townGate();
        }
      } else if (choice === 2) {
        this.playerHP -= 1;
        console.log("Guard: Hey, don't be stupid! *The guard hit you so hard that you gave up...* [You receive 1 damage]");
        console.log(`Your Health: ${this.playerHP}`);
        if (this.playerHP < 1) {
          console.log("GAME OVER. You have no health left.");
          process.exit(0);
        }
        return this.townGate();
      } else if (choice === 3) {
        return this.crossRoads();
      } else {
        return this.townGate();
      }
    }
  
    // Cross Roads
    async crossRoads() {
      console.log("\n---------------------------");
      console.log("Welcome to the CrossRoads.");
      console.log("Where do you want to go?");
      console.log("1. South - Beware");
      console.log("2. North - Head Back to Town");
      console.log("3. West - Shop");
      console.log("4. East - Unknown");
  
      const choice = parseInt(await this.getInput("> "));
      if (isNaN(choice)) {
        console.log("Please enter a valid number.");
        return this.crossRoads();
      }
  
      if (choice === 1) {
        return this.south();
      } else if (choice === 2) {
        return this.townGate();
      } else if (choice === 3) {
        return this.west();
      } else if (choice === 4) {
        return this.east();
      } else {
        return this.crossRoads();
      }
    }
  
    // East
    async east() {
      console.log("\n---------------------------");
      console.log("Welcome to the East. It's peaceful here.");
      console.log("What do you want to do?");
      console.log("1. Leave");
      if (!this.playerPotions[1]) console.log("2. Pickup green potion");
  
      const choice = parseInt(await this.getInput("> "));
      if (isNaN(choice)) {
        console.log("Please enter a valid number.");
        return this.east();
      }
  
      if (choice === 1) {
        return this.crossRoads();
      } else if (choice === 2 && !this.playerPotions[1]) {
        this.playerPotions[1] = "Green Potion";
        console.log("You picked up a green potion!");
        return this.east();
      } else {
        return this.east();
      }
    }
  
    // West
    async west() {
      console.log("\n---------------------------");
      console.log("Welcome to the Shop. You look quite wealthy...");
      console.log("What do you want to do?");
      console.log("1. Buy Sword [1000 gold]");
      console.log("2. Leave");
  
      const choice = parseInt(await this.getInput("> "));
      if (isNaN(choice)) {
        console.log("Please enter a valid number.");
        return this.west();
      }
  
      if (choice === 1) {
        if (this.playerGold >= 1000) {
          this.playerGold -= 1000;
          this.playerWeapon = "Sword";
          console.log("You bought a sword!");
          return this.west();
        } else {
          console.log("You don't have enough gold!");
          return this.west();
        }
      } else if (choice === 2) {
        return this.crossRoads();
      } else {
        return this.west();
      }
    }
  
    // South
    async south() {
      console.log("\n---------------------------");
      console.log("Welcome to the South. You encounter a monster!");
      console.log("What do you want to do?");
      console.log("1. Fight the monster");
      console.log("2. Use a red potion");
      if (this.playerPotions[1]) console.log("3. Use a green potion");
      console.log("4. Leave");
  
      const choice = parseInt(await this.getInput("> "));
      if (isNaN(choice)) {
        console.log("Please enter a valid number.");
        return this.south();
      }
  
      if (choice === 1) {
        return this.fight();
      } else if (choice === 2) {
        this.playerHP += 1;
        console.log("You used a red potion! [Health +1]");
        return this.south();
      } else if (choice === 3 && this.playerPotions[1]) {
        console.log("You used a green potion! [Health +100]");
        this.playerHP += 100;
        this.playerPotions[1] = "";
        return this.south();
      } else if (choice === 4) {
        return this.crossRoads();
      } else {
        return this.south();
      }
    }
  
    // Fight
    async fight() {
      console.log("\n---------------------------");
      console.log("You are in a fight now!!");
      console.log("1. Attack!");
      console.log("2. Leave!");
  
      const choice = parseInt(await this.getInput("> "));
      if (isNaN(choice)) {
        console.log("Please enter a valid number.");
        return this.fight();
      }
  
      if (choice === 1) {
        return this.attack();
      } else if (choice === 2) {
        return this.south();
      } else {
        return this.fight();
      }
    }
  
    // Attack
    async attack() {
      const playerDamage =
        this.playerWeapon === "Knife"
          ? 1 + Math.floor(Math.random() * 5)
          : 1 + Math.floor(Math.random() * 12);
      console.log(`You attacked the monster and dealt ${playerDamage} damage!`);
      this.monsterHP -= playerDamage;
  
      if (this.monsterHP < 1) {
        console.log("You defeated the monster and gained the cursed ring!");
        this.silverRing = 1;
        return this.townGate();
      } else {
        this.monsterDamage = 1 + Math.floor(Math.random() * 5);
        this.playerHP -= this.monsterDamage;
        console.log(`The monster attacked you for ${this.monsterDamage} damage!`);
        if (this.playerHP < 1) {
          console.log("GAME OVER. You have no health left.");
          process.exit(0);
        } else {
          return this.fight();
        }
      }
    }
}

// Start the game
(async () => {
  console.log("Starting the game...");
  const game = new Game();
  await game.playerSetup();
})();