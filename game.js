class Game {
  constructor() {
    this.playerHP = 15;
    this.playerGold = 1000;
    this.silverRing = 0;
    this.monsterHP = 15;
    this.monsterDamage = 0;
    this.playerWeapon = "Knife";
    this.playerName = "";
    this.playerPotions = ["Red Potion", ""];

    this.terminal = document.getElementById('terminal');
    this.form = document.getElementById('input-form');
    this.input = document.getElementById('user-input');

    this.awaitingInput = null;

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = this.input.value.trim();
      this.input.value = "";
      if (this.awaitingInput) {
        const callback = this.awaitingInput;
        this.awaitingInput = null;
        callback(value);
      }
    });

    this.print("Starting the game...");
    this.playerSetup();
  }

  print(text) {
    this.terminal.innerText += text + "\n";
    this.terminal.scrollTop = this.terminal.scrollHeight;
  }

  getInput(promptText) {
    this.print(promptText);
    return new Promise((resolve) => {
      this.awaitingInput = resolve;
    });
  }

  async playerSetup() {
    this.print("---------------------------");
    this.print("Welcome to the game. In a simpler world, you have been placed into a time to battle with your wits...");
    this.print("---------------------------");
    this.print(`Your Health: ${this.playerHP}`);
    this.print(`Your Weapon: ${this.playerWeapon} [damage 5]`);
    this.print(`Your Gold: ${this.playerGold}`);
    this.print(`Your Potions: ${this.playerPotions[0]}`);
    this.print("---------------------------");

    const name = await this.getInput("What's your name, traveler?");
    if (name.length < 1 || !/^[a-zA-Z]+$/.test(name)) {
      this.print("Please enter your name correctly...");
      return this.playerSetup();
    } else {
      this.playerName = name;
      this.print(`\nPleased to meet you, ${this.playerName}.`);
      return this.townGate();
    }
  }

  async townGate() {
    this.print("\nWelcome to the Town Gate.");
    this.print("There is a guard at the gate...");
    this.print("1. Talk to the guard");
    this.print("2. Attack the guard");
    this.print("3. Leave");

    const choice = await this.getInput("> ");
    switch (parseInt(choice)) {
      case 1:
        if (this.silverRing === 1) {
          this.print("GAME WIN! You have defeated the dragon and returned the cursed ring. The town celebrates your victory!");
        } else {
          this.print(`Guard: Hello there, stranger. Your name was ${this.playerName}? Sorry, but we can't let a stranger into our town.`);
          this.print("Maybe if you defeated the dragon and had the cursed ring to prove it...");
          return this.townGate();
        }
        break;
      case 2:
        this.playerHP -= 1;
        this.print("Guard hits you! [-1 HP]");
        this.print(`Your Health: ${this.playerHP}`);
        if (this.playerHP < 1) {
          this.print("GAME OVER. You have no health left.");
          return;
        } else {
          return this.townGate();
        }
      case 3:
        return this.crossRoads();
      default:
        this.print("Please enter a valid number.");
        return this.townGate();
    }
  }

  async crossRoads() {
    this.print("\n---------------------------");
    this.print("Welcome to the CrossRoads.");
    this.print("1. South - Beware");
    this.print("2. North - Head Back to Town");
    this.print("3. West - Shop");
    this.print("4. East - Unknown");

    const choice = await this.getInput("> ");
    switch (parseInt(choice)) {
      case 1: return this.south();
      case 2: return this.townGate();
      case 3: return this.west();
      case 4: return this.east();
      default:
        this.print("Please enter a valid number.");
        return this.crossRoads();
    }
  }

  async east() {
    this.print("\n---------------------------");
    this.print("Welcome to the East. It's peaceful here.");
    this.print("1. Leave");
    if (!this.playerPotions[1]) this.print("2. Pickup green potion");

    const choice = await this.getInput("> ");
    const c = parseInt(choice);
    if (isNaN(c)) return this.east();

    if (c === 1) return this.crossRoads();
    if (c === 2 && !this.playerPotions[1]) {
      this.playerPotions[1] = "Green Potion";
      this.print("You picked up a green potion!");
      return this.east();
    }
    return this.east();
  }

  async west() {
    this.print("\n---------------------------");
    this.print("Welcome to the Shop. You look quite wealthy...");
    this.print("1. Buy Sword [1000 gold]");
    this.print("2. Leave");

    const choice = await this.getInput("> ");
    const c = parseInt(choice);
    if (isNaN(c)) return this.west();

    if (c === 1) {
      if (this.playerGold >= 1000) {
        this.playerGold -= 1000;
        this.playerWeapon = "Sword";
        this.print("You bought a sword!");
      } else {
        this.print("You don't have enough gold!");
      }
      return this.west();
    } else if (c === 2) {
      return this.crossRoads();
    }
    return this.west();
  }

  async south() {
    this.print("\n---------------------------");
    this.print("Welcome to the South. You encounter a monster!");
    this.print("1. Fight the monster");
    this.print("2. Use a red potion");
    if (this.playerPotions[1]) this.print("3. Use a green potion");
    this.print("4. Leave");

    const choice = await this.getInput("> ");
    const c = parseInt(choice);
    if (isNaN(c)) return this.south();

    if (c === 1) return this.fight();
    if (c === 2) {
      this.playerHP += 1;
      this.print("You used a red potion! [Health +1]");
      return this.south();
    }
    if (c === 3 && this.playerPotions[1]) {
      this.playerHP += 100;
      this.playerPotions[1] = "";
      this.print("You used a green potion! [Health +100]");
      return this.south();
    }
    if (c === 4) return this.crossRoads();
    return this.south();
  }

  async fight() {
    this.print("\n---------------------------");
    this.print("You are in a fight now!!");
    this.print("1. Attack!");
    this.print("2. Leave!");

    const choice = await this.getInput("> ");
    const c = parseInt(choice);
    if (isNaN(c)) return this.fight();

    if (c === 1) return this.attack();
    if (c === 2) return this.south();
    return this.fight();
  }

  async attack() {
    const playerDamage = this.playerWeapon === "Knife"
      ? 1 + Math.floor(Math.random() * 5)
      : 1 + Math.floor(Math.random() * 12);
    this.monsterHP -= playerDamage;
    this.print(`You attacked the monster and dealt ${playerDamage} damage!`);

    if (this.monsterHP < 1) {
      this.print("You defeated the monster and gained the cursed ring!");
      this.silverRing = 1;
      return this.townGate();
    } else {
      this.monsterDamage = 1 + Math.floor(Math.random() * 5);
      this.playerHP -= this.monsterDamage;
      this.print(`The monster attacked you for ${this.monsterDamage} damage!`);

      if (this.playerHP < 1) {
        this.print("GAME OVER. You have no health left.");
        return;
      } else {
        return this.fight();
      }
    }
  }
}

window.onload = () => new Game();
