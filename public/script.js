// Подключение EmailJS
(function() {
  emailjs.init("Cgl7uUTpPY3Yj63Ls");
})();

let generatedCode = "";

function sendCode() {
  const email = document.getElementById("email").value;
  if (!email) return alert("Введите email!");

  generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

  const params = {
    email: email,
    passcode: generatedCode
  };

  emailjs.send("service_jlo3pf3", "template_yluzajo", params)
    .then(() => {
      alert("Код отправлен на почту!");
      document.getElementById("code-section").style.display = "block";
    })
    .catch((err) => {
      console.error("Ошибка EmailJS:", err);
      alert("Ошибка при отправке email.");
    });
}

function verifyCode() {
  const code = document.getElementById("code").value;
  if (code === generatedCode) {
    alert("Код подтверждён. Переход к отпечатку пальца.");
    document.getElementById("step2").style.display = "block";
  } else {
    alert("Неверный код.");
  }
}

async function authenticateFingerprint() {
  if (!window.PublicKeyCredential) {
    alert("Ваш браузер не поддерживает WebAuthn");
    return;
  }

  try {
    const publicKey = {
      challenge: new Uint8Array([0x8C, 0x7D, 0x05, 0xD2]).buffer,
      timeout: 60000,
      allowCredentials: [],
      userVerification: "preferred"
    };

    const assertion = await navigator.credentials.get({ publicKey });
    alert("Отпечаток подтверждён! Доступ разрешён ✅");
  } catch (err) {
    alert("Ошибка при аутентификации: " + err.message);
  }
}
