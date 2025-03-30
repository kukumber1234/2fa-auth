(function() {
  emailjs.init("Cgl7uUTpPY3Yj63Ls");
})();

let generatedCode = "";
let savedCredentialId = null; // ID ключа отпечатка

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
    alert("Код подтверждён. Теперь отпечаток.");
    document.getElementById("step2").style.display = "block";
  } else {
    alert("Неверный код.");
  }
}

async function registerFingerprint() {
  try {
    const publicKey = {
      challenge: new Uint8Array(32),
      rp: { name: "2FA Auth Site" },
      user: {
        id: new Uint8Array(16),
        name: "user@example.com",
        displayName: "User"
      },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "preferred"
      },
      timeout: 60000,
      attestation: "direct"
    };

    const credential = await navigator.credentials.create({ publicKey });
    savedCredentialId = credential.rawId;
    alert("Отпечаток зарегистрирован ✅ Теперь можно подтверждать.");
  } catch (err) {
    alert("Ошибка регистрации отпечатка: " + err.message);
  }
}

async function authenticateFingerprint() {
  try {
    if (!savedCredentialId) {
      alert("Сначала нужно зарегистрировать отпечаток!");
      return;
    }

    const publicKey = {
      challenge: new Uint8Array(32),
      timeout: 60000,
      allowCredentials: [
        {
          id: savedCredentialId,
          type: "public-key",
          transports: ["internal"]
        }
      ],
      userVerification: "preferred"
    };

    const assertion = await navigator.credentials.get({ publicKey });
    alert("Отпечаток подтверждён ✅ Доступ разрешён!");
  } catch (err) {
    alert("Ошибка при аутентификации: " + err.message);
  }
}
