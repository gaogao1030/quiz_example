$(function(){
  jsSetTorF = function(obj){
    obj.answer_index = obj.answer_index.sort();
    console.log(JSON.stringify(obj))
    console.log(obj);
    //obj=JSON.stringify(obj) //android
    //setAnswer(obj); //android
  }

  jsGetQuestion = function(obj){
    return obj;
  }

  setYourAnswer = function(quiz){
    var your_answers = quiz.your_answers;
    if(your_answers.length!==0){
      if(your_answers[0]==""){
        $(".analaysis,.view-analaysis").trigger("click");
      } else if(your_answers[0]=="T"){
        $(".analaysis,.view-analaysis").trigger("click");
        $(".icon.right.unclick").trigger("click");
      } else if(your_answers[0]=="F"){
        $(".analaysis,.view-analaysis").trigger("click");
        $(".icon.wrong.unclick").trigger("click");
      } else {
        console.log("错误的格式");
      }
    }
  }

  $("body").on("rendered",function(e,quiz){
    var quiz = quiz
    $(".icon.right.unclick").on("click",function(){
      $(".icon").addClass("hidden");
      $(".icon.click.right").removeClass("hidden");
      $(".icon.unclick.wrong").removeClass("hidden");
      jsSetTorF({question_type_id:quiz.question_type_id,question_id:quiz.id,answer_index:["T"]});
    })
    $(".icon.wrong.unclick").on("click",function(){
      $(".icon").addClass("hidden");
      $(".icon.click.wrong").removeClass("hidden");
      $(".icon.unclick.right").removeClass("hidden");
      jsSetTorF({question_type_id:quiz.question_type_id,question_id:quiz.id,answer_index:["F"]});
    })
    $(".analaysis,.view-analaysis").on("click",function(){
      $('.analaysis > .blur').removeClass('blur');
      $(".view-analaysis").addClass("hidden");
    })
  })

  var letter=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

  urls=['/singleQuestion.json','/multipleQuestion.json','/fillQuestion.json','/judgementQuestion.json','/answerQuestion.json']
  var i = window.location.hash
  i=i.slice(1,2)
  $.get("./"+urls[i],function(quiz,state,response){
    quiz=jsGetQuestion(quiz);
    if(quiz.question_type_id == 1){ //处理单选题
      (function(quiz){
        quiz.question_type = "单选题"
        quiz.right_answers = _.map(quiz.right_answers,function(answer){
          return letter[answer];
        })
        var temp = $("#offlineTemplate").html();
        var compiled_template = _.template(temp)(quiz);
        $("#app").append(compiled_template);
        $("body").trigger("rendered",quiz);
        $("input").attr("disabled",true);
        setYourAnswer(quiz);
      })(quiz)
    }
    else if(quiz.question_type_id == 2){ //处理多选题
      (function(quiz){
        quiz.question_type = "多选题"
        quiz.right_answers = _.map(quiz.right_answers,function(answer){
          return letter[answer];
        })
        var answers="";
        _.each(quiz.right_answers,function(answer){
          answers = answers + "  " + answer;
        })
        quiz.right_answers = answers;
        var temp = $("#offlineTemplate").html();
        var compiled_template = _.template(temp)(quiz);
        $("#app").append(compiled_template);
        $("body").trigger("rendered",quiz);
        $("input").attr("disabled",true);
        setYourAnswer(quiz);
      })(quiz)
    }
    else if(quiz.question_type_id == 3){ //处理填空题
      //your_answer确定有多少空需要填写
      (function(quiz){
        quiz.question_type = "填空题"
        var temp = $("#offlineTemplate").html();
        var compiled_template = _.template(temp)(quiz);
        $("#app").append(compiled_template);
        $("body").trigger("rendered",quiz);
        $("input").attr("disabled",true);
        setYourAnswer(quiz);
      })(quiz)
    }
    else if(quiz.question_type_id == 4){ //处理填空题
      //your_answer确定有多少空需要填写
      (function(quiz){
        quiz.question_type = "解答题"
        var temp = $("#offlineTemplate").html();
        var compiled_template = _.template(temp)(quiz);
        $("#app").append(compiled_template);
        $("body").trigger("rendered",quiz);
        $("input").attr("disabled",true);
        setYourAnswer(quiz);
      })(quiz)
    }
    else if(quiz.question_type_id == 6){ //处理判断题
      (function(quiz){
        quiz.question_type = "判断题"
        var temp = $("#offlineTemplate").html();
        var compiled_template = _.template(temp)(quiz);
        $("#app").append(compiled_template);
        $("body").trigger("rendered",quiz);
        $("input").attr("disabled",true);
        setYourAnswer(quiz);
      })(quiz)
    }
    else
      console.log("没有该类型对应的模板")
  })
})
