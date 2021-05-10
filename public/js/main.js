// AUTHENTICATION
const loginModal = () => {
    $('.modal').modal('show');
};

const registerRedirect = () => {
    window.location = '/register';
};

// INDEX CAROUSEL
(function () {
    "use strict";
  
    var carousels = function () {
      $(".owl-carousel1").owlCarousel({
        loop: true,
        center: true,
        margin: 0,
        responsiveClass: true,
        nav: false,
        responsive: {
          0: {
            items: 1,
            nav: false
          },
          680: {
            items: 2,
            nav: false,
            loop: false
          },
          1000: {
            items: 3,
            nav: true
          }
        }
      });
    };
  
    (function ($) {
      carousels();
    })(jQuery);
  })();


// PROFIT TABLE CAROUSEL
(function () {
  "use strict";

  var carousels = function () {
    $(".owl-carousel2").owlCarousel({
      loop: true,
      // loop: false,
      center: true,
      margin: 0,
      responsiveClass: true,
      nav: false,
      dots: true,
      // dotsEach: true,
      responsive: {
        0: {
          items: 1,
          nav: false
        },
        680: {
          items: 2,
          nav: false,
          loop: false
        },
        1000: {
          items: 3,
          dots: true
        }
      }
    });
  };

  (function ($) {
    carousels();
  })(jQuery);
})();
  

// SWAL SUCCESS MESSAGES ❗️
var urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('success') && urlParams.get('success')) {
  let message;
  if (urlParams.get('for') == 'registration') {
    message = "Du har lyckats med din registrering! Du kommer att få ett e-postmeddelande om ditt konto har godkänts.";
  }
  if (urlParams.get('for') == 'login') {
    message = "Du har lyckats logga in!";
  }
  if (urlParams.get('for') == 'password-reset') {
    message = "Du har begärt en återställning av lösenordet.";
  }
  if (urlParams.get('for') == 'account-activation') {
    message = 'Du har skickat in en begäran om återaktivering av ditt konto!';
  }
  if (urlParams.get('for') == 'new-password') {
    message = 'Du har lyckats återställa ditt lösenord.';
  }

  if (urlParams.get('for') == 'account-accept') {
    message = 'You have accepted an account!';
  }
  if (urlParams.get('for') == 'account-reject') {
    message = 'You have rejected an account!';
  }
  if (urlParams.get('for') == 'panel-add-tips') {
    message = 'You have successfully added a new tip!';
  }
  if (urlParams.get('for') == 'panel-delete-tips') {
    message = 'You have successfully deleted a tip!';
  }
  if (urlParams.get('for') == 'panel-table') {
    message = 'You have successfully added a new profit table!';
  }

  Swal.fire("Grattis!", message, "success");
}


// SWAL ERROR MESSAGES ❗️
if (urlParams.has('error') && urlParams.get('error')) {
  let message;
  let loginExpiration = false;

  if (urlParams.get('for') == 'login-username') {
    message = "Ett kontot med detta användarnamn existerar ej.";
  }
  if (urlParams.get('for') == 'login-email') {
    message = "Ett konto med denna email adress existerar ej.";
  }
  if (urlParams.get('for') == 'login-password') {
    message = "Du har angett ett fel lösenord.";
  }
  if (urlParams.get('for') == 'login-expiration') {
    message = "Ditt konto har gått ut! Vänligen betala ditt månadsmedlemskap. Om du har betalat för återaktivering av ditt konto, tryck på OK!";
    loginExpiration = true;
  }
  if (urlParams.get('for') == 'login-activation') {
    message = "Ditt konto har inte godkänts än.";
  }
  
  if (urlParams.get('for') == 'registration-input-username') {
    message = 'Ditt lösenord måste vara mellan 5-16 bokstäver långt och alfanumeriskt.';
  }
  if (urlParams.get('for') == 'registration-input-username-exists') {
    message = "Användarnamnet finns redan. Testa ett annat.";
  }
  if (urlParams.get('for') == 'registration-input-email') {
    message = 'Ange en giltig e-postadress.';
  }
  if (urlParams.get('for') == 'registration-input-email-exists') {
    message = 'E-postadressen finns redan. Vänligen välj en annan e-postadress.';
  }
  if (urlParams.get('for') == 'registration-input-password') {
    message = 'Ditt lösenord måste vara mellan 5-40 tecken långt.';
  }
  if (urlParams.get('for') == 'registration-input-confirm-password') {
    message = 'Lösenorden överensstämmer inte. Försök igen.';
  }
  if (urlParams.get('for') == 'age') {
    message = 'Du måste ha fyllt 18!';
  }

  if (urlParams.get('for') == 'captcha') {
    message = 'Verifieringen misslyckades. Var god försök igen.';
  }

  if (urlParams.get('for') == 'panel-tips') {
    message = 'You have not selected a VIP option or added any VIP text';
  }
  if (urlParams.get('for') == 'panel-table') {
    message = 'Some information for adding the new profit table is missing';
  }
  
  if (loginExpiration) {
    Swal.fire({
      icon: 'error',
      title: 'Fel',
      text: message,
      imageUrl: '../images/payment.jpg',
      showCancelButton: true
    })
    .then(res => {
      if (res.isConfirmed) {
        window.location.href = '/activate';
      }
    });
  } else {
    Swal.fire("Fel inträffade!", message, "error");
  }
}


//PANEL ACCOUNTS
if (window.location.pathname === '/panel-accounts') {
  const accounts = document.getElementById('accounts').value;
  const n = document.getElementById('n').value;
  let cnt = 0;
  let currentUsername = JSON.parse(accounts)[0].username;
  let currentEmail = JSON.parse(accounts)[0].email;
  let currentDate = JSON.parse(accounts)[0].admission;
  let currentDate2 = new Date(currentDate);

  // console.log(currentDate);
  // console.log(currentDate2);

  const switchAccount = (currentCnt) => {
    currentUsername = JSON.parse(accounts)[currentCnt].username;
    currentEmail = JSON.parse(accounts)[currentCnt].email;
    currentDate = JSON.parse(accounts)[currentCnt].admission;
    currentDate2 = new Date(currentDate);
    
    document.getElementById('account-username').innerHTML = `Username: ${currentUsername}`;
    document.getElementById('account-email').innerHTML = `${currentEmail}`;
    document.getElementById('account-date').innerHTML = `Date of Admission: ${currentDate2.getFullYear()}/${currentDate2.getMonth()+1}/${currentDate2.getDate()}`;
    document.getElementById('account-number').innerHTML = `${cnt+1}/${n}`;
    document.getElementById('accept-username').value = currentUsername;
    document.getElementById('reject-username').value = currentUsername;
  };

  window.moveLeft = () => {
    // console.log('LEFT!');
    if (cnt > 0) {
      cnt--;
      switchAccount(cnt);
    }
  };

  window.moveRight = () => {
    // console.log('RIGHT!');
    if (cnt < n-1) {
      cnt++;
      switchAccount(cnt);
    } 
  }

  // console.log(`accounts: ${accounts}`);
}

// INDEX PAGE
if (window.location.pathname === '/') {
  if (document.getElementById('isAuthenticated').value) {
    const findTip = (vip) => {
      return document.getElementById(vip).value;
    };
  
    document.getElementById('vips').addEventListener('click', ({ target }) => {
      if (target.getAttribute('name') === 'btnradio') {
        const currentVip = findTip(target.value) ? JSON.parse(findTip(target.value)) : null;     
        document.getElementById('vip-text').innerHTML = currentVip.text;
      }
    });
  
    const vip1 = findTip('vip1') ? JSON.parse(findTip('vip1')) : null;
    document.getElementById('vip-text').innerHTML = vip1.text;
  }
}

// LOGIN CAPTCHA
document.getElementById('login-form').addEventListener('submit', e => {
  e.preventDefault();

  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;
  const captcha = document.querySelector('#g-recaptcha-response').value;

  return fetch('/login', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ username, password, captcha })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success == false) {
      window.location.href = `/?error=true&for=${data.for}`;
    } else {
      window.location.href = `/?success=true&for=${data.for}`;
    }
    grecaptcha.reset();
  });
});

// REGISTER CAPTCHA
if (window.location.pathname === '/register') {
  function onHuman(response) {
    document.getElementById('captcha').value = response;
  }

  document.getElementById('register-form').addEventListener('submit', e => {
    e.preventDefault();
  
    const username = document.querySelector('#username-input').value;
    const email = document.querySelector('#email-input').value;
    const password = document.querySelector('#password-input').value;
    const confirmPassword = document.querySelector('#confirm-password-input').value;
    const ageCheck = document.querySelector('#age-check').checked;
    // const captcha = document.querySelector('#g-recaptcha-response').value;
    const captcha = document.querySelector('#captcha').value;
  
    return fetch('/register', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ username, email, password, confirmPassword, ageCheck, captcha })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success == false) {
        window.location.href = `/register?error=true&for=${data.for}`;
      } else {
        window.location.href = `/?success=true&for=${data.for}`;
      }
      grecaptcha.reset();
    });
  });
}

// REACTIVATION CAPTCHA
if (window.location.pathname === '/activate') {
  function onHuman(response) {
    document.getElementById('captcha').value = response;
  }

  document.getElementById('activate-form').addEventListener('submit', e => {
    e.preventDefault();
  
    const username = document.querySelector('#username-input').value;
    // const captcha = document.querySelector('#g-recaptcha-response').value;
    const captcha = document.querySelector('#captcha').value;
  
    return fetch('/activate', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ username, captcha })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success == false) {
        window.location.href = `/activate?error=true&for=${data.for}`;
      } else {
        window.location.href = `/?success=true&for=${data.for}`;
      }
      grecaptcha.reset();
    });
  });
}

// RESET PASSWORD CAPTCHA
if (window.location.pathname === '/reset-password') {
  function onHuman(response) {
    document.getElementById('captcha').value = response;
  }

  document.getElementById('reset-password-form').addEventListener('submit', e => {
    e.preventDefault();
  
    const email = document.querySelector('#email-input').value;
    // const captcha = document.querySelector('#g-recaptcha-response').value;
    const captcha = document.querySelector('#captcha').value;
  
    return fetch('/reset-password', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ email, captcha })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success == false) {
        window.location.href = `/reset-password?error=true&for=${data.for}`;
      } else {
        window.location.href = `/?success=true&for=${data.for}`;
      }
      grecaptcha.reset();
    });
  });
}