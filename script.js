async function getOtp() {
  document.getElementById("output").textContent = "Loading OTP...";
  const res = await fetch("/api/otp");
  const data = await res.json();
  document.getElementById("output").textContent = JSON.stringify(data, null, 2);
}

async function getNumber() {
  document.getElementById("output").textContent = "Loading Number...";
  const res = await fetch("/api/number");
  const data = await res.json();
  document.getElementById("output").textContent = JSON.stringify(data, null, 2);
}

async function getCountries() {
  document.getElementById("output").textContent = "Loading Countries...";
  const res = await fetch("/api/countries");
  const data = await res.json();
  document.getElementById("output").textContent = JSON.stringify(data, null, 2);
}

async function getCarriers() {
  document.getElementById("output").textContent = "Loading Carriers...";
  const res = await fetch("/api/carriers");
  const data = await res.json();
  document.getElementById("output").textContent = JSON.stringify(data, null, 2);
}
