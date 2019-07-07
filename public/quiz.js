var quiz = {
    user: "Dave",
    questions: [
    {
      text: "Which cricketer had scored highest individual score in first-class cricket?",
      image: "http://p.imgci.com/db/PICTURES/CMS/266000/266018.3.jpg",
      responses: [
      { text: "Don Bradman" },
      { text: "Brian Lara", correct: true },
      { text: "Lane Hutton" },
      { text: "Gary Sobers" }] },
  
  
    {
      text: "Which cricketer had scored highest individual score in ODI cricket? ",
      responses: [
      { text: "Virender Sehwag"},
      { text: "Chris Gayle" },
      { text: "Martin Guptill" },
      { text: "Rohit Sharma", correct: true  }] },
  
  
    {
      text: "Which cricketer had scored most centuries in first-class cricket?",
      responses: [
      { text: "Lane Hutton" },
      { text: "Wally Hammond"},
      { text: "Jack Hobbs" , correct: true },
      { text: "Sachin Tendulkar" }] },
  
  
    {
      text: "Which cricketer had scored fastest century in ODI cricket?",
      responses: [
      { text: "Vivian Richards"},
      { text: "Corey Anderson" },
      {
        text: "Shahid Afridi" },
  
      { text: "AB de Villiers", correct: true  }] },
  
  
    {
      text: "Which cricketer has taken most catches in ODI cricket?",
      responses: [
      { text: "Ricky Ponting" },
      {
        text: "Mahela Jayawardene", correct: true  },
  
      { text: "Jacques Kallis"},
      { text: "Mark Waugh" }] },
  
  
    {
      text:
      "Which cricketer had scored highest individual score in Test cricket? ",
      responses: [
      { text: "Sanath Jayasuriya" },
      { text: "Matthew Hayden" },
      { text: "Brian Lara", correct: true },
      { text: "Sachin Tendulkar" }] },
  
  
    {
      text: "Which cricketer had scored fastest century in Test cricket?",
      responses: [
      { text: "Vivian Richards"},
      { text: "Brendon McCullum" , correct: true },
      {
        text: "Misbah-ul-Haq" },
  
      { text: "Adam Gilchrist" }] },
  
  
    {
      text: "Which cricketer had scored most runs in a Test match? ",
      responses: [
      { text: "Graham Gooch" , correct: true },
      { text: "Sunil Gavaskar"},
      { text: "Don Bradman" },
      { text: "Brian Lara" }] },
  
  
    {
      text:
      "Which cricketer had scored most runs in a Test series?",
      responses: [
      {
        text: "Sunil Gavaskar" },
  
      { text: "Don Bradman" , correct: true },
      { text: "Kumar Sangakkara"},
      { text: "Hanif Mohammad" }] },
  
  
    {
      text: "Which cricketer had scored most test runs in a calendar year?",
      responses: [
      { text: "V. V. S. Laxman" },
      { text: "Mohamed Yusuf", correct: true },
      { text: "Rahul Dravid" },
      { text: "Steve Waugh" }] }] },
  
  
  
  
  userResponseSkelaton = Array(quiz.questions.length).fill(null);
  
  var app = new Vue({
    el: "#app",
    data: {
      quiz: quiz,
      questionIndex: 0,
      userResponses: userResponseSkelaton,
      isActive: false },
  
    filters: {
      charIndex: function (i) {
        return String.fromCharCode(97 + i);
      } },
  
    methods: {
      restart: function () {
        this.questionIndex = 0;
        this.userResponses = Array(this.quiz.questions.length).fill(null);
      },
      selectOption: function (index) {
        Vue.set(this.userResponses, this.questionIndex, index);
        //console.log(this.userResponses);
      },
      next: function () {
        if (this.questionIndex < this.quiz.questions.length)
        this.questionIndex++;
      },
  
      prev: function () {
        if (this.quiz.questions.length > 0) this.questionIndex--;
      },
      // Return "true" count in userResponses
      score: function () {
        var score = 0;
        for (let i = 0; i < this.userResponses.length; i++) {
          if (
          typeof this.quiz.questions[i].responses[
          this.userResponses[i]] !==
          "undefined" &&
          this.quiz.questions[i].responses[this.userResponses[i]].correct)
          {
            score = score + 1;
          }
        }
        return score;
  
        //return this.userResponses.filter(function(val) { return val }).length;
      } } });