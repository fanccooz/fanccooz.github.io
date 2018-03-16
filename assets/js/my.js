//技能掌握百分比
let score = $(".score");
let fill = $(".fill");
for (let i = 0; i < score.length; i++) {
  $(fill[i]).css("height", $(score[i]).text());
}

//DSP图片展示
let divisor = document.getElementById("divisor");
let sliderBtn = document.getElementById("slider-btn");

function moveDivisor() {
  $(divisor).css('width', sliderBtn.value + "%");
}

//页面滚动内容效果
let titleDt = $('.work-experience dl dt');
let titleDd = $('.work-experience dl dd');
$(titleDt[0]).find('p').addClass('experience-show');
$(titleDd[0]).find('p').addClass('experience-show');

$(window).scroll(function () {
  //工作经历
  if ($(window).scrollTop() >= 0 && $(window).scrollTop() < 400) {
    $(titleDt[0]).find('p').addClass('experience-show');
    $(titleDd[0]).find('p').addClass('experience-show');
  }
  if ($(window).scrollTop() >= 300 && $(window).scrollTop() < 700) {
    $(titleDt[1]).find('p').addClass('experience-show');
    $(titleDd[1]).find('p').addClass('experience-show');
  }
  if ($(window).scrollTop() >= 400 && $(window).scrollTop() < 900) {
    $(titleDt[2]).find('p').addClass('experience-show');
    $(titleDd[2]).find('p').addClass('experience-show');
  }
  //工作技能
  if ($(window).scrollTop() >= 900 && $(window).scrollTop() < 1600) {
    $('.center').addClass('bg-animation');
    $('.c100').addClass('bg-animation');
    $('.job-skills-circle').addClass('custom-fade');
  }
  //作品
  if ($(window).scrollTop() >= 1700 && $(window).scrollTop() < 2400) {
    $('.floating').addClass('custom-fade');
    $('.floating').prev('h3').addClass('custom-fade');
  }
  if($(window).scrollTop() >= 2200) {
    cloudImgShow()
  }
});

//隐藏手势
$('.circle-line-solid .circle').mouseover(function () {
  $('.circle-line-solid .hand').hide();
})
$('#comparison input[type=range]').mousedown(function () {
  $('.case-img .hand').hide();
})