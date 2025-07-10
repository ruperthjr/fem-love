$(document).ready(function () {
  // progress bar
  setTimeout(function () {
    firstQuestion();
    $('.spinner').fadeOut();
    $('#preloader').delay(350).fadeOut('slow');
    $('body')
      .delay(350)
      .css({
        overflow: 'visible',
      });
  }, 600);
});

function init() {
  document.getElementById('titleWeb').innerHTML = CONFIG.titleWeb;
  $('#title').text(CONFIG.title);
  $('#desc').text(CONFIG.desc);
  $('#yes').text(CONFIG.btnYes);
  $('#no').text(CONFIG.btnNo);

  var xYes =
    (0.9 * $(window).width() - $('#yes').width() - $('#no').width()) / 2;
  var xNo = xYes + $('#yes').width() + 0.1 * $(window).width();
  var y = 0.75 * $(window).height();
  $('#yes').css('left', xYes);
  $('#yes').css('top', y);

  $('#no').css('left', xNo);
  $('#no').css('top', y);
}

function firstQuestion() {
  $('.content').hide();
  Swal.fire({
    title: CONFIG.introTitle,
    text: CONFIG.introDesc,
    imageUrl: 'img/logi.gif',
    imageWidth: 300,
    imageHeight: 300,
    background: '#fff url("img/iput-bg.jpg")',
    imageAlt: 'Intro image',
    confirmButtonText: CONFIG.btnIntro,
  }).then(function () {
    $('.content').show(200);
    var audio = new Audio('sound/sound.mp3');
    audio.play();
  });
}

// switch button position
function switchButton() {
  var audio = new Audio('sound/duck.mp3');
  audio.play();
  var leftNo = $('#no').css('left');
  var topNO = $('#no').css('top');
  var leftY = $('#yes').css('left');
  var topY = $('#yes').css('top');
  $('#no').css('left', leftY);
  $('#no').css('top', topY);
  $('#yes').css('left', leftNo);
  $('#yes').css('top', topNO);
}

// move to random button position
function moveButton() {
  var audio = new Audio('sound/Swish1.mp3');
  audio.play();
  var x = Math.random() * ($(window).width() - $('#no').width()) * 0.9;
  var y = Math.random() * ($(window).height() - $('#no').height()) * 0.9;
  var left = x + 'px';
  var top = y + 'px';
  $('#no').css('left', left);
  $('#no').css('top', top);
}

init();

/* ------ smarter movement logic ------ */
let moveCount = 0;

// one handler for desktop (mouse) AND mobile (pointer / touch)
$('#no').on('mousemove pointermove touchstart', function (e) {
  e.preventDefault();           // avoid accidental clicks on mobile

  const isMobile = window.innerWidth <= 500;

  if (isMobile) {
    // phones: always hop to a fresh random spot
    moveButton();
  } else {
    // larger screens: alternate swap ↔︎ random jump
    if (moveCount % 2 === 0) switchButton();
    else moveButton();
  }
  moveCount++;
});

// still allow a cheeky swap on actual clicks
$('#no').on('click touchend', function () {
  switchButton();
});

// auto-generate text in input
function textGenerate() {
  var n = '';
  var text = ' ' + CONFIG.reply;
  var a = Array.from(text);
  var textVal = $('#txtReason').val() ? $('#txtReason').val() : '';
  var count = textVal.length;
  if (count > 0) {
    for (let i = 1; i <= count; i++) {
      n = n + a[i];
      if (i == text.length + 1) {
        $('#txtReason').val('');
        n = '';
        break;
      }
    }
  }
  $('#txtReason').val(n);
  setTimeout(textGenerate, 1);
}

// show popup
$('#yes').click(function () {
  var audio = new Audio('sound/tick.mp3');
  audio.play();
  Swal.fire({
    title: CONFIG.question,
    html: true,
    width: 900,
    padding: '3em',
    html:
      "<input type='text' class='form-control' id='txtReason' onmousemove=textGenerate()  placeholder='Tell me why it’s fate…'>",
    background: '#fff url(\"img/iput-bg.jpg\")',
    backdrop: `
              rgba(0,0,123,0.4)
              url("img/giphy2.gif")
              left top
              no-repeat
            `,
    confirmButtonColor: '#3085d6',
    confirmButtonColor: '#fe8a71',
    confirmButtonText: CONFIG.btnReply,
  }).then((result) => {
    if (result.value) {
      Swal.fire({
        width: 900,
        confirmButtonText: CONFIG.btnAccept,
        background: '#fff url(\"img/iput-bg.jpg\")',
        title: CONFIG.mess,
        text: CONFIG.messDesc,
        confirmButtonColor: '#83d0c9',
        onClose: () => {
          window.location = CONFIG.messLink;
        },
      });
    }
  });
});
/* --- NEW: handle resize / orientation change --- */
function applyMobileTweaks() {
  const isMobile = window.innerWidth <= 500;

  if (isMobile) {
    // smaller buttons so they never overflow
    $('#yes, #no').css({
      fontSize: '14px',
      padding: '3px'
    });

    // keep buttons in safe horizontal zone
    $('#yes').css({ left: '58%', top: '40vh' });
    $('#no').css({ left: '7%',  top: '40vh' });
  } else {
    // revert to desktop defaults set by init()
    $('#yes, #no').css({ fontSize: '', padding: '' });
  }
}

/* wrap the existing init so we can call it safely on resize */
function initAndTweak() {
  init();            // original positioning logic
  applyMobileTweaks();
}

$(document).ready(function () {
  /* swap init() ➜ initAndTweak() here */
  setTimeout(function () {
    firstQuestion();
    $('.spinner').fadeOut();
    $('#preloader').delay(350).fadeOut('slow');
    $('body').delay(350).css({ overflow: 'visible' });
  }, 600);

  // Run right away
  initAndTweak();
});

/* --- NEW: re-compute on every resize / orientation change --- */
$(window).on('resize orientationchange', initAndTweak);
