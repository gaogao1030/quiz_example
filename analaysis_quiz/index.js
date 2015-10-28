$(function(){
  setAnswer = function(obj){
    console.log(JSON.stringify(obj))
    console.log(obj);
  }
  jsGetQuestion = function(obj){
    if(obj.question_type_id == 1 || obj.question_type_id== 2) {
      obj.your_answers =_.map(obj.your_answers,function(i){
        return i-1;
      })
      obj.right_answers =_.map(obj.right_answers,function(i){
        return i-1;
      })
    }
    return obj;
  }
  urls=['/singleQuestion.json','/multipleQuestion.json','/fillQuestion.json']
  var i = window.location.hash
  i=i.slice(1,2)
  $.get("./"+urls[i],function(quiz,state,response){
    if(quiz.question_type_id == 1){ //处理单选题
      quiz=jsGetQuestion(quiz);
      (function(quiz){
        var temp = $("#singleAnswerTemplate").html();
        var compiled_template = _.template(temp)(quiz);
        var answer
        $("#app").append(compiled_template);
        var your_answer_index= quiz.your_answers[0];
        var right_answer_index= quiz.right_answers[0];
        $("input").iCheck("disable");
        var $your_answer = $($("input")[your_answer_index]);
        $your_answer.iCheck('check');
        $right_answer = $($("input")[right_answer_index]);
        $right_answer.parents("li").append("<div class='right'>right</div>")
      })(quiz)
    }
    else if(quiz.question_type_id == 2){ //处理单选题
      (function(quiz){
        var temp = $("#multipleAnswerTemplate").html();
        var compiled_template = _.template(temp)(quiz);
        $("#app").append(compiled_template);
        var answers = []
        var your_answers_index= quiz.your_answers;
        var right_answers_index= quiz.right_answers;
        $("input").iCheck("disable");
        $your_answers = _.map(your_answers_index,function(answer_index){
          return $("input")[answer_index];
        });
        $('input').on("ifChecked",function(event){
          var index = $(this).data("index");
          answers.push(index);
          var question_id = $(this).data("question");
          setAnswer({question_id:question_id,answer_index: answers});
        });
        $('input').on("ifUnchecked",function(event){
          var index = $(this).data("index");
          var question_id = $(this).data("question")
          answers = _.without(answers,index)
          setAnswer({question_id:question_id,answer_index: answers});
        });
        if(quiz.your_answers.length !== 0){
          var index = quiz.your_answers[0];
          $($("input")[index]).iCheck('check');
        }
      })(quiz)
    }
    else if(quiz.question_type_id == 3){ //处理单选题
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
          setAnswer({question_id:question_id,answer_index: answers});
        })
      })(quiz)
    }
    else
      console.log("没有该类型对应的模板")

  })
})
