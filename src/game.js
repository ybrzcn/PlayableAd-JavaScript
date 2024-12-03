import { Container, Sprite, Text, Graphics } from "pixi.js";
import { gsap } from "gsap";
import { GAME_HEIGHT, GAME_WIDTH } from ".";

export default class Game extends Container {
  constructor() {
    super();

    this.selectedWord = '';
    this.wordList = ["GOD", "DOG", "LOG", "GOLD"];
    this.selectedLetters = [];

    this.init();
  }

  init() 
  {
    this.createBackground();
    this.createLetterGrid();
    this.createLetterCircle();
    this.createShuffleButton();
    this.setupInput();
  }

  createBackground() 
  {
    const bg= Sprite.from("assets/forapp/bg.png");
    bg.height=GAME_HEIGHT;
    bg.width=GAME_WIDTH;
   
    this.addChild(bg);
  }

    
    createLetterGrid() 
    { 
      this.wordContainer = new Container();
      let startY = 100;
      this.wordContainer.y = startY; 
      this.addChild(this.wordContainer); 

      this.firstRowContainer = this.createLetterGridBoxes(['_', '_', '_', '_']);
      this.wordContainer.addChild(this.firstRowContainer);

      this.secondRowContainer = this.createLetterGridBoxes(['_', ' ', '_']);
      this.wordContainer.addChild(this.secondRowContainer);

      this.thirdRowContainer = this.createLetterGridBoxes(['_', '_', '_']);
      this.wordContainer.addChild(this.thirdRowContainer);

      this.wordContainer.x = (GAME_WIDTH - this.wordContainer.width) / 2;

      this.firstRowContainer.y = 0;
      this.secondRowContainer.y = this.firstRowContainer.y + 100;
      this.thirdRowContainer.y = this.secondRowContainer.y + 100;

      this.addInteractionToWords();
    }

    createLetterGridBoxes(charArray) 
    {
        const rowContainer = new Container();
        let currentX = 0;

        charArray.forEach((char) => {
            let container = new Container();
            
            if (char === '_')
              {
                const background = Sprite.from("assets/forapp/rect.png");
                background.width = 90;
                background.height = 90;
                background.x = currentX;
                container.addChild(background);

                const underscoreText = new Text('_', {
                    fontSize: 50,
                    fill: 808080,
                    align: 'center',
                });
                underscoreText.anchor.set(0.5);
                underscoreText.x = currentX + background.width / 2;
                underscoreText.y = background.height / 2;
                container.addChild(underscoreText);

                currentX += background.width + 10;
              } 
            else 
              {
                const spaceText = new Text(' ', { fontSize: 24, fill: 0xffffff });
                spaceText.x = currentX;
                container.addChild(spaceText);
                currentX += 100;
              }

            rowContainer.addChild(container);
        });

        return rowContainer;
    }

    addInteractionToWords() 
    {
        this.wordContainer.children.forEach((rowContainer, rowIndex) => {
            rowContainer.children.forEach((child, colIndex) => {
                child.interactive = true;
                child.buttonMode = true;
                child.on('pointerdown', () => this.onWordSelected(rowIndex, colIndex));
            });
        });
    }

    onWordSelected(rowIndex, colIndex) 
    {
        const selectedText = `${rowIndex},${colIndex}`;
        console.log("Selected cell:", selectedText);
    }

    onLetterSelected(letter) 
    {
      if (this.selectedLetters.length >= 4) return;

      this.selectedLetters.push(letter);

      const formedWord = this.selectedLetters.join('');

      if (this.wordList.includes(formedWord)) 
        {
          console.log("Correct word found:", formedWord);

          this.showWordInGrid(formedWord);

          this.selectedLetters = [];
          this.selectedWord = '';
          
          this.clearSelectedLetterRow();
        } 
      else 
        {
            if (this.selectedLetters.length === 4) 
              {
                console.log("Word not found, will not show letters.");
                this.selectedLetters = [];
                this.clearSelectedLetterRow();
              } 
            else 
              {
                this.createSelectedLetterRow();
              }
        }
    }

  showWordInGrid(word) 
  {
    let rowContainer;
    let startColumnIndex = 0;

    switch (word) 
    {
        case 'GOLD':
            rowContainer = this.firstRowContainer;
            for (let i = 0; i < word.length; i++) {
                const box = rowContainer.children[i];
                const textElement = box.children[1];
                textElement.text = word[i];
            }
            break;

        case 'GOD':
            const godPositions = [
                { container: this.firstRowContainer, index: 0 },
                { container: this.secondRowContainer, index: 0 },
                { container: this.thirdRowContainer, index: 0 }
            ];

            for (let i = 0; i < word.length; i++) {
                const { container, index } = godPositions[i];
                const textElement = container.children[index].children[1];
                textElement.text = word[i];
            }
            break;

        case 'LOG':
            const logPositions = [
                { container: this.firstRowContainer, index: 2 },
                { container: this.secondRowContainer, index: 2 },
                { container: this.thirdRowContainer, index: 2 }
            ];

            for (let i = 0; i < word.length; i++) {
                const { container, index } = logPositions[i];
                const textElement = container.children[index].children[1];
                textElement.text = word[i];
            }
            break;

        case 'DOG':
            rowContainer = this.thirdRowContainer;
            for (let i = 0; i < word.length; i++) {
                const box = rowContainer.children[i];
                const textElement = box.children[1];
                textElement.text = word[i];
            }
            break;

        default:
            console.log("Word is not defined!");
            return;
    }
  }


  createSelectedLetterRow() 
  {
    if (this.letterGrid) {
        this.removeChild(this.letterGrid);
    }

    this.letterGrid = new Container();

    const startY = GAME_HEIGHT / 3 + 175;
    const maxLetters = 4;
    const boxSize = 50;
    const spacing = 20;
    const totalWidth = maxLetters * (boxSize + spacing) - spacing;
    const startX = (GAME_WIDTH - totalWidth) / 2;

    this.selectedLetters.slice(0, maxLetters).forEach((letter, index) => {
        const letterBox = Sprite.from("assets/forapp/rect.png");
        letterBox.width = boxSize;
        letterBox.height = boxSize;
        letterBox.x = startX + index * (boxSize + spacing);
        letterBox.y = startY;
        letterBox.anchor.set(0.5);

        const letterText = new Text(letter, {
            fontSize: 40,
            fill: 0x808080,
        });
        letterText.anchor.set(0.5);
        letterText.x = letterBox.x;
        letterText.y = letterBox.y;

        this.letterGrid.addChild(letterBox);
        this.letterGrid.addChild(letterText);
    });

    this.addChild(this.letterGrid);
  }

  clearSelectedLetterRow() 
  {
    if (this.letterGrid) 
      {
        this.letterGrid.removeChildren();
        this.removeChild(this.letterGrid);
        this.letterGrid = null;
      }
  }


  setupInput() 
  {
    this.on("pointerup", () => {

        if (this.selectedLetters.length === 4) 
          {
            this.selectedWord = this.selectedLetters.join("");

            if (this.checkWord(this.selectedWord)) 
              {
                this.updateWordGrid(this.selectedWord);
                this.clearSelectedLetterRow();
              }

            this.selectedLetters = [];
            this.selectedWord = ''; 
          }
    });
  }

  checkWord(word) 
  {
    const normalizedWord = word.trim().toUpperCase();
    return this.wordList.includes(normalizedWord);
  }


  updateWordGrid(word) 
  {
    const wordText = this.wordContainer.children.find((child) => child.text === word);
    if (wordText) {
      wordText.text = word;
    }
  }
  
  createLetterCircle() 
  {
    const letters = ["G", "O", "L", "D"];
    const radius = 100;
    const centerX = GAME_WIDTH / 2;
    const centerY = GAME_HEIGHT - 200;
  
    this.createLetterChamber(centerX, centerY); 
    this.letterSprites = [];
  
    letters.forEach((letter, i) => {
      const angle = (i / letters.length) * Math.PI * 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
  
      const letterSprite = new Text(letter, {
        fontSize: 40,
        fill: 808080,
      });
      letterSprite.anchor.set(0.5);
      letterSprite.x = x;
      letterSprite.y = y;
      letterSprite.interactive = true;
      letterSprite.buttonMode = true;
      letterSprite.on("pointerdown", () => this.onLetterSelected(letter));
  
      this.addChild(letterSprite);
      this.letterSprites.push(letterSprite);
    });
  
    this.createShuffleButton(centerX, centerY); 
  }

  createLetterChamber(centerX, centerY) 
  {
    const circle= Sprite.from("assets/forapp/circle.png");
    circle.anchor.set(0.5);
    circle.height =250;
    circle.width = 250;

    circle.x = centerX;
    circle.y = centerY;
    this.addChild(circle);

  }
  
  createShuffleButton(centerX, centerY) 
  {
    const shuffleButton = Sprite.from("assets/forapp/suffle.png");
    shuffleButton.anchor.set(0.5);
    shuffleButton.height = 50;
    shuffleButton.width = 50;

    shuffleButton.x = centerX;
    shuffleButton.y = centerY;

    shuffleButton.interactive = true;
    shuffleButton.buttonMode = true;
    shuffleButton.on("pointerdown", () => this.shuffleWords());
    this.addChild(shuffleButton);
  }

  shuffleWords() 
  {
    const letterSprites = this.letterSprites;
    
    for (let i = letterSprites.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
  
      const tempX = letterSprites[i].x;
      const tempY = letterSprites[i].y;
  
      letterSprites[i].x = letterSprites[j].x;
      letterSprites[i].y = letterSprites[j].y;
  
      letterSprites[j].x = tempX;
      letterSprites[j].y = tempY;
    }
  
    console.log("Letters are shuffled!");
  }

}
