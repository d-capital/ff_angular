import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forex-test',
  templateUrl: './forex-test.component.html',
  styleUrls: ['./forex-test.component.css']
})
export class ForexTestComponent implements OnInit {
    currentQuestionIndex = 0;
    showModal = false;
    isAnswerCorrect: boolean | null = null;
    questions = [
        {
          question: "Over the weekend, news emerged that North Korea had fired another missile into Japanese waters, to which the US would respond by sending one of the world's largest warships, the Nimitz, to the Western Pacific to contain any potential escalation. Based on this news, which currency pair would you be more likely to buy or sell?",
          options: ["BUY AUDUSD", "BUY EURJPY", "BUY USDJPY", "SELL USDJPY"],
          answer: "SELL USDJPY",
          selected: null
        },
        {
          question: "There are rumors that OPEC will meet to reduce oil production. If this meeting is successful, oil prices will rise, and since the Forex market is a futures market, it will likely change if the rumors are true. Which currency pair will we trade based on this news?",
          options: ["SELL USDJPY", "SELL AUDUSD", "BUY EURUAD", "SELL USDCAD"],
          answer: "SELL USDCAD",
          selected: null
        },
        {
            question: "It is reported that OPEC will meet in a few days to reach an agreement on cutting oil production. Which deal would you choose?",
            options: ["SELL EURUSD", "SELL GBPAUD", "SELL USDCAD", "SELL CADJPY"],
            answer: "SELL USDCAD",
            selected: null
        },
        {
            question: "Donald Trump's firing of FBI Director James Comey (May 10) and allegations that he pressured Comey to drop the investigation into alleged ties between his former national security chief and other officials and Russia have caused political uncertainty in the US. Investors were concerned that the allegations could delay tax cuts and spending increases with little talk of impeachment.Also, French elections recently concluded on May 7, where France elected a leader who has made it clear that he has no plans to undermine the EU or the eurozone. This is positive for the euro, so current market sentiment on the euro is bullish.Which trade would you choose?",
            options: ["BUY EURGBP", "BUY EURJPY", "BUY EURUSD"],
            answer: "BUY EURUSD",
            selected: null
        },
        {
            question: "China's manufacturing PMI data came in worse than expected in the Asian trading session, and we just received better than expected US Dollar data. Based on these factors, which trade would you choose?",
            options: ["SELL GBPUSD", "SELL AUDUSD", "BUY AUDUSD"],
            answer: "SELL AUDUSD",
            selected: null
        },
        {
            question: "Oil and commodity prices are down and we have just received better than expected manufacturing PMI data for sterling. Based on these factors you would choose to trade below",
            options: ["BUY GBPJPY", "BUY USDCAD", "BUY GBPAUD"],
            answer: "BUY GBPAUD",
            selected: null
        }
      ];


  constructor() { }

  ngOnInit(): void {

  }

  submitAnswer() {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    this.isAnswerCorrect = currentQuestion.selected === currentQuestion.answer;
    this.showModal = true;
  }

  nextQuestion() {
    this.showModal = false;
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      alert('You have finished the quiz!'); // Or navigate to a results page.
    }
  }

}
