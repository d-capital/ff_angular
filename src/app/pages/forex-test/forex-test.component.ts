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
          question: "В выходные дни появились новости о том, что Северная Корея выпустила еще одну ракету в воды Японии, на что США в ответ отправят один из крупнейших в мире военных кораблей «Нимиц» в западную часть Тихого океана, чтобы сдержать любую потенциальную эскалацию. Судя по этой новости, какую валютную пару вы бы с большей вероятностью купили или продали.",
          options: ["КУПИТЬ AUDUSD", "КУПИТЬ EURJPY", "КУПИТЬ USDJPY", "ПРОДАТЬ USDJPY"],
          answer: "ПРОДАТЬ USDJPY",
          selected: null
        },
        {
          question: "Ходят слухи, что ОПЕК встретится с целью снизить добычу нефти. Если эта встреча пройдет успешно, цены на нефть вырастут, а поскольку рынок Форекс является фьючерсным рынком, он, скорее всего, изменится, если слухи подтвердятся. Какой валютной парой мы будем торговать, основываясь на этой новости?",
          options: ["ПРОДАТЬ USDJPY", "ПРОДАТЬ AUDUSD", "КУПИТЬ EURUAD", "ПРОДАТЬ USDCAD"],
          answer: "ПРОДАТЬ USDCAD",
          selected: null
        },
        {
            question: "Сообщается, что ОПЕК встретится через несколько дней, чтобы достичь соглашения о сокращении добычи нефти. Какую сделку вы бы выбрали.",
            options: ["ПРОДАТЬ EURUSD", "ПРОДАТЬ GBPAUD", "ПРОДАТЬ USDCAD", "ПРОДАТЬ CADJPY"],
            answer: "ПРОДАТЬ USDCAD",
            selected: null
        },
        {
            question: "Увольнение Дональдом Трампом директора ФБР Джеймса Коми (10 мая) и обвинения в том, что он давил на Коми, чтобы тот прекратил расследование предполагаемых связей своего бывшего главы национальной безопасности и других чиновников с Россией, вызвали политическую неопределенность в США. Инвесторы были обеспокоены тем, что обвинения могут задержать снижение налогов и увеличение расходов при незначительных разговорах об импичменте.Также недавно 7 мая завершились выборы во Франции, на которых Франция избрала лидера, который ясно дал понять, что у него нет планов подрывать ЕС или еврозону. Это позитивно для евро, поэтому текущие рыночные настроения по евро являются бычьими.Какую сделку вы бы выбрали?",
            options: ["КУПИТЬ EURGBP", "КУПИТЬ EURJPY", "КУПИТЬ EURUSD"],
            answer: "КУПИТЬ EURUSD",
            selected: null
        },
        {
            question: "Данные по PMI в обрабатывающей промышленности Китая оказались хуже ожиданий на азиатской торговой сессии, и мы только что получили данные по доллару США, которые оказались лучше ожиданий. Основываясь на этих факторах, какую сделку вы бы выбрали?",
            options: ["ПРОДАТЬ GBPUSD", "ПРОДАТЬ AUDUSD", "КУПИТЬ AUDUSD"],
            answer: "ПРОДАТЬ AUDUSD",
            selected: null
        },
        {
            question: "Цены на нефть и сырьевые товары снижаются, и мы только что получили лучшие, чем ожидалось, данные производственного PMI для фунта стерлингов. Основываясь на этих факторах, которые вы бы выбрали для торговли ниже",
            options: ["КУПИТЬ GBPJPY", "КУПИТЬ USDCAD", "КУПИТЬ GBPAUD"],
            answer: "КУПИТЬ GBPAUD",
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
      alert('Вы завершили квиз!'); // Or navigate to a results page.
    }
  }

}
