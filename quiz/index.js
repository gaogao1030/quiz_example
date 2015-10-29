$(function(){
  jsSetAnswer = function(obj){
    if(obj.question_type_id == 1 || obj.question_type_id== 2) {
      obj.answer_index =_.map(obj.answer_index,function(i){
        return i+1;
      })
    }
    obj.answer_index = obj.answer_index.sort();
    console.log(JSON.stringify(obj))
    console.log(obj);
    //obj=JSON.stringify(obj) //android
    //setAnswer(obj); //android
  }
  jsGetQuestion = function(obj){
    if(obj.question_type_id == 1 || obj.question_type_id== 2) {
      obj.your_answers =_.map(obj.your_answers,function(i){
        return i-1;
      })
    }
    return obj;
  }
  //var quiz = getQuestion() //android
  //quiz = jsGetQuestion(quiz) //android
  urls=['/singleQuestion.json','/multipleQuestion.json','/fillQuestion.json','/judgementQuestion.json']
  var i = window.location.hash
  i=i.slice(1,2)
  $.get("./"+urls[i],function(quiz,state,response){
    quiz = jsGetQuestion(quiz);
    if(quiz.question_type_id == 1){ //处理单选题
      (function(quiz){
        var temp = $("#singleAnswerTemplate").html();
        var compiled_template = _.template(temp)(quiz);
        var answer
        $("#app").append(compiled_template);
        $('input').on("ifChecked",function(event){
          var index = $(this).data("index");
          var answer = [index];
          var question_id = $(this).data("question")
          jsSetAnswer({question_type_id:quiz.question_type_id,question_id:question_id,answer_index: answer});
        });
        if(quiz.your_answers.length !== 0){
          var index = quiz.your_answers[0];
          $($("input")[index]).iCheck('check');
        }
      })(quiz)
    }
    else if(quiz.question_type_id == 2){ //处理单选题
      (function(quiz){
        var temp = $("#multipleAnswerTemplate").html();
        var compiled_template = _.template(temp)(quiz);
        $("#app").append(compiled_template);
        var answers = []
        $('input').on("ifChecked",function(event){
          var index = $(this).data("index");
          answers.push(index);
          var question_id = $(this).data("question");
          jsSetAnswer({question_type_id:quiz.question_type_id,question_id:question_id,answer_index: answers});
        });
        $('input').on("ifUnchecked",function(event){
          var index = $(this).data("index");
          var question_id = $(this).data("question")
          answers = _.without(answers,index)
          jsSetAnswer({question_type_id:quiz.question_type_id,question_id:question_id,answer_index: answers});
        });
        if(quiz.your_answers.length !== 0){
          var index = quiz.your_answers[0];
          $($("input")[index]).iCheck('check');
        }
      })(quiz)
    }
    else if(quiz.question_type_id == 3){ //处理填空题
      //your_answer确定有多少空需要填写
      (function(quiz){
        var temp = $("#fillAnswerTemplate").html();
        var compiled_template = _.template(temp)(quiz);
        $("#app").append(compiled_template);
        $("input").on("change",function(e){
          var index = $(this).data("index");
          var question_id = $(this).data("question")
          var answers = quiz.your_answers
          answers[index] = this.value
          jsSetAnswer({question_type_id:quiz.question_type_id,question_id:question_id,answer_index: answers});
        })
      })(quiz)
    }
    else if(quiz.question_type_id == 6){ //处理判断题
      (function(quiz){
        var temp = $("#judgementAnswerTemplate").html();
        var compiled_template = _.template(temp)(quiz);
        $("#app").append(compiled_template);
        $('input').on("ifChecked",function(event){
          var answer = $(this).data("answer");
          var answer = [answer];
          var question_id = $(this).data("question")
          jsSetAnswer({question_type_id:quiz.question_type_id,question_id:question_id,answer_index: answer});
        });
        if(quiz.your_answers.length !== 0){
          var your_answer = quiz.your_answers[0];
          $T = $("input[data-answer='T']");
          $F = $("input[data-answer='F']");
          if(your_answer=="T"){
            $T.iCheck('check');
          } else if(your_answer=="F") {
            $F.iCheck('check');
          }
        }
      })(quiz)
    }
    else
      console.log("没有该类型对应的模板")

  })
})
